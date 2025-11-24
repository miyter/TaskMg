// --- プロジェクト操作モジュール ---
import { collection, addDoc, query, onSnapshot, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db, appId } from './firebase-init.js';

function getProjectRef(userId) {
    return collection(db, `/artifacts/${appId}/users/${userId}/projects`);
}

export async function addProject(userId, name) {
    if (!name.trim()) return;
    await addDoc(getProjectRef(userId), {
        name: name.trim(),
        createdAt: new Date(),
        ownerId: userId
    });
}

export async function deleteProject(userId, projectId) {
    if (!confirm("プロジェクトを削除しますか？タスクは削除されませんが、Inboxに移動します。")) return;
    await deleteDoc(doc(getProjectRef(userId), projectId));
    // ※実運用ではタスクのprojectIdをnullにするバッチ処理が必要ですが、今回は割愛
}

export function subscribeProjects(userId, callback) {
    const q = query(getProjectRef(userId), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
        const projects = [];
        snapshot.forEach(doc => projects.push({ id: doc.id, ...doc.data() }));
        callback(projects);
    });
}