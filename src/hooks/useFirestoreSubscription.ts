import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Unsubscribe } from '../core/firebase-sdk';

// Global subscription registry to prevent duplicate listeners
// Map key: JSON stringified queryKey
// Value: { count: number, unsubscribe: () => void }
const subscribers = new Map<string, { count: number; unsubscribe: Unsubscribe }>();

/**
 * A hook that manages a Firestore real-time subscription with React Query cache.
 * It ensures only one active subscription exists per unique queryKey, regardless of how many components use this hook.
 * 
 * @param queryKey Unique key for React Query cache and subscription tracking
 * @param subscribeFn Function that starts the subscription. Must accept an callback for data updates.
 * @param initialData Optional initial data for the query
 * @returns The query result object from useQuery
 */
export function useFirestoreSubscription<T>(
    queryKey: QueryKey,
    subscribeFn: (onData: (data: T) => void) => Unsubscribe,
    initialData?: T
) {
    const queryClient = useQueryClient();
    const keyHash = JSON.stringify(queryKey);

    useEffect(() => {
        // Skip subscription if key contains undefined/null (e.g. waiting for workspaceId)
        if (queryKey.some(k => k === undefined || k === null)) return;

        // --- Subscription Management ---

        let subRecord = subscribers.get(keyHash);

        if (!subRecord) {
            // Start new subscription
            // console.log(`[FirestoreSub] Starting subscription for: ${keyHash}`);
            const unsubscribe = subscribeFn((data) => {
                queryClient.setQueryData(queryKey, data);
            });

            subRecord = { count: 0, unsubscribe };
            subscribers.set(keyHash, subRecord);
        }

        // Increment reference count
        subRecord.count++;
        // console.log(`[FirestoreSub] Count inc for ${keyHash}: ${subRecord.count}`);

        return () => {
            // Decrement reference count
            const currentSub = subscribers.get(keyHash);
            if (currentSub) {
                currentSub.count--;
                // console.log(`[FirestoreSub] Count dec for ${keyHash}: ${currentSub.count}`);

                if (currentSub.count === 0) {
                    // console.log(`[FirestoreSub] Unsubscribing for: ${keyHash}`);
                    currentSub.unsubscribe();
                    subscribers.delete(keyHash);
                }
            }
        };
    }, [keyHash]); // Rely on keyHash stability. subscribeFn should be stable or ignored if key doesn't change.

    // Return data from cache
    return useQuery<T>({
        queryKey,
        queryFn: () => {
            // This function is only called if cache is empty and staleTime expired.
            // Since we rely on subscription to push data, we assume data will come from subscription.
            // If we have initialData, return it synchronously.
            if (initialData !== undefined) {
                return Promise.resolve(initialData);
            }
            // If no initialData, wait for subscription with a timeout to prevent infinite pending.
            // After 30 seconds, resolve with empty array (safe default for list subscriptions).
            return new Promise<T>((resolve) => {
                setTimeout(() => {
                    console.warn('[useFirestoreSubscription] Timeout waiting for subscription data, resolving with default');
                    resolve([] as unknown as T);
                }, 30000);
            });
        },
        initialData: initialData,
        staleTime: Infinity, // Data pushed by subscription is always fresh
        gcTime: 1000 * 60 * 5, // Keep cache for 5 mins after last component unmounts
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
    });
}
