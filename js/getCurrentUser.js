/**
 * User Management Functions for CampusConnect
 * Handles user authentication and session management
 */

// Get the currently logged in user
function getCurrentUser() {
    try {
        // Prioritize localStorage as index.html login logic uses it
        let userJson = localStorage.getItem('currentUser');
        if (userJson) {
            return JSON.parse(userJson);
        }
        
        // Fallback to sessionStorage if not found in localStorage
        userJson = sessionStorage.getItem('currentUser');
        if (userJson) {
            return JSON.parse(userJson);
        }
        
        // If no user is found in either, return null
        return null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Check if user has permission to access pages based on a requiredRole
function checkPermission(requiredRole) {
    const user = getCurrentUser();
    if (!user) {
        return false;
    }
    
    return user.role === requiredRole;
}
