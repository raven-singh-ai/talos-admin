/**
 * TalosPro Tab Synchronization
 * Ensures admin state syncs across multiple browser tabs
 */

// Listen for storage changes from other tabs
window.addEventListener('storage', function(e) {
    console.log('[TabSync] Storage event:', e.key, e.newValue);
    
    // If admin token was removed in another tab, log out this tab too
    if (e.key === 'adminToken' && !e.newValue) {
        console.log('[TabSync] Token removed - redirecting to login');
        window.location.href = '/index.html';
    }
    
    // If admin token was added in another tab, refresh dashboard
    if (e.key === 'adminToken' && e.newValue && window.location.pathname.includes('index.html')) {
        console.log('[TabSync] Token added - redirecting to dashboard');
        window.location.href = '/dashboard.html';
    }
});

// Enhanced logout function with tab sync
function logout() {
    if (confirm('Are you sure you want to sign out?')) {
        console.log('[TabSync] Logging out...');
        
        // Remove token (this triggers storage event in other tabs)
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('rememberMe');
        
        // Redirect this tab
        window.location.href = '/index.html';
    }
}

// Check token on page load
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('adminToken');
    const currentPath = window.location.pathname;
    
    console.log('[TabSync] Page load - path:', currentPath, 'token:', !!token);
    
    // Redirect to dashboard if logged in and on login page
    if (token && (currentPath.endsWith('index.html') || currentPath === '/')) {
        console.log('[TabSync] Already logged in - redirecting to dashboard');
        window.location.href = '/dashboard.html';
    }
    
    // Redirect to login if not logged in and on protected page
    if (!token && !currentPath.endsWith('index.html') && currentPath !== '/') {
        console.log('[TabSync] Not logged in - redirecting to login');
        window.location.href = '/index.html';
    }
});

// Heartbeat to detect token expiry (check every 30 seconds)
setInterval(function() {
    const token = localStorage.getItem('adminToken');
    const currentPath = window.location.pathname;
    
    if (!token && !currentPath.endsWith('index.html') && currentPath !== '/') {
        console.log('[TabSync] Token expired - redirecting to login');
        window.location.href = '/index.html';
    }
}, 30000);

console.log('[TabSync] Initialized');
