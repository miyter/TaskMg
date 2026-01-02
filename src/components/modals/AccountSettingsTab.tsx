import React, { useState } from 'react';
import { auth } from '../../core/firebase';
import { EmailAuthProvider, linkWithCredential, signOut } from '../../core/firebase-sdk';
import { useTranslation } from '../../core/translations';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '../../store/ui/toast-store';

export const AccountSettingsTab: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!user) return <div className="text-center text-gray-500">{t('settings_modal.account.not_logged_in')}</div>;

    const isAnonymous = user.isAnonymous;

    const handleLinkAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const credential = EmailAuthProvider.credential(email, password);
            await linkWithCredential(user, credential);
            toast.success(t('settings_modal.account.register_success'));
            // isAnonymous will update automatically via useAuth
        } catch (error: any) {
            console.error("Link account error:", error);
            let msg = t('settings_modal.account.register_fail');
            if (error.code === 'auth/email-already-in-use') msg = t('settings_modal.account.already_in_use');
            if (error.code === 'auth/weak-password') msg = t('settings_modal.account.weak_password');
            setError(msg); // Set inline error
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        if (confirm(t('settings_modal.account.logout_confirm'))) {
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
                        {isAnonymous ? t('settings_modal.account.guest_user') : (user.displayName || t('settings_modal.account.registered_user'))}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mb-4 break-all">
                        {isAnonymous ? `ID: ${user.uid.slice(0, 8)}...` : user.email}
                    </p>

                    {!isAnonymous && (
                        <button
                            onClick={handleSignOut}
                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-bold px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                        >
                            {t('settings_modal.account.logout')}
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
                            <span>🔐</span> {t('settings_modal.account.persist_account')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">
                            {t('settings_modal.account.persist_desc')}
                        </p>

                        <form onSubmit={handleLinkAccount} className="space-y-4 max-w-md">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg font-medium animate-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="account-email" className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{t('settings_modal.account.email_label')}</label>
                                <input
                                    id="account-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="mail@example.com"
                                    autoComplete="email"
                                />
                            </div>
                            <div>
                                <label htmlFor="account-password" className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{t('settings_modal.account.password_label')}</label>
                                <div className="relative">
                                    <input
                                        id="account-password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-12"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none p-1"
                                        aria-label={showPassword ? t('settings_modal.account.hide_password') : t('settings_modal.account.show_password')}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                            >
                                {loading ? t('settings_modal.account.registering') : (
                                    <>
                                        {t('settings_modal.account.register')}
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400">
                    <p>{t('settings_modal.account.registered_msg')}</p>
                </div>
            )}
        </div>
    );
};
