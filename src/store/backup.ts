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
        const labelsRef = collection(db, paths.labels(userId, workspaceId));
        const targetsRef = collection(db, paths.targets(userId, workspaceId));
        const timeBlocksRef = collection(db, paths.timeblocks(userId, workspaceId));
        const filtersRef = collection(db, paths.filters(userId, workspaceId));

        const [tasksSnap, projectsSnap, labelsSnap, targetsSnap, timeBlocksSnap, filtersSnap] = await Promise.all([
            getDocs(tasksRef),
            getDocs(projectsRef),
            getDocs(labelsRef),
            getDocs(targetsRef),
            getDocs(timeBlocksRef),
            getDocs(filtersRef)
        ]);

        const serializeData = (snap: any) => snap.docs.map((d: any) => {
            const data = d.data();
            const serialized: any = { id: d.id };
            for (const key in data) {
                // Use toMillis() for consistent Timestamp serialization
                serialized[key] = (data[key] instanceof Timestamp)
                    ? data[key].toMillis()
                    : data[key];
            }
            return serialized;
        });

        return {
            version: "1.3",
            exportedAt: new Date().toISOString(),
            userId,
            workspaceId,
            tasks: serializeData(tasksSnap),
            projects: serializeData(projectsSnap),
            labels: serializeData(labelsSnap),
            targets: serializeData(targetsSnap),
            timeBlocks: serializeData(timeBlocksSnap),
            customFilters: serializeData(filtersSnap)
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
        const {
            tasks = [],
            projects = [],
            labels = [],
            targets = [],
            timeBlocks = [],
            customFilters = []
        } = backupData;

        const projectMap = new Map<string, string>(); // OldID -> NewID
        const labelMap = new Map<string, string>();   // OldID -> NewID

        // 1. ラベルのインポート (名前重複チェック)
        const currentLabelsSnap = await getDocs(collection(db, paths.labels(userId, workspaceId)));
        const currentLabelNames = new Map<string, string>();
        currentLabelsSnap.forEach(doc => currentLabelNames.set(doc.data().name, doc.id));

        for (const label of labels) {
            // Normalize label name (trim whitespace)
            const normalizedName = label.name?.trim();
            if (!normalizedName) continue;

            if (currentLabelNames.has(normalizedName)) {
                labelMap.set(label.id, currentLabelNames.get(normalizedName)!);
            } else {
                const newLabelData = { ...label, name: normalizedName };
                delete newLabelData.id;
                const docRef = await addDoc(collection(db, paths.labels(userId, workspaceId)), newLabelData);
                labelMap.set(label.id, docRef.id);
                currentLabelNames.set(normalizedName, docRef.id);
            }
        }

        // 2. プロジェクトのインポート
        for (const project of projects) {
            const newProjectData = { ...project };
            delete newProjectData.id;

            // Handle both ISO string and milliseconds timestamp
            if (typeof newProjectData.createdAt === 'string') {
                newProjectData.createdAt = new Date(newProjectData.createdAt);
            } else if (typeof newProjectData.createdAt === 'number') {
                newProjectData.createdAt = new Date(newProjectData.createdAt);
            }

            const docRef = await addDoc(collection(db, paths.projects(userId, workspaceId)), newProjectData);
            projectMap.set(project.id, docRef.id);
        }

        // 3. TimeBlocksのインポート (単純追加)
        for (const tb of timeBlocks) {
            const newTbData = { ...tb };
            delete newTbData.id;
            await addDoc(collection(db, paths.timeblocks(userId, workspaceId)), newTbData);
        }

        // 4. Custom Filtersのインポート
        for (const filter of customFilters) {
            const newFilterData = { ...filter };
            delete newFilterData.id;
            // Handle both ISO string and milliseconds timestamp
            if (typeof newFilterData.createdAt === 'string') {
                newFilterData.createdAt = new Date(newFilterData.createdAt);
            } else if (typeof newFilterData.createdAt === 'number') {
                newFilterData.createdAt = new Date(newFilterData.createdAt);
            }
            await addDoc(collection(db, paths.filters(userId, workspaceId)), newFilterData);
        }

        // 5. Targetsのインポート
        for (const target of targets) {
            const newTargetData = { ...target };
            delete newTargetData.id;
            if (typeof newTargetData.createdAt === 'string') {
                newTargetData.createdAt = new Date(newTargetData.createdAt);
            }
            if (typeof newTargetData.updatedAt === 'string') {
                newTargetData.updatedAt = new Date(newTargetData.updatedAt);
            }
            newTargetData.ownerId = userId;
            newTargetData.workspaceId = workspaceId; // 現在のWSにインポート
            await addDoc(collection(db, paths.targets(userId, workspaceId)), newTargetData);
        }

        // 6. タスクのインポート (依存関係解決後)
        const tasksPromises = tasks.map(async (task: any) => {
            const newTaskData = { ...task };
            delete newTaskData.id;

            // Handle both ISO string and milliseconds timestamp
            if (typeof newTaskData.createdAt === 'string') {
                newTaskData.createdAt = new Date(newTaskData.createdAt);
            } else if (typeof newTaskData.createdAt === 'number') {
                newTaskData.createdAt = new Date(newTaskData.createdAt);
            }
            if (typeof newTaskData.dueDate === 'string') {
                newTaskData.dueDate = new Date(newTaskData.dueDate);
            } else if (typeof newTaskData.dueDate === 'number') {
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
            // ターゲットIDなどは解決が難しいので維持またはNULLにする場合もあるが、ここでは維持(あるいはターゲット内リンクなら壊れる)
            // TaskSchemaには targetId はない (Targetの方からリンクする構造かも？ 逆は？ Task -> Target はない)

            return addDoc(collection(db, paths.tasks(userId, workspaceId)), newTaskData);
        });

        await Promise.all(tasksPromises);

        return {
            tasksCount: tasks.length,
            projectsCount: projects.length,
            labelsCount: labels.length,
            targetsCount: targets.length
        };
    } catch (error) {
        console.error("[Backup] importBackupData failed:", error);
        throw error;
    }
}
