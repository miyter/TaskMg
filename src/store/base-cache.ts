/**
 * FirestoreCollectionCache - 共通ベースクラス
 * 更新日: 2026-01-03
 * 
 * 全ての *-raw.ts で重複していた Cache クラスを共通化。
 * - cacheMap, listeners, unsubscribes の管理
 * - subscribe, notify, setCache, getItems, isInitialized の共通実装
 * 
 * サブクラスは必要に応じて subscribe をオーバーライドして
 * Firestore クエリのカスタマイズ（orderBy, where など）を行う。
 */

import { FirestoreError, Query, QuerySnapshot, Unsubscribe, onSnapshot } from "../core/firebase-sdk";

/**
 * エンティティ型の基本制約
 * Zod スキーマで id は optional（Firestore が自動生成）なので、ここでも optional とする
 */
export interface BaseEntity {
    id?: string;
}

/**
 * Firestore Collection Cache の設定
 */
export interface CacheConfig {
    /** ログ出力時のプレフィックス */
    logPrefix: string;
}

/**
 * Firestore コレクションのキャッシュと購読を管理する抽象基底クラス
 * 
 * @typeParam T - エンティティ型（id: string を持つ必要がある）
 * @typeParam K - キャッシュキーの型（通常 workspaceId: string、Workspace の場合は userId: string）
 */
export abstract class FirestoreCollectionCache<T extends BaseEntity, K extends string = string> {
    protected cacheMap = new Map<K, T[]>();
    protected listeners = new Map<K, Set<(items: T[]) => void>>();
    protected unsubscribes = new Map<K, Unsubscribe>();
    protected readonly config: CacheConfig;

    constructor(config: CacheConfig) {
        this.config = config;
    }

    /**
     * キャッシュが初期化されているか確認
     */
    public isInitialized(key: K): boolean {
        return this.cacheMap.has(key);
    }

    /**
     * キャッシュされたアイテムを取得
     */
    public getItems(key: K): T[] {
        return this.cacheMap.get(key) || [];
    }

    /**
     * キャッシュを設定し、リスナーに通知
     */
    public setCache(key: K, items: T[]): void {
        this.cacheMap.set(key, items);
        this.notifyListeners(key);
    }

    /**
     * キャッシュをクリア
     */
    public clearCache(key?: K): void {
        if (key) {
            this.cacheMap.delete(key);
            this.unsubscribes.get(key)?.();
            this.unsubscribes.delete(key);
            this.listeners.delete(key);
        } else {
            // 全てクリア
            this.unsubscribes.forEach(unsub => unsub());
            this.cacheMap.clear();
            this.unsubscribes.clear();
            this.listeners.clear();
        }
    }

    /**
     * リスナーに更新を通知
     */
    protected notifyListeners(key: K): void {
        const items = this.cacheMap.get(key) || [];
        const keyListeners = this.listeners.get(key);
        if (keyListeners) {
            const itemsCopy = [...items];
            keyListeners.forEach(listener => listener(itemsCopy));
        }
    }

    /**
     * リスナーを登録し、購読を開始
     * サブクラスで Firestore クエリをカスタマイズする場合はオーバーライド
     */
    protected registerListener(key: K, callback: (items: T[]) => void): () => void {
        // リスナー登録
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        const keyListeners = this.listeners.get(key)!;
        keyListeners.add(callback);

        // キャッシュがあれば即座に返す（マイクロタスクで非同期）
        const cached = this.cacheMap.get(key);
        if (cached) {
            queueMicrotask(() => callback([...cached]));
        }

        // クリーンアップ関数を返す
        return () => {
            keyListeners.delete(callback);
            if (keyListeners.size === 0) {
                this.unsubscribes.get(key)?.();
                this.unsubscribes.delete(key);
                this.listeners.delete(key);
            }
        };
    }

    /**
     * Firestore のスナップショット購読を設定
     * サブクラスで呼び出す
     */
    protected setFirestoreSubscription(key: K, unsub: Unsubscribe): void {
        if (!this.unsubscribes.has(key)) {
            this.unsubscribes.set(key, unsub);
        }
    }

    /**
     * Firestore 購読が既に存在するか確認
     */
    protected hasFirestoreSubscription(key: K): boolean {
        return this.unsubscribes.has(key);
    }
    /**
     * Firestore 購読の共通ロジック
     * @param key キャッシュキー
     * @param query Firestore Query
     * @param transformFn データ変換関数 (Option: デフォルトは id + data())
     * @param compareFn 比較関数 (Option: デフォルトは変更検知なしで更新)
     */
    protected __subscribeToQuery(
        key: K,
        query: Query,
        transformFn: (doc: any) => T = (d) => ({ id: d.id, ...d.data() } as T),
        compareFn?: (a: T[], b: T[]) => boolean
    ): void {
        const unsub = onSnapshot(query, (snapshot: QuerySnapshot) => {
            const items = snapshot.docs.map(transformFn);

            if (compareFn) {
                const current = this.getItems(key);
                if (current.length > 0 && compareFn(current, items)) {
                    return;
                }
            }

            this.setCache(key, items);
        }, (error: FirestoreError) => {
            console.error(`${this.config.logPrefix} Subscription error:`, error);
        });

        this.setFirestoreSubscription(key, unsub);
    }
}

/**
 * 比較関数の型
 */
export type ArrayComparator<T> = (a: T[], b: T[]) => boolean;

/**
 * 標準的な workspaceId ベースのキャッシュのためのヘルパー型
 */
export type WorkspaceBasedCache<T extends BaseEntity> = FirestoreCollectionCache<T, string>;
