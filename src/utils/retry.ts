/**
 * リトライ不要なエラーコード（これらは再試行しても無駄）
 */
const NON_RETRYABLE_ERRORS = [
    'permission-denied',
    'invalid-argument',
    'unauthenticated',
    'not-found',
    'already-exists',
    'failed-precondition',
];

/**
 * 失敗した非同期操作を指数バックオフで再試行する
 * 
 * @param operation - 実行する非同期操作
 * @param maxRetries - 最大再試行回数（デフォルト: 3）
 * @param initialDelay - 初期待機時間（ミリ秒、デフォルト: 1000）
 * @param enableLogging - ログ出力を有効化（開発環境のみ推奨）
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000,
    enableLogging: boolean = import.meta.env?.DEV ?? false
): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error: any) {
            lastError = error;

            // 最後の試行なら再試行しない
            if (attempt === maxRetries) break;

            // リトライ不要なエラーの判定
            const errorCode = error?.code || '';
            const isNonRetryable = NON_RETRYABLE_ERRORS.some(code => errorCode.includes(code));
            if (isNonRetryable) {
                throw error;
            }

            const delay = initialDelay * Math.pow(2, attempt);

            // 開発環境でのみログ出力（本番環境のコンソール汚染を防止）
            if (enableLogging) {
                console.warn(`[Retry] Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, error?.message || error);
            }

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}
