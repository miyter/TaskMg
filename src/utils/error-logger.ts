/**
 * エラーロギングユーティリティ
 * 
 * グローバルエラーをキャッチしてログに記録する。
 * 将来的にFirestore保存やリモート送信に拡張可能。
 */

interface ErrorLog {
    timestamp: string;
    type: 'error' | 'unhandledrejection' | 'react' | 'warn';
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
export function logError(log: ErrorLog): void {
    // バッファに追加
    errorBuffer.push(log);
    if (errorBuffer.length > MAX_BUFFER_SIZE) {
        errorBuffer.shift();
    }

    // コンソール出力（開発時）- 読みやすいフォーマットで出力
    const prefix = `[ErrorLogger] [${log.type.toUpperCase()}]`;
    const details = log.stack ? `\n${log.stack}` : '';

    if (log.type === 'warn') {
        console.warn(`${prefix} ${log.message}${details}`);
    } else {
        console.error(`${prefix} ${log.message}${details}`);
    }

    // TODO: 将来的にFirestoreや外部サービスに送信可能
    // await saveErrorToFirestore(log);
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
        });
        return false; // デフォルトのエラーハンドリングも実行
    };

    // Promise の未処理拒否
    window.onunhandledrejection = (event) => {
        const reason = event.reason;
        logError({
            timestamp: new Date().toISOString(),
            type: 'unhandledrejection',
            message: reason?.message || String(reason),
            stack: reason?.stack,
        });
    };

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
    });
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
