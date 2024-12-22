// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))


const usersKey = 'users';
const currentUserKey = 'currentUser';
const diaryEntriesKey = 'diaryEntries';

// ユーザー管理機能
function getUsers() {
    return JSON.parse(localStorage.getItem(usersKey)) || [];
}

function saveUsers(users) {
    localStorage.setItem(usersKey, JSON.stringify(users));
}

function setCurrentUser(username) {
    localStorage.setItem(currentUserKey, username);
}

function getCurrentUser() {
    return localStorage.getItem(currentUserKey);
}

// 新規登録
document.getElementById('register-form').addEventListener('submit', (event) => {
    event.preventDefault(); // フォームのデフォルト送信を防ぐ

    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const users = getUsers();

    // ユーザー名がすでに存在するかチェック
    if (users.some(user => user.username === username)) {
        alert('このユーザー名は既に登録されています。');
        return;
    }

    // 新規ユーザーの追加
    users.push({ username, password });
    saveUsers(users);

    alert('登録が完了しました！ログインしてください。');
    document.getElementById('register-form').reset(); // フォームをリセット
    showLoginSection(); // ログインフォームに切り替え
});

// ログイン
document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault(); // フォームのデフォルト送信を防ぐ

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const users = getUsers();

    // ユーザー名とパスワードを照合
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        alert('ユーザー名またはパスワードが間違っています。');
        return;
    }

    setCurrentUser(username);
    alert(`${username}さん、ログインしました！`);
    showDiarySection(); // 日記セクションに切り替え
});

// 日記作成
document.getElementById('diary-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const date = document.getElementById('date').value.trim();
    const content = document.getElementById('content').value.trim();

    // 入力チェック（例: 空白のタイトルや内容は保存しない）
    if (!title || !content) {
        alert('タイトルと内容は必須です。');
        return;
    }

    const entries = JSON.parse(localStorage.getItem(diaryEntriesKey)) || [];
    entries.push({ title, date, content });
    localStorage.setItem(diaryEntriesKey, JSON.stringify(entries));

    document.getElementById('diary-form').reset();
    loadDiaryEntries();
});

// 日記一覧のロード
function loadDiaryEntries() {
    const entries = JSON.parse(localStorage.getItem(diaryEntriesKey)) || [];
    const diaryList = document.getElementById('diary-list');
    diaryList.innerHTML = '';

    entries.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.date} - ${entry.title}`;
        listItem.style.cursor = 'pointer';

        listItem.addEventListener('click', () => {
            showDiaryDetail(entry);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteEntry(index);
        });

        listItem.appendChild(deleteButton);
        diaryList.appendChild(listItem);
    });
}

function showDiaryDetail(entry) {
    const modal = document.getElementById('diary-modal');
    document.getElementById('modal-title').textContent = entry.title;
    document.getElementById('modal-date').textContent = entry.date;
    document.getElementById('modal-content').textContent = entry.content;

    modal.style.display = 'block';
}

function closeDiaryDetail() {
    const modal = document.getElementById('diary-modal');
    modal.style.display = 'none';
}

function deleteEntry(index) {
    const entries = JSON.parse(localStorage.getItem(diaryEntriesKey)) || [];
    entries.splice(index, 1);
    localStorage.setItem(diaryEntriesKey, JSON.stringify(entries));
    loadDiaryEntries();
}

// セクション切り替え
function showDiarySection() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('diary-section').style.display = 'block';

    loadDiaryEntries();
}

function showLoginSection() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('diary-section').style.display = 'none';
}

function showRegisterSection() {
    document.getElementById('register-section').style.display = 'block';
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('diary-section').style.display = 'none';
}

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
        showDiarySection(); // ログイン済みなら日記セクションを表示
    } else {
        showRegisterSection(); // 初回は新規登録フォームを表示
    }

    document.getElementById('close-modal').addEventListener('click', closeDiaryDetail);
});

