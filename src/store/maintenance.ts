import { subDays } from 'date-fns';
import { auth, db } from '../core/firebase';
import { collection, doc, getDocs, query, where } from '../core/firebase-sdk';
import { BatchManager } from '../utils/batch-manager';
import { ensureDate } from '../utils/date-tz';
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

    const groupIdsToDelete: string[] = [];

    // 2. Identify Duplicates
    for (const [_, group] of seenTitles.entries()) {
        if (group.length > 1) {
            // Policy: Keep the oldest created one (most likely the original), delete others.
            group.sort((a, b) => {
                const getTime = (val: unknown): number => {
                    return ensureDate(val as any)?.getTime() || 0;
                };
                const timeA = getTime(a.createdAt);
                const timeB = getTime(b.createdAt);
                return timeA - timeB; // Oldest first
            });

            // Keep index 0, delete index 1..n
            const toDelete = group.slice(1);
            for (const task of toDelete) {
                if (task.id) {
                    groupIdsToDelete.push(task.id);
                }
            }
        }
    }

    // 3. Delete using BatchManager
    if (groupIdsToDelete.length > 0) {
        const batchManager = new BatchManager();
        for (const id of groupIdsToDelete) {
            batchManager.delete(doc(db, path, id));
        }
        await batchManager.commitAll();
    }

    return groupIdsToDelete.length;
}

/**
 * 古い完了済みタスクのクリーンアップ（詳細情報の削除）
 * ポリシー: 完了から30日以上経過したタスクのdescriptionを空にし、isDetailPurgedフラグを立てる
 * 
 * @param workspaceId 対象のワークスペースID
 * @returns 更新されたタスクの数
 */
export async function cleanupOldTasks(workspaceId: string): Promise<number> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const path = paths.tasks(user.uid, workspaceId);

    // Fetch completed tasks
    const q = query(collection(db, path), where('status', '==', 'completed'));
    const snapshot = await getDocs(q);

    const cutOffDate = subDays(new Date(), 30);
    const tasksToClean: Task[] = [];

    for (const d of snapshot.docs) {
        const t = { id: d.id, ...d.data() } as Task;

        // Skip if already purged
        if (t.isDetailPurged) continue;

        // Check completedAt
        if (t.completedAt) {
            const completedDate = ensureDate(t.completedAt);
            if (completedDate && completedDate < cutOffDate) {
                // Only process if it has description or hasn't been marked purged
                if (t.description || !t.isDetailPurged) {
                    tasksToClean.push(t);
                }
            }
        }
    }

    if (tasksToClean.length === 0) return 0;

    const batchManager = new BatchManager();
    let updatedCount = 0;

    for (const task of tasksToClean) {
        batchManager.update(doc(db, path, task.id!), {
            description: '',
            isDetailPurged: true,
        });
        updatedCount++;
    }

    await batchManager.commitAll();
    return updatedCount;
}
