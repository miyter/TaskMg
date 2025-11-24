// --- 検索・フィルタリング・ソートロジック (完全版) ---
// 役割: Todoist風の高度なクエリ解析とソート処理を提供

// ヘルパー: プロジェクト名取得
function getProjectName(pid, allProjects) {
    if (!pid) return '';
    const p = allProjects.find(proj => proj.id === pid);
    return p ? p.name : '';
}

// 日付解析ヘルパー
function parseDateKeyword(keyword) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const keywordLower = keyword.toLowerCase();

    // 相対日付
    if (['今日', 'today'].includes(keywordLower)) {
        return { start: today, end: today };
    }
    if (['明日', 'tomorrow'].includes(keywordLower)) {
        return { start: tomorrow, end: tomorrow };
    }
    
    // "X日以内" (今日からX日後まで)
    const withinMatch = keywordLower.match(/^(\d+)日以内$/);
    if (withinMatch) {
        const days = parseInt(withinMatch[1], 10);
        const end = new Date(today);
        end.setDate(today.getDate() + days);
        return { start: today, end: end }; // 今日〜X日後
    }

    return null;
}

// クエリ解析 (Todoist風)
export function parseQuery(query, allProjects, allLabels) {
    if (!query) return [];
    
    // スペースで分割してAND条件として扱う
    // (括弧やORの完全なサポートは今後の課題とし、まずはスペース区切りANDを実装)
    const terms = query.trim().split(/\s+/);
    const conditions = [];

    terms.forEach(term => {
        const lowerTerm = term.toLowerCase();

        // 1. プロジェクト検索 (#ProjectName)
        if (term.startsWith('#')) {
            const searchName = term.substring(1).toLowerCase();
            if (searchName) {
                // 部分一致でプロジェクトを探す
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
            
            // @me (自分) の特別対応
            if (searchName === 'me' || searchName === '自分') {
                // 今回は担当者機能がないため、便宜上「自分のタスク＝全て」または特定ラベルとするが、
                // ここでは「ラベル名がme」または「ユーザーID一致」などを想定
                // 簡易的にラベル検索として処理
            }

            if (searchName) {
                const targetLabels = allLabels.filter(l => l.name.toLowerCase().includes(searchName));
                if (targetLabels.length > 0) {
                    conditions.push(task => task.labelIds && targetLabels.some(l => task.labelIds.includes(l.id)));
                    return;
                }
            }
        }

        // 3. 優先度 (p1, p2...) - 今回のデータ構造にはないが、もしあればここで対応
        // if (lowerTerm.match(/^p[1-4]$/)) { ... }

        // 4. 日付キーワード検索
        const dateRange = parseDateKeyword(lowerTerm);
        if (dateRange) {
            conditions.push(task => {
                if (!task.dueDate) return false;
                const d = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
                d.setHours(0, 0, 0, 0);
                return d >= dateRange.start && d <= dateRange.end;
            });
            return;
        }

        // 特殊キーワード
        if (['期限切れ', '延滞', 'overdue'].includes(lowerTerm)) {
            conditions.push(task => {
                if (!task.dueDate || task.status === 'completed') return false;
                const d = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
                return d < new Date(); // 現在時刻より前
            });
            return;
        }
        if (['期限なし', 'no date', 'no due date'].includes(lowerTerm)) {
            conditions.push(task => !task.dueDate);
            return;
        }
        if (['完了済み', 'completed'].includes(lowerTerm)) {
             // 完了タスクを表示するフラグのような役割（フィルタリング関数側で考慮が必要だが、ここでは条件として追加）
             conditions.push(task => task.status === 'completed');
             return;
        }


        // 5. 通常キーワード検索 (タイトル or メモ)
        conditions.push(task => 
            task.title.toLowerCase().includes(lowerTerm) || 
            (task.description && task.description.toLowerCase().includes(lowerTerm))
        );
    });

    return conditions;
}

// フィルタリングとソートの実行関数
export function processTasks(tasks, filterState, allProjects, allLabels) {
    // 1. クエリパース
    const queryConditions = parseQuery(filterState.searchQuery, allProjects, allLabels);

    // 2. フィルタリング
    let filtered = tasks.filter(t => {
        // 基本フィルタ: 完了済み
        // クエリに「完了済み」が含まれていれば、showCompletedに関わらず表示するロジックも考えられるが、
        // ここではUIのトグルスイッチを優先
        if (!filterState.showCompleted && t.status === 'completed') return false;

        // プロジェクトフィルタ (サイドバー)
        if (filterState.projectId !== 'all') {
            if (filterState.projectId === null) {
                if (t.projectId) return false; // Inbox
            } else {
                if (t.projectId !== filterState.projectId) return false;
            }
        }

        // ラベルフィルタ (サイドバー)
        if (filterState.labelId) {
            if (!t.labelIds || !t.labelIds.includes(filterState.labelId)) return false;
        }

        // 検索クエリフィルタ (AND条件)
        if (queryConditions.length > 0) {
            const matchAll = queryConditions.every(cond => cond(t));
            if (!matchAll) return false;
        }

        return true;
    });

    // 3. ソート
    filtered.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);

        switch (filterState.sort) {
            case 'created_asc': return dateA - dateB;
            case 'due_asc': 
                // 期限なし(null)は最後に送る
                const valA = a.dueDate ? (a.dueDate.toDate ? a.dueDate.toDate() : new Date(a.dueDate)).getTime() : Number.MAX_SAFE_INTEGER;
                const valB = b.dueDate ? (b.dueDate.toDate ? b.dueDate.toDate() : new Date(b.dueDate)).getTime() : Number.MAX_SAFE_INTEGER;
                return valA - valB;
            
            case 'project_asc': // ★追加: プロジェクト名順
                const pNameA = getProjectName(a.projectId, allProjects);
                const pNameB = getProjectName(b.projectId, allProjects);
                // Inbox (名前なし) は最後にする
                if (!pNameA && pNameB) return 1;
                if (pNameA && !pNameB) return -1;
                if (!pNameA && !pNameB) return 0;
                return pNameA.localeCompare(pNameB, 'ja');

            case 'created_desc':
            default: return dateB - dateA;
        }
    });

    return filtered;
}