/**
 * Faculty Functions - Add Student Module
 * Handles functionality for adding new students
 */

// Add new student function
function addNewStudent() {
    // Create a modal for adding a new student
    const modalHTML = `
        <div class="modal" id="addStudentModal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Add New Student</h2>
                <form id="add-student-form">
                    <div class="form-group">
                        <label for="student-name">Full Name</label>
                        <input type="text" id="student-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="student-email">Email</label>
                        <input type="email" id="student-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="student-department">Department</label>
                        <input type="text" id="student-department" name="department" required>
                    </div>
                    <div class="form-group">
                        <label for="student-year">Year</label>
                        <select id="student-year" name="year" required>
                            <option value="First Year">First Year</option>
                            <option value="Second Year">Second Year</option>
                            <option value="Third Year">Third Year</option>
                            <option value="Fourth Year">Fourth Year</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="student-phone">Phone</label>
                        <input type="tel" id="student-phone" name="phone">
                    </div>
                    <div class="form-group">
                        <label for="student-address">Address</label>
                        <textarea id="student-address" name="address" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="student-dob">Date of Birth</label>
                        <input type="date" id="student-dob" name="dob">
                    </div>
                    <div class="form-group">
                        <label for="student-username">Username</label>
                        <input type="text" id="student-username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="student-password">Password</label>
                        <input type="password" id="student-password" name="password" required>
                        <p class="help-text">Password must be at least 8 characters long.</p>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Add Student</button>
                        <button type="button" class="btn btn-secondary" id="cancel-add-student">Cancel</button>
                    </div>
                </form>
                <div id="add-student-message" class="message"></div>
            </div>
        </div>
    `;
    
    // Add modal to the page
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Show the modal
    const modal = document.getElementById('addStudentModal');
    modal.style.display = 'block';
    
    // Close modal when clicking the X
    document.querySelector('.close-modal').addEventListener('click', function() {
        modal.style.display = 'none';
        modal.remove();
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            modal.remove();
        }
    });
    
    // Cancel button handler
    document.getElementById('cancel-add-student').addEventListener('click', function() {
        modal.style.display = 'none';
        modal.remove();
    });
    
    // Form submission handler
    document.getElementById('add-student-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: this.elements['name'].value,
            email: this.elements['email'].value,
            department: this.elements['department'].value,
            year: this.elements['year'].value,
            phone: this.elements['phone'].value,
            address: this.elements['address'].value,
            dob: this.elements['dob'].value,
            username: this.elements['username'].value,
            password: this.elements['password'].value,
            role: 'student'
        };
        
        // Validate password
        if (formData.password.length < 8) {
            const messageElement = document.getElementById('add-student-message');
            messageElement.textContent = 'Password must be at least 8 characters long.';
            messageElement.className = 'message error-message';
            return;
        }
        
        // In a real application, this would be an actual API call
        simulateAddStudent(formData)
            .then(response => {
                if (response.success) {
                    const messageElement = document.getElementById('add-student-message');
                    messageElement.textContent = 'Student added successfully!';
                    messageElement.className = 'message success-message';
                    
                    // Also add to demo_users for login
                    const existingUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
                    existingUsers.push({
                        id: response.student.id,
                        fullName: formData.name,
                        email: formData.email,
                        username: formData.username,
                        role: 'student',
                        createdAt: new Date().toISOString()
                    });
                    localStorage.setItem('demo_users', JSON.stringify(existingUsers));
                    
                    // Close modal and refresh student list after a delay
                    setTimeout(() => {
                        modal.style.display = 'none';
                        modal.remove();
                        loadStudents(); // Refresh the student list
                    }, 1500);
                } else {
                    const messageElement = document.getElementById('add-student-message');
                    messageElement.textContent = response.message || 'Failed to add student';
                    messageElement.className = 'message error-message';
                }
            })
            .catch(error => {
                console.error('Error adding student:', error);
                const messageElement = document.getElementById('add-student-message');
                messageElement.textContent = 'An error occurred while adding student';
                messageElement.className = 'message error-message';
            });
    });
}

// Simulate adding a student
function simulateAddStudent(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Generate a unique ID for the new student
            const newStudentId = 'std' + Math.floor(Math.random() * 10000);
            
            // Create the new student object
            const newStudent = {
                id: newStudentId,
                name: data.name,
                email: data.email,
                department: data.department,
                year: data.year,
                phone: data.phone || '',
                address: data.address || '',
                dob: data.dob || '',
                enrollmentDate: new Date().toISOString().split('T')[0],
                status: 'active'
            };
            
            // Save to localStorage for persistence
            const existingStudents = JSON.parse(localStorage.getItem('custom_students') || '[]');
            existingStudents.push(newStudent);
            localStorage.setItem('custom_students', JSON.stringify(existingStudents));
            
            resolve({
                success: true,
                message: 'Student added successfully',
                student: newStudent
            });
        }, 500); // Simulate network delay
    });
}