// Firebase SDK Wrapper
// インポート元をこのファイルに集約し、プロジェクト内でのバージョン不整合や二重ロードを防止
// TypeScript化に伴い、CDN importを廃止してnpmパッケージを使用

// --- Authentication ---
export {
    EmailAuthProvider, deleteUser, getAuth, linkWithCredential, onAuthStateChanged, signInAnonymously,
    signInWithCustomToken, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, updateProfile,
    type User,
    type UserCredential
} from "firebase/auth";

// --- Firestore ---
export {
    Timestamp, addDoc, collection, deleteDoc, doc, getDoc,
    getDocs, getFirestore, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch,
    type Unsubscribe
} from "firebase/firestore";

// --- App ---
export { initializeApp } from "firebase/app";

