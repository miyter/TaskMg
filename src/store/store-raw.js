// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 日付変換の共通化、バックアップ仕様のコメント追記、Timestamp判定の厳密化
 */

import {
    collection, addDoc, updateDoc, deleteDoc, doc, query, onSnapshot, getDoc, getDocs, Timestamp, serverTimestamp
} from "../core/firebase-sdk.js";
import { db } from '../core/firebase.js';
import { paths } from '../utils/paths.js';

/**
 * 共通の日付変換ヘルパー
 */
const toJSDate = (val) => (val instanceof Timestamp) ? val.toDate() : val;
const toFirestoreDate = (val) => (val instanceof Date) ? Timestamp.fromDate(val) : val;

/**
 * FirestoreドキュメントをJSオブジェクトに変換
 */
function deserializeTask(id, data) {
    return {
        id,
        ...data,
        createdAt: toJSDate(data.createdAt) || null,
        dueDate: toJSDate(data.dueDate) || null,
        recurrence: data.recurrence || null,
    };
}

export function subscribeToTasksRaw(userId, workspaceId, onUpdate) {
    if (!userId || !workspaceId) {
        onUpdate([]);
        return () => { };
    }

    const path = paths.tasks(userId, workspaceId);
    const q = query(collection(db, path));

    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => deserializeTask(doc.id, doc.data()));
        onUpdate(tasks);
    }, (error) => {
        console.error("[Tasks] Subscription error:", error);
        onUpdate([]);
    });
}

export async function getTaskByIdRaw(userId, workspaceId, taskId) {
    const path = paths.tasks(userId, workspaceId);
    const ref = doc(db, path, taskId);
    const docSnap = await getDoc(ref);
    return docSnap.exists() ? deserializeTask(docSnap.id, docSnap.data()) : null;
}

export async function addTaskRaw(userId, workspaceId, taskData) {
    const path = paths.tasks(userId, workspaceId);
    const safeTaskData = { ...taskData };

    // 日付の正規化
    if (safeTaskData.dueDate) {
        safeTaskData.dueDate = toFirestoreDate(safeTaskData.dueDate);
    }

    return await addDoc(collection(db, path), {
        ...safeTaskData,
        ownerId: userId,
        status: 'todo',
        createdAt: serverTimestamp()
    });
}

export async function updateTaskStatusRaw(userId, workspaceId, taskId, status) {
    const path = paths.tasks(userId, workspaceId);
    await updateDoc(doc(db, path, taskId), { status });
}

export async function updateTaskRaw(userId, workspaceId, taskId, updates) {
    const path = paths.tasks(userId, workspaceId);
    const ref = doc(db, path, taskId);
    const safeUpdates = { ...updates };

    if (safeUpdates.dueDate !== undefined) {
        safeUpdates.dueDate = toFirestoreDate(safeUpdates.dueDate);
    }

    // undefinedを削除して既存のフィールドを保護（Firestoreの標準挙動に準拠）
    if (safeUpdates.recurrence === undefined) delete safeUpdates.recurrence;

    await updateDoc(ref, safeUpdates);
}

export async function deleteTaskRaw(userId, workspaceId, taskId) {
    const path = paths.tasks(userId, workspaceId);
    await deleteDoc(doc(db, path, taskId));
}

/**
 * バックアップデータの生成
 * ※ labels はワークスペースに依存せずユーザー全体で共有される仕様のため
 * workspaceId は tasks/projects の抽出にのみ使用する。
 */
export async function createBackupDataRaw(userId, workspaceId) {
    if (!userId || !workspaceId) throw new Error("Credentials missing for backup");

    const tasksRef = collection(db, paths.tasks(userId, workspaceId));
    const projectsRef = collection(db, paths.projects(userId, workspaceId));
    const labelsRef = collection(db, paths.labels(userId));

    const [tasksSnap, projectsSnap, labelsSnap] = await Promise.all([
        getDocs(tasksRef),
        getDocs(projectsRef),
        getDocs(labelsRef)
    ]);

    const serializeData = (snap) => snap.docs.map(d => {
        const data = d.data();
        const serialized = { id: d.id };
        for (const key in data) {
            // TimestampはISO文字列へ変換。それ以外はそのまま
            serialized[key] = (data[key] instanceof Timestamp)
                ? data[key].toDate().toISOString()
                : data[key];
        }
        return serialized;
    });

    return {
        version: "1.2",
        exportedAt: new Date().toISOString(),
        userId,
        workspaceId,
        tasks: serializeData(tasksSnap),
        projects: serializeData(projectsSnap),
        labels: serializeData(labelsSnap)
    };
}