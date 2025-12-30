/**
 * バックアップ・インポート機能
 * store-raw.ts から分離 (2025-12-30)
 */

import { db } from '../core/firebase';
import {
    addDoc,
    collection,
    getDocs,
    Timestamp
} from "../core/firebase-sdk";
import { paths } from '../utils/paths';

// Firestore Timestamp → JS Date 変換
const toFirestoreDate = (val: any): Timestamp | Date | undefined => (val instanceof Date) ? Timestamp.fromDate(val) : val;

/**
 * バックアップデータの生成
 * 注: ラベルはユーザー単位、タスク・プロジェクトはワークスペース単位で抽出
 */
export async function createBackupData(userId: string, workspaceId: string) {
    if (!userId || !workspaceId) throw new Error("Missing parameters for backup.");

    try {
        const tasksRef = collection(db, paths.tasks(userId, workspaceId));
        const projectsRef = collection(db, paths.projects(userId, workspaceId));
        const labelsRef = collection(db, paths.labels(userId));

        const [tasksSnap, projectsSnap, labelsSnap] = await Promise.all([
            getDocs(tasksRef),
            getDocs(projectsRef),
            getDocs(labelsRef)
        ]);

        const serializeData = (snap: any) => snap.docs.map((d: any) => {
            const data = d.data();
            const serialized: any = { id: d.id };
            for (const key in data) {
                serialized[key] = (data[key] instanceof Timestamp)
                    ? data[key].toDate().toISOString()
                    : data[key];
            }
            return serialized;
        });

        return {
            version: "1.2",
            exportedAt: new Date().toISOString(),
            userId,
            workspaceId,
            tasks: serializeData(tasksSnap),
            projects: serializeData(projectsSnap),
            labels: serializeData(labelsSnap)
        };
    } catch (error) {
        console.error("[Backup] createBackupData failed:", error);
        throw error;
    }
}

/**
 * データのインポート処理
 * 関係性（プロジェクトID、ラベルID）を維持しながら新規データとして作成する
 */
export async function importBackupData(userId: string, workspaceId: string, backupData: any) {
    if (!userId || !workspaceId || !backupData) throw new Error("Invalid import parameters.");

    try {
        const { tasks = [], projects = [], labels = [] } = backupData;
        const projectMap = new Map<string, string>(); // OldID -> NewID
        const labelMap = new Map<string, string>();   // OldID -> NewID

        // 1. ラベルのインポート (名前重複チェック)
        const currentLabelsSnap = await getDocs(collection(db, paths.labels(userId)));
        const currentLabelNames = new Map<string, string>();
        currentLabelsSnap.forEach(doc => currentLabelNames.set(doc.data().name, doc.id));

        for (const label of labels) {
            if (!label.name) continue;

            if (currentLabelNames.has(label.name)) {
                labelMap.set(label.id, currentLabelNames.get(label.name)!);
            } else {
                const newLabelData = { ...label };
                delete newLabelData.id;
                const docRef = await addDoc(collection(db, paths.labels(userId)), newLabelData);
                labelMap.set(label.id, docRef.id);
                currentLabelNames.set(label.name, docRef.id);
            }
        }

        // 2. プロジェクトのインポート
        for (const project of projects) {
            const newProjectData = { ...project };
            delete newProjectData.id;

            if (typeof newProjectData.createdAt === 'string') {
                newProjectData.createdAt = new Date(newProjectData.createdAt);
            }

            const docRef = await addDoc(collection(db, paths.projects(userId, workspaceId)), newProjectData);
            projectMap.set(project.id, docRef.id);
        }

        // 3. タスクのインポート
        const tasksPromises = tasks.map(async (task: any) => {
            const newTaskData = { ...task };
            delete newTaskData.id;

            if (typeof newTaskData.createdAt === 'string') {
                newTaskData.createdAt = new Date(newTaskData.createdAt);
            }
            if (typeof newTaskData.dueDate === 'string') {
                newTaskData.dueDate = new Date(newTaskData.dueDate);
            }
            if (newTaskData.dueDate) {
                newTaskData.dueDate = toFirestoreDate(newTaskData.dueDate);
            }

            if (newTaskData.projectId && projectMap.has(newTaskData.projectId)) {
                newTaskData.projectId = projectMap.get(newTaskData.projectId);
            } else {
                newTaskData.projectId = null;
            }

            if (Array.isArray(newTaskData.labelIds)) {
                newTaskData.labelIds = newTaskData.labelIds
                    .map((oldId: string) => labelMap.get(oldId))
                    .filter((newId: string | undefined) => newId);
            }

            newTaskData.ownerId = userId;

            return addDoc(collection(db, paths.tasks(userId, workspaceId)), newTaskData);
        });

        await Promise.all(tasksPromises);

        return {
            tasksCount: tasks.length,
            projectsCount: projects.length,
            labelsCount: labels.length
        };
    } catch (error) {
        console.error("[Backup] importBackupData failed:", error);
        throw error;
    }
}
