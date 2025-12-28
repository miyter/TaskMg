/**
 * サイドバーの構造（HTMLテンプレートとトグル、並び替え）
 */
import { SIDEBAR_CONFIG } from './sidebar-constants.js';
import { getStoredBool } from './sidebar-utils.js';

const getSectionKey = (id) => `${SIDEBAR_CONFIG.STORAGE_KEYS.SECTION_PREFIX}${id}`;

// セクションの定義
const SECTION_METADATA = {
    'basic': {
        title: '基本項目',
        listId: SIDEBAR_CONFIG.LIST_IDS.BASIC,
        renderContent: (listId) => {
            const inboxExtra = `<span id="inbox-count" class="hidden bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs font-semibold">0</span>`;
            return `
                ${createNavItem('nav-dashboard', 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z', 'ダッシュボード')}
                ${createNavItem('nav-inbox', 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4', 'インボックス', inboxExtra)}
                ${createNavItem('nav-search', 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', '検索')}
                ${createNavItem('nav-settings', 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', '設定')}
            `;
        }
    },
    'projects': { title: 'プロジェクト', listId: SIDEBAR_CONFIG.LIST_IDS.PROJECTS, hasAddButton: true, buttonId: 'add-project-btn' },
    'timeblocks': { title: '時間帯', listId: SIDEBAR_CONFIG.LIST_IDS.TIMEBLOCKS, hasAddButton: true, buttonId: 'edit-timeblocks-btn' },
    'durations': { title: '所要時間', listId: SIDEBAR_CONFIG.LIST_IDS.DURATIONS },
    'filters': { title: 'フィルター', listId: SIDEBAR_CONFIG.LIST_IDS.FILTERS, hasAddButton: true, buttonId: 'add-filter-btn' }
};

const DEFAULT_ORDER = ['basic', 'projects', 'timeblocks', 'durations', 'filters'];

function getSectionOrder() {
    try {
        const stored = localStorage.getItem(SIDEBAR_CONFIG.STORAGE_KEYS.SECTION_ORDER);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error('Failed to parse section order', e);
    }
    return DEFAULT_ORDER;
}

function createSectionHeader(title, targetId, hasAddButton = false, buttonId = '') {
    const isOpen = getStoredBool(getSectionKey(targetId), true);
    const rotationClass = isOpen ? 'rotate-0' : '-rotate-90';

    const addButton = hasAddButton ? `
        <button id="${buttonId}" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center" aria-label="${title}を追加">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        </button>
    ` : '';

    // ドラッグハンドルを追加
    return `
        <div class="flex items-center justify-between px-3 py-2 group cursor-pointer sidebar-section-header" 
             data-target="${targetId}" role="button" aria-expanded="${isOpen}" aria-controls="${targetId}">
            <div class="flex items-center min-w-0 pointer-events-none">
                <svg class="w-3 h-3 text-gray-400 mr-2 transition-transform duration-200 flex-shrink-0 ${rotationClass} section-arrow" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                <h3 class="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate select-none">${title}</h3>
            </div>
            ${addButton}
        </div>
    `;
}

function createListContainer(id, content = '') {
    const isOpen = getStoredBool(getSectionKey(id), true);
    return `<ul id="${id}" class="space-y-0.5 mb-2 pl-1 ${isOpen ? '' : 'hidden'}">${content}</ul>`;
}

function createNavItem(id, iconPath, label, extra = '') {
    return `
        <li>
            <a href="#" id="${id}" class="sidebar-item-row group flex items-center px-3 py-1.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"></path>
                </svg>
                <span class="flex-1">${label}</span>
                ${extra}
            </a>
        </li>
    `;
}

export function buildSidebarHTML() {
    const order = getSectionOrder();

    // データ不整合（キー不足など）があればデフォルトをマージ
    DEFAULT_ORDER.forEach(key => {
        if (!order.includes(key)) order.push(key);
    });

    const sectionsHTML = order.map(key => {
        const meta = SECTION_METADATA[key];
        if (!meta) return '';

        const content = meta.renderContent ? meta.renderContent(meta.listId) : '';

        return `
            <div class="sidebar-section-container transition-all duration-200" draggable="true" data-section-key="${key}">
                ${createSectionHeader(meta.title, meta.listId, meta.hasAddButton, meta.buttonId)}
                ${createListContainer(meta.listId, content)}
            </div>
        `;
    }).join('');

    return `<div class="mt-2 select-none" id="sidebar-sections-wrapper">${sectionsHTML}</div>`;
}

export function setupSidebarToggles() {
    document.querySelectorAll('.sidebar-section-header').forEach(header => {
        const targetId = header.dataset.target;
        const list = document.getElementById(targetId);
        const arrow = header.querySelector('.section-arrow');

        if (!list || !arrow) return;

        header.onclick = (e) => {
            // ボタンやドラッグハンドルのクリックは無視
            if (e.target.closest('button')) return;

            const isHidden = list.classList.toggle(SIDEBAR_CONFIG.CLASSES.HIDDEN);
            const isOpen = !isHidden;

            arrow.classList.toggle('rotate-0', isOpen);
            arrow.classList.toggle('-rotate-90', !isOpen);
            header.setAttribute('aria-expanded', isOpen);

            localStorage.setItem(getSectionKey(targetId), isOpen);
        };
    });
}

/**
 * セクションのドラッグ&ドロップ初期化
 */
export function setupSectionDragAndDrop() {
    const wrapper = document.getElementById('sidebar-sections-wrapper');
    if (!wrapper) return;

    let dragSrcEl = null;

    const sections = wrapper.querySelectorAll('.sidebar-section-container');
    sections.forEach(section => {
        section.addEventListener('dragstart', (e) => {
            dragSrcEl = section;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', section.dataset.sectionKey);
            section.classList.add('opacity-50', 'bg-gray-100', 'dark:bg-gray-800');
        });

        section.addEventListener('dragend', (e) => {
            section.classList.remove('opacity-50', 'bg-gray-100', 'dark:bg-gray-800');
            wrapper.querySelectorAll('.sidebar-section-container').forEach(col => {
                col.classList.remove('border-t-2', 'border-blue-500');
            });
        });

        section.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            // 自分自身へのドラッグは無視
            if (dragSrcEl === section) return;
            section.classList.add('border-t-2', 'border-blue-500');
        });

        section.addEventListener('dragleave', (e) => {
            section.classList.remove('border-t-2', 'border-blue-500');
        });

        section.addEventListener('drop', (e) => {
            e.stopPropagation(); // 親への伝播（タスクのドロップなど）を防ぐ
            e.preventDefault();

            if (dragSrcEl !== section) {
                // DOM移動
                // ドラッグ元を、ドロップ先の手前に挿入（簡易的なロジック）
                // より精密にするならgetBoundingClientRectで上下判定が必要だが、今回は簡易的に手前に
                wrapper.insertBefore(dragSrcEl, section);

                // 順序保存
                saveSectionOrder(wrapper);
            }
            return false;
        });
    });
}

function saveSectionOrder(wrapper) {
    const sections = wrapper.querySelectorAll('.sidebar-section-container');
    const newOrder = Array.from(sections).map(sec => sec.dataset.sectionKey);
    localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.SECTION_ORDER, JSON.stringify(newOrder));
}