/**
 * バックアップ・インポート機能
 * tasks-raw.ts から分離 (2025-12-30)
 * 更新日: 2026-01-02 - Zodスキーマ検証を追加してデータ破損リスクを軽減
 */

import { z } from 'zod';
import { db } from '../core/firebase';
import {
    addDoc,
    collection,
    getDocs,
    Timestamp
} from "../core/firebase-sdk";
import { paths } from '../utils/paths';

// ============================================================
// バックアップデータのスキーマ定義
// ============================================================

/**
 * インポート時のスキーマ（エクスポート時よりも緩めに設定）
 * - id は文字列必須（マッピング用）
 * - 日付フィールドは number (ミリ秒) または string (ISO8601) を許容
 */
const ImportDateSchema = z.union([
    z.number(), // milliseconds
    z.string(), // ISO8601
    z.null(),
    z.undefined()
]);

const ImportTaskSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    description: z.string().nullable().optional(),
    status: z.enum(['todo', 'completed', 'archived']).optional(),
    dueDate: ImportDateSchema,
    completedAt: ImportDateSchema,
    createdAt: ImportDateSchema,
    ownerId: z.string().optional(),
    projectId: z.string().nullable().optional(),
    labelIds: z.array(z.string()).optional(),
    timeBlockId: z.string().nullable().optional(),
    duration: z.number().optional(),
    isImportant: z.boolean().optional(),
    recurrence: z.object({
        type: z.enum(['none', 'daily', 'weekly', 'weekdays', 'monthly']).optional(),
        days: z.array(z.number()).optional(),
    }).nullable().optional(),
    order: z.number().optional(),
}).passthrough(); // 追加フィールドを許容

const ImportProjectSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    color: z.string().optional(),
    ownerId: z.string().optional(),
    createdAt: ImportDateSchema,
    order: z.number().optional(),
}).passthrough();

const ImportLabelSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    color: z.string().optional(),
    ownerId: z.string().optional(),
    createdAt: ImportDateSchema,
}).passthrough();

const ImportTargetSchema = z.object({
    id: z.string(),
    mode: z.string(),
    data: z.record(z.string(), z.string()),
    createdAt: ImportDateSchema,
    updatedAt: ImportDateSchema,
    ownerId: z.string().optional(),
    workspaceId: z.string().optional(),
}).passthrough();

const ImportTimeBlockSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    start: z.string(),
    end: z.string(),
    color: z.string().optional(),
    order: z.number().optional(),
}).passthrough();

const ImportFilterSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    query: z.string(),
    createdAt: ImportDateSchema,
}).passthrough();

/** バックアップファイル全体のスキーマ */
const BackupDataSchema = z.object({
    version: z.string().optional(),
    exportedAt: z.string().optional(),
    userId: z.string().optional(),
    workspaceId: z.string().optional(),
    tasks: z.array(ImportTaskSchema).default([]),
    projects: z.array(ImportProjectSchema).default([]),
    labels: z.array(ImportLabelSchema).default([]),
    targets: z.array(ImportTargetSchema).default([]),
    timeBlocks: z.array(ImportTimeBlockSchema).default([]),
    customFilters: z.array(ImportFilterSchema).default([]),
});

export type BackupData = z.infer<typeof BackupDataSchema>;

// ============================================================
// ユーティリティ
// ============================================================

// Firestore Timestamp → JS Date 変換
const toFirestoreDate = (val: unknown): Timestamp | Date | undefined => {
    if (val instanceof Date) return Timestamp.fromDate(val);
    return val as Timestamp | undefined;
};

/** インポート用の日付変換（ミリ秒 or ISO文字列 → Date） */
const parseImportDate = (val: unknown): Date | undefined => {
    if (val === null || val === undefined) return undefined;
    if (typeof val === 'number') return new Date(val);
    if (typeof val === 'string') return new Date(val);
    return undefined;
};

// ============================================================
// エクスポート処理
// ============================================================

/**
 * バックアップデータの生成
 * 注: ラベルはユーザー単位、タスク・プロジェクトはワークスペース単位で抽出
 */
