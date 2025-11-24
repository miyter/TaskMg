// --- タスクデータ操作 ---
import { 
    collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc, Timestamp,
    getDocs // ★追加: バックアップ用
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db } from '../core/firebase.js';

let unsubscribe = null;

export function subscribeToTasks(userId, onUpdate) {
    if (unsubscribe) unsubscribe();
    
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/tasks`;
    const q = query(collection(db, path));

    unsubscribe = onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // TimestampをDateオブジェクトまたは数値に変換
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                dueDate: data.dueDate?.toDate ? data.dueDate.toDate() : null
            };
        });
        onUpdate(tasks);
    });
}

export async function addTask(userId, taskData) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/tasks`;
    
    await addDoc(collection(db, path), {
        ...taskData,
        ownerId: userId,
        createdAt: new Date(),
        status: 'todo'
    });
}

export async function updateTask(userId, taskId, updates) {
    const appId = window.GLOBAL_APP_ID;
    const ref = doc(db, `/artifacts/${appId}/users/${userId}/tasks`, taskId);
    
    // 日付データの変換処理
    if (updates.dueDate && !(updates.dueDate instanceof Date) && !(updates.dueDate instanceof Timestamp)) {
         updates.dueDate = new Date(updates.dueDate);
    }
    
    await updateDoc(ref, updates);
}

export async function deleteTask(userId, taskId) {
    const appId = window.GLOBAL_APP_ID;
    const ref = doc(db, `/artifacts/${appId}/users/${userId}/tasks`, taskId);
    await deleteDoc(ref);
}

// ★追加: バックアップデータ作成機能
export async function createBackupData(userId) {
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

    // TimestampをtoISOStringに変換するヘルパー
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

    const backup = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        userId: userId,
        tasks: serializeData(tasksSnap),
        projects: serializeData(projectsSnap),
        labels: serializeData(labelsSnap)
    };

    return backup;
}