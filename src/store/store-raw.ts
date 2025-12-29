/**
 * 更新日: 2025-12-21
 * 内容: 防御的なプログラミングの強化（コールバックの型チェック、recurrenceの安全な扱い）
 * TypeScript化: 2025-12-29
 */

import { db } from '../core/firebase';
import {
    addDoc,
    collection,
    deleteDoc, doc,
    getDoc, getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    Timestamp,
    Unsubscribe,
    updateDoc
} from "../core/firebase-sdk";
import { paths } from '../utils/paths';
import { Task } from './schema';

const toJSDate = (val: any): Date | undefined => (val instanceof Timestamp) ? val.toDate() : (val instanceof Date ? val : undefined);
const toFirestoreDate = (val: any): Timestamp | Date | undefined => (val instanceof Date) ? Timestamp.fromDate(val) : val;

function deserializeTask(id: string, data: any): Task {
    // データを安全に Task 型に整形
    // Note: Zodでparseするのも手だが、ここではパフォーマンス重視で手動マッピング＋キャストでいく
    const recurrence = data.recurrence || null;

    return {
        id,
        ...data,
        createdAt: toJSDate(data.createdAt) || undefined,
        dueDate: toJSDate(data.dueDate) || undefined,
        recurrence: recurrence,
        completedAt: toJSDate(data.completedAt) || undefined,
        ownerId: data.ownerId || '', // 必須フィールド
        title: data.title || '' // 必須フィールド
    } as Task;
}

// ==========================================================
// ★ RAW FUNCTIONS (userId必須)
// ==========================================================

let _cachedTasks: Task[] = [];

export function getTasks(): Task[] {
    return _cachedTasks;
}

export function subscribeToTasksRaw(userId: string, workspaceId: string, onUpdate: (tasks: Task[]) => void): Unsubscribe {
    const safeUpdate = (data: Task[]) => {
        if (typeof onUpdate === 'function') onUpdate(data);
    };

    if (!userId || !workspaceId) {
        safeUpdate([]);
        return () => { };
    }

    const path = paths.tasks(userId, workspaceId);
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => deserializeTask(doc.id, doc.data()));
        _cachedTasks = tasks;
        safeUpdate(tasks);
    }, (error) => {
        console.error("[Tasks] Subscription error:", error);
        _cachedTasks = [];
        safeUpdate([]);
    });
}

/**
 * バックアップデータの生成
 * 注: ラベルはユーザー単位、タスク・プロジェクトはワークスペース単位で抽出
 */
export async function createBackupDataRaw(userId: string, workspaceId: string) {
    if (!userId || !workspaceId) throw new Error("Missing parameters for backup.");

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
}

// 他の関数（addTaskRaw, updateTaskRawなど）は既存ロジックを維持
export async function addTaskRaw(userId: string, workspaceId: string, taskData: Partial<Task>) {
    const path = paths.tasks(userId, workspaceId);
    const safeData: any = { ...taskData };
    if (safeData.dueDate) safeData.dueDate = toFirestoreDate(safeData.dueDate);

    // Zodバリデーションをここで挟むのがベストだが、既存ロジックを優先
    delete safeData.id;

    return await addDoc(collection(db, path), {
        ...safeData,
        ownerId: userId,
        status: 'todo',
        createdAt: serverTimestamp()
    });
}

export async function updateTaskStatusRaw(userId: string, workspaceId: string, taskId: string, status: string) {
    const path = paths.tasks(userId, workspaceId);
    const updates: any = { status };
    if (status === 'completed') {
        updates.completedAt = serverTimestamp();
    } else {
        updates.completedAt = null;
    }
    await updateDoc(doc(db, path, taskId), updates);
}

export async function updateTaskRaw(userId: string, workspaceId: string, taskId: string, updates: Partial<Task>) {
    const path = paths.tasks(userId, workspaceId);
    const safeUpdates: any = { ...updates };
    if (safeUpdates.dueDate !== undefined) safeUpdates.dueDate = toFirestoreDate(safeUpdates.dueDate);
    await updateDoc(doc(db, path, taskId), safeUpdates);
}

