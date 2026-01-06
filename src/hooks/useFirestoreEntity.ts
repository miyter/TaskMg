import { useCallback, useRef, useSyncExternalStore } from 'react';
import { useWorkspace } from './useWorkspace';

const EMPTY_ARRAY: any[] = [];

interface UseFirestoreEntityOptions<T> {
    entityName: string;
    subscribeFn: (workspaceId: string, onData: (data: T[]) => void) => (() => void);
    getCacheFn: (workspaceId: string) => T[];
    isInitializedFn: (workspaceId: string) => boolean;
}

/**
 * Generic hook for subscribing to Firestore collections (Tasks, Labels, Projects, etc.) using SyncExternalStore.
 * This connects directly to the manual FirestoreCollectionCache, avoiding double caching with React Query.
 */
export const useFirestoreEntity = <T>({
    entityName, // Kept for interface compatibility/debugging
    subscribeFn: storeSubscribeFn,
    getCacheFn,
    isInitializedFn
}: UseFirestoreEntityOptions<T>) => {
    const { workspaceId, userId, loading: authLoading } = useWorkspace();

    // Dev-only: Detect infinite loops caused by unstable subscribeFn
    const lastFnRef = useRef(storeSubscribeFn);
    const lastCallRef = useRef(Date.now());
    const violationCountRef = useRef(0);

    if (import.meta.env.DEV) {
        if (lastFnRef.current !== storeSubscribeFn) {
            const now = Date.now();
            if (now - lastCallRef.current < 1000) {
                violationCountRef.current++;
                if (violationCountRef.current > 5) {
                    console.error(
                        `[useFirestoreEntity] 🚨 CRITICAL: Infinite loop detected for entity "${entityName}".\n` +
                        `The 'subscribeFn' prop is being recreated too frequently. \n` +
                        `Wrap the function passed to useFirestoreEntity with useCallback() in the parent component.`
                    );
                }
            } else {
                violationCountRef.current = 0;
            }
            lastFnRef.current = storeSubscribeFn;
            lastCallRef.current = now;
        }
    }

    const subscribe = useCallback((onStoreChange: () => void) => {
        if (!workspaceId || !userId) return () => { };
        // Adapter: store emits data, we emit event to trigger getSnapshot
        return storeSubscribeFn(workspaceId, () => onStoreChange());
    }, [workspaceId, userId, storeSubscribeFn]);

    const getSnapshot = useCallback(() => {
        if (workspaceId && userId && isInitializedFn(workspaceId)) {
            return getCacheFn(workspaceId);
        }
        return EMPTY_ARRAY as T[];
    }, [workspaceId, userId, isInitializedFn, getCacheFn]);

    const entities = useSyncExternalStore(subscribe, getSnapshot);

    const isCacheReady = workspaceId ? isInitializedFn(workspaceId) : false;
    const loading = authLoading || (!!workspaceId && !isCacheReady);

    return { entities, loading };
};
