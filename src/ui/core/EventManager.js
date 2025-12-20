// @ts-nocheck
// @miyter:20251221
// グローバルイベントリスナーの管理

import { auth } from '../../core/firebase.js';
import { setCurrentFilter } from '../ui-view-manager.js';
import { startAllSubscriptions, stopDataSync, updateUI } from './DataSyncManager.js';
import { setupCustomSortDropdown } from '../components/SortDropdown.js';

/**
 * アプリケーション全体のイベントリスナーを設定
 */
export function setupGlobalEventListeners() {
    // 1. ワークスペース切り替え
    document.addEventListener('workspace-changed', (e) => {
        const headerTitle = document.getElementById('header-title');
        if (headerTitle) headerTitle.textContent = '読み込み中...';
        
        if (auth?.currentUser) {
            // フィルタをインボックスにリセットして同期開始
            setCurrentFilter({ type: 'inbox', id: null });
            stopDataSync(false); 
            startAllSubscriptions();
            updateUI();
        }
    });

    // 2. ルーティング（サイドバー等）
    document.addEventListener('route-change', (e) => {
        const { page, id } = e.detail;
        setCurrentFilter({ type: page, id: id || null });
        
        localStorage.setItem('lastPage', JSON.stringify({ page, id: id || null }));
        updateUI();
    });
    
    // 3. 検索・フィルタUI
    document.getElementById('search-input')?.addEventListener('input', updateUI);
    
    document.getElementById('toggle-completed-btn')?.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('text-blue-500');
        updateUI();
    });
    
    // 4. コンポーネント固有のイベント
    setupCustomSortDropdown();
}