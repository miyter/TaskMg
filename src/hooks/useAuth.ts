import { useEffect, useState } from 'react';
import { authService, initAuthListener } from '../core/auth';
import { auth } from '../core/firebase';


/**
 * 認証状態を管理する単一のフック
 * アプリケーション全体で認証状態の唯一の情報源となる
 */
export const useAuth = () => {
    const [userId, setUserId] = useState<string | null>(auth.currentUser?.uid || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe = () => { };

        const setup = async () => {
            if (authService.hasInitialToken()) {
                await authService.tryInitialTokenLogin();
            }

            unsubscribe = initAuthListener(
                (user) => {
                    setUserId(user.uid);
                    setLoading(false);
                },
                () => {
                    setUserId(null);
                    setLoading(false);
                }
            );
        };

        setup();

        return () => unsubscribe();
    }, []);


    return { userId, loading };
};
