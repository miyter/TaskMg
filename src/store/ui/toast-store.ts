import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

// Type別の表示時間 (ms)
const TOAST_DURATIONS: Record<ToastType, number> = {
    success: 3000,
    info: 4000,
    error: 6000, // エラーは長めに表示
};

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

// タイマー管理用 (メモリリーク防止)
const _timers = new Map<string, ReturnType<typeof setTimeout>>();

// 安全なID生成
const generateId = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 11);
};

interface ToastState {
    toasts: Toast[];
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (message, type = 'info') => {
        const id = generateId();
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));

        // Type別の表示時間でAuto remove
        const duration = TOAST_DURATIONS[type];
        const timer = setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id)
            }));
            _timers.delete(id);
        }, duration);
        _timers.set(id, timer);
    },
    removeToast: (id) => {
        // タイマーをクリア
        const timer = _timers.get(id);
        if (timer) {
            clearTimeout(timer);
            _timers.delete(id);
        }
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
        }));
    },
}));

// Helper for usage outside React components (e.g., in store actions)
export const toast = {
    success: (msg: string) => useToastStore.getState().addToast(msg, 'success'),
    error: (msg: string) => useToastStore.getState().addToast(msg, 'error'),
    info: (msg: string) => useToastStore.getState().addToast(msg, 'info'),
};
