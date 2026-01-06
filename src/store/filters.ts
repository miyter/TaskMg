/**
 * Filter Store Facade
 * Provides Type-Safe API for Filters with Validation
 */

import { auth } from '../core/firebase';
import { Unsubscribe } from "../core/firebase-sdk";
import { getTranslator } from '../core/i18n/utils';
import {
    addFilterRaw,
    clearFiltersCacheRaw,
    deleteFilterRaw,
    getFiltersRaw,
    isFiltersInitializedRaw,
    subscribeToFiltersRaw,
    updateFilterRaw
} from './filters-raw';
import { Filter, FilterSchema } from './schema';
import { useSettingsStore } from './ui/settings-store';
import { toast } from './ui/toast-store';

const getT = () => getTranslator(useSettingsStore.getState().language).t;

export function getFilters(workspaceId?: string): Filter[] {
    if (!workspaceId) return [];
    return getFiltersRaw(workspaceId);
}

export function clearFiltersCache(workspaceId?: string) {
    clearFiltersCacheRaw(workspaceId);
}

export function isFiltersInitialized(workspaceId: string): boolean {
    return isFiltersInitializedRaw(workspaceId);
}

/**
 * フィルターのリアルタイム購読
 */
export function subscribeToFilters(workspaceId: string, onUpdate: (filters: Filter[]) => void, onError?: (error: any) => void): Unsubscribe {
    const userId = auth.currentUser?.uid;

    if (!userId || !workspaceId) {
        onUpdate([]);
        return () => { };
    }
    return subscribeToFiltersRaw(userId, workspaceId, onUpdate, onError);
}

/**
 * フィルターを追加
 */
export async function addFilter(filterData: Partial<Filter> & { workspaceId: string }) {
    const t = getT();
    const userId = auth.currentUser?.uid;
    if (!userId) {
        toast.error(t('validation.auth_required'));
        throw new Error("Authentication required");
    }

    const { workspaceId, ...rest } = filterData;
    if (!workspaceId) {
        toast.error(t('validation.workspace_required'));
        throw new Error("Workspace ID required");
    }

    // Validate input (partial validation - only check name and query)
    const result = FilterSchema.pick({ name: true, query: true }).safeParse(rest);
    if (!result.success) {
        const errorMsg = result.error.issues.map((e) => e.message).join(', ');
        console.error("[Filters] Validation failed:", result.error.flatten());
        toast.error(`${t('validation.validation_error')}: ${errorMsg}`);
        throw new Error(`Validation failed: ${errorMsg}`);
    }

    const { id, ...data } = rest;

    // Pass to raw (raw expects Omit<Filter, 'id' | 'createdAt'> roughly, but typed loosely in implementation or handled)
    // We need to cast or ensure types match. 
    // Data here is name, query, etc.
    // raw expects "filter" object + ownerId/workspaceId which we need to construct or pass.

    await addFilterRaw(userId, workspaceId, {
        name: data.name!,
        query: data.query!,
        workspaceId,
        ownerId: userId
        // createdAt handled in raw
    });
}

/**
 * フィルターを更新
 */
export async function updateFilter(workspaceId: string, filterId: string, filterData: Partial<Filter>) {
    const t = getT();
    const userId = auth.currentUser?.uid;
    if (!userId || !workspaceId) {
        toast.error(t('validation.auth_required'));
        throw new Error("Authentication required");
    }

    // Validate input (partial - allow partial updates)
    const result = FilterSchema.partial().safeParse(filterData);
    if (!result.success) {
        const errorMsg = result.error.issues.map((e) => e.message).join(', ');
        console.error("[Filters] Validation failed:", result.error.flatten());
        toast.error(`${t('validation.validation_error')}: ${errorMsg}`);
        throw new Error(`Validation failed: ${errorMsg}`);
    }

    const { id, ...updates } = filterData;
    await updateFilterRaw(userId, workspaceId, filterId, updates);
}


/**
 * フィルターを削除
 */
export async function deleteFilter(workspaceId: string, filterId: string) {
    const t = getT();
    const userId = auth.currentUser?.uid;
    if (!userId || !workspaceId) {
        toast.error(t('validation.auth_required'));
        throw new Error("Authentication required");
    }

    await deleteFilterRaw(userId, workspaceId, filterId);
}
