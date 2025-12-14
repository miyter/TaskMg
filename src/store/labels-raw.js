// @ts-nocheck
// @miyter:20251129

// 修正: SDKラッパーからインポート
import { 
    collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot 
} from "../core/firebase-sdk.js";

// 修正: dbの直接インポートを廃止し、getFirebaseヘルパーを使用
// import { db } from '../core/firebase.js';
import { getFirebase } from '../core/firebase.js';

// ==========================================================
// ★ RAW FUNCTIONS (userId必須) - ラッパー層からのみ呼び出し
// ==========================================================

/**
 * ラベルデータのリアルタイムリスナーを開始する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {function} onUpdate - データ更新時に呼び出されるコールバック関数
 * @returns {function} リスナーを解除するための関数
 */
export function subscribeToLabelsRaw(userId, onUpdate) {
    const appId = (typeof window !== 'undefined' && window.GLOBAL_APP_ID) 
        ? window.GLOBAL_APP_ID 
        : 'default-app-id';
        
    const path = `/artifacts/${appId}/users/${userId}/labels`;
    
    // 修正: 実行時にインスタンスを取得
    const { db } = getFirebase();
    
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const labels = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        onUpdate(labels);
    });
}

/**
 * 新しいラベルを追加する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {string} name - ラベル名
 * @param {string} color - ラベルの色 (HEXまたはTailwindクラス名)
 */
export async function addLabelRaw(userId, name, color) {
    const appId = (typeof window !== 'undefined' && window.GLOBAL_APP_ID) 
        ? window.GLOBAL_APP_ID 
        : 'default-app-id';
        
    const path = `/artifacts/${appId}/users/${userId}/labels`;
    
    // 修正: 実行時にインスタンスを取得
    const { db } = getFirebase();

    await addDoc(collection(db, path), {
        name,
        color,
        ownerId: userId,
        createdAt: new Date()
    });
}

/**
 * ラベルを更新する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {string} labelId - ラベルID
 * @param {object} updates - 更新内容
 */
export async function updateLabelRaw(userId, labelId, updates) {
    const appId = (typeof window !== 'undefined' && window.GLOBAL_APP_ID) 
        ? window.GLOBAL_APP_ID 
        : 'default-app-id';
        
    const path = `/artifacts/${appId}/users/${userId}/labels`;
    
    // 修正: 実行時にインスタンスを取得
    const { db } = getFirebase();

    const ref = doc(db, path, labelId);
    return updateDoc(ref, updates);
}

/**
 * ラベルを削除する (RAW)。
 * @param {string} userId - ユーザーID (必須)
 * @param {string} labelId - ラベルID
 */
export async function deleteLabelRaw(userId, labelId) {
    const appId = (typeof window !== 'undefined' && window.GLOBAL_APP_ID) 
        ? window.GLOBAL_APP_ID 
        : 'default-app-id';
        
    const path = `/artifacts/${appId}/users/${userId}/labels`;
    
    // 修正: 実行時にインスタンスを取得
    const { db } = getFirebase();

    await deleteDoc(doc(db, path, labelId));
}