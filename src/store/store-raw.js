// @ts-nocheck
// @miyter:20251221
// タスクの低レイヤー操作 (Firestore直結)

import { 
    collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot, getDoc, getDocs, Timestamp 
} from "../core/firebase-sdk.js";
import { db } from '../core/firebase.js'; // dbを直接インポート
import { paths } from '../utils/paths.js';

/**
 * FirestoreドキュメントをJSオブジェクトに変換
 */
function deserializeTask(id, data) {
    return {
        id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || Date.now()),
        dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : (data.dueDate || null),
        recurrence: data.recurrence || null,
    };
}

// ==========================================================
// ★ RAW FUNCTIONS (userId, workspaceId 必須)
// ==========================================================

export function subscribeToTasksRaw(userId, workspaceId, onUpdate) {
    if (!userId || !workspaceId) {
        onUpdate([]); 
        return () => {}; 
    }
    
    const path = paths.tasks(userId, workspaceId);
    console.log(`[Tasks] Subscribing to: ${path}`);
    
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => deserializeTask(doc.id, doc.data()));
        onUpdate(tasks);
    }, (error) => {
        console.error("Task subscription error:", error);
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
    
    if (safeTaskData.dueDate instanceof Date) {
        safeTaskData.dueDate = Timestamp.fromDate(safeTaskData.dueDate);
    }
    
    await addDoc(collection(db, path), {
        ...safeTaskData,
        ownerId: userId,
        status: 'todo',
        createdAt: Timestamp.fromDate(new Date()) 
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

    if (safeUpdates.dueDate && !(safeUpdates.dueDate instanceof Timestamp)) {
        if (safeUpdates.dueDate instanceof Date) {
            safeUpdates.dueDate = Timestamp.fromDate(safeUpdates.dueDate);
        } else if (typeof safeUpdates.dueDate === 'string' || typeof safeUpdates.dueDate === 'number') {
            safeUpdates.dueDate = Timestamp.fromDate(new Date(safeUpdates.dueDate));
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
            serialized[key] = (data[key] && data[key].toDate) ? data[key].toDate().toISOString() : data[key];
        }
        return serialized;
    });

    return {
        version: "1.1",
        exportedAt: new Date().toISOString(),
        userId,
        workspaceId,
        tasks: serializeData(tasksSnap),
        projects: serializeData(projectsSnap),
        labels: serializeData(labelsSnap)
    };
}