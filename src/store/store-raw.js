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
// import { db } from '../core/firebase.js'; 
import { getFirebase } from '../core/firebase.js';
import { getCurrentWorkspaceId } from './workspace.js'; // 追加

// 削除: グローバル変数での購読管理を廃止
// let unsubscribe = null;

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
 * @returns {string|null} パスまたはnull（ワークスペース未選択時）
 */
function getTasksPath(userId) {
    const appId = window.GLOBAL_APP_ID || (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
    
    // ワークスペースIDを取得してパスに含める
    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) {
        console.warn('getTasksPath: Workspace ID not found');
        return null;
    }

    return `/artifacts/${appId}/users/${userId}/workspaces/${workspaceId}/tasks`;
}


// ==========================================================
// ★ RAW FUNCTIONS (userId必須) - UI層からは直接呼び出さない
// ==========================================================

/**
 * タスク一覧をリアルタイム監視 (RAW)
 * @param {string} userId - ユーザーID (必須)
 * @param {function} onUpdate - データ更新コールバック
 * @returns {function} 購読解除関数
 */
export function subscribeToTasksRaw(userId, onUpdate) {
    // 削除: グローバル変数のチェックを廃止
    // if (unsubscribe) unsubscribe();

    if (!userId) {
        onUpdate([]); // ユーザーIDがない場合は空のリストを返す
        return () => {}; // 空の解除関数を返す
    }
    
    // 修正: 実行時にインスタンスを取得
    const { db } = getFirebase();

    const path = getTasksPath(userId);
    if (!path) {
        onUpdate([]);
        return () => {}; // 空の解除関数を返す
    }

    console.log(`[Tasks] Subscribing to: ${path}`);
    const q = query(collection(db, path));

    // 変更: onSnapshotの戻り値（解除関数）を直接呼び出し元へ返す
    return onSnapshot(q, (snapshot) => {
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
        
        // グローバル変数の操作を削除
        // unsubscribe = null;
    });
}

/**
 * タスクをIDで取得 (RAW)
 * @param {string} userId - ユーザーID (必須)
 * @param {string} taskId - タスクID
 * @returns {object|null} タスクオブジェクト
 */
export async function getTaskByIdRaw(userId, taskId) {
    // 修正: 実行時にインスタンスを取得
    const { db } = getFirebase();

    const path = getTasksPath(userId);
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
 * @param {string} userId - ユーザーID (必須)
 * @param {object} taskData - タスクデータ
 */
export async function addTaskRaw(userId, taskData) {
    const path = getTasksPath(userId);
    if (!path) throw new Error('Workspace not selected');
    
    // dueDateがDateオブジェクトの場合はTimestampに変換
    const safeTaskData = { ...taskData };
    if (safeTaskData.dueDate instanceof Date) {
        safeTaskData.dueDate = Timestamp.fromDate(safeTaskData.dueDate);
    }
    
    // 修正: 実行時にインスタンスを取得
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
 * @param {string} userId - ユーザーID (必須)
 * @param {string} taskId - タスクID
 * @param {string} status - 新しいステータス
 */
export async function updateTaskStatusRaw(userId, taskId, status) {
    const path = getTasksPath(userId);
    if (!path) throw new Error('Workspace not selected');
    
    // 修正: 実行時にインスタンスを取得
    const { db } = getFirebase();

    await updateDoc(doc(db, path, taskId), { status });
}

/**
 * タスクの情報を更新（汎用, RAW）
 * @param {string} userId - ユーザーID (必須)
 * @param {string} taskId - タスクID
 * @param {object} updates - 更新内容
 */
export async function updateTaskRaw(userId, taskId, updates) {
    const path = getTasksPath(userId);
    if (!path) throw new Error('Workspace not selected');
    
    // 修正: 実行時にインスタンスを取得
    const { db } = getFirebase();
    
    const ref = doc(db, path, taskId);
    
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
    const path = getTasksPath(userId);
    if (!path) throw new Error('Workspace not selected');
    
    // 修正: 実行時にインスタンスを取得
    const { db } = getFirebase();

    const ref = doc(db, path, taskId);
    await deleteDoc(ref);
}

/**
 * バックアップデータ作成機能 (RAW)
 * @param {string} userId - ユーザーID (必須)
 */
export async function createBackupDataRaw(userId) {
    // 修正: 実行時にインスタンスを取得
    let dbInstance;
    try {
        const firebase = getFirebase();
        dbInstance = firebase.db;
    } catch (e) {
        throw new Error("Firestore not initialized");
    }

    const appId = window.GLOBAL_APP_ID;
    
    // 注: バックアップも現在のワークスペースのみを対象とする
    // もし全ワークスペースのバックアップが必要な場合は、構造を再考する必要がある
    const workspaceId = getCurrentWorkspaceId();
    if (!workspaceId) throw new Error("Workspace not selected for backup");

    const tasksPath = `/artifacts/${appId}/users/${userId}/workspaces/${workspaceId}/tasks`;
    const projectsPath = `/artifacts/${appId}/users/${userId}/workspaces/${workspaceId}/projects`;
    // ラベルはワークスペース共有か個別か未定だが、一旦ユーザー直下のままにするか、あるいはワークスペース下にするか。
    // ここでは安全のため既存パス(ユーザー直下)を維持しておくが、必要に応じて変更する。
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