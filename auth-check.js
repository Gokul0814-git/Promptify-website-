// auth-check.js - Client-side authentication check

// Check authentication immediately, before DOM loads
(function() {
    const username = localStorage.getItem('promptify.username');
    const currentPath = window.location.pathname;
    
    // If not authenticated and not on login/signup pages, redirect to login immediately
    if (!username && !currentPath.includes('login.html') && !currentPath.includes('signup.html')) {
        window.location.replace('/login.html');
        return;
    }
    
    // If authenticated and on login/signup pages, redirect to main page
    if (username && (currentPath.includes('login.html') || currentPath.includes('signup.html'))) {
        window.location.replace('/');
        return;
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Double-check authentication after DOM loads
    const username = localStorage.getItem('promptify.username');
    
    // Update UI to show logged-in user if on main page
    if (username && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
        updateUIForLoggedInUser(username);
    }
});

function updateUIForLoggedInUser(username) {
    // Update navigation to show user info
    const navButtons = document.getElementById('navButtons');
    if (navButtons) {
        navButtons.innerHTML = `
            <button class="btn-username" style="cursor:default;background:transparent;color:var(--text-light);font-weight:600;border:none;">👤 ${username}</button>
            <button class="btn-logout" onclick="logout()">Logout</button>
        `;
    }
}

function logout() {
    localStorage.removeItem('promptify.username');
    window.location.replace('/login.html');
}