export async function createBackupData(userId: string, workspaceId: string): Promise<BackupData> {
    if (!userId || !workspaceId) throw new Error("Missing parameters for backup.");

    try {
        const tasksRef = collection(db, paths.tasks(userId, workspaceId));
        const projectsRef = collection(db, paths.projects(userId, workspaceId));
        const labelsRef = collection(db, paths.labels(userId, workspaceId));
        const targetsRef = collection(db, paths.targets(userId, workspaceId));
        const timeBlocksRef = collection(db, paths.timeblocks(userId, workspaceId));
        const filtersRef = collection(db, paths.filters(userId, workspaceId));

        const [tasksSnap, projectsSnap, labelsSnap, targetsSnap, timeBlocksSnap, filtersSnap] = await Promise.all([
            getDocs(tasksRef),
            getDocs(projectsRef),
            getDocs(labelsRef),
            getDocs(targetsRef),
            getDocs(timeBlocksRef),
            getDocs(filtersRef)
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const serializeData = (snap: any) =>
            snap.docs.map((d: any) => {
                const data = d.data();
                const serialized: Record<string, unknown> = { id: d.id };
                for (const key in data) {
                    // Use toMillis() for consistent Timestamp serialization
                    const value = data[key];
                    serialized[key] = (value instanceof Timestamp)
                        ? value.toMillis()
                        : value;
                }
                return serialized;
            });

        return {
            version: "1.4",
            exportedAt: new Date().toISOString(),
            userId,
            workspaceId,
            tasks: serializeData(tasksSnap) as BackupData['tasks'],
            projects: serializeData(projectsSnap) as BackupData['projects'],
            labels: serializeData(labelsSnap) as BackupData['labels'],
            targets: serializeData(targetsSnap) as BackupData['targets'],
            timeBlocks: serializeData(timeBlocksSnap) as BackupData['timeBlocks'],
            customFilters: serializeData(filtersSnap) as BackupData['customFilters'],
        };
    } catch (error) {
        console.error("[Backup] createBackupData failed:", error);
        throw error;
    }
}

// ============================================================
// インポート処理
// ============================================================

export interface ImportResult {
    tasksCount: number;
    projectsCount: number;
    labelsCount: number;
    targetsCount: number;
    timeBlocksCount: number;
    filtersCount: number;
    errors: string[];
}

/**
 * データのインポート処理
 * 関係性（プロジェクトID、ラベルID）を維持しながら新規データとして作成する
 * 
 * @throws ZodError - バックアップデータの形式が不正な場合
 */
export async function importBackupData(
    userId: string,
    workspaceId: string,
    backupData: unknown
): Promise<ImportResult> {
    if (!userId || !workspaceId) throw new Error("Invalid import parameters: userId and workspaceId are required.");
    if (!backupData) throw new Error("Invalid import parameters: backupData is required.");

    // ============================================================
    // 1. Zodスキーマによるバリデーション
    // ============================================================
    const parseResult = BackupDataSchema.safeParse(backupData);
    if (!parseResult.success) {
        console.error("[Backup] Validation failed:", parseResult.error.format());
        throw new Error(`バックアップデータの形式が不正です: ${parseResult.error.issues.map(i => i.message).join(', ')}`);
    }

    const validatedData = parseResult.data;
    const errors: string[] = [];

    try {
        const {
            tasks,
            projects,
            labels,
            targets,
            timeBlocks,
            customFilters
        } = validatedData;

        const projectMap = new Map<string, string>(); // OldID -> NewID
        const labelMap = new Map<string, string>();   // OldID -> NewID

        // ============================================================
        // 2. ラベルのインポート (名前重複チェック)
        // ============================================================
        const currentLabelsSnap = await getDocs(collection(db, paths.labels(userId, workspaceId)));
        const currentLabelNames = new Map<string, string>();
        currentLabelsSnap.forEach(doc => currentLabelNames.set(doc.data().name, doc.id));

        for (const label of labels) {
            try {
                const normalizedName = label.name?.trim();
                if (!normalizedName) continue;

                if (currentLabelNames.has(normalizedName)) {
                    labelMap.set(label.id, currentLabelNames.get(normalizedName)!);
                } else {
                    const newLabelData: Record<string, unknown> = { ...label, name: normalizedName };
                    delete newLabelData.id;
                    const docRef = await addDoc(collection(db, paths.labels(userId, workspaceId)), newLabelData);
                    labelMap.set(label.id, docRef.id);
                    currentLabelNames.set(normalizedName, docRef.id);
                }
            } catch (err) {
                errors.push(`ラベル "${label.name}" のインポートに失敗: ${err}`);
            }
        }

        // ============================================================
        // 3. プロジェクトのインポート
        // ============================================================
        for (const project of projects) {
            try {
                const newProjectData: Record<string, unknown> = { ...project };
                delete newProjectData.id;
                newProjectData.createdAt = parseImportDate(project.createdAt);

                const docRef = await addDoc(collection(db, paths.projects(userId, workspaceId)), newProjectData);
                projectMap.set(project.id, docRef.id);
            } catch (err) {
                errors.push(`プロジェクト "${project.name}" のインポートに失敗: ${err}`);
            }
        }

        // ============================================================
        // 4. TimeBlocksのインポート
        // ============================================================
        for (const tb of timeBlocks) {
            try {
                const newTbData: Record<string, unknown> = { ...tb };
                delete newTbData.id;
                await addDoc(collection(db, paths.timeblocks(userId, workspaceId)), newTbData);
            } catch (err) {
                errors.push(`タイムブロック "${tb.name}" のインポートに失敗: ${err}`);
            }
        }

        // ============================================================
        // 5. Custom Filtersのインポート
        // ============================================================
        for (const filter of customFilters) {
            try {
                const newFilterData: Record<string, unknown> = { ...filter };
                delete newFilterData.id;
                newFilterData.createdAt = parseImportDate(filter.createdAt);
                await addDoc(collection(db, paths.filters(userId, workspaceId)), newFilterData);
            } catch (err) {
                errors.push(`フィルター "${filter.name}" のインポートに失敗: ${err}`);
            }
        }

        // ============================================================
        // 6. Targetsのインポート
        // ============================================================
        for (const target of targets) {
            try {
                const newTargetData: Record<string, unknown> = { ...target };
                delete newTargetData.id;
                newTargetData.createdAt = parseImportDate(target.createdAt);
                newTargetData.updatedAt = parseImportDate(target.updatedAt);
                newTargetData.ownerId = userId;
                newTargetData.workspaceId = workspaceId;
                await addDoc(collection(db, paths.targets(userId, workspaceId)), newTargetData);
            } catch (err) {
                errors.push(`ターゲット (mode: ${target.mode}) のインポートに失敗: ${err}`);
            }
        }

        // ============================================================
        // 7. タスクのインポート (依存関係解決後)
        // ============================================================
        const tasksPromises = tasks.map(async (task) => {
            try {
                const newTaskData: Record<string, unknown> = { ...task };
                delete newTaskData.id;

                // 日付変換
                newTaskData.createdAt = parseImportDate(task.createdAt);
                const dueDate = parseImportDate(task.dueDate);
                newTaskData.dueDate = dueDate ? toFirestoreDate(dueDate) : null;
                newTaskData.completedAt = parseImportDate(task.completedAt);

                // プロジェクトIDマッピング
                if (task.projectId && projectMap.has(task.projectId)) {
                    newTaskData.projectId = projectMap.get(task.projectId);
                } else {
                    newTaskData.projectId = null;
                }

                // ラベルIDマッピング
                if (Array.isArray(task.labelIds)) {
                    newTaskData.labelIds = task.labelIds
                        .map((oldId: string) => labelMap.get(oldId))
                        .filter((newId: string | undefined): newId is string => !!newId);
                }

                newTaskData.ownerId = userId;

                await addDoc(collection(db, paths.tasks(userId, workspaceId)), newTaskData);
            } catch (err) {
                errors.push(`タスク "${task.title}" のインポートに失敗: ${err}`);
            }
        });

        await Promise.all(tasksPromises);

        return {
            tasksCount: tasks.length,
            projectsCount: projects.length,
            labelsCount: labels.length,
            targetsCount: targets.length,
            timeBlocksCount: timeBlocks.length,
            filtersCount: customFilters.length,
            errors,
        };
    } catch (error) {
        console.error("[Backup] importBackupData failed:", error);
        throw error;
    }
}
