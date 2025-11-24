// --- データ操作モジュール (更新日: 2025-11-25 検索機能強化版) ---
import { 
    collection, addDoc, query, onSnapshot, doc, updateDoc, orderBy, deleteDoc, arrayUnion, arrayRemove, getDocs 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db, appId } from './firebase-init.js';
// ★他のStoreからデータを購読して内部キャッシュする
import { subscribeProjects } from './project-store.js';
import { subscribeLabels } from './label-store.js';

// --- State ---
let tasks = [];
// 検索・ソートのためにプロジェクトとラベルの全ても知っておく必要がある
let allProjects = [];
let allLabels = [];

let currentFilter = {
    projectId: null, // null=Inbox, 'all'=全部
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

export async function addTask(userId, title, recurrenceType = 'none', projectId = null, dueDate = null, description = '') {
    if (!title.trim()) return;

    const taskData = {
        title: title.trim(),
        description: description || '',
        status: "todo",
        createdAt: new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        recurrence: { type: recurrenceType },
        projectId: projectId,
        labelIds: [],
        ownerId: userId
    };

    await addDoc(getTaskCollectionRef(userId), taskData);
}

export async function updateTask(userId, taskId, updates) {
    const taskRef = doc(getTaskCollectionRef(userId), taskId);
    
    if (updates.dueDate && typeof updates.dueDate === 'string') {
        updates.dueDate = new Date(updates.dueDate);
    } else if (updates.dueDate === '') {
        updates.dueDate = null;
    }

    await updateDoc(taskRef, updates);
}

export async function toggleTaskStatus(userId, taskId, currentStatus, taskData) {
    const taskRef = doc(getTaskCollectionRef(userId), taskId);
    const newStatus = currentStatus === 'todo' ? 'completed' : 'todo';

    await updateDoc(taskRef, { status: newStatus });

    if (newStatus === 'completed' && taskData.recurrence && taskData.recurrence.type !== 'none') {
        await createNextRecurringTask(userId, taskData);
    }
}

export async function addLabelToTask(userId, taskId, labelId) {
    const taskRef = doc(getTaskCollectionRef(userId), taskId);
    await updateDoc(taskRef, {
        labelIds: arrayUnion(labelId)
    });
}

export async function removeLabelFromTask(userId, taskId, labelId) {
    const taskRef = doc(getTaskCollectionRef(userId), taskId);
    await updateDoc(taskRef, {
        labelIds: arrayRemove(labelId)
    });
}

async function createNextRecurringTask(userId, originalTask) {
    const today = new Date();
    let nextDate = new Date();
    const baseDate = originalTask.dueDate && originalTask.dueDate.toDate ? originalTask.dueDate.toDate() : today;

    switch (originalTask.recurrence.type) {
        case 'daily': nextDate = new Date(baseDate); nextDate.setDate(baseDate.getDate() + 1); break;
        case 'weekly': nextDate = new Date(baseDate); nextDate.setDate(baseDate.getDate() + 7); break;
        case 'monthly': nextDate = new Date(baseDate); nextDate.setMonth(baseDate.getMonth() + 1); break;
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

export async function deleteTask(userId, taskId) {
    if(!confirm("このタスクを削除しますか？")) return;
    await deleteDoc(doc(getTaskCollectionRef(userId), taskId));
}

// --- Export & Filtering System ---

export async function createBackupData(userId) {
    if (!db) throw new Error("Firestore not initialized");
    
    const tasksRef = collection(db, `/artifacts/${appId}/users/${userId}/tasks`);
    const projectsRef = collection(db, `/artifacts/${appId}/users/${userId}/projects`);
    const labelsRef = collection(db, `/artifacts/${appId}/users/${userId}/labels`);

    const [tasksSnap, projectsSnap, labelsSnap] = await Promise.all([
        getDocs(tasksRef),
        getDocs(projectsRef),
        getDocs(labelsRef)
    ]);

    const backup = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        userId: userId,
        tasks: tasksSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        projects: projectsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        labels: labelsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    };

    return backup;
}

export function setFilter(newFilter) {
    currentFilter = { ...currentFilter, ...newFilter };
    applyFilter();
}

export function getCurrentFilter() {
    return currentFilter;
}

// ★検索クエリの高度なパース処理
function parseQuery(query) {
    if (!query) return [];
    
    // スペース区切りでキーワードを抽出 (AND検索)
    const terms = query.trim().split(/\s+/);
    const conditions = [];

    terms.forEach(term => {
        const lowerTerm = term.toLowerCase();

        // 1. プロジェクト検索 (#ProjectName)
        if (term.startsWith('#')) {
            const searchName = term.substring(1).toLowerCase();
            if (searchName) {
                const targetProjects = allProjects.filter(p => p.name.toLowerCase().includes(searchName));
                if (targetProjects.length > 0) {
                    conditions.push(task => targetProjects.some(p => p.id === task.projectId));
                    return;
                }
            }
        }

        // 2. ラベル検索 (@LabelName)
        if (term.startsWith('@')) {
            const searchName = term.substring(1).toLowerCase();
            if (searchName) {
                const targetLabels = allLabels.filter(l => l.name.toLowerCase().includes(searchName));
                if (targetLabels.length > 0) {
                    conditions.push(task => task.labelIds && targetLabels.some(l => task.labelIds.includes(l.id)));
                    return;
                }
            }
        }

        // 3. 日付キーワード検索
        const today = new Date();
        today.setHours(0,0,0,0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (['今日', 'today'].includes(lowerTerm)) {
            conditions.push(task => {
                if (!task.dueDate) return false;
                const d = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
                d.setHours(0,0,0,0);
                return d.getTime() === today.getTime();
            });
            return;
        }
        if (['明日', 'tomorrow'].includes(lowerTerm)) {
            conditions.push(task => {
                if (!task.dueDate) return false;
                const d = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
                d.setHours(0,0,0,0);
                return d.getTime() === tomorrow.getTime();
            });
            return;
        }
        if (['期限切れ', '延滞', 'overdue'].includes(lowerTerm)) {
            conditions.push(task => {
                if (!task.dueDate || task.status === 'completed') return false;
                const d = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
                // 時間比較のため厳密には現在時刻と比較
                return d < new Date(); 
            });
            return;
        }
        if (['期限なし', 'no date', 'no due date'].includes(lowerTerm)) {
            conditions.push(task => !task.dueDate);
            return;
        }

        // 4. 通常キーワード検索 (タイトル or メモ)
        conditions.push(task => 
            task.title.toLowerCase().includes(lowerTerm) || 
            (task.description && task.description.toLowerCase().includes(lowerTerm))
        );
    });

    return conditions;
}

// フィルタリングとソートの実行
function applyFilter() {
    // 検索条件のパース
    const queryConditions = parseQuery(currentFilter.searchQuery);

    let filtered = tasks.filter(t => {
        // 1. 完了済みフィルタ
        if (!currentFilter.showCompleted && t.status === 'completed') return false;

        // 2. プロジェクトフィルタ (サイドバー選択)
        if (currentFilter.projectId !== 'all') {
            if (currentFilter.projectId === null) {
                if (t.projectId) return false; // Inbox選択時
            } else {
                if (t.projectId !== currentFilter.projectId) return false;
            }
        }

        // 3. ラベルフィルタ (サイドバー選択)
        if (currentFilter.labelId) {
            if (!t.labelIds || !t.labelIds.includes(currentFilter.labelId)) return false;
        }

        // 4. 検索クエリフィルタ (AND条件)
        if (queryConditions.length > 0) {
            // 全ての条件を満たすかチェック
            const matchAll = queryConditions.every(cond => cond(t));
            if (!matchAll) return false;
        }

        return true;
    });

    // ソート
    filtered.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);

        switch (currentFilter.sort) {
            case 'created_asc': return dateA - dateB;
            case 'due_asc': 
                const dueA = a.dueDate ? (a.dueDate.toDate ? a.dueDate.toDate() : new Date(a.dueDate)) : new Date(9999,11,31);
                const dueB = b.dueDate ? (b.dueDate.toDate ? b.dueDate.toDate() : new Date(b.dueDate)) : new Date(9999,11,31);
                return dueA - dueB;
            
            // ★追加: プロジェクト名順
            case 'project_asc':
                const pNameA = getProjectName(a.projectId);
                const pNameB = getProjectName(b.projectId);
                // Inbox(空文字)は最後にするか最初にするか...ここでは最後にします
                if (!pNameA) return 1;
                if (!pNameB) return -1;
                return pNameA.localeCompare(pNameB, 'ja');

            case 'created_desc':
            default: return dateB - dateA;
        }
    });

    notifyListeners(filtered, currentFilter);
}

// ヘルパー: プロジェクト名取得
function getProjectName(pid) {
    if (!pid) return '';
    const p = allProjects.find(proj => proj.id === pid);
    return p ? p.name : '';
}

export function subscribeTasks(userId, callback) {
    notifyListeners = callback;
    
    // フィルタリングのためにプロジェクトとラベルの情報も常に最新を持っておく
    subscribeProjects(userId, (projs) => {
        allProjects = projs;
        applyFilter(); // プロジェクト名が変わったらソート順変わるかもなので再適用
    });
    
    subscribeLabels(userId, (lbls) => {
        allLabels = lbls;
        applyFilter();
    });

    const q = query(getTaskCollectionRef(userId), orderBy("createdAt", "desc"));
    
    return onSnapshot(q, (snapshot) => {
        tasks = [];
        snapshot.forEach(doc => {
            tasks.push({ id: doc.id, ...doc.data() });
        });
        applyFilter();
    });
}