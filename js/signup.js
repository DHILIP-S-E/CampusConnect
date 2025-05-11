/**
 * Signup Functions for CampusConnect
 * Handles user registration
 */

// Signup function
function signup() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;
    
    const errorMessageElement = document.getElementById('error-message');
    const successMessageElement = document.getElementById('success-message');
    
    errorMessageElement.textContent = '';
    successMessageElement.textContent = '';

    if (!fullName || !email || !username || !password || !confirmPassword || !role) {
        errorMessageElement.textContent = 'Please fill in all fields';
        return;
    }
    if (password !== confirmPassword) {
        errorMessageElement.textContent = 'Passwords do not match';
        return;
    }
    if (password.length < 6) { // Basic validation
        errorMessageElement.textContent = 'Password must be at least 6 characters long';
        return;
    }

    try {
        // For a frontend-only app, we'll store user data in localStorage.
        // In a real app, you'd want to hash passwords, but for this example, we'll store directly.
        // Consider that storing multiple users would require a more complex structure,
        // e.g., an array of users or an object keyed by username.
        // For simplicity, this example will overwrite if the username exists or just store one user.
        // A more robust solution would check if the username/email already exists.

        const users = JSON.parse(localStorage.getItem('campus_users')) || [];
        
        // Check if username or email already exists
        if (users.find(user => user.username === username)) {
            errorMessageElement.textContent = 'Username already exists. Please choose another.';
            return;
        }
        if (users.find(user => user.email === email)) {
            errorMessageElement.textContent = 'Email already registered. Please use a different email.';
            return;
        }

        const newUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Simple unique ID
            fullName,
            email,
            username,
            // Storing passwords in plain text in localStorage is highly insecure.
            // This is for demonstration purposes only in a frontend-only context.
            // In a real scenario, even for local storage, some form of obfuscation or
            // a clear warning about insecurity would be necessary if passwords must be stored.
            // Ideally, for a true frontend-only app with auth, you'd use a mock system
            // or a service like Firebase, or simply not handle passwords directly.
            password: password, // Storing plain text for simplicity of this exercise
            role,
            // Add department and year for students, similar to admin.js addUser
            department: role === CONFIG.ROLES.STUDENT ? 'N/A' : undefined, // Default or prompt if needed
            year: role === CONFIG.ROLES.STUDENT ? 'N/A' : undefined // Default or prompt if needed
        };

        users.push(newUser);
        localStorage.setItem('campus_users', JSON.stringify(users));

        successMessageElement.textContent = 'Account created successfully! Redirecting to login...';
        document.getElementById('signupForm').reset();
        
        setTimeout(() => {
            window.location.href = '../index.html'; // Redirect to login page
        }, 2000);

    } catch (error) {
        console.error('Signup error:', error);
        errorMessageElement.textContent = 'An error occurred during signup. Please try again.';
    }
}
