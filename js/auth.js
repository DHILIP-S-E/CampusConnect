/**
 * Authentication Functions for CampusConnect
 * Handles user login, signup, and session management
 */

// Check if user is logged in
function isLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null || localStorage.getItem('currentUser') !== null;
}

// Logout function
function logout() {
    try {
        // Clear session storage
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('currentUser');
        
        // Redirect to login page
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Error during logout:', error);
        alert('An error occurred during logout. Please try again.');
    }
}