export async function deleteTaskRaw(userId: string, workspaceId: string, taskId: string) {
    const path = paths.tasks(userId, workspaceId);
    await deleteDoc(doc(db, path, taskId));
}

export async function getTaskByIdRaw(userId: string, workspaceId: string, taskId: string): Promise<Task | null> {
    const path = paths.tasks(userId, workspaceId);
    const docSnap = await getDoc(doc(db, path, taskId));
    return docSnap.exists() ? deserializeTask(docSnap.id, docSnap.data()) : null;
}

/**
 * データのインポート処理
 * 関係性（プロジェクトID、ラベルID）を維持しながら新規データとして作成する
 */
export async function importBackupDataRaw(userId: string, workspaceId: string, backupData: any) {
    if (!userId || !workspaceId || !backupData) throw new Error("Invalid import parameters.");

    const { tasks = [], projects = [], labels = [] } = backupData;
    const projectMap = new Map(); // OldID -> NewID
    const labelMap = new Map();   // OldID -> NewID

    // 1. ラベルのインポート (名前重複チェック)
    const currentLabelsSnap = await getDocs(collection(db, paths.labels(userId)));
    const currentLabelNames = new Map();
    currentLabelsSnap.forEach(doc => currentLabelNames.set(doc.data().name, doc.id));

    // ラベル処理
    for (const label of labels) {
        if (!label.name) continue;

        // 既存ラベルがある場合はそのIDを利用
        if (currentLabelNames.has(label.name)) {
            labelMap.set(label.id, currentLabelNames.get(label.name));
        } else {
            // 新規作成
            const newLabelData = { ...label };
            delete newLabelData.id; // 新規ID生成のため削除
            const docRef = await addDoc(collection(db, paths.labels(userId)), newLabelData);
            labelMap.set(label.id, docRef.id);
            currentLabelNames.set(label.name, docRef.id); // 重複防止用に追加
        }
    }

    // 2. プロジェクトのインポート
    for (const project of projects) {
        const newProjectData = { ...project };
        delete newProjectData.id;

        // 日付文字列をDateオブジェクトに復元
        if (typeof newProjectData.createdAt === 'string') newProjectData.createdAt = new Date(newProjectData.createdAt);

        // メインのワークスペースに紐付け
        const docRef = await addDoc(collection(db, paths.projects(userId, workspaceId)), newProjectData);
        projectMap.set(project.id, docRef.id);
    }

    // 3. タスクのインポート
    const tasksPromises = tasks.map(async (task: any) => {
        const newTaskData = { ...task };
        delete newTaskData.id;

        // 日付復元
        if (typeof newTaskData.createdAt === 'string') newTaskData.createdAt = new Date(newTaskData.createdAt);
        if (typeof newTaskData.dueDate === 'string') newTaskData.dueDate = new Date(newTaskData.dueDate);
        // Firestore Timestampへ変換 (addTaskRaw相当の処理)
        if (newTaskData.dueDate) newTaskData.dueDate = toFirestoreDate(newTaskData.dueDate);

        // IDの書き換え
        if (newTaskData.projectId && projectMap.has(newTaskData.projectId)) {
            newTaskData.projectId = projectMap.get(newTaskData.projectId);
        } else {
            newTaskData.projectId = null; // 該当プロジェクトがない場合は未分類へ
        }

        if (Array.isArray(newTaskData.labelIds)) {
            newTaskData.labelIds = newTaskData.labelIds
                .map((oldId: string) => labelMap.get(oldId))
                .filter((newId: string) => newId); // マッピングできたものだけ残す
        }

        // ワークスペースID等はパスで決まるためデータには含めなくて良いが、念のためクリーンアップ
        // ownerIdはaddDoc時に指定されるものを使うか、バックアップのものは無視
        newTaskData.ownerId = userId;

        return addDoc(collection(db, paths.tasks(userId, workspaceId)), newTaskData);
    });

    await Promise.all(tasksPromises);

    return {
        tasksCount: tasks.length,
        projectsCount: projects.length,
        labelsCount: labels.length
    };
}
