// @ts-nocheck
// @miyter:20251129

// 修正: SDKラッパーからインポートして一元管理
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    onSnapshot, 
    getDoc, 
    getDocs,
    Timestamp 
} from "../core/firebase-sdk.js";

// 修正: dbの直接インポートを廃止し、getFirebaseヘルパーを使用
import { getFirebase } from '../core/firebase.js';

// 削除: 内部での workspace 依存を削除
// import { getCurrentWorkspaceId } from './workspace.js';

/**
 * FirestoreドキュメントデータをJavaScriptオブジェクトに変換するヘルパー
 * @param {string} id - ドキュメントID
 * @param {object} data - ドキュメントデータ
 * @returns {object} 変換後のタスクオブジェクト
 */
function deserializeTask(id, data) {
    return {
        id,
        ...data,
        // TimestampをDateオブジェクトに変換
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || Date.now()),
        dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : (data.dueDate || null),
        recurrence: data.recurrence || null,
    };
}

/**
 * タスクコレクションへのパスを取得する内部ヘルパー
 * @param {string} userId 
 * @param {string} workspaceId - ★引数で受け取るように変更
 * @returns {string|null} パス
 */
function getTasksPath(userId, workspaceId) {
    const appId = window.GLOBAL_APP_ID || (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
    
    // 引数でチェック
    if (!workspaceId || !userId) {
        // console.warn('getTasksPath: Workspace ID or User ID not provided');
        return null;
    }

    return `/artifacts/${appId}/users/${userId}/workspaces/${workspaceId}/tasks`;
}


// ==========================================================
// ★ RAW FUNCTIONS (userId, workspaceId 必須)
// ==========================================================

/**
 * タスク一覧をリアルタイム監視 (RAW)
 * @param {string} userId - ユーザーID (必須)
 * @param {string} workspaceId - ワークスペースID (必須) ★追加
 * @param {function} onUpdate - データ更新コールバック
 * @returns {function} 購読解除関数
 */
export function subscribeToTasksRaw(userId, workspaceId, onUpdate) {
    if (!userId || !workspaceId) {
        onUpdate([]); 
        return () => {}; 
    }
    
    const { db } = getFirebase();

    const path = getTasksPath(userId, workspaceId);
    if (!path) {
        onUpdate([]);
        return () => {};
    }

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

/**
 * タスクをIDで取得 (RAW)
 */
export async function getTaskByIdRaw(userId, workspaceId, taskId) {
    const { db } = getFirebase();

    const path = getTasksPath(userId, workspaceId);
    if (!path) return null;

    const ref = doc(db, path, taskId);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
        return deserializeTask(docSnap.id, docSnap.data());
    }
    return null;
}

/**
 * タスクを追加 (RAW)
 */
export async function addTaskRaw(userId, workspaceId, taskData) {
    const path = getTasksPath(userId, workspaceId);
    if (!path) throw new Error('Workspace or User not identified');
    
    const safeTaskData = { ...taskData };
    if (safeTaskData.dueDate instanceof Date) {
        safeTaskData.dueDate = Timestamp.fromDate(safeTaskData.dueDate);
    }
    
    const { db } = getFirebase();

    await addDoc(collection(db, path), {
        ...safeTaskData,
        ownerId: userId,
        status: 'todo',
        createdAt: Timestamp.fromDate(new Date()) 
    });
}

/**
 * タスクのステータスを更新 (RAW)
 */
export async function updateTaskStatusRaw(userId, workspaceId, taskId, status) {
    const path = getTasksPath(userId, workspaceId);
    if (!path) throw new Error('Workspace or User not identified');
    
    const { db } = getFirebase();

    await updateDoc(doc(db, path, taskId), { status });
}

/**
 * タスクの情報を更新（汎用, RAW）
 */
export async function updateTaskRaw(userId, workspaceId, taskId, updates) {
    const path = getTasksPath(userId, workspaceId);
    if (!path) throw new Error('Workspace or User not identified');
    
    const { db } = getFirebase();
    
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
    
    if (safeUpdates.recurrence === undefined) {
        delete safeUpdates.recurrence;
    } else if (safeUpdates.recurrence === null) {
        safeUpdates.recurrence = null;
    } 

    await updateDoc(ref, safeUpdates);
}

/**
 * タスクを削除 (RAW)
 */
export async function deleteTaskRaw(userId, workspaceId, taskId) {
    const path = getTasksPath(userId, workspaceId);
    if (!path) throw new Error('Workspace or User not identified');
    
    const { db } = getFirebase();

    const ref = doc(db, path, taskId);
    await deleteDoc(ref);
}

/**
 * バックアップデータ作成機能 (RAW)
 * 引数に workspaceId を追加して明示的に受け取る
 */
export async function createBackupDataRaw(userId, workspaceId) {
    let dbInstance;
    try {
        const firebase = getFirebase();
        dbInstance = firebase.db;
    } catch (e) {
        throw new Error("Firestore not initialized");
    }

    const appId = window.GLOBAL_APP_ID;
    
    if (!userId || !workspaceId) throw new Error("User or Workspace not identified for backup");

    const tasksPath = `/artifacts/${appId}/users/${userId}/workspaces/${workspaceId}/tasks`;
    const projectsPath = `/artifacts/${appId}/users/${userId}/workspaces/${workspaceId}/projects`;
    // ラベルはユーザー共通とするかワークスペース毎とするかによるが、現状はユーザー直下
    const labelsPath = `/artifacts/${appId}/users/${userId}/labels`;

    const tasksRef = collection(dbInstance, tasksPath);
    const projectsRef = collection(dbInstance, projectsPath);
    const labelsRef = collection(dbInstance, labelsPath);

    const [tasksSnap, projectsSnap, labelsSnap] = await Promise.all([
        getDocs(tasksRef),
        getDocs(projectsRef),
        getDocs(labelsRef)
    ]);

    const serializeData = (snap) => snap.docs.map(d => {
        const data = d.data();
        const serialized = { id: d.id };
        for (const key in data) {
            if (data[key] && data[key].toDate) {
                serialized[key] = data[key].toDate().toISOString();
            } else {
                serialized[key] = data[key];
            }
        }
        return serialized;
    });

    return {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        userId: userId,
        workspaceId: workspaceId,
        tasks: serializeData(tasksSnap),
        projects: serializeData(projectsSnap),
        labels: serializeData(labelsSnap)
    };
}