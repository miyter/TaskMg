import { UI_CONFIG, SIDEBAR_TYPE } from './ui-view-constants.js';
import { getTimeBlockById, getTimeBlocks } from '../../store/timeblocks';
import { getFilters } from '../../store/filters';

const { CLASSES, HEADER_IDS, DATA_ATTRS } = UI_CONFIG;

// ... (showView, clearSidebarHighlight, highlightSidebarItem remain unchanged) ...

/**
 * フィルターに応じたヘッダータイトルの更新
 */
export function updateHeaderTitleByFilter(filter, allProjects = [], allLabels = []) {
    const elTitle = document.getElementById(HEADER_IDS.TITLE);
    const elCount = document.getElementById(HEADER_IDS.COUNT);
    if (!elTitle) return;

    // ストアからデータを補完してタイトル解決（updateView以外からの呼び出しに対応）
    const allTimeBlocks = getTimeBlocks();
    const allFilters = getFilters();

    const title = resolveTitleText(filter, allProjects, allLabels, allTimeBlocks, allFilters);

    elTitle.textContent = title;

    if (elCount && ['dashboard', 'search'].includes(filter.type)) {
        elCount.textContent = '';
    }
}

/**
 * フィルター情報からタイトルテキストを解決する（純粋関数）
 */
export function resolveTitleText(filter, allProjects = [], allLabels = [], allTimeBlocks = [], allFilters = []) {
    const { type, id, name } = filter;
    if (name) return name;

    switch (type) {
        case 'inbox': return 'インボックス';
        case 'project': return allProjects.find(p => p.id === id)?.name || 'プロジェクト';
        case 'label': {
            const l = allLabels.find(l => l.id === id);
            return l ? `ラベル: ${l.name}` : 'ラベル';
        }
        case 'timeblock':
            if (id === 'unassigned' || id === 'none') return '時間帯: 未定';
            const b = allTimeBlocks.find(block => block.id === id);
            return b ? `時間帯: ${b.start} - ${b.end}` : '時間帯';
        case 'duration': return `所要時間: ${id}分`;
        case 'filter':
        case 'custom':
            return allFilters.find(f => f.id === id)?.name || 'フィルター';
        case 'today': return '今日';
        case 'upcoming': return '今後';
        case 'wizard': return '目標設計ウィザード';
        case 'target-dashboard': return '目標ダッシュボード';
        case 'wiki': return 'フレームワークWiki';
        case 'search': return 'タスク検索';
        case 'dashboard': return 'ダッシュボード';
        default:
            if (id) return id;
            return 'タスク';
    }
}

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