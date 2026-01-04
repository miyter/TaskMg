/**
 * エラーロギングユーティリティ
 * 
 * グローバルエラーをキャッチしてログに記録する。
 * 将来的にFirestore保存やリモート送信に拡張可能。
 */

interface ErrorLog {
    timestamp: string;
    type: 'error' | 'unhandledrejection' | 'react' | 'warn' | 'console-error';
    message: string;
    stack?: string;
    url?: string;
    line?: number;
    column?: number;
    componentStack?: string;
}

// エラーログを一時保存（最新50件）
const errorBuffer: ErrorLog[] = [];
const MAX_BUFFER_SIZE = 50;

/**
 * エラーをログに記録
 */
export async function logError(log: ErrorLog, showToast = false): Promise<void> {
    // バッファに追加
    errorBuffer.push(log);
    if (errorBuffer.length > MAX_BUFFER_SIZE) {
        errorBuffer.shift();
    }

    // コンソール出力（開発時）- 読みやすいフォーマットで出力
    const prefix = `[ErrorLogger] [${log.type.toUpperCase()}]`;
    const details = log.stack ? `\n${log.stack}` : '';

    if (log.type === 'warn') {
        process.env.NODE_ENV === 'development' && console.warn(`${prefix} ${log.message}${details}`);
    } else {
        process.env.NODE_ENV === 'development' && console.error(`${prefix} ${log.message}${details}`);
    }

    // トースト通知（クリティカルな場合や明示的に指定された場合）
    if (showToast) {
        try {
            // Lazy load toast to avoid early React/Store initialization issues
            const { toast } = await import('../store/ui/toast-store');
            toast.error(`System: ${log.message.substring(0, 100)}${log.message.length > 100 ? '...' : ''}`);
        } catch (e) {
            console.error('Failed to show error toast', e);
        }
    }
}

/**
 * 保存されたエラーログを取得（デバッグ用）
 */
export function getErrorLogs(): ErrorLog[] {
    return [...errorBuffer];
}

/**
 * グローバルエラーハンドラーを初期化
 */
export function initErrorLogger(): void {
    if (typeof window === 'undefined') return;

    // JavaScript エラー
    window.onerror = (message, source, lineno, colno, error) => {
        logError({
            timestamp: new Date().toISOString(),
            type: 'error',
            message: String(message),
            stack: error?.stack,
            url: source,
            line: lineno,
            column: colno,
        }, true); // グローバルエラーは常にトースト
        return false;
    };

    // Promise の未処理拒否
    window.onunhandledrejection = (event) => {
        const reason = event.reason;
        logError({
            timestamp: new Date().toISOString(),
            type: 'unhandledrejection',
            message: reason?.message || String(reason),
            stack: reason?.stack,
        }, true);
    };

    // 開発環境のみ: console.warn/error をフックしてUIに表面化させる
    if (import.meta.env.DEV) {
        const originalWarn = console.warn;
        const originalError = console.error;

        // サーキットブレーカー（無限ループ対策）
        let recentLogCount = 0;
        let lastLogTime = Date.now();
        const MAX_LOGS_PER_WINDOW = 30; // 1秒間に30回以上のログで発動
        const TIME_WINDOW_MS = 1000;

        const checkCircuitBreaker = (message: string) => {
            const now = Date.now();
            if (now - lastLogTime < TIME_WINDOW_MS) {
                recentLogCount++;
            } else {
                recentLogCount = 1;
                lastLogTime = now;
            }

            if (recentLogCount > MAX_LOGS_PER_WINDOW) {
                const fatalMsg = `🛑 Infinite Loop detected! Stopped following logs. Last: ${message}`;
                originalError(fatalMsg);
                // ストッパー：意図的に例外を投げてErrorBoundaryを発動させる
                throw new Error("CIRCUIT_BREAKER_TRIGGERED: " + fatalMsg);
            }
        };

        console.warn = (...args) => {
            const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
            checkCircuitBreaker(message);

            // Tiptapの警告などの重要なライブラリ警告をキャッチ
            if (message.includes('[tiptap warn]') || message.includes('Duplicate extension')) {
                logError({
                    timestamp: new Date().toISOString(),
                    type: 'warn',
                    message: `Library Warning: ${message}`,
                }, true); // UIに通知
            }
            originalWarn(...args);
        };

        console.error = (...args) => {
            const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
            checkCircuitBreaker(message);

            // 無限ループなどのReact警告をキャッチ
            if (message.includes('Too many re-renders') || message.includes('infinite loop')) {
                logError({
                    timestamp: new Date().toISOString(),
                    type: 'console-error',
                    message: `Critical Error: ${message}`,
                }, true);
            }
            originalError(...args);
        };
    }

    console.info('[ErrorLogger] Initialized');
}

/**
 * Reactコンポーネントエラーをログに記録
 */
export function logReactError(error: Error, componentStack?: string): void {
    logError({
        timestamp: new Date().toISOString(),
        type: 'react',
        message: error.message,
        stack: error.stack,
        componentStack,
    }, true);
}

/**
 * 警告をログに記録
 */
export function logWarn(message: string, context?: Record<string, unknown>): void {
    logError({
        timestamp: new Date().toISOString(),
        type: 'warn',
        message,
        stack: context ? JSON.stringify(context) : undefined
    });
}
