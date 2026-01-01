// Firebase SDK Wrapper
// インポート元をこのファイルに集約し、プロジェクト内でのバージョン不整合や二重ロードを防止
// TypeScript化に伴い、CDN importを廃止してnpmパッケージを使用

// --- 認証 (Authentication) ---
export {
    getAuth, onAuthStateChanged,
    signInWithCustomToken, signInWithEmailAndPassword, signOut, updatePassword,
    type User,
    type UserCredential
} from "firebase/auth";

// --- Firestore (Database) ---
export {
    addDoc, collection, deleteDoc, doc, getDoc,
    getDocs, getFirestore, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc, where, writeBatch,
    type Unsubscribe
} from "firebase/firestore";

// --- アプリケーション (App) ---
export { initializeApp } from "firebase/app";

