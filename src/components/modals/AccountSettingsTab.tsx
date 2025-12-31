import React, { useState } from 'react';
import { auth } from '../../core/firebase';
import { EmailAuthProvider, linkWithCredential, signOut } from '../../core/firebase-sdk';
import { toast } from '../../store/ui/toast-store';

export const AccountSettingsTab: React.FC = () => {
    const user = auth.currentUser;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // 強制再レンダリング用（auth.currentUserの変更を検知するため、あるいは単純に表示用）
    // note: auth.currentUserはリアクティブではないため、onAuthStateChangedが必要だが
    // SettingsModalが開いている間に状態が変わるケースは少ないため、今回は簡易実装。
    // link成功後にUIを更新するためにstateを使用。
    const [isAnonymous, setIsAnonymous] = useState(user?.isAnonymous ?? false);
    const [error, setError] = useState<string | null>(null);

    if (!user) return <div className="text-center text-gray-500">ログインしていません</div>;

    const handleLinkAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const credential = EmailAuthProvider.credential(email, password);
            await linkWithCredential(user, credential);
            toast.success("アカウントを登録しました！");
            setIsAnonymous(false); // UI更新
        } catch (error: any) {
            console.error("Link account error:", error);
            let msg = "登録に失敗しました";
            if (error.code === 'auth/email-already-in-use') msg = "このメールアドレスは既に使用されています";
            if (error.code === 'auth/weak-password') msg = "パスワードが弱すぎます";
            setError(msg); // Set inline error
            toast.error(msg); // Keep toast for visibility
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        if (confirm("ログアウトしますか？")) {
            await signOut(auth);
            // App.tsxのonAuthStateChangedが検知してリダイレクトするはずだが、念のためリロード
            window.location.reload();
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-8 sm:gap-6 border border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-3xl shadow-inner shrink-0">
                    {isAnonymous ? '🕵️' : '👤'}
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {isAnonymous ? 'ゲストユーザー' : (user.displayName || '登録ユーザー')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mb-4 break-all">
                        {isAnonymous ? `ID: ${user.uid.slice(0, 8)}...` : user.email}
                    </p>

                    {!isAnonymous && (
                        <button
                            onClick={handleSignOut}
                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-bold px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                        >
                            ログアウト
                        </button>
                    )}
                </div>
            </div>

            {isAnonymous ? (
                <div className="border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg className="w-32 h-32 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                    </div>

                    <div className="relative">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <span>🔐</span> アカウントを永続化
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                            現在のアカウントは一時的なものです。<br />
                            メールアドレスを登録すると、別のデバイスでもログインしてデータを引き継ぐことができます。
                        </p>

                        <form onSubmit={handleLinkAccount} className="space-y-4 max-w-md">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg font-medium animate-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="account-email" className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
                                <input
                                    id="account-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="mail@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="account-password" className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
                                <input
                                    id="account-password"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                            >
                                {loading ? '登録処理中...' : (
                                    <>
                                        アカウントを登録
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400">
                    <p>アカウントは正常に登録されています。</p>
                </div>
            )}
        </div>
    );
};
