// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: serverTimestampの導入とデータ変換ロジックの堅牢化
 */

import { 
    collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot, getDoc, getDocs, Timestamp, serverTimestamp 
} from "../core/firebase-sdk.js";
import { db } from '../core/firebase.js';
import { paths } from '../utils/paths.js';

/**
 * FirestoreドキュメントをJSオブジェクトに変換
 */
function deserializeTask(id, data) {
    return {
        id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || null),
        dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : (data.dueDate || null),
        recurrence: data.recurrence || null,
    };
}

export function subscribeToTasksRaw(userId, workspaceId, onUpdate) {
    if (!userId || !workspaceId) {
        onUpdate([]); 
        return () => {}; 
    }
    
    const path = paths.tasks(userId, workspaceId);
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => deserializeTask(doc.id, doc.data()));
        onUpdate(tasks);
    }, (error) => {
        console.error("[Tasks] Subscription error:", error);
        onUpdate([]);
    });
}

export async function getTaskByIdRaw(userId, workspaceId, taskId) {
    const path = paths.tasks(userId, workspaceId);
    const ref = doc(db, path, taskId);
    const docSnap = await getDoc(ref);
    return docSnap.exists() ? deserializeTask(docSnap.id, docSnap.data()) : null;
}

export async function addTaskRaw(userId, workspaceId, taskData) {
    const path = paths.tasks(userId, workspaceId);
    const safeTaskData = { ...taskData };
    
    // 日付の正規化は呼び出し側で行う前提だが、念のためTimestamp変換
    if (safeTaskData.dueDate instanceof Date) {
        safeTaskData.dueDate = Timestamp.fromDate(safeTaskData.dueDate);
    }
    
    return await addDoc(collection(db, path), {
        ...safeTaskData,
        ownerId: userId,
        status: 'todo',
        createdAt: serverTimestamp() // クライアント時刻ではなくサーバー時刻を使用
    });
}

export async function updateTaskStatusRaw(userId, workspaceId, taskId, status) {
    const path = paths.tasks(userId, workspaceId);
    await updateDoc(doc(db, path, taskId), { status });
}

export async function updateTaskRaw(userId, workspaceId, taskId, updates) {
    const path = paths.tasks(userId, workspaceId);
    const ref = doc(db, path, taskId);
    const safeUpdates = { ...updates };

    // 期限日の変換処理
    if (safeUpdates.dueDate !== undefined) {
        if (safeUpdates.dueDate instanceof Date) {
            safeUpdates.dueDate = Timestamp.fromDate(safeUpdates.dueDate);
        } else if (safeUpdates.dueDate === null) {
            safeUpdates.dueDate = null;
        }
    }
    
    if (safeUpdates.recurrence === undefined) delete safeUpdates.recurrence;

    await updateDoc(ref, safeUpdates);
}

export async function deleteTaskRaw(userId, workspaceId, taskId) {
    const path = paths.tasks(userId, workspaceId);
    await deleteDoc(doc(db, path, taskId));
}

export async function createBackupDataRaw(userId, workspaceId) {
    if (!userId || !workspaceId) throw new Error("Credentials missing for backup");

    const tasksRef = collection(db, paths.tasks(userId, workspaceId));
    const projectsRef = collection(db, paths.projects(userId, workspaceId));
    const labelsRef = collection(db, paths.labels(userId));

    const [tasksSnap, projectsSnap, labelsSnap] = await Promise.all([
        getDocs(tasksRef),
        getDocs(projectsRef),
        getDocs(labelsRef)
    ]);

    const serializeData = (snap) => snap.docs.map(d => {
        const data = d.data();
        const serialized = { id: d.id };
        for (const key in data) {
            // TimestampはISO文字列に変換
            serialized[key] = (data[key] && data[key].toDate) ? data[key].toDate().toISOString() : data[key];
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