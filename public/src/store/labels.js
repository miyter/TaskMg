// --- ラベルデータ操作 ---
import { collection, addDoc, query, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db } from '../core/firebase.js';

export function subscribeToLabels(userId, onUpdate) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/labels`;
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const labels = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        onUpdate(labels);
    });
}

export async function addLabel(userId, name, color) {
    const appId = window.GLOBAL_APP_ID;
    const path = `/artifacts/${appId}/users/${userId}/labels`;
    await addDoc(collection(db, path), {
        name,
        color,
        ownerId: userId,
        createdAt: new Date()
    });
}