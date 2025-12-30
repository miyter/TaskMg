/**
 * 失敗した非同期操作を指数バックオフで再試行する
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error: any) {
            lastError = error;

            // 最後の試行なら再試行しない
            if (attempt === maxRetries) break;

            // 権限エラーやバリデーションエラーの場合は即座に終了（これらは再試行しても無駄なため）
            const errorCode = error?.code || '';
            if (errorCode.includes('permission-denied') || errorCode.includes('invalid-argument')) {
                throw error;
            }

            const delay = initialDelay * Math.pow(2, attempt);
            console.warn(`[Retry] Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}
