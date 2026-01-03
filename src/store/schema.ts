/**
 * 共有スキーマ定義
 * Zodを使用してランタイムバリデーションと型定義を両立させる
 */
import { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

// --- Base Types ---

/**
 * FirestoreのTimestampまたはDateを受け入れるスキーマ
 * 最終的にDateオブジェクトに変換することを想定
 * 文字列の場合はISO8601形式のみ許容
 */
const DateLikeSchema = z.union([
    z.date(),
    z.instanceof(Timestamp),
    z.string().datetime({ offset: true }).or(z.string().datetime())
]).nullable().optional();

// --- Schemas ---

export const RecurrenceSchema = z.object({
    type: z.enum(['none', 'daily', 'weekly', 'weekdays', 'monthly']).default('none'),
    days: z.array(z.number().min(0).max(6)).optional(), // 0-6 for Sunday-Saturday
}).nullable();

export const TaskSchema = z.object({
    id: z.string().optional(), // Firestore ID
    title: z.string().min(1, "タイトルは必須です"),
    description: z.string().nullable().optional(),
    status: z.enum(['todo', 'completed', 'archived']).default('todo'),
    dueDate: DateLikeSchema,
    completedAt: DateLikeSchema,
    createdAt: DateLikeSchema,

    // Relations
    ownerId: z.string(),
    projectId: z.string().nullable().optional(),
    labelIds: z.array(z.string()).optional(),
    timeBlockId: z.string().nullable().optional(),

    // Metadata
    duration: z.number().min(0, '所要時間は0以上の数値で指定してください').optional(),
    isImportant: z.boolean().default(false),
    recurrence: RecurrenceSchema,
    order: z.number().optional(), // For custom ordering
});

export const ProjectSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "プロジェクト名は必須です"),
    color: z.string().optional(),
    ownerId: z.string(),
    createdAt: DateLikeSchema,
    order: z.number().optional(),
});

export const LabelSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "ラベル名は必須です"),
    color: z.string().optional(),
    ownerId: z.string(),
    workspaceId: z.string().optional(), // Added for future migration
    createdAt: DateLikeSchema,
});

export const WorkspaceSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "ワークスペース名は必須です"),
    createdAt: DateLikeSchema,
});

export const FilterSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "フィルター名は必須です"),
    query: z.string(),
    workspaceId: z.string().optional(),
    ownerId: z.string().optional(),
    createdAt: DateLikeSchema,
});

/** HH:mm format regex (00:00 to 23:59) */
const TimeStringSchema = z.string().regex(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
    "時刻はHH:mm形式で入力してください（例: 09:00, 14:30）"
);

export const TimeBlockSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "時間帯の名前は必須です"),
    start: TimeStringSchema,
    end: TimeStringSchema,
    color: z.string().optional(),
    order: z.number().optional(),
});

export const TargetSchema = z.object({
    id: z.string().optional(),
    mode: z.string(), // 'backward', 'woop', 'okr'
    data: z.record(z.string(), z.string()), // Key-value pairs from wizard steps
    createdAt: DateLikeSchema,
    updatedAt: DateLikeSchema,
    ownerId: z.string(),
    workspaceId: z.string(), // Targets are workspace-bound
});

// --- Type Exports ---

export type Recurrence = z.infer<typeof RecurrenceSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Label = z.infer<typeof LabelSchema>;
export type Workspace = z.infer<typeof WorkspaceSchema>;
export type Filter = z.infer<typeof FilterSchema>;
export type TimeBlock = z.infer<typeof TimeBlockSchema>;
export type Target = z.infer<typeof TargetSchema>;
