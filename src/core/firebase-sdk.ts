// Firebase SDK Wrapper
// インポート元をこのファイルに集約し、プロジェクト内でのバージョン不整合や二重ロードを防止
// TypeScript化に伴い、CDN importを廃止してnpmパッケージを使用

// --- 認証 (Authentication) ---
export {
    EmailAuthProvider, getAuth, linkWithCredential, onAuthStateChanged,
    signInAnonymously, signInWithCustomToken, signInWithEmailAndPassword, signOut, updatePassword, type User,
    type UserCredential
} from "firebase/auth";

// --- Firestore (Database) ---
export {
    Timestamp, addDoc, collection, deleteDoc, doc, getDoc,
    getDocs, getFirestore, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch, type FirestoreError, type Query, type QuerySnapshot, type Unsubscribe
} from "firebase/firestore";

// --- アプリケーション (App) ---
export { initializeApp } from "firebase/app";

