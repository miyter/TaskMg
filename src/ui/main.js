import '../index.css';
// アプリケーションのエントリーポイント
import { initializeApp } from './app.js';

// DOMの読み込み完了を待ってアプリを開始
document.addEventListener('DOMContentLoaded', () => {
    console.log('Main: DOMContentLoaded');

    // ファビコンを動的に設定
    const setFavicon = () => {
        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.type = 'image/png';
        link.href = 'public/images/favicon-96x96.png';
    };
    setFavicon();

    initializeApp();
});