// 作成日: 2025-11-25
// 役割: 認証に関連するUIの表示切り替えを担当

const loginFormContainer = document.getElementById('login-form-container');
const userInfoDiv = document.getElementById('user-info');
const userDisplayNameSpan = document.getElementById('user-display-name');
const loginErrorMessage = document.getElementById('login-error-message');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');

export function updateAuthUI(user) {
    if (user) {
        const displayName = user.email || "ユーザー";
        loginFormContainer.classList.add('hidden');
        userInfoDiv.classList.remove('hidden');
        userDisplayNameSpan.textContent = displayName;
    } else {
        loginFormContainer.classList.remove('hidden');
        userInfoDiv.classList.add('hidden');
    }
}

export function showLoginError(message) {
    if (loginErrorMessage) loginErrorMessage.textContent = message;
}

export function clearLoginError() {
    if (loginErrorMessage) loginErrorMessage.textContent = '';
}

export function clearAuthInputs() {
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
}

export function getAuthInputValues() {
    return {
        email: emailInput ? emailInput.value : '',
        password: passwordInput ? passwordInput.value : ''
    };
}