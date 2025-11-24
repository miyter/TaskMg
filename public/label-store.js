// --- ラベル操作モジュール ---
import { collection, addDoc, query, onSnapshot, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db, appId } from './firebase-init.js';

const PRESET_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];

function getLabelRef(userId) {
    return collection(db, `/artifacts/${appId}/users/${userId}/labels`);
}

export async function addLabel(userId, name) {
    if (!name.trim()) return;
    const color = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
    await addDoc(getLabelRef(userId), {
        name: name.trim(),
        color: color,
        createdAt: new Date(),
        ownerId: userId
    });
}

export async function deleteLabel(userId, labelId) {
    if (!confirm("タグを削除しますか？")) return;
    await deleteDoc(doc(getLabelRef(userId), labelId));
}

export function subscribeLabels(userId, callback) {
    const q = query(getLabelRef(userId), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
        const labels = [];
        snapshot.forEach(doc => labels.push({ id: doc.id, ...doc.data() }));
        callback(labels);
    });
}