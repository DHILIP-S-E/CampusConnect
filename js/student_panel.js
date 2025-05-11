/**
 * Student Panel Functions for CampusConnect
 * Handles the slide-in panel for viewing and editing student details
 */

// Open the student details panel with student information
function viewStudentInPanel(studentId) {
    // Get the panel element
    const panel = document.getElementById('student-details-panel');
    const panelContent = panel.querySelector('.panel-content');
    
    // Show loading state
    panelContent.innerHTML = '<div class="loading">Loading student details...</div>';
    
    // Open the panel
    panel.classList.add('open');
    
    // Fetch student data
    simulateApiCall('GET_STUDENT_DETAILS', { studentId: studentId })
        .then(response => {
            if (response.success) {
                const student = response.student;
                
                // Get student initials for avatar
                const initials = getInitials(student.name);
                
                // Create the panel content with tabs
                panelContent.innerHTML = `
                    <div class="student-profile">
                        <div class="student-avatar">${initials}</div>
                        <div class="student-name">${student.name}</div>
                        <div class="student-id">${student.id}</div>
                    </div>
                    
                    <div class="panel-tabs">
                        <div class="panel-tab active" data-tab="basic">Basic Info</div>
                        <div class="panel-tab" data-tab="academic">Academic</div>
                        <div class="panel-tab" data-tab="attendance">Attendance</div>
                    </div>
                    
                    <div id="basic-tab" class="tab-content active">
                        <div class="detail-section">
                            <h4>Personal Information</h4>
                            <div class="detail-item">
                                <div class="detail-label">Email:</div>
                                <div class="detail-value">${student.email}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Phone:</div>
                                <div class="detail-value">${student.phone || 'Not provided'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Address:</div>
                                <div class="detail-value">${student.address || 'Not provided'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Date of Birth:</div>
                                <div class="detail-value">${student.dob || 'Not provided'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="academic-tab" class="tab-content">
                        <div class="detail-section">
                            <h4>Academic Information</h4>
                            <div class="detail-item">
                                <div class="detail-label">Department:</div>
                                <div class="detail-value">${student.department}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Year:</div>
                                <div class="detail-value">${student.year}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Enrollment Date:</div>
                                <div class="detail-value">${student.enrollmentDate || 'Not available'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Current GPA:</div>
                                <div class="detail-value">${student.gpa || 'Not available'}</div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Courses</h4>
                            ${student.courses && student.courses.length > 0 ? 
                                `<ul class="courses-list">
                                    ${student.courses.map(course => `<li>${course}</li>`).join('')}
                                </ul>` : 
                                '<p>No courses enrolled</p>'
                            }
                        </div>
                    </div>
                    
                    <div id="attendance-tab" class="tab-content">
                        <div class="detail-section">
                            <h4>Attendance Summary</h4>
                            <div class="detail-item">
                                <div class="detail-label">Average Rate:</div>
                                <div class="detail-value">${student.attendanceRate || '0'}%</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Last Attended:</div>
                                <div class="detail-value">${student.lastAttended || 'N/A'}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Absences:</div>
                                <div class="detail-value">${student.absences || '0'}</div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Recent Attendance</h4>
                            ${student.recentAttendance && student.recentAttendance.length > 0 ? 
                                `<table class="attendance-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Subject</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${student.recentAttendance.map(record => `
                                            <tr>
                                                <td>${record.date}</td>
                                                <td>${record.subject}</td>
                                                <td>${record.present ? 'Present' : 'Absent'}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>` : 
                                '<p>No attendance records available</p>'
                            }
                        </div>
                    </div>
                    
                    <div class="panel-actions">
                        <button class="btn btn-primary" onclick="editStudentInPanel('${student.id}')">Edit Details</button>
                        <button class="btn btn-secondary" onclick="printStudentDetails('${student.id}')">Print Details</button>
                    </div>
                `;
                
                // Add tab switching functionality
                panel.querySelectorAll('.panel-tab').forEach(tab => {
                    tab.addEventListener('click', function() {
                        // Remove active class from all tabs and contents
                        panel.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
                        panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                        
                        // Add active class to clicked tab and corresponding content
                        this.classList.add('active');
                        const tabId = this.getAttribute('data-tab') + '-tab';
                        document.getElementById(tabId).classList.add('active');
                    });
                });
            } else {
                panelContent.innerHTML = '<div class="error-message">Failed to load student details</div>';
            }
        })
        .catch(error => {
            console.error('Error loading student details:', error);
            panelContent.innerHTML = '<div class="error-message">An error occurred while loading student details</div>';
        });
    
    // Setup close button if not already set up
    if (!panel.querySelector('.close-panel').hasAttribute('listener')) {
        panel.querySelector('.close-panel').setAttribute('listener', 'true');
        panel.querySelector('.close-panel').addEventListener('click', closeStudentPanel);
    }
}

