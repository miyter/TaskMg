import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Unsubscribe } from '../core/firebase-sdk';

// Global subscription registry to prevent duplicate listeners
// Map key: JSON stringified queryKey
// Value: { count: number, unsubscribe: () => void }
const subscribers = new Map<string, { count: number; unsubscribe: Unsubscribe }>();

/**
 * Resets the global subscription registry.
 * Use ONLY for testing cleanup.
 */
export const resetSubscribersForTesting = () => {
    subscribers.forEach(sub => sub.unsubscribe());
    subscribers.clear();
};

/**
 * A hook that manages a Firestore real-time subscription with React Query cache.
 * It ensures only one active subscription exists per unique queryKey, regardless of how many components use this hook.
 * 
 * @param queryKey Unique key for React Query cache and subscription tracking
 * @param subscribeFn Function that starts the subscription. Must accept an callback for data updates.
 * @param initialData Optional initial data for the query
 * @returns The query result object from useQuery
 */
export interface SubscriptionOptions {
    timeout?: number;
}

/**
 * A hook that manages a Firestore real-time subscription with React Query cache.
 * It ensures only one active subscription exists per unique queryKey, regardless of how many components use this hook.
 * 
 * @param queryKey Unique key for React Query cache and subscription tracking
 * @param subscribeFn Function that starts the subscription. Must accept an callback for data updates.
 * @param initialData Optional initial data for the query
 * @param options Subscription configuration objects
 * @returns The query result object from useQuery
 */
export function useFirestoreSubscription<T>(
    queryKey: QueryKey,
    subscribeFn: (onData: (data: T) => void) => Unsubscribe,
    initialData?: T,
    options?: SubscriptionOptions
) {
    const queryClient = useQueryClient();
    const keyHash = JSON.stringify(queryKey);
    const timeoutMs = options?.timeout ?? 5000; // Default reduced to 5s from 10s for better UX

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

        return () => {
            // Decrement reference count
            const currentSub = subscribers.get(keyHash);
            if (currentSub) {
                currentSub.count--;

                if (currentSub.count === 0) {
                    currentSub.unsubscribe();
                    subscribers.delete(keyHash);
                }
            }
        };
        // Rely on keyHash stability. We intentionally do NOT include subscribeFn in deps 
        // to prevent unnecessary re-subscriptions when inline functions are used. 
        // subscribeFn is assumed to be derived from queryKey.
    }, [keyHash]);

    // Return data from cache
    return useQuery<T>({
        queryKey,
        queryFn: () => {
            // Check if data already exists in cache (race condition handling)
            const existingData = queryClient.getQueryData<T>(queryKey);
            if (existingData !== undefined) {
                return Promise.resolve(existingData);
            }

            if (initialData !== undefined) {
                return Promise.resolve(initialData);
            }

            // If no initialData, wait for subscription.
            return new Promise<T>((resolve) => {
                const timeoutId = setTimeout(() => {
                    // Fail-safe: resolve with current cache or null after timeout
                    const finalData = queryClient.getQueryData<T>(queryKey);
                    console.warn(`[FirestoreSub] Timeout waiting for data: ${keyHash}`);
                    resolve((finalData ?? initialData ?? null) as unknown as T);
                }, timeoutMs);

                // Listen for cache updates via queryClient
                const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
                    if (event.type === 'updated' && JSON.stringify(event.query.queryKey) === keyHash) {
                        const data = event.query.state.data as T;
                        if (data !== undefined) {
                            clearTimeout(timeoutId);
                            unsubscribe();
                            resolve(data);
                        }
                    }
                });

                // Final check just in case it updated between the check at start and subscription
                const dataNow = queryClient.getQueryData<T>(queryKey);
                if (dataNow !== undefined) {
                    clearTimeout(timeoutId);
                    unsubscribe();
                    resolve(dataNow);
                }
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
