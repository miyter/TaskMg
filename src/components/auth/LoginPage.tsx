import React, { useState } from 'react';
import { auth } from '../../core/firebase';
import { signInAnonymously, signInWithEmailAndPassword } from '../../core/firebase-sdk';
import { cn } from '../../utils/cn';

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">TaskMg</h1>
                    <p className="text-gray-500 dark:text-gray-400">Sign in to manage your tasks</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-all"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                            loading && "animate-pulse"
                        )}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGuestLogin}
                        disabled={loading}
                        className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>🕵️</span> Guest Access
                    </button>
                </div>
            </div>
        </div>
    );
};
