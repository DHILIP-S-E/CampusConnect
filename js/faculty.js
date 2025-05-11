/**
 * Faculty Dashboard Main JavaScript
 * Handles core functionality for the faculty dashboard
 */

// Initialize the faculty dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and has faculty role
    if (!checkPermission()) {
        window.location.href = '../index.html';
        return;
    }
    
    // Set up event listeners for the add student button
    setupAddStudentButton();
    
    // Set up event listeners for other dashboard elements
    setupDashboardListeners();
});

// Check if user has permission to access faculty dashboard
function checkPermission() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'faculty') {
        alert('You do not have permission to access this page.');
        return false;
    }
    return true;
}

// Set up the add student button
function setupAddStudentButton() {
    const addStudentBtn = document.getElementById('add-student-btn');
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', function() {
            if (typeof addNewStudent === 'function') {
                addNewStudent();
            } else {
                console.error('addNewStudent function is not defined');
                alert('Unable to add student. Please try again later.');
            }
        });
    }
}

// Set up event listeners for dashboard elements
function setupDashboardListeners() {
    // Set up navigation links
    document.getElementById('nav-dashboard').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('dashboard-section');
        loadDashboardData();
    });
    
    document.getElementById('nav-materials').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('materials-section');
        if (typeof loadMaterials === 'function') {
            loadMaterials();
        }
    });
    
    document.getElementById('nav-students').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('students-section');
        if (typeof loadStudents === 'function') {
            loadStudents();
        }
    });
    
    document.getElementById('nav-attendance').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('attendance-section');
    });
    
    document.getElementById('nav-certificates').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('certificates-section');
        if (typeof loadStudentsForCertificate === 'function') {
            loadStudentsForCertificate();
        }
    });
    
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}

// Show the specified section and hide others
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // In a real application, these would be actual API calls
        const materialsResponse = await simulateApiCall('GET_MATERIALS');
        const studentsResponse = await simulateApiCall('GET_STUDENTS');
        const attendanceResponse = await simulateApiCall('GET_ATTENDANCE_STATS');
        const certificatesResponse = await simulateApiCall('GET_CERTIFICATES');
        
        // Update dashboard stats
        if (materialsResponse.success) {
            document.getElementById('total-materials').textContent = materialsResponse.materials.length;
        }
        
        if (studentsResponse.success) {
            document.getElementById('total-students').textContent = studentsResponse.students.length;
        }
        
        if (attendanceResponse.success) {
            document.getElementById('attendance-rate').textContent = attendanceResponse.averageRate + '%';
        }
        
        if (certificatesResponse.success) {
            document.getElementById('total-certificates').textContent = certificatesResponse.certificates.length;
        }
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Simulate API call for dashboard data
function simulateApiCall(endpoint, data = {}) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Check if we have custom students in localStorage
            const customStudents = JSON.parse(localStorage.getItem('custom_students') || '[]');
            
            switch (endpoint) {
                case 'GET_MATERIALS':
                    resolve({
                        success: true,
                        materials: Array(12).fill().map((_, i) => ({ id: 'mat' + i }))
                    });
                    break;
                case 'GET_STUDENTS':
                    // Use custom students if available, otherwise use demo data
                    if (customStudents.length > 0) {
                        resolve({
                            success: true,
                            students: customStudents
                        });
                    } else {
                        resolve({
                            success: true,
                            students: Array(45).fill().map((_, i) => ({ 
                                id: 'std' + i,
                                name: `Student ${i}`,
                                email: `student${i}@example.com`,
                                department: i % 3 === 0 ? 'Computer Science' : i % 3 === 1 ? 'Electrical Engineering' : 'Business Administration',
                                year: i % 4 === 0 ? 'First Year' : i % 4 === 1 ? 'Second Year' : i % 4 === 2 ? 'Third Year' : 'Fourth Year',
                                status: 'active'
                            }))
                        });
                    }
                    break;
                case 'GET_ATTENDANCE_STATS':
                    resolve({
                        success: true,
                        averageRate: 85
                    });
                    break;
                case 'GET_CERTIFICATES':
                    resolve({
                        success: true,
                        certificates: Array(8).fill().map((_, i) => ({ id: 'cert' + i }))
                    });
                    break;
                case 'GET_STUDENT_DETAILS':
                    // Check if we have this student in custom students
                    const studentId = data.studentId;
                    const customStudent = customStudents.find(s => s.id === studentId);
                    
                    if (customStudent) {
                        resolve({
                            success: true,
                            student: customStudent
                        });
                    } else {
                        // Generate demo student data
                        resolve({
                            success: true,
                            student: {
                                id: studentId,
                                name: `Student ${studentId.replace('std', '')}`,
                                email: `student${studentId.replace('std', '')}@example.com`,
                                department: 'Computer Science',
                                year: 'Second Year',
                                phone: '123-456-7890',
                                address: '123 Campus Street, University City',
                                dob: '2000-01-01',
                                enrollmentDate: '2022-09-01',
                                gpa: '3.5',
                                courses: ['Introduction to Programming', 'Data Structures', 'Database Systems'],
                                lastAttended: '2023-10-15',
                                absences: '3',
                                attendanceRate: '92',
                                status: 'active'
                            }
                        });
                    }
                    break;
                default:
                    resolve({
                        success: true,
                        message: 'Operation completed successfully'
                    });
            }
        }, 300);
    });
}