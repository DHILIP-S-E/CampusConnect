/**
 * Faculty Student Management Module
 * Handles viewing, editing, and adding students
 */

// View student details
function viewStudent(studentId) {
    // Get student data
    getStudentData(studentId)
        .then(student => {
            if (student) {
                showStudentDetailsModal(student);
            } else {
                alert('Student not found');
            }
        })
        .catch(error => {
            console.error('Error viewing student:', error);
            alert('An error occurred while loading student details');
        });
}

// Show student details modal
function showStudentDetailsModal(student) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal" id="studentDetailsModal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Student Details</h2>
                
                <div class="student-details-tabs">
                    <button class="tab-btn active" data-tab="personal">Personal Info</button>
                    <button class="tab-btn" data-tab="academic">Academic</button>
                    <button class="tab-btn" data-tab="attendance">Attendance</button>
                </div>
                
                <div class="tab-content" id="personal-tab" style="display: block;">
                    <h3>Personal Information</h3>
                    <div class="student-details">
                        <p><strong>ID:</strong> ${student.id}</p>
                        <p><strong>Name:</strong> ${student.name}</p>
                        <p><strong>Email:</strong> ${student.email}</p>
                        <p><strong>Phone:</strong> ${student.phone || 'N/A'}</p>
                        <p><strong>Address:</strong> ${student.address || 'N/A'}</p>
                        <p><strong>Date of Birth:</strong> ${student.dob || 'N/A'}</p>
                    </div>
                </div>
                
                <div class="tab-content" id="academic-tab" style="display: none;">
                    <h3>Academic Information</h3>
                    <div class="student-details">
                        <p><strong>Department:</strong> ${student.department}</p>
                        <p><strong>Year:</strong> ${student.year}</p>
                        <p><strong>Enrollment Date:</strong> ${student.enrollmentDate || 'N/A'}</p>
                        <p><strong>Current GPA:</strong> ${student.gpa || 'N/A'}</p>
                    </div>
                </div>
                
                <div class="tab-content" id="attendance-tab" style="display: none;">
                    <h3>Attendance Information</h3>
                    <div class="student-attendance">
                        <p><strong>Average Attendance Rate:</strong> ${student.attendanceRate || '85'}%</p>
                        <div class="attendance-chart">
                            <div class="attendance-bar" style="width: ${student.attendanceRate || '85'}%;">${student.attendanceRate || '85'}%</div>
                        </div>
                        <p><strong>Last Attended:</strong> ${student.lastAttended || 'N/A'}</p>
                        <p><strong>Absences This Semester:</strong> ${student.absences || '3'}</p>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="editStudent('${student.id}')">Edit Details</button>
                    <button class="btn btn-secondary" onclick="printStudentDetails('${student.id}')">Print Details</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the page
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Show the modal
    const modal = document.getElementById('studentDetailsModal');
    modal.style.display = 'block';
    
    // Setup tab functionality
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.style.display = 'none';
            });
            
            // Remove active class from all buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show the selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).style.display = 'block';
            
            // Add active class to the clicked button
            this.classList.add('active');
        });
    });
    
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
}

// Get student data
function getStudentData(studentId) {
    return new Promise((resolve, reject) => {
        try {
            // First check custom students
            const customStudents = JSON.parse(localStorage.getItem('custom_students') || '[]');
            const customStudent = customStudents.find(s => s.id === studentId);
            
            if (customStudent) {
                resolve(customStudent);
                return;
            }
            
            // If not found in custom students, use demo data
            const demoStudents = {
                'std1': {
                    id: 'std1',
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    department: 'Computer Science',
                    year: 'Second Year',
                    phone: '123-456-7890',
                    address: '123 Campus Street, University City',
                    dob: '2000-05-15',
                    enrollmentDate: '2022-09-01',
                    gpa: '3.8',
                    attendanceRate: '92',
                    lastAttended: '2023-10-15',
                    absences: '2'
                },
                'std2': {
                    id: 'std2',
                    name: 'Jane Smith',
                    email: 'jane.smith@example.com',
                    department: 'Mathematics',
                    year: 'First Year',
                    phone: '987-654-3210',
                    address: '456 University Ave, College Town',
                    dob: '2001-08-22',
                    enrollmentDate: '2023-09-01',
                    gpa: '3.9',
                    attendanceRate: '95',
                    lastAttended: '2023-10-16',
                    absences: '1'
                },
                'std3': {
                    id: 'std3',
                    name: 'Robert Johnson',
                    email: 'robert.johnson@example.com',
                    department: 'Physics',
                    year: 'Third Year',
                    phone: '555-123-4567',
                    address: '789 Science Blvd, Research City',
                    dob: '1999-03-10',
                    enrollmentDate: '2021-09-01',
                    gpa: '3.5',
                    attendanceRate: '88',
                    lastAttended: '2023-10-14',
                    absences: '4'
                }
            };
            
            if (demoStudents[studentId]) {
                resolve(demoStudents[studentId]);
            } else {
                // Create a generic student object if ID not found
                resolve({
                    id: studentId,
                    name: 'Student ' + studentId,
                    email: `student${studentId}@example.com`,
                    department: 'General Studies',
                    year: 'First Year',
                    enrollmentDate: '2023-09-01',
                    attendanceRate: '85'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

// Print student details
function printStudentDetails(studentId) {
    alert('Printing student details for ID: ' + studentId);
    // In a real implementation, this would format and print the student details
}