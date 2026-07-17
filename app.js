class BudgetManager {
    constructor(username) {
        this.storageKey = `transactions_${username}`;
        this.transactions = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }
    add(desc, amount, type) {
        const val = type === 'income' ? Math.abs(amount) : -Math.abs(amount);
        this.transactions.push({ id: Date.now(), desc, amount: val });
        localStorage.setItem(this.storageKey, JSON.stringify(this.transactions));
    }
}

let manager;

// Inisialisasi user jika sudah login sebelumnya
const savedUser = localStorage.getItem('currentUser');
if (savedUser) manager = new BudgetManager(savedUser);

function showPage(page) {
    const content = document.getElementById('content');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn && page !== 'login') page = 'login';

    if (page === 'login') {
        content.innerHTML = `
            <div class="card">
                <h3>Login</h3>
                <input id="username" placeholder="Masukkan nama pengguna">
                <button onclick="handleLogin()">Masuk</button>
            </div>`;
    } else if (page === 'dashboard') {
        const total = manager.transactions.reduce((acc, t) => acc + t.amount, 0);
        content.innerHTML = `
            <div class="card" style="text-align:center">
                <h2>Saldo ${localStorage.getItem('currentUser')}</h2>
                <h1>Rp ${total.toLocaleString('id-ID')}</h1>
                <button onclick="handleLogout()" class="btn-delete">Logout</button>
            </div>`;
    } else if (page === 'transaction') {
        content.innerHTML = `
            <div class="card">
                <h3>Tambah Transaksi</h3>
                <input id="desc" placeholder="Keterangan">
                <input id="amt" type="number" placeholder="Nominal">
                <select id="type"><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option></select>
                <button onclick="handleSave()">Simpan Transaksi</button>
            </div>
            <div class="card"><ul id="list" style="list-style:none; padding:0"></ul></div>`;
        renderList();
    }
}

function handleLogin() {
    const user = document.getElementById('username').value;
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', user);
        manager = new BudgetManager(user);
        showPage('dashboard');
    }
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    location.reload();
}

function handleSave() {
    const desc = document.getElementById('desc').value;
    const amt = document.getElementById('amt').value;
    const type = document.getElementById('type').value;
    if (!desc || !amt) return alert("Isi semua data!");
    manager.add(desc, amt, type);
    showPage('transaction');
}

function renderList() {
    const list = document.getElementById('list');
    list.innerHTML = manager.transactions.map(t => 
        `<li class="${t.amount > 0 ? 'income' : 'expense'}">${t.desc}: Rp ${Math.abs(t.amount).toLocaleString('id-ID')}</li>`
    ).join('');
}

showPage(localStorage.getItem('isLoggedIn') ? 'dashboard' : 'login');