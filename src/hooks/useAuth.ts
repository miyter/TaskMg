import { useEffect, useState } from 'react';
import { initAuthListener } from '../core/auth';
import { auth } from '../core/firebase';
import { User } from '../core/firebase-sdk';


import { SYSTEM_CONSTANTS } from '../core/constants';

/**
 * 認証状態を管理する単一のフック
 * アプリケーション全体で認証状態の唯一の情報源となる
 */
export const useAuth = () => {
    const [userId, setUserId] = useState<string | null>(auth.currentUser?.uid || null);
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [loading, setLoading] = useState(!auth.currentUser);

    useEffect(() => {
        const controller = new AbortController();
        let unsubscribe = () => { };
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const setup = async () => {


            // Avoid setting state if component unmounted during async operation
            if (controller.signal.aborted) return;

            unsubscribe = initAuthListener(
                (user) => {
                    if (controller.signal.aborted) return;
                    setUserId(user.uid);
                    setUser(user);
                    setLoading(false);
                    if (timeoutId) clearTimeout(timeoutId);
                },
                () => {
                    if (controller.signal.aborted) return;
                    setUserId(null);
                    setUser(null);
                    setLoading(false);
                    if (timeoutId) clearTimeout(timeoutId);
                }
            );
        };

        // Loading timeout: prevent infinite loading state (10 seconds)
        timeoutId = setTimeout(() => {
            if (!controller.signal.aborted) {
                console.warn('[useAuth] Loading timeout reached, forcing loading=false');
                setLoading(false);
            }
        }, SYSTEM_CONSTANTS.TIMEOUT.AUTH_LOADING);

        setup();

        return () => {
            controller.abort();
            unsubscribe();
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);


    return { userId, user, loading };
};
