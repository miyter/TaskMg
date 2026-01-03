import React, { useState } from 'react';
import { auth } from '../../core/firebase';
import { EmailAuthProvider, linkWithCredential, signOut } from '../../core/firebase-sdk';
import { useTranslation } from '../../core/translations';
import { useAuth } from '../../hooks/useAuth';
import { useModalStore } from '../../store/ui/modal-store';
import { toast } from '../../store/ui/toast-store';
import { IconEye, IconEyeOff } from '../common/Icons';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const AccountSettingsTab: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { openModal } = useModalStore(); // Add openModal
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

    const handleSignOut = () => {
        openModal('confirmation', {
            title: t('settings_modal.account.logout'),
            message: t('settings_modal.account.logout_confirm'),
            confirmLabel: t('settings_modal.account.logout'),
            variant: 'danger',
            onConfirm: async () => {
                await signOut(auth);
                window.location.reload();
            }
        });
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-8 sm:gap-6 border border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-3xl shrink-0">
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
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSignOut}
                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-bold"
                        >
                            {t('settings_modal.account.logout')}
                        </Button>
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
                                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg font-medium">
                                    {error}
                                </div>
                            )}

                            <Input
                                id="account-email"
                                type="email"
                                label={t('settings_modal.account.email_label')}
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="mail@example.com"
                                autoComplete="email"
                            />
                            <Input
                                id="account-password"
                                type={showPassword ? "text" : "password"}
                                label={t('settings_modal.account.password_label')}
                                required
                                minLength={6}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none p-1 pointer-events-auto"
                                        aria-label={showPassword ? t('settings_modal.account.hide_password') : t('settings_modal.account.show_password')}
                                    >
                                        {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                                    </button>
                                }
                            />
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full"
                                rightIcon={!loading ? <span>→</span> : undefined}
                            >
                                {t('settings_modal.account.register')}
                            </Button>
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



