/**
 * 更新日: 2025-12-21
 * 内容: 引数シグネチャの修正 (workspaceId, callback)
 * TypeScript化: 2025-12-29
 */

import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    Unsubscribe,
    writeBatch
} from "../core/firebase-sdk";

import { auth, db } from "../core/firebase";

import { paths } from '../utils/paths';
import { TimeBlock } from './schema';

let timeBlocks: TimeBlock[] = [];

const defaultTimeBlocks: TimeBlock[] = [
    { id: 'tb_morning', name: '06:00 - 09:00', start: '06:00', end: '09:00', color: '#EF4444', order: 0 },
    { id: 'tb_afternoon', name: '13:00 - 17:00', start: '13:00', end: '17:00', color: '#3B82F6', order: 1 },
    { id: 'tb_night', name: '20:00 - 22:00', start: '20:00', end: '22:00', color: '#8B5CF6', order: 2 }
];

/**
 * タイムブロックの購読
 * @param {string} workspaceId - DataSyncManagerから渡されるID
 * @param {function} callback
 */
export function subscribeToTimeBlocks(workspaceId: string, callback: (blocks: TimeBlock[]) => void): Unsubscribe {
    const userId = auth.currentUser?.uid;

    if (!userId) {
        timeBlocks = [...defaultTimeBlocks];
        if (typeof callback === 'function') callback(timeBlocks);
        return () => { };
    }

    const path = paths.timeblocks(userId);
    const q = query(collection(db, path), orderBy('order', 'asc'));

    return onSnapshot(q, (snapshot) => {
        // Validation could be added here
        timeBlocks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as TimeBlock[];

        if (typeof callback === 'function') callback(timeBlocks);
    }, (error) => {
        console.error("[TimeBlocks] Subscription error:", error);
    });
}

export function getTimeBlocks(): TimeBlock[] {
    return [...timeBlocks];
}

export function getTimeBlockById(id: string): TimeBlock | undefined {
    return timeBlocks.find(b => b.id === id);
}

export function clearTimeBlocksCache() {
    timeBlocks = [];
}

export async function saveTimeBlock(block: Partial<TimeBlock>): Promise<boolean | undefined> {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        console.error('Authentication required for TimeBlock operation.');
        return;
    }

    try {
        // Validate partial block if needed, but for now we trust mostly
        // TimeBlockSchema.partial().parse(block);

        const path = paths.timeblocks(userId);
        const id = block.id || crypto.randomUUID();
        const nextOrder = block.order !== undefined
            ? block.order
            : Math.max(...timeBlocks.map(b => b.order || 0), -1) + 1;

        const dataToSave = {
            name: block.name,
            start: block.start,
            end: block.end,
            color: block.color,
            order: nextOrder,
            updatedAt: serverTimestamp()
        };

        // Validate dataToSave against schema parts except serverTimestamp

        await setDoc(doc(db, path, id), dataToSave, { merge: true });
        return true;
    } catch (e) {
        console.error("[TimeBlocks] Save error:", e);
        // showMessageModal("保存に失敗した。");
    }
}

export async function deleteTimeBlock(id: string): Promise<boolean | undefined> {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    try {
        const path = paths.timeblocks(userId);
        await deleteDoc(doc(db, path, id));
        return true;
    } catch (e) {
        console.error("[TimeBlocks] Delete error:", e);
    }
}

export async function updateTimeBlockOrder(orderedIds: string[]) {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    try {
        const path = paths.timeblocks(userId);
        const batch = writeBatch(db);
        orderedIds.forEach((id, index) => {
            const ref = doc(db, path, id);
            batch.update(ref, { order: index });
        });
        await batch.commit();
    } catch (e) {
        console.error("[TimeBlocks] Order update error:", e);
    }
}
