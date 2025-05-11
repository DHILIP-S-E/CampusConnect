/**
 * Utility functions for CampusConnect
 */

// Debounce function to limit how often a function is called
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Format file size to human-readable format
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format target audience
function formatTarget(target) {
    if (target === 'all') return 'All Students';
    if (target === 'year1') return 'First Year';
    if (target === 'year2') return 'Second Year';
    if (target === 'year3') return 'Third Year';
    if (target === 'year4') return 'Fourth Year';
    return target;
}

// Load departments for filter
function loadDepartments() {
    const departmentFilter = document.getElementById('department-filter');
    
    // In a real application, this would fetch from the server
    const departments = [
        'Computer Science',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Business Administration',
        'Economics',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology'
    ];
    
    // Add departments to filter
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        departmentFilter.appendChild(option);
    });
}

// Perform bulk action on selected students
function performBulkAction(action, studentIds) {
    if (studentIds.length === 0) {
        alert('No students selected');
        return;
    }
    
    // In a real application, this would send the action to the server
    switch(action) {
        case 'export':
            alert(`Exporting data for ${studentIds.length} students`);
            break;
        case 'email':
            showEmailForm(studentIds);
            break;
        case 'certificate':
            showBulkCertificateForm(studentIds);
            break;
        case 'active':
            updateStudentStatus(studentIds, 'active');
            break;
        case 'inactive':
            updateStudentStatus(studentIds, 'inactive');
            break;
        default:
            alert(`Action "${action}" not implemented yet`);
    }
}

// Show email form for bulk emailing
function showEmailForm(studentIds) {
    // Create modal for email form
    const modalHTML = `
        <div class="modal" id="emailModal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Send Email to ${studentIds.length} Students</h2>
                <form id="email-form">
                    <div class="form-group">
                        <label for="email-subject">Subject</label>
                        <input type="text" id="email-subject" name="subject" required>
                    </div>
                    <div class="form-group">
                        <label for="email-message">Message</label>
                        <textarea id="email-message" name="message" rows="6" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="email-attachment" name="attachment">
                            Include attachment
                        </label>
                    </div>
                    <div class="form-group" id="attachment-group" style="display: none;">
                        <label for="email-file">Attachment</label>
                        <input type="file" id="email-file" name="file">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Send Email</button>
                        <button type="button" class="btn btn-secondary" id="cancel-email">Cancel</button>
                    </div>
                </form>
                <div id="email-message-status" class="message"></div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = document.getElementById('emailModal');
    modal.style.display = 'block';
    
    // Handle attachment checkbox
    document.getElementById('email-attachment').addEventListener('change', function() {
        document.getElementById('attachment-group').style.display = this.checked ? 'block' : 'none';
    });
    
    // Close modal when clicking X
    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
        modal.remove();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            modal.remove();
        }
    });
    
    // Cancel button handler
    document.getElementById('cancel-email').addEventListener('click', () => {
        modal.style.display = 'none';
        modal.remove();
    });
    
    // Form submission
    document.getElementById('email-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const messageElement = document.getElementById('email-message-status');
        messageElement.textContent = 'Sending emails...';
        messageElement.className = 'message info-message';
        
        // In a real app, this would send the emails
        setTimeout(() => {
            messageElement.textContent = `Emails sent successfully to ${studentIds.length} students!`;
            messageElement.className = 'message success-message';
            
            // Close modal after delay
            setTimeout(() => {
                modal.style.display = 'none';
                modal.remove();
            }, 1500);
        }, 1000);
    });
}

// Update status for multiple students
function updateStudentStatus(studentIds, status) {
    // In a real app, this would update the status on the server
    alert(`Updating ${studentIds.length} students to status: ${status}`);
    
    // Simulate API call and refresh
    setTimeout(() => {
        alert('Status updated successfully!');
        loadStudents(); // Refresh the student list
    }, 1000);
}

// Export student data
function exportStudentData(yearFilter, departmentFilter, searchQuery) {
    // In a real app, this would generate and download a file
    alert('Exporting student data...');
    
    // Create export options modal
    const modalHTML = `
        <div class="modal" id="exportModal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Export Student Data</h2>
                <form id="export-form">
                    <div class="form-group">
                        <label>Export Format</label>
                        <div class="radio-group">
                            <label>
                                <input type="radio" name="format" value="csv" checked> CSV
                            </label>
                            <label>
                                <input type="radio" name="format" value="excel"> Excel
                            </label>
                            <label>
                                <input type="radio" name="format" value="pdf"> PDF
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Include Fields</label>
                        <div class="checkbox-group">
                            <label>
                                <input type="checkbox" name="fields" value="id" checked> Student ID
                            </label>
                            <label>
                                <input type="checkbox" name="fields" value="name" checked> Name
                            </label>
                            <label>
                                <input type="checkbox" name="fields" value="email" checked> Email
                            </label>
                            <label>
                                <input type="checkbox" name="fields" value="department" checked> Department
                            </label>
                            <label>
                                <input type="checkbox" name="fields" value="year" checked> Year
                            </label>
                            <label>
                                <input type="checkbox" name="fields" value="phone"> Phone
                            </label>
                            <label>
                                <input type="checkbox" name="fields" value="address"> Address
                            </label>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Export</button>
                        <button type="button" class="btn btn-secondary" id="cancel-export">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = document.getElementById('exportModal');
    modal.style.display = 'block';
    
    // Close modal when clicking X
    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
        modal.remove();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            modal.remove();
        }
    });
    
    // Cancel button handler
    document.getElementById('cancel-export').addEventListener('click', () => {
        modal.style.display = 'none';
        modal.remove();
    });
    
    // Form submission
    document.getElementById('export-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const format = document.querySelector('input[name="format"]:checked').value;
        const fields = Array.from(document.querySelectorAll('input[name="fields"]:checked'))
            .map(checkbox => checkbox.value);
        
        // In a real app, this would generate and download the file
        alert(`Exporting student data in ${format.toUpperCase()} format with fields: ${fields.join(', ')}`);
        
        // Close modal
        modal.style.display = 'none';
        modal.remove();
    });
}

