import { useEffect, useState } from 'react';
import { authService, initAuthListener } from '../core/auth';
import { auth } from '../core/firebase';
import { User } from '../core/firebase-sdk';


/**
 * 認証状態を管理する単一のフック
 * アプリケーション全体で認証状態の唯一の情報源となる
 */
export const useAuth = () => {
    const [userId, setUserId] = useState<string | null>(auth.currentUser?.uid || null);
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isCancelled = false;
        let unsubscribe = () => { };
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const setup = async () => {
            if (authService.hasInitialToken()) {
                await authService.tryInitialTokenLogin();
            }

            // Avoid setting state if component unmounted during async operation
            if (isCancelled) return;

            unsubscribe = initAuthListener(
                (user) => {
                    if (isCancelled) return;
                    setUserId(user.uid);
                    setUser(user);
                    setLoading(false);
                    if (timeoutId) clearTimeout(timeoutId);
                },
                () => {
                    if (isCancelled) return;
                    setUserId(null);
                    setUser(null);
                    setLoading(false);
                    if (timeoutId) clearTimeout(timeoutId);
                }
            );
        };

        // Loading timeout: prevent infinite loading state (10 seconds)
        timeoutId = setTimeout(() => {
            if (!isCancelled) {
                console.warn('[useAuth] Loading timeout reached, forcing loading=false');
                setLoading(false);
            }
        }, 10000);

        setup();

        return () => {
            isCancelled = true;
            unsubscribe();
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);


    return { userId, user, loading };
};
