import { 
    getFirestore, 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    addDoc, 
    updateDoc, 
    doc, 
    serverTimestamp,
    getDocs,
    limit
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// グローバル変数からアプリID取得 (修正: GLOBAL_APP_IDを優先)
const appId = (typeof window !== 'undefined' && window.GLOBAL_APP_ID) 
    ? window.GLOBAL_APP_ID 
    : (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');

const db = getFirestore();
const auth = getAuth();

const STORAGE_KEY = 'currentWorkspaceId';
const CHANGE_EVENT = 'workspace-changed';
const COLLECTION_NAME = 'workspaces';

// 初期値を空関数に変更（安全のため）
let unsubscribe = () => {};
let _workspaces = [];

/**
 * 現在キャッシュされているワークスペース一覧を取得
 * @returns {Array}
 */
export function getWorkspaces() {
    return _workspaces;
}

/**
 * ワークスペース一覧をリアルタイム購読する
 * @param {Function} onUpdate - 更新時に呼ばれるコールバック (workspaces) => void
 */
export function subscribeToWorkspaces(onUpdate) {
    const user = auth.currentUser;
    if (!user) {
        console.warn('subscribeToWorkspaces: User not authenticated');
        onUpdate([]);
        return () => {};
    }

    // 既存の購読があれば解除
    if (unsubscribe) {
        unsubscribe();
    }

    const collRef = collection(db, 'artifacts', appId, 'users', user.uid, COLLECTION_NAME);
    const q = query(collRef, orderBy('createdAt', 'asc'));

    unsubscribe = onSnapshot(q, async (snapshot) => {
        const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        _workspaces = items;

        // 初期化ロジック: ワークスペースが0個の場合、デフォルトを作成
        if (items.length === 0 && !snapshot.metadata.hasPendingWrites) {
            await ensureDefaultWorkspace(onUpdate);
        } else {
            // 現在のIDが有効かチェック
            validateCurrentWorkspace(items);
            onUpdate(items);
        }
    }, (error) => {
        console.error("Error subscribing to workspaces:", error);
        onUpdate([]);
    });

    return unsubscribe;
}

/**
 * デフォルトのワークスペースを作成し、選択状態にする
 * 作成完了後、即座にUI更新コールバックを呼ぶ
 */
async function ensureDefaultWorkspace(onUpdate) {
    try {
        const user = auth.currentUser;
        if (!user) return;
        
        // 重複作成を防ぐために一度getして確認（onSnapshotのラグ対策）
        const collRef = collection(db, 'artifacts', appId, 'users', user.uid, COLLECTION_NAME);
        const snapshot = await getDocs(query(collRef, limit(1)));
        
        if (snapshot.empty) {
            console.log('Creating default workspace...');
            // addWorkspaceがオブジェクトを返すようになったので受け取る
            const newWorkspace = await addWorkspace('メイン');
            
            // イベント発火とID保存
            setCurrentWorkspaceId(newWorkspace.id);
            
            // UIを即座に更新（Snapshotの再発火を待たずに反映）
            _workspaces = [newWorkspace];
            if (onUpdate) onUpdate(_workspaces);
        }
    } catch (err) {
        console.error('Failed to ensure default workspace:', err);
    }
}

/**
 * 現在選択中のワークスペースIDが一覧に含まれているか確認し、
 * 存在しない場合は先頭のワークスペースを選択する
 */
function validateCurrentWorkspace(items) {
    const currentId = getCurrentWorkspaceId();
    if (items.length > 0) {
        const exists = items.find(w => w.id === currentId);
        // IDがない、または削除されていた場合は先頭を選択
        // setCurrentWorkspaceId内で変更イベントが発火される
        if (!currentId || !exists) {
            console.log('Current workspace invalid or missing, resetting to default.');
            setCurrentWorkspaceId(items[0].id);
        }
    }
}

/**
 * 現在のワークスペースIDを取得
 * @returns {string|null}
 */
export function getCurrentWorkspaceId() {
    return localStorage.getItem(STORAGE_KEY);
}

/**
 * 現在のワークスペースIDを設定し、変更イベントを発火
 * @param {string} id 
 */
export function setCurrentWorkspaceId(id) {
    if (!id) return;
    
    const oldId = localStorage.getItem(STORAGE_KEY);
    if (oldId === id) return; // 変更なし

    localStorage.setItem(STORAGE_KEY, id);
    
    // イベント発火 (validateCurrentWorkspace等からの呼び出しでもこれで通知される)
    const event = new CustomEvent(CHANGE_EVENT, { 
        detail: { workspaceId: id } 
    });
    document.dispatchEvent(event);
    
    console.log(`Workspace changed to: ${id}`);
}

/**
 * 新規ワークスペースを追加
 * @param {string} name 
 * @returns {Promise<Object>} 作成されたワークスペースオブジェクト {id, ...data}
 */
export async function addWorkspace(name) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const collRef = collection(db, 'artifacts', appId, 'users', user.uid, COLLECTION_NAME);
    
    const newDocData = {
        name: name,
        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collRef, newDocData);
    
    // IDを含めた完全なオブジェクトを返す
    return {
        id: docRef.id,
        ...newDocData
    };
}

/**
 * ワークスペース名を変更
 * @param {string} id 
 * @param {string} newName 
 */
export async function updateWorkspaceName(id, newName) {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, COLLECTION_NAME, id);
    
    await updateDoc(docRef, {
        name: newName
    });
}