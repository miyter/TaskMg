/**
 * 時間帯設定モーダルのビジネスロジック（保存、削除、バリデーション）
 */
import { deleteTimeBlock, getTimeBlocks, saveTimeBlock } from '../../../store/timeblocks';
import { showMessageModal } from '../../components';
import { TimeBlockRowData } from './timeblock-modal-dom';
import { timeToMinutes, updateAddButtonUI } from './timeblock-modal-utils';

/**
 * 行のDOM要素からデータを抽出
 */
export function getRowValues(row: HTMLElement, index: number): TimeBlockRowData & { order: number } {
    const startH = (row.querySelector('.tb-custom-select[data-type="start-h"]') as HTMLElement).dataset.value!;
    const startM = (row.querySelector('.tb-custom-select[data-type="start-m"]') as HTMLElement).dataset.value!;
    const endH = (row.querySelector('.tb-custom-select[data-type="end-h"]') as HTMLElement).dataset.value!;
    const endM = (row.querySelector('.tb-custom-select[data-type="end-m"]') as HTMLElement).dataset.value!;
    const color = (row.querySelector('.tb-color-trigger') as HTMLElement).dataset.color!;

    return {
        id: row.dataset.id || null,
        start: `${startH}:${startM}`,
        end: `${endH}:${endM}`,
        color: color,
        order: index // 現在のDOMの順番を保存
    };
}

/**
 * 削除処理
 */
export function handleDelete(row: HTMLElement): void {
    const currentId = row.dataset.id;
    if (!currentId) {
        row.remove();
        updateAddButtonUI(document.getElementById('add-tb-btn') as HTMLButtonElement, getTimeBlocks().length);
        return;
    }

    // アニメーション付き削除
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';
    setTimeout(() => {
        showMessageModal({
            message: '削除しますか？\n（完了ボタンを押さなくても、削除は即時反映されます）',
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await deleteTimeBlock(currentId);
                    row.remove();
                    document.dispatchEvent(new CustomEvent('timeblocks-updated'));
                    updateAddButtonUI(document.getElementById('add-tb-btn') as HTMLButtonElement, getTimeBlocks().length);
                } catch (e) {
                    showMessageModal({ message: "削除に失敗しました", type: 'error' });
                    // Revert styles on error (optional)
                }
            },
            onCancel: () => {
                row.style.opacity = '1';
                row.style.transform = 'translate(0)';
            }
        });
    }, 200); // Wait for transition
}

/**
 * 一括保存処理
 */
export async function saveAllAndClose(btn: HTMLButtonElement | null, closeFn: () => void): Promise<void> {
    if (!btn) return;
    const rows = Array.from(document.querySelectorAll('.tb-row')) as HTMLElement[];

    // SortableJSによってDOMの順序が変わっているので、その順序でデータを取得するだけでOK
    const dataList = rows.map((row, index) => getRowValues(row, index));

    // 1. Basic Validation
    for (const data of dataList) {
        const startMin = timeToMinutes(data.start);
        const endMin = timeToMinutes(data.end);

        if (startMin >= endMin) {
            showMessageModal({ message: `時間設定が不正です: ${data.start} - ${data.end}\n(終了時間は開始時間より後にしてください)`, type: 'error' });
            return;
        }
    }

    // Execution
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = '保存中...';

    // ドラッグ＆ドロップされた順序（data.order）を使って保存
    try {
        const promises = dataList.map(data =>
            saveTimeBlock({
                id: data.id,
                name: `${data.start}-${data.end}`,
                start: data.start,
                end: data.end,
                color: data.color,
                order: data.order
            })
        );

        await Promise.all(promises);

        document.dispatchEvent(new CustomEvent('timeblocks-updated'));
        closeFn();

    } catch (e) {
        console.error("Timeblock save error (suppressed):", e);
        // showMessageModal({ message: "保存中にエラーが発生しました", type: 'error' });
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}
