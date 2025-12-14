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

// 相対パスを維持
import { db } from '../core/firebase.js';

let unsubscribe = null;

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


// ==========================================================
// ★ RAW FUNCTIONS (userId必須) - UI層からは直接呼び出さない
// ==========================================================

/**
 * タスク一覧をリアルタイム監視 (RAW)
 * @param {string} userId - ユーザーID (必須)
 * @param {function} onUpdate - データ更新コールバック
 */
export function subscribeToTasksRaw(userId, onUpdate) {
    if (unsubscribe) unsubscribe();
    if (!userId) {
        onUpdate([]); // ユーザーIDがない場合は空のリストを返す
        return;
    }
    
    // アプリIDの取得と検証
    const appId = window.GLOBAL_APP_ID || (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
    console.log(`[Tasks] Subscribing for User: ${userId}, AppId: ${appId}`);

    const path = `/artifacts/${appId}/users/${userId}/tasks`;
    const q = query(collection(db, path));

    unsubscribe = onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => deserializeTask(doc.id, doc.data()));
        onUpdate(tasks);
    }, (error) => {
        // エラーハンドリング追加
        console.error("Task subscription error:", error);
        
        if (error.code === 'permission-denied') {
            console.warn("Permission denied for tasks. This usually happens when:\n1. Firestore rules block access\n2. The userId in path doesn't match auth.currentUser\n3. Data migration is incomplete (old paths)");
        }
        
        // エラー時は空配列を返してUIをブロックしない
        onUpdate([]);
        
        // エラー発生時は購読を明示的に解除
        unsubscribe = null;
    });
}

/**
 * タスクをIDで取得 (RAW)
 * @param {string} userId - ユーザーID (必須)
 * @param {string} taskId - タスクID
 * @returns {object|null} タスクオブジェクト
 */
export async function getTaskByIdRaw(userId, taskId) {
    const appId = window.GLOBAL_APP_ID;
    const ref = doc(db, `/artifacts/${appId}/users/${userId}/tasks`, taskId);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
        return deserializeTask(docSnap.id, docSnap.data());
    }
    return null;
}

/**
 * タスクを追加 (RAW)
 * @param {string} userId - ユーザーID (必須)
 * @param {object} taskData - タスクデータ
 */
export async function addTaskRaw(userId, taskData) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/tasks`;
    
    // dueDateがDateオブジェクトの場合はTimestampに変換
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

/**
 * タスクのステータスを更新 (RAW)
 * @param {string} userId - ユーザーID (必須)
 * @param {string} taskId - タスクID
 * @param {string} status - 新しいステータス
 */
export async function updateTaskStatusRaw(userId, taskId, status) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/tasks`;
    await updateDoc(doc(db, path, taskId), { status });
}

/**
 * タスクの情報を更新（汎用, RAW）
 * @param {string} userId - ユーザーID (必須)
 * @param {string} taskId - タスクID
 * @param {object} updates - 更新内容
 */
export async function updateTaskRaw(userId, taskId, updates) {
    const appId = window.GLOBAL_APP_ID;
    const ref = doc(db, `/artifacts/${appId}/users/${userId}/tasks`, taskId);
    
    const safeUpdates = { ...updates };

    // 日付オブジェクトの変換
    if (safeUpdates.dueDate && !(safeUpdates.dueDate instanceof Timestamp)) {
        if (safeUpdates.dueDate instanceof Date) {
            safeUpdates.dueDate = Timestamp.fromDate(safeUpdates.dueDate);
        } else if (typeof safeUpdates.dueDate === 'string' || typeof safeUpdates.dueDate === 'number') {
            safeUpdates.dueDate = Timestamp.fromDate(new Date(safeUpdates.dueDate));
        } else if (safeUpdates.dueDate === null) {
            safeUpdates.dueDate = null;
        }
    }
    
    // recurrence: null または object をそのまま渡す
    if (safeUpdates.recurrence === undefined) {
        delete safeUpdates.recurrence;
    } else if (safeUpdates.recurrence === null) {
        safeUpdates.recurrence = null;
    } 

    await updateDoc(ref, safeUpdates);
}

/**
 * タスクを削除 (RAW)
 * @param {string} userId - ユーザーID (必須)
 * @param {string} taskId - タスクID
 */
export async function deleteTaskRaw(userId, taskId) {
    const appId = window.GLOBAL_APP_ID;
    const ref = doc(db, `/artifacts/${appId}/users/${userId}/tasks`, taskId);
    await deleteDoc(ref);
}

/**
 * バックアップデータ作成機能 (RAW)
 * @param {string} userId - ユーザーID (必須)
 */
export async function createBackupDataRaw(userId) {
    if (!db) throw new Error("Firestore not initialized");
    const appId = window.GLOBAL_APP_ID;
    
    const tasksRef = collection(db, `/artifacts/${appId}/users/${userId}/tasks`);
    const projectsRef = collection(db, `/artifacts/${appId}/users/${userId}/projects`);
    const labelsRef = collection(db, `/artifacts/${appId}/users/${userId}/labels`);

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
        tasks: serializeData(tasksSnap),
        projects: serializeData(projectsSnap),
        labels: serializeData(labelsSnap)
    };
}