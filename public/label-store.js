// 作成日: 2025-11-25
// 役割: ラベル（タグ）データのFirestore読み書きを担当

import { 
    collection, 
    addDoc, 
    query, 
    onSnapshot, 
    deleteDoc, 
    doc 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db, isInitialized } from "./firebase-init.js";

const appId = window.GLOBAL_APP_ID || 'default-app-id';

// プリセットカラー（パステルカラー）
const PRESET_COLORS = [
    '#FCA5A5', // Red
    '#FDBA74', // Orange
    '#FDE047', // Yellow
    '#86EFAC', // Green
    '#67E8F9', // Cyan
    '#93C5FD', // Blue
    '#C4B5FD', // Purple
    '#F0ABFC', // Pink
];

function getLabelCollection(userId) {
    const currentAppId = typeof __app_id !== 'undefined' ? __app_id : appId;
    return collection(db, `/artifacts/${currentAppId}/users/${userId}/labels`);
}

/**
 * ラベルを追加
 * 色はランダムで決定します
 */
export async function addLabel(userId, name) {
    if (!isInitialized || !userId || !name.trim()) return false;

    // ランダムに色を選択
    const color = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];

    try {
        await addDoc(getLabelCollection(userId), {
            name: name.trim(),
            color: color,
            createdAt: new Date(),
            ownerId: userId
        });
        console.log("ラベル追加成功");
        return true;
    } catch (e) {
        console.error("ラベル追加エラー:", e);
        return false;
    }
}

/**
 * ラベル一覧をリアルタイム監視
 */
export function subscribeToLabels(userId, callback) {
    if (!isInitialized || !userId) return;

    const q = query(getLabelCollection(userId));

    return onSnapshot(q, (snapshot) => {
        const labels = [];
        snapshot.forEach((doc) => {
            labels.push({ id: doc.id, ...doc.data() });
        });
        
        // 名前順にソート
        labels.sort((a, b) => a.name.localeCompare(b.name));

        callback(labels);
    }, (error) => {
        console.error("ラベル取得エラー:", error);
        callback([]);
    });
}

/**
 * ラベルを削除
 */
export async function deleteLabel(userId, labelId) {
    if (!isInitialized || !userId) return;
    try {
        const currentAppId = typeof __app_id !== 'undefined' ? __app_id : appId;
        const ref = doc(db, `/artifacts/${currentAppId}/users/${userId}/labels/${labelId}`);
        await deleteDoc(ref);
        return true;
    } catch (e) {
        console.error("ラベル削除エラー:", e);
        return false;
    }
}