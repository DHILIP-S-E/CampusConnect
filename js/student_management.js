/**
 * Student Management Functions for CampusConnect
 * Handles viewing and editing student details
 */

// View student details in a modal
function viewStudentDetails(studentId) {
    // Fetch student data from API/storage
    simulateApiCall('GET_STUDENT_DETAILS', { studentId: studentId })
        .then(response => {
            if (response.success) {
                const student = response.student;
                
                // Create modal for student details
                const modalHTML = `
                    <div class="modal" id="viewStudentModal">
                        <div class="modal-content">
                            <span class="close-modal">&times;</span>
                            <h2>Student Details</h2>
                            <div class="student-info">
                                <p><strong>ID:</strong> ${student.id}</p>
                                <p><strong>Name:</strong> ${student.name}</p>
                                <p><strong>Email:</strong> ${student.email}</p>
                                <p><strong>Department:</strong> ${student.department}</p>
                                <p><strong>Year:</strong> ${student.year}</p>
                                <p><strong>Phone:</strong> ${student.phone || 'N/A'}</p>
                                <p><strong>Address:</strong> ${student.address || 'N/A'}</p>
                            </div>
                            <div class="modal-actions">
                                <button class="btn btn-primary" onclick="editStudentDetails('${student.id}')">Edit Details</button>
                                <button class="btn btn-secondary" onclick="closeModal('viewStudentModal')">Close</button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add modal to page
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                
                // Show modal
                const modal = document.getElementById('viewStudentModal');
                modal.style.display = 'block';
                
                // Close modal when clicking X
                document.querySelector('.close-modal').addEventListener('click', () => {
                    closeModal('viewStudentModal');
                });
                
                // Close modal when clicking outside
                window.addEventListener('click', (event) => {
                    if (event.target === modal) {
                        closeModal('viewStudentModal');
                    }
                });
            } else {
                showMessage('Failed to load student details', 'error');
            }
        })
        .catch(error => {
            console.error('Error viewing student details:', error);
            showMessage('An error occurred while loading student details', 'error');
        });
}

// Edit student details
function editStudentDetails(studentId) {
    // Close view modal if open
    closeModal('viewStudentModal');
    
    // Fetch student data
    simulateApiCall('GET_STUDENT_DETAILS', { studentId: studentId })
        .then(response => {
            if (response.success) {
                const student = response.student;
                
                // Create edit form modal
                const modalHTML = `
                    <div class="modal" id="editStudentModal">
                        <div class="modal-content">
                            <span class="close-modal">&times;</span>
                            <h2>Edit Student Details</h2>
                            <form id="edit-student-form">
                                <div class="form-group">
                                    <label for="student-name">Full Name</label>
                                    <input type="text" id="student-name" name="name" value="${student.name}" required>
                                </div>
                                <div class="form-group">
                                    <label for="student-email">Email</label>
                                    <input type="email" id="student-email" name="email" value="${student.email}" required>
                                </div>
                                <div class="form-group">
                                    <label for="student-department">Department</label>
                                    <input type="text" id="student-department" name="department" value="${student.department}" required>
                                </div>
                                <div class="form-group">
                                    <label for="student-year">Year</label>
                                    <select id="student-year" name="year" required>
                                        <option value="First Year" ${student.year === 'First Year' ? 'selected' : ''}>First Year</option>
                                        <option value="Second Year" ${student.year === 'Second Year' ? 'selected' : ''}>Second Year</option>
                                        <option value="Third Year" ${student.year === 'Third Year' ? 'selected' : ''}>Third Year</option>
                                        <option value="Fourth Year" ${student.year === 'Fourth Year' ? 'selected' : ''}>Fourth Year</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="student-phone">Phone</label>
                                    <input type="tel" id="student-phone" name="phone" value="${student.phone || ''}">
                                </div>
                                <div class="form-group">
                                    <label for="student-address">Address</label>
                                    <textarea id="student-address" name="address" rows="3">${student.address || ''}</textarea>
                                </div>
                                <input type="hidden" name="studentId" value="${student.id}">
                                <div class="form-actions">
                                    <button type="submit" class="btn btn-primary">Save Changes</button>
                                    <button type="button" class="btn btn-secondary" onclick="closeModal('editStudentModal')">Cancel</button>
                                </div>
                            </form>
                            <div id="edit-message" class="message"></div>
                        </div>
                    </div>
                `;
                
                // Add modal to page
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                
                // Show modal
                const modal = document.getElementById('editStudentModal');
                modal.style.display = 'block';
                
                // Close modal when clicking X
                document.querySelector('.close-modal').addEventListener('click', () => {
                    closeModal('editStudentModal');
                });
                
                // Close modal when clicking outside
                window.addEventListener('click', (event) => {
                    if (event.target === modal) {
                        closeModal('editStudentModal');
                    }
                });
                
                // Handle form submission
                document.getElementById('edit-student-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Get form data
                    const formData = {
                        studentId: this.elements['studentId'].value,
                        name: this.elements['name'].value,
                        email: this.elements['email'].value,
                        department: this.elements['department'].value,
                        year: this.elements['year'].value,
                        phone: this.elements['phone'].value,
                        address: this.elements['address'].value
                    };
                    
                    // Update student data
                    updateStudentDetails(formData);
                });
            } else {
                showMessage('Failed to load student details for editing', 'error');
            }
        })
        .catch(error => {
            console.error('Error editing student details:', error);
            showMessage('An error occurred while loading student details for editing', 'error');
        });
}

// Update student details in database/storage
function updateStudentDetails(formData) {
    // In a real app, this would send data to server
    simulateApiCall('UPDATE_STUDENT', formData)
        .then(response => {
            if (response.success) {
                showMessage('Student details updated successfully!', 'success', 'edit-message');
                
                // Close modal and refresh student list after delay
                setTimeout(() => {
                    closeModal('editStudentModal');
                    loadStudents(); // Refresh the student list
                }, 1500);
            } else {
                showMessage(response.message || 'Failed to update student details', 'error', 'edit-message');
            }
        })
        .catch(error => {
            console.error('Error updating student:', error);
            showMessage('An error occurred while updating student details', 'error', 'edit-message');
        });
}

// Helper function to close modals
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
    }
}

// Helper function to show messages
function showMessage(message, type, elementId = 'message') {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}-message`;
    } else {
        // Create a floating message if element doesn't exist
        const messageDiv = document.createElement('div');
        messageDiv.className = `floating-message ${type}-message`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Load students with basic filtering
function loadStudentList(yearFilter = 'all') {
    const tableBody = document.getElementById('students-table-body');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Show loading indicator
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Loading students...</td></tr>';
    
    // Fetch students data
    simulateApiCall('GET_STUDENTS', { yearFilter: yearFilter })
        .then(response => {
            if (response.success && response.students.length > 0) {
                // Clear loading indicator
                tableBody.innerHTML = '';
                
                // Add students to table
                response.students.forEach(student => {
                    const row = document.createElement('tr');
                    
                    row.innerHTML = `
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.department}</td>
                        <td>${student.year}</td>
                        <td>
                            <button class="btn btn-secondary btn-sm view-btn" data-id="${student.id}">View</button>
                            <button class="btn btn-primary btn-sm edit-btn" data-id="${student.id}">Edit</button>
                        </td>
                    `;
                    
                    tableBody.appendChild(row);
                });
                
                // Add event listeners to buttons
                document.querySelectorAll('.view-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const studentId = this.getAttribute('data-id');
                        viewStudentDetails(studentId);
                    });
                });
                
                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const studentId = this.getAttribute('data-id');
                        editStudentDetails(studentId);
                    });
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No students found.</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error loading students:', error);
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center error-message">Failed to load students.</td></tr>';
        });
}