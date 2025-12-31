import React, { useState } from 'react';
import { auth } from '../../core/firebase';
import { signInAnonymously, signInWithEmailAndPassword } from '../../core/firebase-sdk';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            let msg = "Login failed.";
            switch (err.code) {
                case 'auth/invalid-email': msg = "Invalid email format."; break;
                case 'auth/user-disabled': msg = "User disabled."; break;
                case 'auth/user-not-found': msg = "User not found."; break;
                case 'auth/wrong-password': msg = "Wrong password."; break;
                case 'auth/too-many-requests': msg = "Too many requests. Try again later."; break;
                case 'auth/network-request-failed': msg = "Network error."; break;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            await signInAnonymously(auth);
        } catch (err: any) {
            setError("Guest login failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-premium-gradient p-4 antialiased">
            <div className="max-w-md w-full p-6 sm:p-8 bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-[2rem] shadow-2xl transition-all duration-300">
                <div className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-3xl shadow-lg mb-6 animate-float">
                        <img src="/images/web-app-manifest-512x512.png" alt="Logo" className="h-12 w-12" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Task<span className="text-blue-600 dark:text-blue-400">Mg</span></h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">究極のタスク管理エクスペリエンス</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl font-medium animate-in fade-in slide-in-from-top-4 duration-300 shadow-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="login-email" className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Email</label>
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-5 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-gray-900 dark:text-white transition-all placeholder-gray-400"
                            placeholder="mail@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="login-password" className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Password</label>
                        <input
                            id="login-password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-5 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-gray-900 dark:text-white transition-all placeholder-gray-400"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium w-full py-4 text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
                    >
                        {loading ? 'サインイン中...' : 'サインイン'}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200/50 dark:border-gray-700/50"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-transparent text-gray-400 uppercase tracking-widest font-bold">OR</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGuestLogin}
                        disabled={loading}
                        className="mt-8 w-full py-3.5 bg-gray-100/50 hover:bg-gray-200/70 active:bg-gray-300 dark:bg-gray-700/30 dark:hover:bg-gray-600/50 dark:active:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    >
                        <span className="text-xl">🕵️</span> ゲストとして利用
                    </button>
                </div>
            </div>
        </div>
    );
};
