import { Component, ErrorInfo, ReactNode } from 'react';
import { logReactError } from '../../utils/error-logger';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * React Error Boundary
 * 
 * 子コンポーネントでエラーが発生した場合にキャッチし、
 * フォールバックUIを表示する。
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // ReactエラーはToastを表示しない (再レンダリングループ防止のため)
        logReactError(error, errorInfo.componentStack ?? undefined, false);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // 安全のため、ストア依存の翻訳機能は使用せず、静的なバイリンガルテキストを表示する
            // This prevents crashes in the error boundary itself due to store access issues.
            const t = (key: string) => {
                const map: Record<string, string> = {
                    'error_boundary.title': 'エラーが発生しました / An Error Occurred',
                    'error_boundary.description': '申し訳ありません。予期せぬエラーが発生しました。\nSorry, an unexpected error has occurred.',
                    'error_boundary.retry': '再試行 / Retry',
                    'error_boundary.reload': '再読み込み / Reload',
                    'error_boundary.reset': '緊急リセット / Hard Reset',
                    'error_boundary.details': 'エラー詳細 / Error Details',
                };
                return map[key] || key;
            };

            const handleHardReset = () => {
                if (window.confirm('本当にリセットしますか？\nローカルの設定とキャッシュを消去します。\nクラウド上のデータは安全です。\n\nAre you sure?\nThis will clear local settings and cache.\nYour cloud data is safe.')) {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/';
                }
            };

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                            {t('error_boundary.title')}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 whitespace-pre-line">
                            {t('error_boundary.description')}
                        </p>
                        <div className="flex flex-col gap-3 justify-center">
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={this.handleRetry}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {t('error_boundary.retry')}
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {t('error_boundary.reload')}
                                </button>
                            </div>
                            <button
                                onClick={handleHardReset}
                                className="text-xs text-gray-400 hover:text-red-500 underline mt-2"
                            >
                                {t('error_boundary.reset')}
                            </button>
                        </div>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="text-xs text-gray-400 cursor-pointer">{t('error_boundary.details')}</summary>
                                <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-auto max-h-40 text-red-600 dark:text-red-400">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

