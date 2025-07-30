document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const passwordDisplay = document.getElementById('passwordDisplay');
    const loginBtn = document.getElementById('loginBtn');
    const generateBtn = document.getElementById('generateBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const copyBtn = document.getElementById('copyBtn');
    const loading = document.getElementById('loading');
    const authError = document.getElementById('authError');
    const generatedPassword = document.getElementById('generatedPassword');

    // Check existing session
    if (localStorage.getItem('authenticated')) {
        showPasswordUI();
    }

    // Login handler
    loginBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            showError('Please enter both fields');
            return;
        }

        loading.classList.add('active');
        
        try {
            // Test authentication by calling /generate
            const response = await fetch('/generate', {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${username}:${password}`)
                }
            });

            if (!response.ok) throw new Error('Authentication failed');
            
            localStorage.setItem('authenticated', 'true');
            showPasswordUI();
            await generatePassword();
        } catch (error) {
            showError('Invalid credentials');
        } finally {
            loading.classList.remove('active');
        }
    });

    // Password generation
    async function generatePassword() {
        loading.classList.add('active');
        try {
            const response = await fetch('/generate', {
                headers: {
                    'Authorization': 'Basic ' + btoa(
                        `${document.getElementById('username').value}:${document.getElementById('password').value}`
                    )
                }
            });
            const data = await response.json();
            generatedPassword.textContent = data.password;
        } catch (error) {
            showError('Failed to generate password');
        } finally {
            loading.classList.remove('active');
        }
    }

    // UI Helpers
    function showPasswordUI() {
        authForm.classList.remove('active');
        passwordDisplay.classList.add('active');
    }

    function showError(message) {
        authError.textContent = message;
        setTimeout(() => authError.textContent = '', 3000);
    }

    // Event listeners
    generateBtn.addEventListener('click', generatePassword);
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authenticated');
        passwordDisplay.classList.remove('active');
        authForm.classList.add('active');
    });
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(generatedPassword.textContent);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy', 2000);
    });
});