// Edit student details in the panel
function editStudentInPanel(studentId) {
    // Get the panel element
    const panel = document.getElementById('student-details-panel');
    const panelContent = panel.querySelector('.panel-content');
    
    // Show loading state
    panelContent.innerHTML = '<div class="loading">Loading student details...</div>';
    
    // Fetch student data
    simulateApiCall('GET_STUDENT_DETAILS', { studentId: studentId })
        .then(response => {
            if (response.success) {
                const student = response.student;
                
                // Create edit form in panel
                panelContent.innerHTML = `
                    <h4>Edit Student Details</h4>
                    <form id="edit-student-panel-form" class="edit-form">
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
                        <div class="form-group">
                            <label for="student-dob">Date of Birth</label>
                            <input type="date" id="student-dob" name="dob" value="${student.dob || ''}">
                        </div>
                        <input type="hidden" name="studentId" value="${student.id}">
                        
                        <div class="panel-actions">
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                            <button type="button" class="btn btn-secondary" onclick="viewStudentInPanel('${student.id}')">Cancel</button>
                        </div>
                    </form>
                    <div id="panel-message" class="message"></div>
                `;
                
                // Handle form submission
                document.getElementById('edit-student-panel-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Get form data
                    const formData = {
                        studentId: this.elements['studentId'].value,
                        name: this.elements['name'].value,
                        email: this.elements['email'].value,
                        department: this.elements['department'].value,
                        year: this.elements['year'].value,
                        phone: this.elements['phone'].value,
                        address: this.elements['address'].value,
                        dob: this.elements['dob'].value
                    };
                    
                    // Update student data
                    updateStudentFromPanel(formData);
                });
            } else {
                panelContent.innerHTML = '<div class="error-message">Failed to load student details for editing</div>';
            }
        })
        .catch(error => {
            console.error('Error loading student details for editing:', error);
            panelContent.innerHTML = '<div class="error-message">An error occurred while loading student details</div>';
        });
}

// Update student details from panel form
function updateStudentFromPanel(formData) {
    // Show saving message
    const messageElement = document.getElementById('panel-message');
    messageElement.textContent = 'Saving changes...';
    messageElement.className = 'message info-message';
    
    // In a real app, this would send data to server
    simulateApiCall('UPDATE_STUDENT', formData)
        .then(response => {
            if (response.success) {
                messageElement.textContent = 'Student details updated successfully!';
                messageElement.className = 'message success-message';
                
                // Refresh student list and show updated details after delay
                setTimeout(() => {
                    loadStudents(); // Refresh the student list
                    viewStudentInPanel(formData.studentId); // Show updated details
                }, 1500);
            } else {
                messageElement.textContent = response.message || 'Failed to update student details';
                messageElement.className = 'message error-message';
            }
        })
        .catch(error => {
            console.error('Error updating student:', error);
            messageElement.textContent = 'An error occurred while updating student details';
            messageElement.className = 'message error-message';
        });
}

// Close the student details panel
function closeStudentPanel() {
    const panel = document.getElementById('student-details-panel');
    panel.classList.remove('open');
}

// Print student details
function printStudentDetails(studentId) {
    // In a real app, this would format and print the student details
    simulateApiCall('GET_STUDENT_DETAILS', { studentId: studentId })
        .then(response => {
            if (response.success) {
                const student = response.student;
                
                // Create a new window for printing
                const printWindow = window.open('', '_blank');
                
                // Generate print content
                const printContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Student Details - ${student.name}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            h1 { text-align: center; margin-bottom: 20px; }
                            .section { margin-bottom: 20px; }
                            .section h2 { border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                            .detail-row { display: flex; margin-bottom: 8px; }
                            .detail-label { font-weight: bold; width: 150px; }
                            .school-info { text-align: center; margin-bottom: 30px; }
                            .print-date { text-align: right; font-size: 12px; margin-top: 50px; }
                        </style>
                    </head>
                    <body>
                        <div class="school-info">
                            <h1>CampusConnect</h1>
                            <p>Student Information Report</p>
                        </div>
                        
                        <div class="section">
                            <h2>Personal Information</h2>
                            <div class="detail-row">
                                <div class="detail-label">Student ID:</div>
                                <div>${student.id}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Full Name:</div>
                                <div>${student.name}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Email:</div>
                                <div>${student.email}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Phone:</div>
                                <div>${student.phone || 'Not provided'}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Address:</div>
                                <div>${student.address || 'Not provided'}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Date of Birth:</div>
                                <div>${student.dob || 'Not provided'}</div>
                            </div>
                        </div>
                        
                        <div class="section">
                            <h2>Academic Information</h2>
                            <div class="detail-row">
                                <div class="detail-label">Department:</div>
                                <div>${student.department}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Year:</div>
                                <div>${student.year}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Enrollment Date:</div>
                                <div>${student.enrollmentDate || 'Not available'}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Current GPA:</div>
                                <div>${student.gpa || 'Not available'}</div>
                            </div>
                        </div>
                        
                        <div class="print-date">
                            Printed on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
                        </div>
                    </body>
                    </html>
                `;
                
                // Write to the new window and print
                printWindow.document.open();
                printWindow.document.write(printContent);
                printWindow.document.close();
                
                // Print after content is loaded
                printWindow.onload = function() {
                    printWindow.print();
                };
            } else {
                alert('Failed to load student details for printing');
            }
        })
        .catch(error => {
            console.error('Error printing student details:', error);
            alert('An error occurred while preparing student details for printing');
        });
}

// Helper function to get initials from name
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}