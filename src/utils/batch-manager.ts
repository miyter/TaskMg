import { db } from '../core/firebase';
import { DocumentReference, WriteBatch, writeBatch } from "../core/firebase-sdk";

/**
 * Firestore WriteBatch Manager
 * Automatically manages batch size limits (500 operations).
 * Note: Firestore does not support atomic commits across multiple batches.
 * If a batch fails, previous batches remain committed.
 */
export class BatchManager {
    private batch: WriteBatch;
    private count = 0;
    private commits: Promise<void>[] = [];

    constructor() {
        this.batch = writeBatch(db);
    }

    /**
     * Add a set operation to the batch
     */
    set(ref: DocumentReference, data: unknown) {
        this.batch.set(ref, data);
        this.checkLimit();
    }

    /**
     * Add a update operation to the batch
     */
    update(ref: DocumentReference, data: Record<string, unknown>) {
        this.batch.update(ref, data);
        this.checkLimit();
    }

    /**
     * Add a delete operation to the batch
     */
    delete(ref: DocumentReference) {
        this.batch.delete(ref);
        this.checkLimit();
    }

    private checkLimit() {
        this.count++;
        // Firestore limit is 500. Using 450 for safety margin and other triggers.
        if (this.count >= 450) {
            this.commits.push(this.batch.commit());
            this.batch = writeBatch(db);
            this.count = 0;
        }
    }

    /**
     * Commit all pending batches
     */
    async commitAll() {
        if (this.count > 0) {
            this.commits.push(this.batch.commit());
        }
        // Commit in parallel for speed, though sequentially might be safer for order dependence.
        // For independent items, parallel is fine.
        await Promise.all(this.commits);
    }
}
