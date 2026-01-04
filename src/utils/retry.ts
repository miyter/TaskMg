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

interface ErrorWithCode {
    code?: string;
    message?: string;
}

interface RetryOptions {
    maxRetries?: number;
    initialDelay?: number;
    onError?: (error: unknown, attempt: number) => void;
    onFinalFailure?: (error: unknown) => void;
}

/**
 * 失敗した非同期操作を指数バックオフで再試行する
 * 
 * @param operation - 実行する非同期操作
 * @param options - リトライオプション
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions | number = {}
): Promise<T> {
    // 後方互換性: 数値が渡された場合はmaxRetriesとして扱う
    const opts: RetryOptions = typeof options === 'number'
        ? { maxRetries: options }
        : options;

    const {
        maxRetries = 3,
        initialDelay = 1000,
        onError,
        onFinalFailure
    } = opts;

    const enableLogging = import.meta.env?.DEV ?? false;
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error: unknown) {
            lastError = error;

            // エラーコールバック実行
            if (onError) {
                onError(error, attempt);
            }

            // 最後の試行なら再試行しない
            if (attempt === maxRetries) break;

            // リトライ不要なエラーの判定
            const errorObj = error as ErrorWithCode;
            const errorCode = errorObj?.code || '';
            const isNonRetryable = NON_RETRYABLE_ERRORS.some(code => errorCode.includes(code));
            if (isNonRetryable) {
                if (onFinalFailure) {
                    onFinalFailure(error);
                }
                throw error;
            }

            const delay = initialDelay * Math.pow(2, attempt);

            // 開発環境でのみログ出力（本番環境のコンソール汚染を防止）
            if (enableLogging) {
                console.warn(`[Retry] Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, errorObj?.message || String(error));
            }

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // 最終失敗コールバック実行
    if (onFinalFailure) {
        onFinalFailure(lastError);
    }

    throw lastError;
}

