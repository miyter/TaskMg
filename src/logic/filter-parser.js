// @ts-nocheck
/**
 * Todoist風カスタムフィルターパーサー
 * 文字列クエリを解析し、タスクが条件に合致するか判定する関数を返します。
 */

// =========================================================
// 1. トークナイザー (字句解析)
// =========================================================

const TOKENS = {
    AND: '&',
    OR: '|',
    NOT: '!',
    LPAREN: '(',
    RPAREN: ')',
};

const KEYWORDS = {
    TODAY: ['今日', 'today'],
    TOMORROW: ['明日', 'tomorrow'],
    YESTERDAY: ['昨日', 'yesterday'],
    OVERDUE: ['期限切れ', 'overdue'],
    NO_DATE: ['期限なし', 'no date', 'nodate'],
    NEXT_DAYS: /^次の(\d+)日間/,
};

/**
 * クエリ文字列をトークン配列に分解する
 */
function tokenize(query) {
    const tokens = [];
    let i = 0;
    
    // 空白処理用
    query = query.trim();

    while (i < query.length) {
        const char = query[i];

        if (/\s/.test(char)) {
            i++;
            continue;
        }

        if (char === '&' || char === '|') {
            tokens.push({ type: 'OPERATOR', value: char });
            i++;
            continue;
        }
        
        if (char === '!') {
            tokens.push({ type: 'NOT', value: char });
            i++;
            continue;
        }

        if (char === '(' || char === ')') {
            tokens.push({ type: char === '(' ? 'LPAREN' : 'RPAREN', value: char });
            i++;
            continue;
        }

        // キーワード、日付、プロジェクト(#)、ラベル(@)、検索語の抽出
        // 演算子や括弧、スペースが出るまでを1つの塊とする
        let value = '';
        while (i < query.length && !['&', '|', '!', '(', ')', ' '].includes(query[i])) {
            value += query[i];
            i++;
        }
        
        if (value) {
            tokens.push({ type: 'TERM', value: value });
        }
    }
    return tokens;
}

// =========================================================
// 2. パーサー (構文解析 - 逆ポーランド記法への変換)
// =========================================================

const PRECEDENCE = {
    '!': 3,
    '&': 2,
    '|': 1,
    '(': 0
};

/**
 * 中置記法のトークン列を後置記法(RPN)に変換 (操車場アルゴリズム簡略版)
 */
function toRPN(tokens) {
    const outputQueue = [];
    const operatorStack = [];

    // 暗黙のAND補完 (例: "@a @b" -> "@a & @b")
    // トークン間で TERM同士、あるいは ) と TERM などが連続する場合に & を挿入する処理は省略（Todoistはスペース=AND）
    // 今回はシンプルに明示的な演算子のみを扱うが、スペースをANDとするならここでトークン加工が必要

    tokens.forEach(token => {
        if (token.type === 'TERM') {
            outputQueue.push(token);
        } else if (token.type === 'NOT') {
            operatorStack.push(token);
        } else if (token.type === 'OPERATOR') {
            while (
                operatorStack.length > 0 &&
                operatorStack[operatorStack.length - 1].type !== 'LPAREN' &&
                PRECEDENCE[operatorStack[operatorStack.length - 1].value] >= PRECEDENCE[token.value]
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        } else if (token.type === 'LPAREN') {
            operatorStack.push(token);
        } else if (token.type === 'RPAREN') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type !== 'LPAREN') {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop(); // '(' を捨てる
        }
    });

    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
}

// =========================================================
// 3. 評価器 (条件判定)
// =========================================================

/**
 * 単一の条件（TERM）を評価する関数
 */
