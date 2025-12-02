/**
 * Simple Authentication Logic
 * For demonstration purposes only.
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMsg');
            const btn = loginForm.querySelector('button[type="submit"]');
            
            // Loading state
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Hardcoded credentials: admin@dash.com / admin123
                if (email === 'admin@dash.com' && password === 'admin123') {
                    // Success
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', email);
window.location.href = 'index.php';
                } else {
                    // Error
                    errorMsg.classList.remove('d-none');
                    errorMsg.textContent = 'Invalid email or password.';
                    
                    // Reset button
                    btn.innerHTML = originalBtnText;
                    btn.disabled = false;
                    
                    // Shake animation
                    const card = document.querySelector('.login-card');
                    card.classList.add('animate__animated', 'animate__shakeX');
                    setTimeout(() => {
                        card.classList.remove('animate__animated', 'animate__shakeX');
                    }, 1000);
                }
            }, 1500);
        });
    }
});

// Check auth on protected pages
function checkAuth() {
    const isLoginPage = window.location.pathname.includes('login.php');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn && !isLoginPage) {
        window.location.href = 'login.php';
    } else if (isLoggedIn && isLoginPage) {
        window.location.href = 'index.php';
    }
}

// Run check immediately if not on login page
if (!window.location.pathname.includes('login.php')) {
    checkAuth();
}
