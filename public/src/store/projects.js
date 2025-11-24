// --- プロジェクトデータ操作 ---
import { collection, addDoc, query, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db } from '../core/firebase.js';

export function subscribeToProjects(userId, onUpdate) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/projects`;
    // orderByはインデックスエラー回避のため一旦外すか、必要なら複合インデックスを作成する
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        onUpdate(projects);
    });
}

export async function addProject(userId, name) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/projects`;
    await addDoc(collection(db, path), {
        name,
        ownerId: userId,
        createdAt: new Date()
    });
}