/**
 * Feedback functionality for CampusConnect
 * Handles submitting and managing student feedback
 */

// Load faculty for feedback
function loadFaculty() {
    const selectElement = document.getElementById('feedback-faculty');
    if (!selectElement) {
        console.error("feedback-faculty select element not found.");
        return;
    }
    
    try {
        const users = JSON.parse(localStorage.getItem('campus_users')) || [];
        const facultyMembers = users.filter(user => user.role === CONFIG.ROLES.FACULTY);
        
        selectElement.innerHTML = '<option value="">Select Faculty</option>';
        if (facultyMembers.length > 0) {
            facultyMembers.forEach(facultyMember => {
                const option = document.createElement('option');
                // Use a consistent ID, e.g., user.id if available, otherwise username
                option.value = facultyMember.id || facultyMember.username; 
                option.textContent = facultyMember.fullName || facultyMember.username; // Display fullName if available
                selectElement.appendChild(option);
            });
        } else {
            selectElement.innerHTML = '<option value="">No faculty found</option>';
        }
    } catch (error) {
        console.error('Error loading faculty from localStorage:', error);
        selectElement.innerHTML = '<option value="">Error loading faculty</option>';
    }
}

// Submit feedback
function submitFeedback() {
    const subject = document.getElementById('feedback-subject').value;
    const facultyId = document.getElementById('feedback-faculty').value; // This will be the faculty's username or ID
    const rating = document.querySelector('input[name="rating"]:checked')?.value;
    const comments = document.getElementById('feedback-comments').value;
    const messageElement = document.getElementById('feedback-message');
    
    if (!subject || !facultyId || !rating || !comments) {
        messageElement.textContent = 'Please fill in all fields';
        messageElement.className = 'message error-message';
        return;
    }
    
    try {
        const currentUser = getCurrentUser(); // Assumes this returns { username: '...', id: '...' (optional), ... }
        if (!currentUser || !currentUser.username) { // Check for username or a unique ID
            messageElement.textContent = 'Could not identify current user. Please log in.';
            messageElement.className = 'message error-message';
            return;
        }

        const allFeedback = JSON.parse(localStorage.getItem('campus_feedback')) || [];
        const newFeedback = {
            id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            subject,
            facultyId, // ID of the faculty member being reviewed
            facultyName: document.getElementById('feedback-faculty').selectedOptions[0]?.textContent || facultyId, // Store name for easier display
            rating: parseInt(rating),
            comments,
            studentId: currentUser.username, // ID of the student submitting
            studentName: currentUser.fullName || currentUser.username,
            submissionDate: new Date().toISOString()
        };

        allFeedback.push(newFeedback);
        localStorage.setItem('campus_feedback', JSON.stringify(allFeedback));
        
        messageElement.textContent = 'Feedback submitted successfully and stored locally.';
        messageElement.className = 'message success-message';
        const form = document.getElementById('submit-feedback-form');
        if (form) form.reset();

        // Optionally, if admin or faculty can view feedback, this would trigger a reload for them.
        // e.g., if (typeof loadAdminFeedbackView === 'function') loadAdminFeedbackView();

    } catch (error) {
        console.error('Error submitting feedback to localStorage:', error);
        messageElement.textContent = 'An error occurred while submitting feedback';
        messageElement.className = 'message error-message';
    }
}
