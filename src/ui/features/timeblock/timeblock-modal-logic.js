/**
 * 時間帯設定モーダルのビジネスロジック（保存、削除、バリデーション）
 */
import { saveTimeBlock, deleteTimeBlock, getTimeBlocks } from '../../../store/timeblocks.js';
import { showMessageModal } from '../../components.js';
import { timeToMinutes, updateAddButtonUI } from './timeblock-modal-utils.js';

/**
 * 行のDOM要素からデータを抽出
 */
export function getRowValues(row) {
    const startH = row.querySelector('.tb-custom-select[data-type="start-h"]').dataset.value;
    const startM = row.querySelector('.tb-custom-select[data-type="start-m"]').dataset.value;
    const endH = row.querySelector('.tb-custom-select[data-type="end-h"]').dataset.value;
    const endM = row.querySelector('.tb-custom-select[data-type="end-m"]').dataset.value;
    const color = row.querySelector('.tb-color-trigger').dataset.color;

    return {
        id: row.dataset.id || null,
        start: `${startH}:${startM}`,
        end: `${endH}:${endM}`,
        color: color
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
    showMessageModal({
        message: '削除しますか？\n（保存ボタンを押すまで確定しません... と言いたいところですが、削除は即時反映されます）',
        type: 'confirm',
        onConfirm: async () => {
            try {
                await deleteTimeBlock(currentId);
                row.remove();
                document.dispatchEvent(new CustomEvent('timeblocks-updated'));
                updateAddButtonUI(document.getElementById('add-tb-btn'), getTimeBlocks().length);
            } catch (e) {
                showMessageModal({ message: "削除に失敗しました", type: 'error' });
            }
        }
    });
}

/**
 * 一括保存処理
 */
export async function saveAllAndClose(btn, closeFn) {
    const rows = Array.from(document.querySelectorAll('.tb-row'));
    const dataList = rows.map(getRowValues);

    // 1. Basic Validation
    for (const data of dataList) {
        const startMin = timeToMinutes(data.start);
        const endMin = timeToMinutes(data.end);

        if (startMin >= endMin) {
            return showMessageModal({ message: `時間設定が不正です: ${data.start} - ${data.end}\n(終了時間は開始時間より後にしてください)`, type: 'error' });
        }
    }

    // 2. Overlap Validation (Internal)
    for (let i = 0; i < dataList.length; i++) {
        const a = dataList[i];
        const aStart = timeToMinutes(a.start);
        const aEnd = timeToMinutes(a.end);

        for (let j = i + 1; j < dataList.length; j++) {
            const b = dataList[j];
            const bStart = timeToMinutes(b.start);
            const bEnd = timeToMinutes(b.end);

            if (Math.max(aStart, bStart) < Math.min(aEnd, bEnd)) {
                return showMessageModal({ message: `時間帯が重複しています:\n${a.start}~${a.end} と ${b.start}~${b.end}`, type: 'error' });
            }
        }
    }

    // Execution
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = '保存中...';

    try {
        const promises = dataList.map(data =>
            saveTimeBlock({ id: data.id, name: `${data.start}-${data.end}`, start: data.start, end: data.end, color: data.color })
        );

        await Promise.all(promises);

        document.dispatchEvent(new CustomEvent('timeblocks-updated'));
        closeFn();

    } catch (e) {
        console.error(e);
        showMessageModal({ message: "保存中にエラーが発生しました", type: 'error' });
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}
