// Firebase SDK Wrapper
// 全てのFirebase SDKインポートをここで一元管理し、二重読み込みを防ぐ

// Authentication
import { 
    getAuth, 
    signInWithCustomToken, 
    signInAnonymously, 
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    updatePassword // 👈 追加: ビルドエラー修正
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Firestore
import { 
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

// App
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

// Export all needed functions
export {
    // App
    initializeApp,
    
    // Auth
    getAuth,
    signInWithCustomToken,
    signInAnonymously,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    updatePassword, // 👈 追加: エクスポート漏れ修正

    // Firestore
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
};