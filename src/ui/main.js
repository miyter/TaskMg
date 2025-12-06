import '../index.css';
// アプリケーションのエントリーポイント
import { initializeApp } from './app.js';

// DOMの読み込み完了を待ってアプリを開始
document.addEventListener('DOMContentLoaded', () => {
    console.log('Main: DOMContentLoaded');
    initializeApp();
});