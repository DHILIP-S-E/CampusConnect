/**
 * Certificate Functions for CampusConnect
 * Handles functionality for managing certificates
 */

// Load students for certificate dropdown
function loadStudentsForCertificate() {
    console.log('Loading students for certificate dropdown');
    const certificateStudentSelect = document.getElementById('certificate-student'); // This ID might be on admin or faculty page
    
    if (!certificateStudentSelect) {
        console.error('certificate-student select element not found');
        return;
    }
    certificateStudentSelect.innerHTML = '<option value="">Loading students...</option>';
    
    try {
        const users = JSON.parse(localStorage.getItem('campus_users')) || [];
        const students = users.filter(user => user.role === CONFIG.ROLES.STUDENT);
        
        certificateStudentSelect.innerHTML = '<option value="">Select Student</option>';
        if (students.length > 0) {
            students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id || student.username; // Use a consistent student identifier
                option.textContent = `${student.fullName || student.username} (${student.id || student.username})`;
                certificateStudentSelect.appendChild(option);
            });
            console.log('Students loaded successfully for certificate dropdown:', students.length);
        } else {
            certificateStudentSelect.innerHTML = '<option value="">No students found</option>';
        }
    } catch (error) {
        console.error('Error loading students for certificate dropdown from localStorage:', error);
        certificateStudentSelect.innerHTML = '<option value="">Error loading students</option>';
    }
}

// Issue certificate function
function issueCertificate() {
    const form = document.getElementById('issue-certificate-form'); // This ID should be on the form in admin/faculty page
    const messageElement = document.getElementById('certificate-message'); // Message element near the form
    
    if (!form || !messageElement) {
        console.error('Certificate form or message element not found');
        alert('Error: Certificate form elements are missing.');
        return;
    }
    
    // Ensure form elements have `name` attributes for `form.elements` to work by name, or use `getElementById`
    const studentId = document.getElementById('certificate-student').value; // Assuming the select has id 'certificate-student'
    const certificateType = document.getElementById('certificate-type').value; // Assuming input id 'certificate-type'
    const courseName = document.getElementById('certificate-course').value; // Assuming input id 'certificate-course'
    const issueDate = document.getElementById('certificate-date').value; // Assuming input id 'certificate-date'
    
    if (!studentId || !certificateType || !courseName || !issueDate) {
        messageElement.textContent = 'Please fill in all required fields';
        messageElement.className = 'message error-message';
        return;
    }
    
    const currentUser = getCurrentUser(); // Assumes this returns { username: '...', fullName: '...', ... }
    if (!currentUser || !currentUser.username) {
        messageElement.textContent = 'Could not identify current user (issuer). Please log in.';
        messageElement.className = 'message error-message';
        return;
    }

    const certificateData = {
        id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        studentId: studentId, // This is the ID/username of the student receiving the certificate
        certificateType: certificateType,
        courseName: courseName,
        issueDate: issueDate,
        issuedByUsername: currentUser.username, // Username of faculty/admin issuing
        issuedByName: currentUser.fullName || currentUser.username, // Name of faculty/admin
        timestamp: new Date().toISOString()
    };
    
    try {
        const allCertificates = JSON.parse(localStorage.getItem('campus_certificates')) || [];
        allCertificates.push(certificateData);
        localStorage.setItem('campus_certificates', JSON.stringify(allCertificates));
        
        messageElement.textContent = `Certificate issued successfully and stored locally!`;
        messageElement.className = 'message success-message';
        form.reset();
            
        // If on admin page, and admin dashboard data shows certificate counts, reload it
        if (typeof loadAdminDashboardData === 'function') {
            loadAdminDashboardData();
        }
        // If on faculty page, and faculty dashboard data shows certificate counts, reload it
        if (typeof loadDashboardData === 'function' && currentUser.role === CONFIG.ROLES.FACULTY) {
            loadDashboardData(); // This function name is generic, ensure it's the correct one for faculty dashboard
        }
        // If there's a list of issued certificates visible on the current page (e.g., admin viewing all certs), reload it.
        // e.g., if (typeof loadAllIssuedCertificates === 'function') loadAllIssuedCertificates();

    } catch (error) {
        console.error('Error issuing certificate to localStorage:', error);
        messageElement.textContent = 'An error occurred while issuing the certificate';
        messageElement.className = 'message error-message';
    }
}
