import { UI_CONFIG, SIDEBAR_TYPE } from './ui-view-constants.js';
import { getTimeBlockById } from '../../store/timeblocks.js';

const { CLASSES, HEADER_IDS, DATA_ATTRS } = UI_CONFIG;

/**
 * 更新日: 2025-12-27
 * 内容: showView を完全に null-safe 化。Optional Chaining を導入し classList の参照エラーを封殺。
 */
export function showView(activeView, otherViews) {
    if (Array.isArray(otherViews)) {
        otherViews.forEach(v => {
            // 要素が存在し、かつ classList を持っている場合のみ操作
            v?.classList?.add(CLASSES.HIDDEN);
            v?.classList?.remove(CLASSES.FADE_IN);
        });
    }

    if (activeView?.classList) {
        activeView.classList.remove(CLASSES.HIDDEN);
        activeView.classList.add(CLASSES.FADE_IN);
    }
}

/**
 * サイドバーの全ハイライトを解除
 */
export function clearSidebarHighlight() {
    document.querySelectorAll('.sidebar-item-row').forEach(el => {
        el.classList.remove(...(Array.isArray(CLASSES.HIGHLIGHT) ? CLASSES.HIGHLIGHT : [CLASSES.HIGHLIGHT]));
        el.classList.add(...(Array.isArray(CLASSES.NORMAL) ? CLASSES.NORMAL : [CLASSES.NORMAL]));

        const icon = el.querySelector('svg, span:not(.truncate)');
        if (icon) {
            const textClasses = Array.from(icon.classList).filter(c => c.startsWith('text-'));
            if (textClasses.length > 0) icon.classList.remove(...textClasses);

            const defaultColor = el.getAttribute(DATA_ATTRS.DEFAULT_COLOR);
            if (defaultColor) {
                icon.classList.add(defaultColor);
            }
        }
    });
}

/**
 * サイドバーのハイライトを更新
 */
export function highlightSidebarItem(filter) {
    clearSidebarHighlight();

    const target = getSidebarTarget(filter);
    if (target?.classList) {
        target.classList.remove(...(Array.isArray(CLASSES.NORMAL) ? CLASSES.NORMAL : [CLASSES.NORMAL]));
        target.classList.add(...(Array.isArray(CLASSES.HIGHLIGHT) ? CLASSES.HIGHLIGHT : [CLASSES.HIGHLIGHT]));

        const icon = target.querySelector('svg, span:not(.truncate)');
        if (icon) {
            const textClasses = Array.from(icon.classList).filter(c => c.startsWith('text-'));
            if (textClasses.length > 0) icon.classList.remove(...textClasses);
            icon.classList.add('text-white');
        }
    }
}

/**
 * フィルター情報からサイドバーのターゲット要素を取得
 */
function getSidebarTarget(filter) {
    if (!filter) return null;
    const { type, id } = filter;

    const navTypes = ['inbox', 'dashboard', 'search', 'settings'];
    if (navTypes.includes(type)) {
        return document.getElementById(`nav-${type}`);
    }

    const typeAttr = type === 'custom' ? SIDEBAR_TYPE.FILTER : type;
    return document.querySelector(`.sidebar-item-row[data-type="${typeAttr}"][data-id="${id}"]`);
}

/**
 * フィルターに応じたヘッダータイトルの更新
 */
export function updateHeaderTitleByFilter(filter, allProjects = [], allLabels = []) {
    const elTitle = document.getElementById(HEADER_IDS.TITLE);
    const elCount = document.getElementById(HEADER_IDS.COUNT);
    if (!elTitle) return;

    let title = 'インボックス';
    const { type, id, name } = filter;

    if (name) {
        title = name;
    } else {
        switch (type) {
            case SIDEBAR_TYPE.PROJECT:
                title = allProjects.find(x => x.id === id)?.name || 'プロジェクト';
                break;
            case SIDEBAR_TYPE.LABEL:
                const l = allLabels.find(x => x.id === id);
                title = l ? `ラベル: ${l.name}` : 'ラベル';
                break;
            case SIDEBAR_TYPE.TIMEBLOCK:
                if (id === 'unassigned') {
                    title = '時間帯: 未定';
                } else {
                    const b = getTimeBlockById(id);
                    title = b ? `時間帯: ${b.start} - ${b.end}` : '時間帯';
                }
                break;
            case SIDEBAR_TYPE.DURATION:
                title = `所要時間: ${id}分`;
                break;
            case 'search':
                title = 'タスク検索';
                break;
            case 'dashboard':
                title = 'ダッシュボード';
                break;
        }
    }

    elTitle.textContent = title;
    if (elCount && ['dashboard', 'search'].includes(type)) {
        elCount.textContent = '';
    }
}

/**
 * 未ログイン時の表示状態をレンダリング
 */
/**
 * 未ログイン時の表示状態をレンダリング（ログインフォーム表示）
 */
export function renderLoginState() {
    const { VIEW_IDS } = UI_CONFIG;

    // 他のビューを非表示
    Object.values(VIEW_IDS).forEach(id => {
        const el = document.getElementById(id);
        if (id !== VIEW_IDS.TASK && el) el.classList.add(CLASSES.HIDDEN);
    });

    const taskView = document.getElementById(VIEW_IDS.TASK);
    if (!taskView) return;

    taskView.classList.remove(CLASSES.HIDDEN);
    taskView.innerHTML = `
        <div id="login-container-wrapper" class="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div id="login-form-container" class="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Welcome Back</h1>
                    <p class="text-gray-500 dark:text-gray-400">タスク管理をはじめよう</p>
                </div>
                
                <div class="space-y-4 mb-6">
                    <div>
                        <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 ml-1">メールアドレス</label>
                        <input id="email-input" type="email" placeholder="name@example.com" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all outline-none">
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 ml-1">パスワード</label>
                        <input id="password-input" type="password" placeholder="••••••••" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all outline-none">
                    </div>
                </div>
                
                <button id="email-login-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 mb-6">
                    ログイン
                </button>

                <div class="relative flex py-2 items-center mb-6">
                    <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    <span class="flex-shrink mx-4 text-gray-400 text-sm">または</span>
                    <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                     <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">アカウント登録なしで試す</p>
                    <button id="guest-login-btn" class="w-full bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-semibold py-2 px-4 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2">
                        <span>🚀</span> ゲストとして利用する
                    </button>
                    <p class="text-xs text-gray-400 mt-2">※ゲストデータはローカルに保存されます</p>
                </div>
            </div>
            
            <!-- ユーザー情報表示用（ロジック互換性のため残す、実際はヘッダー等で管理推奨） -->
            <div id="user-info" class="hidden">
                 <span id="user-email-display"></span>
            </div>
        </div>
    `;
}