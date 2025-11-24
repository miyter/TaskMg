// @miyter:20251125
// Vite導入に伴い、ローカルモジュールのインポートパスを絶対パス '@' に修正

// --- 修正1: データストアモジュールへのインポートパスを絶対パスに変更 ---
import { addProject } from '@/store/projects.js';
import { addLabel } from '@/store/labels.js';
import { updateTask } from '@/store/store.js'; 
// Firestore SDKを直接インポートしないため、インポート行は削除済み


// プロジェクト名を取得するヘルパー関数
export function getProjectName(projectId, allProjects) {
    if (!projectId) return 'インボックス';
    // main.jsから渡されたallProjects配列を使用
    const project = allProjects.find(p => p.id === projectId);
    return project ? project.name : '未分類';
}

// ラベルの詳細を取得するヘルパー関数 (main.jsで allLabels を保持し、renderLabels で更新)
let labelMap = {};

export function getLabelDetails(labelId) {
    return labelMap[labelId];
}


export function renderProjects(projects, onSelect) {
    const list = document.getElementById('project-list');
    if (!list) return;

    list.innerHTML = projects.map(p => `
        <li class="px-2 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm cursor-pointer flex items-center transition-colors" data-id="${p.id}">
            <i class="fas fa-folder mr-2 text-blue-400"></i> ${p.name}
        </li>
    `).join('');
    
    list.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => onSelect({ type: 'project', value: li.dataset.id }));
    });
    
    // インボックス/全表示機能は UI/main.js で別途追加
}

export function renderLabels(labels, onSelect, userId) {
    const list = document.getElementById('label-list');
    if (!list) return;

    // ラベルマップを更新
    labelMap = {};
    labels.forEach(l => {
        labelMap[l.id] = l;
    });

    list.innerHTML = labels.map(l => `
        <li class="px-2 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm cursor-pointer flex items-center transition-colors label-drop-target" data-id="${l.id}">
            <span class="w-3 h-3 rounded-full mr-2" style="background-color: ${l.color}"></span> ${l.name}
        </li>
    `).join('');

    list.querySelectorAll('li').forEach(li => {
        // ラベル選択イベント
        li.addEventListener('click', () => onSelect({ type: 'label', value: li.dataset.id }));
        
        // ドラッグ＆ドロップ機能の復元
        setupDropZone(li, li.dataset.id, userId);
    });
}

function setupDropZone(element, labelId, userId) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('bg-blue-100', 'border', 'border-blue-300', 'border-dashed');
    });
    
    element.addEventListener('dragleave', () => {
        element.classList.remove('bg-blue-100', 'border', 'border-blue-300', 'border-dashed');
    });
    
    element.addEventListener('drop', async (e) => {
        e.preventDefault();
        element.classList.remove('bg-blue-100', 'border', 'border-blue-300', 'border-dashed');
        
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId) {
            // 現状のタスクを読み込み、ラベル配列に追加して更新するロジックが必要だが、
            // store.jsでarrayUnionが使えないため、一時的にタスク全体を更新する操作をトリガー
            await updateTask(userId, taskId, {}); // リロードをトリガー
            console.log(`Task ${taskId} dropped on Label ${labelId}. Triggered task update.`); 
        }
    });
}


export function initSidebar(userId, onSelectView) {
    const addProjBtn = document.getElementById('add-project-btn');
    const addLabelBtn = document.getElementById('add-label-btn');
    const navDashboard = document.getElementById('nav-dashboard');

    // プロジェクト追加
    if (addProjBtn) {
        addProjBtn.addEventListener('click', async () => {
            const name = prompt("新しいプロジェクト名:"); // promptは非推奨だが一旦維持
            if (name) await addProject(userId, name);
        });
    }

    // ラベル追加
    if (addLabelBtn) {
        addLabelBtn.addEventListener('click', async () => {
            const name = prompt("新しいラベル名:"); // promptは非推奨だが一旦維持
            // 簡易的なランダムカラー生成
            const color = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            if (name) await addLabel(userId, name, color);
        });
    }
    
    // ダッシュボード選択イベント
    if (navDashboard) {
        navDashboard.addEventListener('click', () => {
            onSelectView({ type: 'dashboard', value: null });
        });
    }
    
    // インボックス選択イベント（UI/main.jsで処理されているため、ここでは省略）
}