// --- プロジェクトStore (移動: public/project-store.js -> src/store/projects.js) ---
import { collection, addDoc, query, onSnapshot, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db, appId } from '../core/firebase.js';

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
}

export function subscribeProjects(userId, callback) {
    const q = query(getProjectRef(userId), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
        const projects = [];
        snapshot.forEach(doc => projects.push({ id: doc.id, ...doc.data() }));
        callback(projects);
    });
}