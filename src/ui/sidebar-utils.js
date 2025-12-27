/**
 * 更新日: 2025-12-27
 * 内容: サイドバーのリサイズ処理に requestAnimationFrame を導入
 * リフローを最適化し、ドラッグ中のカクつき（ラグ）を解消
 */
import { SIDEBAR_CONFIG } from './sidebar-constants.js';

/**
 * サイドバーのリサイズ（ドラッグ）設定
 */
export function setupResizer(sidebar, resizer) {
    if (!resizer || !sidebar) return;

    let isResizing = false;
    let pendingWidth = null;
    let requestId = null;

    /**
     * ブラウザの描画タイミングに合わせてスタイルを適用
     */
    const applyPendingWidth = () => {
        if (pendingWidth !== null && sidebar) {
            sidebar.style.width = `${pendingWidth}px`;
        }
        requestId = null;
    };

    /**
     * マウス移動時の処理（rAFでスロットリング）
     */
    const resize = (e) => {
        if (!isResizing) return;
        
        const { MIN_WIDTH, MAX_WIDTH } = SIDEBAR_CONFIG;
        // マウス位置から新しい幅を計算し、制限範囲内に収める
        pendingWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, e.clientX));
        
        // すでに実行待ちのフレームがない場合のみスケジュール
        if (!requestId) {
            requestId = requestAnimationFrame(applyPendingWidth);
        }
    };

    /**
     * リサイズ終了時の処理
     */
    const stopResize = () => {
        if (!isResizing) return;
        isResizing = false;
        
        // UI状態を戻す
        document.body.classList.remove('cursor-col-resize', 'select-none');
        sidebar.style.transition = ''; // トランジションを戻す

        // 実行待ちの描画があればキャンセルして最終幅を強制適用
        if (requestId) cancelAnimationFrame(requestId);
        requestId = null;
        applyPendingWidth();

        // 最終的な幅を保存
        localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.WIDTH, sidebar.offsetWidth);
        
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    };

    /**
     * リサイズ開始（mousedown）
     */
    resizer.addEventListener('mousedown', (e) => {
        // デスクトップ表示時のみリサイズ有効
        if (!isDesktop()) return;

        isResizing = true;
        
        // リサイズ中の視覚効果設定
        document.body.classList.add('cursor-col-resize', 'select-none');
        sidebar.style.transition = 'none'; // ドラッグ中の遅延を防ぐため transition を切る

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });
}

/**
 * デスクトップ表示（MDブレイクポイント以上）かどうかを判定
 */
export function isDesktop() {
    return window.innerWidth >= 768; // Tailwind の md ブレイクポイント相当
}

/**
 * localStorage から boolean 値を取得
 */
export function getStoredBool(key, defaultValue = false) {
    const val = localStorage.getItem(key);
    if (val === null) return defaultValue;
    return val === 'true' || val === 'compact'; // sidebar-density の 'compact' 文字列にも対応
}