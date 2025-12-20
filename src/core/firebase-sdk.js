// @miyter:20251221
// Firebase SDK Wrapper
// インポート元をこのファイルに集約し、プロジェクト内でのバージョン不整合や二重ロードを防止

// --- Authentication ---
export { 
    getAuth, 
    signInWithCustomToken, 
    signInAnonymously, 
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    updatePassword 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// --- Firestore ---
export { 
    getFirestore, 
    collection, 
    doc, 
    addDoc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    getDoc, 
    getDocs, 
    onSnapshot, 
    query, 
    where, 
    orderBy, 
    limit, 
    serverTimestamp,
    Timestamp,
    writeBatch
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- App ---
export { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";