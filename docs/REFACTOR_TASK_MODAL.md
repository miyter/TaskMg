# TaskDetailModal 拡張計画

**目的**: `modal-dom-generator.ts` (HTML文字列生成) を廃止し、`TaskDetailModal.tsx` (React) に機能を統合する

---

## 📊 現状比較

| 機能 | Vanilla版 (`modal-dom-generator.ts`) | React版 (`TaskDetailModal.tsx`) |
|------|--------------------------------------|----------------------------------|
| タイトル入力 | ✅ | ✅ |
| 説明/メモ | ✅ Markdown対応 | ✅ プレーンのみ |
| プロジェクト選択 | ❌ | ✅ |
| ステータス | ❌ | ✅ |
| 期限日 | ✅ | ❌ |
| 繰り返し設定 | ✅ (daily/weekly/weekdays/monthly) | ❌ |
| 曜日選択 | ✅ (weekly時) | ❌ |
| 時間帯(TimeBlock) | ✅ | ❌ |
| 所要時間(Duration) | ✅ | ❌ |
| ラベル | ❌ | ❌ |
| Markdownプレビュー | ✅ (自動切り替え) | ❌ |
| 削除 | ✅ | ✅ |

---

## 🎯 実装フェーズ

### Phase 1: スケジュールセクション追加
**目標**: 期限日、繰り返し設定、時間帯、所要時間

**追加するフック**:
```typescript
// src/hooks/useTimeBlocks.ts (新規作成)
export function useTimeBlocks() {
    const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
    // subscribeToTimeBlocks を使用
    return { timeBlocks };
}
```

**状態追加**:
```typescript
const [dueDate, setDueDate] = useState<Date | null>(null);
const [recurrence, setRecurrence] = useState<Recurrence>({ type: 'none', days: [] });
const [timeBlockId, setTimeBlockId] = useState<string | null>(null);
const [duration, setDuration] = useState<number | null>(null);
```

---

### Phase 2: Markdownメモ対応

**追加コンポーネント**:
```
src/components/common/MarkdownEditor.tsx
```

**機能**:
- テキストエリア / プレビュー 自動切り替え
- ツールバー (太字、リスト、番号付きリスト)
- Ctrl+B ショートカット

**依存**:
- `src/utils/markdown.ts` の `simpleMarkdownToHtml` を再利用

---

### Phase 3: ラベル選択

**追加コンポーネント**:
```
src/components/common/LabelSelector.tsx
```

**機能**:
- マルチセレクト
- 色付きバッジ表示

---

### Phase 4: 旧コード削除

**削除対象**:
- `src/ui/modals/modal-dom-generator.ts`
- `src/ui/modals/task-modal.ts`
- `src/ui/modals/task-modal-ctrl.ts`
- `src/ui/modals/task-modal-markdown.ts`
- `src/ui/modals/task-modal-recurrence.ts`
- `src/ui/modals/task-modal-labels.ts`

**修正対象**:
- `showTaskModal` の呼び出し箇所を `openModal('task-detail', task)` に置換

---

## 📝 UIレイアウト案

```
┌──────────────────────────────────────────────────────┐
│ [タスクタイトル入力]                           [×]  │
├──────────────────────────────────────────────────────┤
│  ┌─────────────────────────┬──────────────────────┐  │
│  │                        │ スケジュール ▼      │  │
│  │  メモ (Markdown)       │ ├─ 期限日          │  │
│  │  [B] [・] [1.]         │ ├─ 繰り返し        │  │
│  │  ──────────────────    │ │   └─ 曜日選択    │  │
│  │  テキストエリア        │ ├─ 時間帯          │  │
│  │  / プレビュー          │ └─ 所要時間        │  │
│  │                        │                    │  │
│  │                        ├──────────────────────┤  │
│  │                        │ プロジェクト ▼     │  │
│  │                        ├──────────────────────┤  │
│  │                        │ ラベル (バッジ)    │  │
│  └─────────────────────────┴──────────────────────┘  │
├──────────────────────────────────────────────────────┤
│ [削除]                        [キャンセル] [保存]   │
└──────────────────────────────────────────────────────┘
```

---

## ⚙️ 技術的詳細

### Timestamp変換
```typescript
// 保存時
dueDate: dueDate ? Timestamp.fromDate(dueDate) : null

// 読み込み時
const parseDueDate = (val: any): Date | null => {
    if (!val) return null;
    if (val.toDate) return val.toDate(); // Timestamp
    if (val instanceof Date) return val;
    return new Date(val);
};
```

### 繰り返しスキーマ
```typescript
type RecurrenceType = 'none' | 'daily' | 'weekly' | 'weekdays' | 'monthly';

interface Recurrence {
    type: RecurrenceType;
    days?: number[]; // 0-6 (日-土), weekly時のみ
}
```

---

## ✅ 完了条件

- [x] TaskDetailModal.tsx に全機能が実装されている
- [x] 旧Vanilla版モーダルファイルがすべて削除されている
- [x] `showTaskModal` の呼び出し箇所が0件
- [x] ビルドエラーなし
- [ ] 動作確認完了

---

## 📝 変更履歴

### 2025-12-30 完了

**作成したファイル:**
- `src/hooks/useTimeBlocks.ts` - TimeBlocks用Reactフック

**修正したファイル:**
- `src/components/modals/TaskDetailModal.tsx` - 全機能搭載
- `src/store/ui/modal-store.ts` - 非React用ヘルパー関数追加
- `src/ui/components/TaskItem.ts` - React版モーダル呼び出しに変更
- `src/ui/task-input.ts` - React版モーダル呼び出しに変更
- `src/ui/core/AppInitializer.ts` - 旧initTaskModal呼び出し削除

**削除したファイル (6件):**
- `src/ui/modals/task-modal.ts`
- `src/ui/modals/task-modal-ctrl.ts`
- `src/ui/modals/task-modal-markdown.ts`
- `src/ui/modals/task-modal-recurrence.ts`
- `src/ui/modals/task-modal-labels.ts`
- `src/ui/modals/modal-dom-generator.ts`
