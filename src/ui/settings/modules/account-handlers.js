import { auth } from '../../../core/firebase';
import { updateUserPassword } from '../../auth.js';
import { signOut } from '../../../core/firebase-sdk'; // 修正: firebase-sdk から signOut を取得
import { showMessageModal } from '../../components';

export function setupPasswordHandler() {
    const btn = document.getElementById('update-password-btn-new');
    const input = document.getElementById('new-password-input-new');
    if (!btn || !input) return;

    btn.onclick = async () => {
        const pass = input.value.trim();
        if (pass.length < 6) return showMessageModal({ message: "6文字以上入力してくれ", type: 'error' });

        try {
            await updateUserPassword(pass);
            input.value = '';
            showMessageModal({ message: "パスワードを変更しました", type: 'success' });
        } catch (err) { }
    };
}

export function setupLogoutHandler(closeModal) {
    document.getElementById('logout-btn-settings')?.addEventListener('click', async () => {
        try {
            await signOut(auth);
            closeModal();
        } catch (err) {
            showMessageModal({ message: "エラーが発生した", type: 'error' });
        }
    });
}
