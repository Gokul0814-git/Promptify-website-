// auth.js - Authentication functionality for Promptify

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginModal = document.getElementById('loginModal');
    const openLoginModal = document.getElementById('openLoginModal');
    const closeModal = document.querySelector('.close-modal');
    const loginForm = document.getElementById('loginForm');
    const showSignup = document.getElementById('showSignup');

    // Open login modal
    if (openLoginModal) {
        openLoginModal.addEventListener('click', (e) => {
            window.location.href = '/login.html'; // Redirect to login.html for static server compatibility
        });
    }

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            loginModal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            console.log('Login form submitted'); // Debug log
            e.preventDefault();
            e.stopPropagation();
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!username || !password) {
                showError('Please fill in all fields');
                return;
            }

            // Simulate user not found
            if (username !== 'Bharanidharan') {
                showError('User not found. Please sign up first.');
                return;
            }

            try {
                // Show loading state
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="btn-spinner"></span> Logging in...';

                // Here you would typically make an API call to your backend
                // For now, we'll simulate a successful login
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Simulate successful login
                handleSuccessfulLogin(username);
                
            } catch (error) {
                console.error('Login error:', error);
                showError('Login failed. Please try again.');
            } finally {
                // Reset button state
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Log In';
            }
        });
    }

    // Show signup form (placeholder)
    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            // Close login modal
            loginModal.classList.remove('show');
            // Here you would typically show the signup form
            alert('Sign up functionality coming soon!');
        });
    }

    // Handle successful login
    function handleSuccessfulLogin(username) {
        // Close the modal
        loginModal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Store login state
        localStorage.setItem('promptify.username', username);
        // Update UI to show user is logged in
        const navButtons = document.getElementById('navButtons');
        if (navButtons) {
            navButtons.innerHTML = `
                <button class="btn-username" style="cursor:default;background:transparent;color:var(--text-light);font-weight:600;border:none;">👤 ${username}</button>
                <button class="btn-logout">Logout</button>
            `;
            const logoutBtn = navButtons.querySelector('.btn-logout');
            logoutBtn.addEventListener('click', () => {
                // Clear login state and redirect to login page
                localStorage.removeItem('promptify.username');
                window.location.href = '/login.html';
            });
        }
        
        // Show success message
        showSuccess(`Welcome back, ${username}!`);
        setTimeout(() => {
            window.location.href = '/index.html'; // Redirect to home after 1 second
        }, 1000);
        
        // Here you would typically:
        // 1. Store the authentication token
        // 2. Update the user interface
        // 3. Redirect or load user-specific content
    }

    // Show error message
    function showError(message) {
        // Remove any existing error messages
        const existingError = loginForm.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#ff6b6b';
        errorElement.style.marginTop = '0.5rem';
        errorElement.style.fontSize = '0.875rem';
        errorElement.textContent = message;
        
        loginForm.insertBefore(errorElement, loginForm.firstChild);
    }

    // Show success message
    function showSuccess(message) {
        // Create a temporary success message
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.style.position = 'fixed';
        successElement.style.top = '20px';
        successElement.style.right = '20px';
        successElement.style.padding = '12px 24px';
        successElement.style.backgroundColor = '#10b981';
        successElement.style.color= 'white';
        successElement.style.borderRadius = '6px';
        successElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        successElement.style.zIndex = '9999';
        successElement.style.animation = 'slideIn 0.3s ease-out';
        successElement.textContent = message;
        
        document.body.appendChild(successElement);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
            successElement.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                successElement.remove();
            }, 300);
        }, 3000);
    }

    // Add keyframes for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        .btn-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
            vertical-align: middle;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});