function evaluateTerm(task, term, allProjects = [], allLabels = []) {
    const lowerTerm = term.toLowerCase();

    // ラベル検索 (@)
    if (term.startsWith('@')) {
        const labelName = term.substring(1).toLowerCase();
        if (!task.labelIds || task.labelIds.length === 0) return false;
        // ラベルIDから名前を引いて一致判定が必要だが、
        // ここでは簡易的に allLabels を使って名前マッチを探す
        const targetLabels = allLabels.filter(l => l.name.toLowerCase().includes(labelName));
        const targetIds = targetLabels.map(l => l.id);
        return task.labelIds.some(id => targetIds.includes(id));
    }

    // プロジェクト検索 (#)
    if (term.startsWith('#')) {
        const projName = term.substring(1).toLowerCase();
        if (!task.projectId) return false;
        const project = allProjects.find(p => p.id === task.projectId);
        return project && project.name.toLowerCase().includes(projName);
    }

    // 優先度 (p1-p4) - Todoist: p1=4(High), p4=1(Normal) だが、ここでは p1=1 と仮定
    if (/^p[1-4]$/.test(lowerTerm)) {
        // DB設計次第だが、task.priority があると仮定
        // const priority = parseInt(lowerTerm.charAt(1));
        // return task.priority === priority;
        return false; // 未実装
    }

    // 日付判定
    const today = new Date();
    today.setHours(0,0,0,0);
    
    let taskDate = null;
    if (task.dueDate) {
        taskDate = new Date(task.dueDate);
        taskDate.setHours(0,0,0,0);
    }

    // 期限なし
    if (KEYWORDS.NO_DATE.includes(lowerTerm)) {
        return !task.dueDate;
    }

    // 日付がないタスクはこれ以降の期限判定でfalse
    if (!taskDate) return false;

    // 今日
    if (KEYWORDS.TODAY.includes(lowerTerm)) {
        return taskDate.getTime() === today.getTime();
    }
    // 明日
    if (KEYWORDS.TOMORROW.includes(lowerTerm)) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return taskDate.getTime() === tomorrow.getTime();
    }
    // 昨日
    if (KEYWORDS.YESTERDAY.includes(lowerTerm)) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return taskDate.getTime() === yesterday.getTime();
    }
    // 期限切れ
    if (KEYWORDS.OVERDUE.includes(lowerTerm)) {
        return taskDate.getTime() < today.getTime();
    }
    // 次のX日間 (正規表現)
    const nextDaysMatch = term.match(KEYWORDS.NEXT_DAYS);
    if (nextDaysMatch) {
        const days = parseInt(nextDaysMatch[1]);
        const endDay = new Date(today);
        endDay.setDate(endDay.getDate() + days);
        return taskDate.getTime() >= today.getTime() && taskDate.getTime() <= endDay.getTime();
    }

    // テキスト検索 (タイトル or 説明)
    return (task.title && task.title.toLowerCase().includes(lowerTerm)) || 
           (task.description && task.description.toLowerCase().includes(lowerTerm));
}

/**
 * クエリに基づいてタスクをフィルタリングする関数を生成
 * @param {string} queryString 
 * @param {Array} allProjects 
 * @param {Array} allLabels 
 * @returns {Function} (task) => boolean
 */
export function createFilter(queryString, allProjects = [], allLabels = []) {
    if (!queryString) return () => true;

    try {
        const tokens = tokenize(queryString);
        const rpn = toRPN(tokens);

        return (task) => {
            const stack = [];

            rpn.forEach(token => {
                if (token.type === 'TERM') {
                    stack.push(evaluateTerm(task, token.value, allProjects, allLabels));
                } else if (token.type === 'NOT') {
                    const a = stack.pop();
                    stack.push(!a);
                } else if (token.type === 'OPERATOR') {
                    const b = stack.pop();
                    const a = stack.pop();
                    if (token.value === '&') {
                        stack.push(a && b);
                    } else if (token.value === '|') {
                        stack.push(a || b);
                    }
                }
            });

            return stack.length > 0 ? stack[0] : true;
        };
    } catch (e) {
        console.error("Filter parse error:", e);
        return () => false; // エラー時は何も表示しない
    }
}