// @ts-nocheck

// ★修正: パスを ../../store/store.js に修正
import { updateTask } from '../../store/store.js';
// ★修正: パスを ../../ui/components.js に修正
import { showMessageModal } from '../../ui/components.js';

/**
 * Dateオブジェクトを指定のフォーマット（YYYY-MM-DD）に変換し、input[type="date"]のvalueとして利用可能にする。
 * @param {Date} date - 変換する日付オブジェクト
 * @returns {string} "YYYY-MM-DD"形式の文字列
 */
export function formatDateForInput(date) {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// ==========================================================
// ★ タスク移動用コンテキストメニュー機能の追加
// ==========================================================

/**
 * タスクの移動用コンテキストメニューを表示する。
 * @param {Object} task - 対象タスクオブジェクト
 * @param {Array<Object>} allProjects - 全プロジェクトのリスト ({id, name}を含む)
 * @param {number} x - クリックされたX座標
 * @param {number} y - クリックされたY座標
 */
export function showTaskMoveMenu(task, allProjects, x, y) {
    // 既存のコンテキストメニューがあれば削除
    document.getElementById('task-move-menu')?.remove();

    const menu = document.createElement('div');
    menu.id = 'task-move-menu';
    // スタイル設定：絶対配置、z-index、装飾
    menu.className = 'fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50 animate-fade-in text-sm min-w-[200px]';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    // プロジェクトリストのDOMを生成
    const projectItems = allProjects.map(project => {
        const isCurrent = task.projectId === project.id;
        return `
            <button data-project-id="${project.id}" 
                    class="flex w-full justify-between items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition ${isCurrent ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}">
                ${project.name}
                ${isCurrent ? '<span class="text-xs ml-2">✓</span>' : ''}
            </button>
        `;
    }).join('');

    // インボックス (projectId: null) のDOM
    const isInbox = !task.projectId;
    const inboxItem = `
        <button data-project-id="INBOX"
                class="flex w-full justify-between items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition ${isInbox ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}">
            📥 インボックス
            ${isInbox ? '<span class="text-xs ml-2">✓</span>' : ''}
        </button>
    `;

    menu.innerHTML = `
        <div class="px-3 py-1 font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 mb-1">
            タスクを移動
        </div>
        ${inboxItem}
        ${projectItems.length > 0 ? projectItems : '<div class="px-3 py-2 text-gray-400">プロジェクトがありません</div>'}
    `;

    document.body.appendChild(menu);

    // クリックイベントのリスナー
    menu.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', async (e) => {
            const newProjectId = e.currentTarget.dataset.projectId === 'INBOX' ? null : e.currentTarget.dataset.projectId;
            
            // 既に同じプロジェクトなら何もしない
            if (newProjectId === task.projectId) {
                menu.remove();
                return;
            }

            try {
                // Firestoreを更新
                await updateTask(task.id, { projectId: newProjectId });

                // UIフィードバック
                const projectName = newProjectId === null ? 'インボックス' : allProjects.find(p => p.id === newProjectId)?.name || 'プロジェクト';
                showMessageModal(`タスクを「${projectName}」に移動しました`);
            } catch (error) {
                console.error('Task move failed:', error);
                showMessageModal("タスクの移動に失敗しました。", 'error');
            }

            // メニューを閉じる
            menu.remove();
        });
    });

    // 画面のどこかをクリックしたらメニューを閉じる
    const dismissMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', dismissMenu);
        }
    };
    // 画面外クリックでメニューを閉じるための遅延登録
    setTimeout(() => {
        document.addEventListener('click', dismissMenu);
    }, 0);
}