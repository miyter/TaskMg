// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: ワークスペース切り替え時の同期フローを修正
 */

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
            // UI上のフィルタをインボックスにリセット
            setCurrentFilter({ type: 'inbox', id: null });
            
            // 一旦全てのデータ同期を停止し、再開する
            // これにより新しいworkspaceIdに基づいた購読が開始される
            stopDataSync(false); 
            startAllSubscriptions();
            
            // 即座にUIを更新（クリア状態またはロード中表示のため）
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