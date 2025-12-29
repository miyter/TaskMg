/**
 * 時間帯設定モーダルのビジネスロジック（保存、削除、バリデーション）
 */
import { saveTimeBlock, deleteTimeBlock, getTimeBlocks } from '../../../store/timeblocks';
import { showMessageModal } from '../../components';
import { timeToMinutes, updateAddButtonUI } from './timeblock-modal-utils.js';

/**
 * 行のDOM要素からデータを抽出
 */
export function getRowValues(row, index) {
    const startH = row.querySelector('.tb-custom-select[data-type="start-h"]').dataset.value;
    const startM = row.querySelector('.tb-custom-select[data-type="start-m"]').dataset.value;
    const endH = row.querySelector('.tb-custom-select[data-type="end-h"]').dataset.value;
    const endM = row.querySelector('.tb-custom-select[data-type="end-m"]').dataset.value;
    const color = row.querySelector('.tb-color-trigger').dataset.color;

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
export function handleDelete(row) {
    const currentId = row.dataset.id;
    if (!currentId) {
        row.remove();
        updateAddButtonUI(document.getElementById('add-tb-btn'), getTimeBlocks().length);
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
                    updateAddButtonUI(document.getElementById('add-tb-btn'), getTimeBlocks().length);
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
export async function saveAllAndClose(btn, closeFn) {
    const rows = Array.from(document.querySelectorAll('.tb-row'));

    // SortableJSによってDOMの順序が変わっているので、その順序でデータを取得するだけでOK
    const dataList = rows.map((row, index) => getRowValues(row, index));

    // 1. Basic Validation
    for (const data of dataList) {
        const startMin = timeToMinutes(data.start);
        const endMin = timeToMinutes(data.end);

        if (startMin >= endMin) {
            return showMessageModal({ message: `時間設定が不正です: ${data.start} - ${data.end}\n(終了時間は開始時間より後にしてください)`, type: 'error' });
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
