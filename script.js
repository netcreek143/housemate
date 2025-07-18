// HouseMate - Comprehensive Expense Tracking and Bill Splitting Application
// Main Application Class with User Permission Controls

class HouseMate {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.expenses = [];
        this.bills = [];
        this.budgets = [];
        this.usedPins = new Set();
        this.theme = 'light';
        this.activeTab = 'dashboard';
        
        this.init();
    }

    // Initialize the application
    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupTheme();
        this.hideLoadingScreen();
        
        // Check if user is logged in
        if (this.currentUser) {
            this.showApp();
            this.updateDashboard();
        } else {
            this.showAuth();
        }
    }

    // Hide loading screen
    hideLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 1500);
    }

    // Setup event listeners
    setupEventListeners() {
        this.setupAuthListeners();
        this.setupMainAppListeners();
        this.setupModalListeners();
        this.setupFormListeners();
    }

    // Setup authentication event listeners
    setupAuthListeners() {
        // Show/hide forms
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPinForm();
        });

        // Form submissions
        document.getElementById('pin-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePinLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // PIN input handling
        this.setupPinInputs();
    }

    // Setup main app event listeners
    setupMainAppListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Header actions
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        document.getElementById('profile-btn').addEventListener('click', () => {
            this.showProfileModal();
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Quick actions
        document.getElementById('quick-add-expense').addEventListener('click', () => {
            this.showExpenseModal();
        });

        document.getElementById('quick-split-bill').addEventListener('click', () => {
            this.showBillModal();
        });

        // Add buttons
        document.getElementById('add-expense-btn').addEventListener('click', () => {
            this.showExpenseModal();
        });

        document.getElementById('add-bill-btn').addEventListener('click', () => {
            this.showBillModal();
        });

        document.getElementById('set-budget-btn').addEventListener('click', () => {
            this.showBudgetModal();
        });

        // Export buttons
        document.getElementById('export-csv').addEventListener('click', () => {
            this.exportCSV();
        });

        // Filters
        document.getElementById('expense-search').addEventListener('input', () => {
            this.filterExpenses();
        });

        document.getElementById('category-filter').addEventListener('change', () => {
            this.filterExpenses();
        });

        document.getElementById('date-from').addEventListener('change', () => {
            this.filterExpenses();
        });

        document.getElementById('date-to').addEventListener('change', () => {
            this.filterExpenses();
        });

        // Bill filters
        document.getElementById('bill-status-filter').addEventListener('change', () => {
            this.filterBills();
        });

        document.getElementById('bill-category-filter').addEventListener('change', () => {
            this.filterBills();
        });

        // Report period
        document.getElementById('report-period').addEventListener('change', (e) => {
            this.handleReportPeriodChange(e.target.value);
        });

        // Settle all button
        document.getElementById('settle-all-btn').addEventListener('click', () => {
            this.settleAllBalances();
        });
    }

    // Setup modal event listeners
    setupModalListeners() {
        // Close modal buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal);
            });
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal);
                }
            });
        });

        // Split method change
        document.querySelectorAll('input[name="split-method"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleSplitMethodChange(e.target.value);
            });
        });
    }

    // Setup form event listeners
    setupFormListeners() {
        // Expense form
        document.getElementById('expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleExpenseSubmit();
        });

        // Bill form
        document.getElementById('bill-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBillSubmit();
        });

        // Budget form
        document.getElementById('budget-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBudgetSubmit();
        });

        // Profile form
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileSubmit();
        });

        // File input display
        document.getElementById('expense-receipt').addEventListener('change', (e) => {
            this.updateFileInputDisplay(e.target);
        });

        document.getElementById('bill-receipt').addEventListener('change', (e) => {
            this.updateFileInputDisplay(e.target);
        });
    }

    // Setup PIN inputs
    setupPinInputs() {
        const pinInputs = document.querySelectorAll('.pin-digit');
        pinInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < pinInputs.length - 1) {
                    pinInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                    pinInputs[index - 1].focus();
                }
            });
        });
    }

    // Update file input display
    updateFileInputDisplay(input) {
        const display = input.parentElement.querySelector('.file-input-display span');
        if (input.files.length > 0) {
            display.textContent = input.files[0].name;
        } else {
            display.textContent = 'Choose receipt image';
        }
    }

    // Authentication Methods
    showAuth() {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('app-container').classList.add('hidden');
        
        // Show PIN form if there are registered users
        if (this.users.length > 0) {
            this.showPinForm();
        } else {
            this.showRegisterForm();
        }
    }

    showApp() {
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        this.updateUserInfo();
    }

    showPinForm() {
        document.getElementById('pin-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('pin-error').textContent = '';
        
        // Clear PIN inputs
        document.querySelectorAll('.pin-digit').forEach(input => input.value = '');
        document.querySelector('.pin-digit').focus();
    }

    showRegisterForm() {
        document.getElementById('pin-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
    }

    handlePinLogin() {
        const pinInputs = document.querySelectorAll('.pin-digit');
        const pin = Array.from(pinInputs).map(input => input.value).join('');
        
        if (pin.length !== 4) {
            this.showPinError('Please enter all 4 digits');
            return;
        }

        const user = this.users.find(u => u.pin === pin);
        if (user) {
            this.currentUser = user;
            this.saveData();
            this.showApp();
            this.updateDashboard();
            this.showToast(`Welcome back, ${user.name}!`, 'success');
        } else {
            this.showPinError('Invalid PIN');
            // Clear PIN inputs
            pinInputs.forEach(input => input.value = '');
            pinInputs[0].focus();
        }
    }

    showPinError(message) {
        document.getElementById('pin-error').textContent = message;
        setTimeout(() => {
            document.getElementById('pin-error').textContent = '';
        }, 3000);
    }

    handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const pin = document.getElementById('register-pin').value;
        const room = document.getElementById('register-room').value;

        if (!this.isValidEmail(email)) {
            this.showToast('Please enter a valid email', 'error');
            return;
        }

        if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
            this.showToast('PIN must be exactly 4 digits', 'error');
            return;
        }

        // Check if email already exists
        if (this.users.find(u => u.email === email)) {
            this.showToast('Email already registered', 'error');
            return;
        }

        // Check if PIN already exists
        if (this.usedPins.has(pin)) {
            this.showToast('This PIN is already taken. Please choose a different one.', 'error');
            return;
        }

        // Register user
        const newUser = { 
            id: Date.now().toString(),
            email, 
            name, 
            pin,
            room,
            createdAt: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.usedPins.add(pin);
        this.currentUser = newUser;
        
        this.saveData();
        this.showApp();
        this.updateDashboard();
        this.showToast('Account created successfully!', 'success');
    }

    logout() {
        this.currentUser = null;
        this.saveData();
        this.showAuth();
        this.showToast('Logged out successfully', 'success');
    }

    updateUserInfo() {
        if (this.currentUser) {
            document.getElementById('current-user-info').textContent = 
                `${this.currentUser.name} • ${this.currentUser.room}`;
        }
    }

    // Validation methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Theme management
    setupTheme() {
        const savedTheme = localStorage.getItem('housemate-theme') || 'light';
        this.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('housemate-theme', this.theme);
        this.updateThemeIcon();
        this.showToast(`Switched to ${this.theme} mode`, 'success');
    }

    updateThemeIcon() {
        const icon = document.querySelector('#theme-toggle i');
        icon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Navigation
    switchTab(tabName) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.activeTab = tabName;

        // Update content based on tab
        switch (tabName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'expenses':
                this.updateExpensesList();
                break;
            case 'bills':
                this.updateBillsList();
                break;
            case 'budget':
                this.updateBudgetView();
                break;
            case 'reports':
                this.updateReportsView();
                break;
            case 'balances':
                this.updateBalancesView();
                break;
        }
    }

    // Dashboard methods
    updateDashboard() {
        this.updateDashboardStats();
        this.updateRecentActivity();
        this.updateOutstandingBalances();
    }

    updateDashboardStats() {
        const myExpenses = this.expenses.filter(e => e.userId === this.currentUser.id);
        const totalExpenses = myExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyExpenses = myExpenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        }).reduce((sum, expense) => sum + expense.amount, 0);

        const sharedExpenses = this.getMySharedExpenses();
        const netBalance = this.calculateNetBalance();

        document.getElementById('my-total-expenses').textContent = this.formatCurrency(totalExpenses);
        document.getElementById('my-monthly-expenses').textContent = this.formatCurrency(monthlyExpenses);
        document.getElementById('shared-expenses').textContent = this.formatCurrency(sharedExpenses);
        document.getElementById('net-balance').textContent = this.formatCurrency(netBalance);
    }

    updateRecentActivity() {
        const allActivity = [
            ...this.expenses.map(e => ({...e, type: 'expense'})),
            ...this.bills.map(b => ({...b, type: 'bill'}))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

        const container = document.getElementById('recent-activity');
        
        if (allActivity.length === 0) {
            container.innerHTML = '<p class="text-center">No recent activity</p>';
            return;
        }

        container.innerHTML = allActivity.map(item => `
            <div class="activity-item">
                <div class="activity-info">
                    <div class="activity-title">${item.description}</div>
                    <div class="activity-meta">
                        <span>${item.type === 'expense' ? 'Personal Expense' : 'Split Bill'}</span>
                        <span>${this.formatDate(item.createdAt)}</span>
                    </div>
                </div>
                <div class="activity-amount">${this.formatCurrency(item.amount)}</div>
            </div>
        `).join('');
    }

    updateOutstandingBalances() {
        const balances = this.calculateDetailedBalances();
        const container = document.getElementById('outstanding-balances');
        
        if (balances.length === 0) {
            container.innerHTML = '<p class="text-center">No outstanding balances</p>';
            return;
        }

        container.innerHTML = balances.slice(0, 3).map(balance => `
            <div class="balance-item">
                <div class="balance-info">
                    <div class="balance-title">${balance.description}</div>
                    <div class="balance-meta">${balance.type}</div>
                </div>
                <div class="balance-amount ${balance.amount > 0 ? 'positive' : 'negative'}">
                    ${this.formatCurrency(Math.abs(balance.amount))}
                </div>
            </div>
        `).join('');
    }

    getMySharedExpenses() {
        return this.bills.filter(bill => 
            bill.participants.some(p => p.userId === this.currentUser.id)
        ).reduce((sum, bill) => {
            const myShare = bill.participants.find(p => p.userId === this.currentUser.id);
            return sum + (myShare ? myShare.amount : 0);
        }, 0);
    }

    calculateNetBalance() {
        const balances = this.calculateDetailedBalances();
        return balances.reduce((sum, balance) => sum + balance.amount, 0);
    }

    // Expense management
    showExpenseModal(expense = null) {
        const modal = document.getElementById('expense-modal');
        const form = document.getElementById('expense-form');
        const title = document.getElementById('expense-modal-title');
        
        if (expense) {
            // Check permission - users can only edit their own expenses
            if (expense.userId !== this.currentUser.id) {
                this.showToast('You can only edit your own expenses', 'error');
                return;
            }
            
            title.textContent = 'Edit Expense';
            this.populateExpenseForm(expense);
            form.dataset.expenseId = expense.id;
        } else {
            title.textContent = 'Add Expense';
            form.reset();
            delete form.dataset.expenseId;
            document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
        }
        
        this.showModal(modal);
    }

    populateExpenseForm(expense) {
        document.getElementById('expense-description').value = expense.description;
        document.getElementById('expense-amount').value = expense.amount;
        document.getElementById('expense-category').value = expense.category;
        document.getElementById('expense-date').value = expense.date;
    }

    handleExpenseSubmit() {
        const form = document.getElementById('expense-form');
        const expenseId = form.dataset.expenseId;
        
        const expense = {
            id: expenseId || Date.now().toString(),
            userId: this.currentUser.id,
            description: document.getElementById('expense-description').value,
            amount: parseFloat(document.getElementById('expense-amount').value),
            category: document.getElementById('expense-category').value,
            date: document.getElementById('expense-date').value,
            receipt: null, // Would handle file upload here
            createdAt: expenseId ? this.expenses.find(e => e.id === expenseId).createdAt : new Date().toISOString()
        };

        if (expenseId) {
            // Check permission before updating
            const existingExpense = this.expenses.find(e => e.id === expenseId);
            if (existingExpense.userId !== this.currentUser.id) {
                this.showToast('You can only edit your own expenses', 'error');
                return;
            }
            
            const index = this.expenses.findIndex(e => e.id === expenseId);
            this.expenses[index] = expense;
            this.showToast('Expense updated successfully', 'success');
        } else {
            this.expenses.push(expense);
            this.showToast('Expense added successfully', 'success');
        }

        this.saveData();
        this.hideModal(document.getElementById('expense-modal'));
        this.updateDashboard();
        this.updateExpensesList();
    }

    updateExpensesList() {
        const container = document.getElementById('my-expenses-list');
        const myExpenses = this.getFilteredExpenses().filter(e => e.userId === this.currentUser.id);
        
        if (myExpenses.length === 0) {
            container.innerHTML = '<p class="text-center">No expenses found</p>';
            return;
        }

        container.innerHTML = myExpenses.map(expense => `
            <div class="expense-item">
                <div class="expense-info">
                    <div class="expense-title">${expense.description}</div>
                    <div class="expense-meta">
                        <span class="expense-category">${this.getCategoryName(expense.category)}</span>
                        <span>${this.formatDate(expense.date)}</span>
                    </div>
                </div>
                <div class="expense-amount">${this.formatCurrency(expense.amount)}</div>
                <div class="expense-actions">
                    <button class="btn btn-secondary" onclick="app.showExpenseModal(${JSON.stringify(expense).replace(/"/g, '&quot;')})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary" onclick="app.deleteExpense('${expense.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getFilteredExpenses() {
        let filtered = [...this.expenses];
        
        const search = document.getElementById('expense-search').value.toLowerCase();
        const category = document.getElementById('category-filter').value;
        const dateFrom = document.getElementById('date-from').value;
        const dateTo = document.getElementById('date-to').value;
        
        if (search) {
            filtered = filtered.filter(expense => 
                expense.description.toLowerCase().includes(search)
            );
        }
        
        if (category) {
            filtered = filtered.filter(expense => expense.category === category);
        }
        
        if (dateFrom) {
            filtered = filtered.filter(expense => expense.date >= dateFrom);
        }
        
        if (dateTo) {
            filtered = filtered.filter(expense => expense.date <= dateTo);
        }
        
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    filterExpenses() {
        this.updateExpensesList();
    }

    deleteExpense(expenseId) {
        const expense = this.expenses.find(e => e.id === expenseId);
        
        // Check permission - users can only delete their own expenses
        if (expense.userId !== this.currentUser.id) {
            this.showToast('You can only delete your own expenses', 'error');
            return;
        }

        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(expense => expense.id !== expenseId);
            this.saveData();
            this.updateExpensesList();
            this.updateDashboard();
            this.showToast('Expense deleted successfully', 'success');
        }
    }

    // Bill splitting management
    showBillModal(bill = null) {
        const modal = document.getElementById('bill-modal');
        const form = document.getElementById('bill-form');
        const title = document.getElementById('bill-modal-title');
        
        if (bill) {
            title.textContent = 'Edit Split Bill';
            this.populateBillForm(bill);
            form.dataset.billId = bill.id;
        } else {
            title.textContent = 'Split New Bill';
            form.reset();
            delete form.dataset.billId;
            document.getElementById('bill-date').value = new Date().toISOString().split('T')[0];
        }
        
        this.populateHousemateSelection();
        this.showModal(modal);
    }

    populateHousemateSelection() {
        const container = document.getElementById('housemate-selection');
        const otherUsers = this.users.filter(u => u.id !== this.currentUser.id);
        
        container.innerHTML = otherUsers.map(user => `
            <div class="housemate-option">
                <input type="checkbox" id="user-${user.id}" value="${user.id}">
                <div class="housemate-avatar">${user.name.charAt(0).toUpperCase()}</div>
                <div class="housemate-info">
                    <div class="housemate-name">${user.name}</div>
                    <div class="housemate-room">${user.room}</div>
                </div>
            </div>
        `).join('');
    }

    handleSplitMethodChange(method) {
        const customAmounts = document.getElementById('custom-split-amounts');
        
        if (method === 'custom') {
            customAmounts.classList.remove('hidden');
            this.updateCustomSplitAmounts();
        } else {
            customAmounts.classList.add('hidden');
        }
    }

    updateCustomSplitAmounts() {
        const selectedUsers = this.getSelectedHousemates();
        const container = document.getElementById('custom-split-amounts');
        
        let html = `
            <div class="split-amount-item">
                <label>${this.currentUser.name} (You):</label>
                <input type="number" id="amount-${this.currentUser.id}" step="0.01" placeholder="0.00">
            </div>
        `;
        
        selectedUsers.forEach(user => {
            html += `
                <div class="split-amount-item">
                    <label>${user.name}:</label>
                    <input type="number" id="amount-${user.id}" step="0.01" placeholder="0.00">
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    getSelectedHousemates() {
        const checkboxes = document.querySelectorAll('#housemate-selection input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(checkbox => {
            const userId = checkbox.value;
            return this.users.find(u => u.id === userId);
        });
    }

    handleBillSubmit() {
        const form = document.getElementById('bill-form');
        const billId = form.dataset.billId;
        
        const description = document.getElementById('bill-description').value;
        const totalAmount = parseFloat(document.getElementById('bill-amount').value);
        const category = document.getElementById('bill-category').value;
        const date = document.getElementById('bill-date').value;
        const selectedUsers = this.getSelectedHousemates();
        const splitMethod = document.querySelector('input[name="split-method"]:checked').value;
        
        if (selectedUsers.length === 0) {
            this.showToast('Please select at least one housemate to split with', 'error');
            return;
        }

        let participants = [];
        
        if (splitMethod === 'equal') {
            const shareAmount = totalAmount / (selectedUsers.length + 1);
            
            // Add current user
            participants.push({
                userId: this.currentUser.id,
                amount: shareAmount,
                paid: true // Bill creator is assumed to have paid
            });
            
            // Add selected users
            selectedUsers.forEach(user => {
                participants.push({
                    userId: user.id,
                    amount: shareAmount,
                    paid: false
                });
            });
        } else {
            // Custom amounts
            let totalCustom = 0;
            
            // Add current user
            const myAmount = parseFloat(document.getElementById(`amount-${this.currentUser.id}`).value) || 0;
            participants.push({
                userId: this.currentUser.id,
                amount: myAmount,
                paid: true
            });
            totalCustom += myAmount;
            
            // Add selected users
            selectedUsers.forEach(user => {
                const amount = parseFloat(document.getElementById(`amount-${user.id}`).value) || 0;
                participants.push({
                    userId: user.id,
                    amount: amount,
                    paid: false
                });
                totalCustom += amount;
            });
            
            if (Math.abs(totalCustom - totalAmount) > 0.01) {
                this.showToast('Custom amounts must add up to the total amount', 'error');
                return;
            }
        }

        const bill = {
            id: billId || Date.now().toString(),
            createdBy: this.currentUser.id,
            description: description,
            amount: totalAmount,
            category: category,
            date: date,
            participants: participants,
            receipt: null,
            createdAt: billId ? this.bills.find(b => b.id === billId).createdAt : new Date().toISOString()
        };

        if (billId) {
            const index = this.bills.findIndex(b => b.id === billId);
            this.bills[index] = bill;
            this.showToast('Bill updated successfully', 'success');
        } else {
            this.bills.push(bill);
            this.showToast('Bill split successfully', 'success');
        }

        this.saveData();
        this.hideModal(document.getElementById('bill-modal'));
        this.updateDashboard();
        this.updateBillsList();
    }

    updateBillsList() {
        const container = document.getElementById('split-bills-list');
        const filteredBills = this.getFilteredBills();
        
        if (filteredBills.length === 0) {
            container.innerHTML = '<p class="text-center">No split bills found</p>';
            return;
        }

        container.innerHTML = filteredBills.map(bill => {
            const myParticipation = bill.participants.find(p => p.userId === this.currentUser.id);
            const status = this.getBillStatus(bill);
            
            return `
                <div class="bill-item">
                    <div class="bill-info">
                        <div class="bill-title">${bill.description}</div>
                        <div class="bill-meta">
                            <span class="bill-category">${this.getCategoryName(bill.category)}</span>
                            <span>${this.formatDate(bill.date)}</span>
                            <span class="status-badge ${status.toLowerCase()}">${status}</span>
                        </div>
                    </div>
                    <div class="bill-details">
                        <div class="bill-amount">${this.formatCurrency(bill.amount)}</div>
                        ${myParticipation ? `<div>Your share: ${this.formatCurrency(myParticipation.amount)}</div>` : ''}
                    </div>
                    <div class="bill-actions">
                        ${myParticipation && !myParticipation.paid ? `
                            <button class="btn btn-secondary" onclick="app.markAsPaid('${bill.id}')">
                                <i class="fas fa-check"></i> Mark Paid
                            </button>
                        ` : ''}
                        <button class="btn btn-secondary" onclick="app.viewBillDetails('${bill.id}')">
                            <i class="fas fa-eye"></i> Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    getFilteredBills() {
        let filtered = this.bills.filter(bill => 
            bill.participants.some(p => p.userId === this.currentUser.id) || 
            bill.createdBy === this.currentUser.id
        );
        
        const statusFilter = document.getElementById('bill-status-filter').value;
        const categoryFilter = document.getElementById('bill-category-filter').value;
        
        if (statusFilter) {
            filtered = filtered.filter(bill => this.getBillStatus(bill).toLowerCase() === statusFilter);
        }
        
        if (categoryFilter) {
            filtered = filtered.filter(bill => bill.category === categoryFilter);
        }
        
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    filterBills() {
        this.updateBillsList();
    }

    getBillStatus(bill) {
        const paidCount = bill.participants.filter(p => p.paid).length;
        const totalCount = bill.participants.length;
        
        if (paidCount === totalCount) return 'Settled';
        if (paidCount > 0) return 'Partial';
        return 'Pending';
    }

    markAsPaid(billId) {
        const bill = this.bills.find(b => b.id === billId);
        const participant = bill.participants.find(p => p.userId === this.currentUser.id);
        
        if (participant) {
            participant.paid = true;
            this.saveData();
            this.updateBillsList();
            this.updateDashboard();
            this.showToast('Marked as paid successfully', 'success');
        }
    }

    viewBillDetails(billId) {
        const bill = this.bills.find(b => b.id === billId);
        // This would open a detailed view modal
        this.showToast('Bill details view would be implemented here', 'info');
    }

    // Budget management
    showBudgetModal() {
        const modal = document.getElementById('budget-modal');
        this.showModal(modal);
    }

    handleBudgetSubmit() {
        const category = document.getElementById('budget-category-input').value;
        const amount = parseFloat(document.getElementById('budget-amount-input').value);
        
        const budget = {
            id: Date.now().toString(),
            userId: this.currentUser.id, // User-specific budget
            category: category,
            amount: amount,
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            createdAt: new Date().toISOString()
        };

        // Remove existing budget for same category/month for this user
        this.budgets = this.budgets.filter(b => 
            !(b.userId === this.currentUser.id && b.category === budget.category && 
              b.month === budget.month && b.year === budget.year)
        );
        
        this.budgets.push(budget);
        this.saveData();
        this.hideModal(document.getElementById('budget-modal'));
        this.updateBudgetView();
        this.showToast('Budget set successfully', 'success');
    }

    updateBudgetView() {
        const myBudgets = this.budgets.filter(b => b.userId === this.currentUser.id);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const overallBudget = myBudgets.find(b => 
            b.category === 'overall' && b.month === currentMonth && b.year === currentYear
        );

        if (overallBudget) {
            const spent = this.getMyMonthlySpending();
            const remaining = overallBudget.amount - spent;
            const percentage = (spent / overallBudget.amount) * 100;
            
            document.getElementById('total-budget-amount').textContent = this.formatCurrency(overallBudget.amount);
            document.getElementById('budget-remaining').textContent = this.formatCurrency(remaining);
            document.getElementById('budget-percentage').textContent = `${Math.round(percentage)}%`;
            
            const progressFill = document.getElementById('budget-progress-fill');
            progressFill.style.width = `${Math.min(percentage, 100)}%`;
            
            progressFill.className = 'progress-fill';
            if (percentage > 90) {
                progressFill.classList.add('danger');
            } else if (percentage > 75) {
                progressFill.classList.add('warning');
            }
        } else {
            document.getElementById('total-budget-amount').textContent = '₹0';
            document.getElementById('budget-remaining').textContent = 'No budget set';
            document.getElementById('budget-percentage').textContent = '0%';
            document.getElementById('budget-progress-fill').style.width = '0%';
        }

        this.updateCategoryBudgets();
    }

    updateCategoryBudgets() {
        const myBudgets = this.budgets.filter(b => 
            b.userId === this.currentUser.id && 
            b.category !== 'overall' &&
            b.month === new Date().getMonth() && 
            b.year === new Date().getFullYear()
        );
        
        const container = document.getElementById('category-budget-list');
        
        if (myBudgets.length === 0) {
            container.innerHTML = '<p class="text-center">No category budgets set</p>';
            return;
        }

        container.innerHTML = myBudgets.map(budget => {
            const spent = this.getCategorySpending(budget.category);
            const percentage = (spent / budget.amount) * 100;
            
            return `
                <div class="category-budget-item">
                    <div class="category-budget-info">
                        <div class="category-budget-name">${this.getCategoryName(budget.category)}</div>
                        <div class="category-budget-progress">
                            <div class="progress-bar">
                                <div class="progress-fill ${percentage > 90 ? 'danger' : percentage > 75 ? 'warning' : ''}" 
                                     style="width: ${Math.min(percentage, 100)}%"></div>
                            </div>
                            <span>${Math.round(percentage)}%</span>
                        </div>
                    </div>
                    <div class="category-budget-amount">
                        ${this.formatCurrency(spent)} / ${this.formatCurrency(budget.amount)}
                    </div>
                </div>
            `;
        }).join('');
    }

    getMyMonthlySpending() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expense.userId === this.currentUser.id &&
                   expenseDate.getMonth() === currentMonth && 
                   expenseDate.getFullYear() === currentYear;
        }).reduce((sum, expense) => sum + expense.amount, 0);
    }

    getCategorySpending(category) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expense.userId === this.currentUser.id &&
                   expense.category === category &&
                   expenseDate.getMonth() === currentMonth && 
                   expenseDate.getFullYear() === currentYear;
        }).reduce((sum, expense) => sum + expense.amount, 0);
    }

    // Reports
    updateReportsView() {
        this.updateHouseSummary();
        this.updateIndividualContributions();
        this.createReportsChart();
    }

    updateHouseSummary() {
        const period = document.getElementById('report-period').value;
        const allExpenses = this.getExpensesForPeriod(period);
        const allBills = this.getBillsForPeriod(period);
        
        const totalPersonalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
        const totalSharedExpenses = allBills.reduce((sum, b) => sum + b.amount, 0);
        const totalExpenses = totalPersonalExpenses + totalSharedExpenses;
        const avgPerPerson = this.users.length > 0 ? totalExpenses / this.users.length : 0;

        const container = document.getElementById('house-summary');
        container.innerHTML = `
            <div class="summary-item">
                <h4>Total House Expenses</h4>
                <p>${this.formatCurrency(totalExpenses)}</p>
            </div>
            <div class="summary-item">
                <h4>Personal Expenses</h4>
                <p>${this.formatCurrency(totalPersonalExpenses)}</p>
            </div>
            <div class="summary-item">
                <h4>Shared Expenses</h4>
                <p>${this.formatCurrency(totalSharedExpenses)}</p>
            </div>
            <div class="summary-item">
                <h4>Average per Person</h4>
                <p>${this.formatCurrency(avgPerPerson)}</p>
            </div>
        `;
    }

    updateIndividualContributions() {
        const period = document.getElementById('report-period').value;
        const container = document.getElementById('individual-contributions');
        
        const contributions = this.users.map(user => {
            const personalExpenses = this.getExpensesForPeriod(period)
                .filter(e => e.userId === user.id)
                .reduce((sum, e) => sum + e.amount, 0);
            
            const sharedExpenses = this.getBillsForPeriod(period)
                .reduce((sum, bill) => {
                    const participation = bill.participants.find(p => p.userId === user.id);
                    return sum + (participation ? participation.amount : 0);
                }, 0);
            
            return {
                user: user,
                personal: personalExpenses,
                shared: sharedExpenses,
                total: personalExpenses + sharedExpenses
            };
        }).sort((a, b) => b.total - a.total);

        container.innerHTML = contributions.map(contrib => `
            <div class="contribution-item">
                <div class="contribution-user">
                    <div class="housemate-avatar">${contrib.user.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="housemate-name">${contrib.user.name}</div>
                        <div class="housemate-room">${contrib.user.room}</div>
                    </div>
                </div>
                <div class="contribution-amount">
                    <div>Total: ${this.formatCurrency(contrib.total)}</div>
                    <small>Personal: ${this.formatCurrency(contrib.personal)} | Shared: ${this.formatCurrency(contrib.shared)}</small>
                </div>
            </div>
        `).join('');
    }

    getExpensesForPeriod(period) {
        const now = new Date();
        let startDate;
        
        switch (period) {
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            case 'custom':
                const from = document.getElementById('report-from').value;
                const to = document.getElementById('report-to').value;
                return this.expenses.filter(expense => 
                    expense.date >= from && expense.date <= to
                );
            default:
                return this.expenses;
        }
        
        return this.expenses.filter(expense => 
            new Date(expense.date) >= startDate
        );
    }

    getBillsForPeriod(period) {
        const now = new Date();
        let startDate;
        
        switch (period) {
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            case 'custom':
                const from = document.getElementById('report-from').value;
                const to = document.getElementById('report-to').value;
                return this.bills.filter(bill => 
                    bill.date >= from && bill.date <= to
                );
            default:
                return this.bills;
        }
        
        return this.bills.filter(bill => 
            new Date(bill.date) >= startDate
        );
    }

    handleReportPeriodChange(period) {
        const fromWrapper = document.getElementById('report-from-wrapper');
        const toWrapper = document.getElementById('report-to-wrapper');
        
        if (period === 'custom') {
            fromWrapper.classList.remove('hidden');
            toWrapper.classList.remove('hidden');
        } else {
            fromWrapper.classList.add('hidden');
            toWrapper.classList.add('hidden');
        }
        
        this.updateReportsView();
    }

    createReportsChart() {
        const canvas = document.getElementById('reports-chart');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const period = document.getElementById('report-period').value;
        const expenses = this.getExpensesForPeriod(period);
        const bills = this.getBillsForPeriod(period);
        
        const categories = {};
        
        // Add personal expenses
        expenses.forEach(expense => {
            categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
        });
        
        // Add shared expenses
        bills.forEach(bill => {
            categories[bill.category] = (categories[bill.category] || 0) + bill.amount;
        });
        
        // Draw simple bar chart
        let x = 20;
        const maxAmount = Math.max(...Object.values(categories));
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b'];
        
        Object.entries(categories).forEach(([category, amount], index) => {
            const barHeight = maxAmount > 0 ? (amount / maxAmount) * 150 : 0;
            const barWidth = 40;
            
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, canvas.height - barHeight - 30, barWidth, barHeight);
            
            // Label
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.fillText(this.getCategoryName(category).slice(0, 8), x - 5, canvas.height - 10);
            
            x += barWidth + 15;
        });
    }

    // Balances management
    updateBalancesView() {
        const balances = this.calculateDetailedBalances();
        
        const totalOwedToMe = balances.filter(b => b.amount > 0).reduce((sum, b) => sum + b.amount, 0);
        const totalIOwe = balances.filter(b => b.amount < 0).reduce((sum, b) => sum + Math.abs(b.amount), 0);
        const netBalance = totalOwedToMe - totalIOwe;
        
        document.getElementById('total-owed-to-me').textContent = this.formatCurrency(totalOwedToMe);
        document.getElementById('total-i-owe').textContent = this.formatCurrency(totalIOwe);
        document.getElementById('net-balance-amount').textContent = this.formatCurrency(netBalance);
        
        this.updateDetailedBalances(balances);
    }

    calculateDetailedBalances() {
        const balances = [];
        
        // Calculate balances from split bills
        this.bills.forEach(bill => {
            const myParticipation = bill.participants.find(p => p.userId === this.currentUser.id);
            
            if (myParticipation) {
                bill.participants.forEach(participant => {
                    if (participant.userId !== this.currentUser.id) {
                        const otherUser = this.users.find(u => u.id === participant.userId);
                        
                        if (bill.createdBy === this.currentUser.id && !participant.paid) {
                            // Others owe me
                            balances.push({
                                userId: participant.userId,
                                userName: otherUser.name,
                                amount: participant.amount,
                                description: `${otherUser.name} owes you for "${bill.description}"`,
                                type: 'Bill Split',
                                billId: bill.id
                            });
                        } else if (bill.createdBy === participant.userId && !myParticipation.paid) {
                            // I owe others
                            balances.push({
                                userId: participant.userId,
                                userName: otherUser.name,
                                amount: -myParticipation.amount,
                                description: `You owe ${otherUser.name} for "${bill.description}"`,
                                type: 'Bill Split',
                                billId: bill.id
                            });
                        }
                    }
                });
            }
        });
        
        return balances;
    }

    updateDetailedBalances(balances) {
        const container = document.getElementById('detailed-balances');
        
        if (balances.length === 0) {
            container.innerHTML = '<p class="text-center">No outstanding balances</p>';
            return;
        }

        const owedToMe = balances.filter(b => b.amount > 0);
        const iOwe = balances.filter(b => b.amount < 0);
        
        let html = '';
        
        if (owedToMe.length > 0) {
            html += `
                <div class="balance-group">
                    <h4>Owed to You</h4>
                    ${owedToMe.map(balance => `
                        <div class="balance-detail">
                            <div class="balance-users">
                                <div class="housemate-avatar">${balance.userName.charAt(0).toUpperCase()}</div>
                                <div>${balance.description}</div>
                            </div>
                            <div class="balance-detail-amount positive">
                                ${this.formatCurrency(balance.amount)}
                            </div>
                            <div class="balance-actions">
                                <button class="btn btn-secondary" onclick="app.sendReminder('${balance.userId}', '${balance.billId}')">
                                    <i class="fas fa-bell"></i> Remind
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        if (iOwe.length > 0) {
            html += `
                <div class="balance-group">
                    <h4>You Owe</h4>
                    ${iOwe.map(balance => `
                        <div class="balance-detail">
                            <div class="balance-users">
                                <div class="housemate-avatar">${balance.userName.charAt(0).toUpperCase()}</div>
                                <div>${balance.description}</div>
                            </div>
                            <div class="balance-detail-amount negative">
                                ${this.formatCurrency(Math.abs(balance.amount))}
                            </div>
                            <div class="balance-actions">
                                <button class="btn btn-primary" onclick="app.markAsPaid('${balance.billId}')">
                                    <i class="fas fa-check"></i> Mark Paid
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        container.innerHTML = html;
    }

    sendReminder(userId, billId) {
        // In a real app, this would send a notification
        const user = this.users.find(u => u.id === userId);
        this.showToast(`Reminder sent to ${user.name}`, 'success');
    }

    settleAllBalances() {
        if (confirm('Are you sure you want to mark all your debts as settled?')) {
            this.bills.forEach(bill => {
                const myParticipation = bill.participants.find(p => p.userId === this.currentUser.id);
                if (myParticipation && !myParticipation.paid) {
                    myParticipation.paid = true;
                }
            });
            
            this.saveData();
            this.updateBalancesView();
            this.updateDashboard();
            this.showToast('All balances settled successfully', 'success');
        }
    }

    // Export functionality
    exportCSV() {
        const period = document.getElementById('report-period').value;
        const expenses = this.getExpensesForPeriod(period);
        const bills = this.getBillsForPeriod(period);
        
        const csvContent = this.generateCSV(expenses, bills);
        this.downloadFile(csvContent, `housemate-report-${period}.csv`, 'text/csv');
        this.showToast('CSV exported successfully', 'success');
    }

    generateCSV(expenses, bills) {
        const headers = ['Date', 'Type', 'Description', 'Category', 'Amount', 'User'];
        const rows = [];
        
        // Add expenses
        expenses.forEach(expense => {
            const user = this.users.find(u => u.id === expense.userId);
            rows.push([
                expense.date,
                'Personal Expense',
                expense.description,
                this.getCategoryName(expense.category),
                expense.amount,
                user ? user.name : 'Unknown'
            ]);
        });
        
        // Add bills
        bills.forEach(bill => {
            const creator = this.users.find(u => u.id === bill.createdBy);
            rows.push([
                bill.date,
                'Split Bill',
                bill.description,
                this.getCategoryName(bill.category),
                bill.amount,
                creator ? creator.name : 'Unknown'
            ]);
        });
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
        
        return csvContent;
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Profile management
    showProfileModal() {
        const modal = document.getElementById('profile-modal');
        
        // Populate form with current user data
        document.getElementById('profile-name').value = this.currentUser.name || '';
        document.getElementById('profile-email').value = this.currentUser.email || '';
        document.getElementById('profile-room').value = this.currentUser.room || '';
        document.getElementById('profile-pin').value = '';
        
        this.showModal(modal);
    }

    handleProfileSubmit() {
        const name = document.getElementById('profile-name').value;
        const email = document.getElementById('profile-email').value;
        const room = document.getElementById('profile-room').value;
        const newPin = document.getElementById('profile-pin').value;
        
        // Check if email is already used by another user
        const existingUser = this.users.find(u => u.email === email && u.id !== this.currentUser.id);
        if (existingUser) {
            this.showToast('Email already used by another user', 'error');
            return;
        }
        
        // Check if new PIN is already used
        if (newPin && newPin !== this.currentUser.pin && this.usedPins.has(newPin)) {
            this.showToast('PIN already used by another user', 'error');
            return;
        }
        
        // Update user data
        const oldPin = this.currentUser.pin;
        this.currentUser.name = name;
        this.currentUser.email = email;
        this.currentUser.room = room;
        
        if (newPin && newPin !== oldPin) {
            this.usedPins.delete(oldPin);
            this.usedPins.add(newPin);
            this.currentUser.pin = newPin;
        }
        
        // Update user in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        this.users[userIndex] = this.currentUser;
        
        this.saveData();
        this.hideModal(document.getElementById('profile-modal'));
        this.updateUserInfo();
        this.showToast('Profile updated successfully', 'success');
    }

    // Modal management
    showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Utility methods
    formatCurrency(amount) {
        return `₹${amount.toFixed(2)}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    getCategoryName(category) {
        const categories = {
            groceries: 'Groceries',
            utilities: 'Utilities',
            rent: 'Rent',
            entertainment: 'Entertainment',
            transport: 'Transport',
            household: 'Household Items',
            other: 'Other'
        };
        return categories[category] || category;
    }

    // Toast notifications
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
            </div>
            <div class="toast-message">${message}</div>
        `;
        
        document.getElementById('toast-container').appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Data persistence
    saveData() {
        const data = {
            currentUser: this.currentUser,
            users: this.users,
            expenses: this.expenses,
            bills: this.bills,
            budgets: this.budgets,
            usedPins: Array.from(this.usedPins),
            theme: this.theme
        };
        localStorage.setItem('housemate-data', JSON.stringify(data));
    }

    loadData() {
        const data = localStorage.getItem('housemate-data');
        if (data) {
            const parsed = JSON.parse(data);
            this.currentUser = parsed.currentUser;
            this.users = parsed.users || [];
            this.expenses = parsed.expenses || [];
            this.bills = parsed.bills || [];
            this.budgets = parsed.budgets || [];
            this.usedPins = new Set(parsed.usedPins || []);
            this.theme = parsed.theme || 'light';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HouseMate();
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}