// View student attendance
function viewStudentAttendance(studentId) {
    alert(`Viewing attendance for student ID: ${studentId}`);
    // This would be implemented to show detailed attendance records
}

// Manage student certificates
function manageStudentCertificates(studentId) {
    alert(`Managing certificates for student ID: ${studentId}`);
    // This would be implemented to manage certificates
}

// Manage student grades
function manageStudentGrades(studentId) {
    alert(`Managing grades for student ID: ${studentId}`);
    // This would be implemented to manage grades
}

// Change student status
function changeStudentStatus(studentId) {
    // Create modal for status change
    const modalHTML = `
        <div class="modal" id="statusModal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Change Student Status</h2>
                <form id="status-form">
                    <div class="form-group">
                        <label for="student-status">Status</label>
                        <select id="student-status" name="status" required>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                            <option value="graduated">Graduated</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="status-reason">Reason for Change</label>
                        <textarea id="status-reason" name="reason" rows="3"></textarea>
                    </div>
                    <input type="hidden" name="studentId" value="${studentId}">
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Update Status</button>
                        <button type="button" class="btn btn-secondary" id="cancel-status">Cancel</button>
                    </div>
                </form>
                <div id="status-message" class="message"></div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = document.getElementById('statusModal');
    modal.style.display = 'block';
    
    // Close modal when clicking X
    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
        modal.remove();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            modal.remove();
        }
    });
    
    // Cancel button handler
    document.getElementById('cancel-status').addEventListener('click', () => {
        modal.style.display = 'none';
        modal.remove();
    });
    
    // Form submission
    document.getElementById('status-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            studentId: this.elements['studentId'].value,
            status: this.elements['status'].value,
            reason: this.elements['reason'].value
        };
        
        const messageElement = document.getElementById('status-message');
        messageElement.textContent = 'Updating student status...';
        messageElement.className = 'message info-message';
        
        // In a real app, this would update the status on the server
        setTimeout(() => {
            messageElement.textContent = 'Student status updated successfully!';
            messageElement.className = 'message success-message';
            
            // Close modal and refresh student list after delay
            setTimeout(() => {
                modal.style.display = 'none';
                modal.remove();
                loadStudents(); // Refresh the student list
            }, 1500);
        }, 1000);
    });
}