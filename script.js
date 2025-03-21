// JSON database using localStorage
function initDatabase() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify({}));
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users'));
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// hash function
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return hash.toString();
}

// Page navigation
function showDashboard(username) {
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('signup-page').classList.add('hidden');
    document.getElementById('username-display').textContent = username;
}

function showLogin() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('signup-page').classList.add('hidden');
}

function showSignup() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('signup-page').classList.remove('hidden');
}

// Message display
function showMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.classList.remove('hidden');
    setTimeout(() => messageEl.classList.add('hidden'), 3000);
}

// Login handling
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const users = getUsers();

    if (users[username] && users[username].password === simpleHash(password)) {
        sessionStorage.setItem('loggedInUser', username);
        showMessage('login-message', 'Login successful!', 'success');
        showDashboard(username);
    } else {
        showMessage('login-message', 'Invalid credentials', 'error');
    }
});

// Signup handling
document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const users = getUsers();

    if (users[username]) {
        showMessage('signup-message', 'Username already exists', 'error');
    } else {
        users[username] = {
            password: simpleHash(password),
            created_at: new Date().toISOString().split('T')[0]
        };
        saveUsers(users);
        showMessage('signup-message', 'Signup successful! Please login.', 'success');
        setTimeout(showLogin, 1000);
    }
});

// Logout
function logout() {
    sessionStorage.removeItem('loggedInUser');
    showLogin();
}

// Check login status on page load
function checkLogin() {
    initDatabase();
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser && getUsers()[loggedInUser]) {
        showDashboard(loggedInUser);
    } else {
        showLogin();
    }
}

// Initialize
window.onload = checkLogin;