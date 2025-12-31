
import { auth, db } from '../core/firebase';
import { collection, deleteDoc, doc, getDocs } from '../core/firebase-sdk';
import { paths } from '../utils/paths';
import { Task } from './schema';

/**
 * ワークスペース内の重複タスクを検出し、削除する
 * 重複の定義: タイトルが完全に一致し、かつ未完了のタスク
 * 
 * @param workspaceId 対象のワークスペースID
 * @returns 削除されたタスクの数
 */
export async function cleanupDuplicateTasks(workspaceId: string): Promise<number> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const path = paths.tasks(user.uid, workspaceId);
    const snapshot = await getDocs(collection(db, path));

    const tasks = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Task));
    const seenTitles = new Map<string, Task[]>();

    // 1. Group by Title
    for (const task of tasks) {
        if (!task.title) continue;
        const key = task.title.trim();
        const existing = seenTitles.get(key) || [];
        existing.push(task);
        seenTitles.set(key, existing);
    }

    let deletedCount = 0;
    const deletePromises: Promise<void>[] = [];

    // 2. Identify Duplicates
    for (const [title, group] of seenTitles.entries()) {
        if (group.length > 1) {
            // Keep the one with the most information (e.g. has description) 
            // or the oldest one (original), or newest.
            // Policy: Keep the oldest created one (most likely the original), delete others.
            // If createdAt is missing, use ID string comparison.

            group.sort((a, b) => {
                // Handle Firestore Timestamp or Date objects
                const getTime = (val: unknown): number => {
                    if (!val) return 0;
                    if (typeof val === 'object' && 'toDate' in val && typeof (val as { toDate: () => Date }).toDate === 'function') {
                        return (val as { toDate: () => Date }).toDate().getTime();
                    }
                    const date = new Date(val as string | number | Date);
                    return isNaN(date.getTime()) ? 0 : date.getTime();
                };
                const timeA = getTime(a.createdAt);
                const timeB = getTime(b.createdAt);
                return timeA - timeB; // Oldest first
            });

            // Keep index 0, delete index 1..n
            const toDelete = group.slice(1);

            for (const task of toDelete) {
                if (!task.id) continue; // Skip if id is undefined
                console.log(`[Cleanup] Deleting duplicate task: "${task.title}" (${task.id})`);
                deletePromises.push(deleteDoc(doc(db, path, task.id)));
                deletedCount++;
            }
        }
    }

    await Promise.all(deletePromises);
    return deletedCount;
}
