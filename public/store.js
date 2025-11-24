// --- データ操作モジュール (完全版：更新 2025/11/24) ---
import { 
    collection, addDoc, query, onSnapshot, doc, updateDoc, orderBy, deleteDoc, arrayUnion, arrayRemove 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db, appId } from './firebase-init.js';

// --- State ---
let tasks = [];
let currentFilter = {
    projectId: null,
    labelId: null,
    searchQuery: '',
    showCompleted: false,
    sort: 'created_desc'
};
let notifyListeners = () => {};

// --- Helpers ---
function getTaskCollectionRef(userId) {
    if (!db) throw new Error("Firestore not initialized");
    return collection(db, `/artifacts/${appId}/users/${userId}/tasks`);
}

// --- Actions ---

// タスク追加
export async function addTask(userId, title, recurrenceType = 'none', projectId = null) {
    if (!title.trim()) return;

    const taskData = {
        title: title.trim(),
        status: "todo",
        createdAt: new Date(),
        dueDate: null,
        recurrence: { type: recurrenceType },
        projectId: projectId,
        labelIds: [],
        ownerId: userId
    };

    await addDoc(getTaskCollectionRef(userId), taskData);
}

// ステータス更新 & 繰り返し処理
export async function toggleTaskStatus(userId, taskId, currentStatus, taskData) {
    const taskRef = doc(getTaskCollectionRef(userId), taskId);
    const newStatus = currentStatus === 'todo' ? 'completed' : 'todo';

    await updateDoc(taskRef, { status: newStatus });

    if (newStatus === 'completed' && taskData.recurrence && taskData.recurrence.type !== 'none') {
        await createNextRecurringTask(userId, taskData);
    }
}

// ★追加: タスクにラベルを付与（サイドバーへのドロップで使用）
export async function addLabelToTask(userId, taskId, labelId) {
    const taskRef = doc(getTaskCollectionRef(userId), taskId);
    await updateDoc(taskRef, {
        labelIds: arrayUnion(labelId) // 配列に重複なく追加
    });
}

// ★追加: タスクからラベルを削除
export async function removeLabelFromTask(userId, taskId, labelId) {
    const taskRef = doc(getTaskCollectionRef(userId), taskId);
    await updateDoc(taskRef, {
        labelIds: arrayRemove(labelId) // 配列から削除
    });
}

// 次回タスク自動生成
async function createNextRecurringTask(userId, originalTask) {
    const today = new Date();
    let nextDate = new Date();
    
    switch (originalTask.recurrence.type) {
        case 'daily': nextDate.setDate(today.getDate() + 1); break;
        case 'weekly': nextDate.setDate(today.getDate() + 7); break;
        case 'monthly': nextDate.setMonth(today.getMonth() + 1); break;
        default: return;
    }

    const newTaskData = {
        ...originalTask,
        title: originalTask.title,
        status: "todo",
        createdAt: new Date(),
        dueDate: nextDate,
        isRecurringCopy: true,
    };
    delete newTaskData.id;

    await addDoc(getTaskCollectionRef(userId), newTaskData);
}

// タスク削除
export async function deleteTask(userId, taskId) {
    if(!confirm("このタスクを削除しますか？")) return;
    await deleteDoc(doc(getTaskCollectionRef(userId), taskId));
}

// --- Filtering & Sorting ---

export function setFilter(newFilter) {
    currentFilter = { ...currentFilter, ...newFilter };
    applyFilter();
}

function applyFilter() {
    let filtered = tasks.filter(t => {
        if (!currentFilter.showCompleted && t.status === 'completed') return false;

        if (currentFilter.projectId !== 'all') {
            if (currentFilter.projectId === null) {
                if (t.projectId) return false;
            } else {
                if (t.projectId !== currentFilter.projectId) return false;
            }
        }

        if (currentFilter.labelId) {
            if (!t.labelIds || !t.labelIds.includes(currentFilter.labelId)) return false;
        }

        if (currentFilter.searchQuery) {
            const q = currentFilter.searchQuery.toLowerCase();
            if (!t.title.toLowerCase().includes(q)) return false;
        }

        return true;
    });

    filtered.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);

        switch (currentFilter.sort) {
            case 'created_asc': return dateA - dateB;
            case 'due_asc': 
                const dueA = a.dueDate ? (a.dueDate.toDate ? a.dueDate.toDate() : new Date(a.dueDate)) : new Date(9999,11,31);
                const dueB = b.dueDate ? (b.dueDate.toDate ? b.dueDate.toDate() : new Date(b.dueDate)) : new Date(9999,11,31);
                return dueA - dueB;
            case 'created_desc':
            default: return dateB - dateA;
        }
    });

    notifyListeners(filtered, currentFilter);
}

export function subscribeTasks(userId, callback) {
    notifyListeners = callback;
    const q = query(getTaskCollectionRef(userId), orderBy("createdAt", "desc"));
    
    return onSnapshot(q, (snapshot) => {
        tasks = [];
        snapshot.forEach(doc => {
            tasks.push({ id: doc.id, ...doc.data() });
        });
        applyFilter();
    });
}

export function getCurrentFilter() {
    return currentFilter;
}