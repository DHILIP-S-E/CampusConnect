/**
 * Initialization script for CampusConnect
 * Sets up event listeners and initializes the application
 */

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('CampusConnect initializing...');
    
    // Add default users if none exist
    addDefaultUsers();

    // Set up the Add Student button
    setupAddStudentButton();
});

// Function to add default users to localStorage
function addDefaultUsers() {
    const usersKey = 'campus_users';
    let users = JSON.parse(localStorage.getItem(usersKey)) || [];

    // Check if default users already exist to avoid duplicates
    const adminExists = users.some(user => user.username === 'adminuser');
    const facultyExists = users.some(user => user.username === 'facultyuser');
    const studentExists = users.some(user => user.username === 'studentuser');

    if (!adminExists) {
        users.push({
            id: 'admin_default_01',
            fullName: 'Admin User',
            email: 'admin@example.com',
            username: 'adminuser',
            password: 'password123', // Storing plain text for demo purposes
            role: 'admin',
            department: 'Administration',
            year: 'N/A'
        });
    }

    if (!facultyExists) {
        users.push({
            id: 'faculty_default_01',
            fullName: 'Faculty User',
            email: 'faculty@example.com',
            username: 'facultyuser',
            password: 'password123',
            role: 'faculty',
            department: 'Computer Science',
            year: 'N/A' 
        });
    }

    if (!studentExists) {
        users.push({
            id: 'student_default_01',
            fullName: 'Student User',
            email: 'student@example.com',
            username: 'studentuser',
            password: 'password123',
            role: 'student',
            department: 'Computer Science',
            year: 'Second Year',
            phone: '123-456-0000',
            address: '789 University Lane',
            dob: '2002-06-10',
            enrollmentDate: '2023-09-01'
        });
    }

    // Save back to localStorage only if new users were added
    if (!adminExists || !facultyExists || !studentExists) {
        localStorage.setItem(usersKey, JSON.stringify(users));
        console.log('Default users added to localStorage.');
    } else {
        console.log('Default users already exist or no new default users to add.');
    }

    if (!adminExists || !facultyExists || !studentExists) {
        localStorage.setItem(usersKey, JSON.stringify(users));
        console.log('Default users added to localStorage.');
    } else {
        console.log('Default users already exist or no new default users to add.');
    }

    // Add sample departments if none exist
    const departmentsKey = 'campus_departments';
    let departments = JSON.parse(localStorage.getItem(departmentsKey)) || [];
    if (departments.length === 0) {
        departments = [
            { id: 'dept_cs_01', name: 'Computer Science', code: 'CS', head: 'Dr. Ada Lovelace', description: 'Department of Computer Science and Engineering.', createdAt: new Date().toISOString() },
            { id: 'dept_math_01', name: 'Mathematics', code: 'MATH', head: 'Dr. Alan Turing', description: 'Department of Mathematics.', createdAt: new Date().toISOString() },
            { id: 'dept_phy_01', name: 'Physics', code: 'PHY', head: 'Dr. Marie Curie', description: 'Department of Physics.', createdAt: new Date().toISOString() }
        ];
        localStorage.setItem(departmentsKey, JSON.stringify(departments));
        console.log('Default departments added.');
    }
    
    // Add sample courses if none exist
    const coursesKey = 'campus_courses';
    let courses = JSON.parse(localStorage.getItem(coursesKey)) || [];
    if (courses.length === 0) {
        courses = [
            { id: 'course_cs101', name: 'Intro to Programming', code: 'CS101', departmentId: 'dept_cs_01', departmentName: 'Computer Science', credits: 3, instructor: 'Prof. Faculty User', description: 'Fundamentals of programming using Python.', createdAt: new Date().toISOString() },
            { id: 'course_math101', name: 'Calculus I', code: 'MATH101', departmentId: 'dept_math_01', departmentName: 'Mathematics', credits: 4, instructor: 'Dr. Isaac Newton', description: 'Differential calculus.', createdAt: new Date().toISOString() },
            { id: 'course_phy101', name: 'Physics for Engineers', code: 'PHY101', departmentId: 'dept_phy_01', departmentName: 'Physics', credits: 4, instructor: 'Dr. Albert Einstein', description: 'Mechanics and Thermodynamics.', createdAt: new Date().toISOString() }
        ];
        localStorage.setItem(coursesKey, JSON.stringify(courses));
        console.log('Default courses added.');
    }


    // Add sample study material if none exists
    const materialsKey = 'campus_materials';
    let materials = JSON.parse(localStorage.getItem(materialsKey)) || [];
    if (materials.length === 0) {
        materials.push({
            id: 'mat_default_01',
            title: 'Introduction to Web Development',
            description: 'A comprehensive guide to HTML, CSS, and JavaScript.',
            type: 'pdf',
            subject: 'CS101', // Linked to course code
            category: 'lecture-notes',
            targetStudents: 'All Students',
            facultyId: 'facultyuser', 
            facultyName: 'Faculty User',
            uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), 
            fileName: 'web_dev_intro.pdf',
            fileType: 'application/pdf',
        });
        materials.push({
            id: 'mat_default_02',
            title: 'Calculus I Problem Set 1',
            description: 'Practice problems for differential calculus - Chapter 1.',
            type: 'text',
            subject: 'MATH101', // Linked to course code
            category: 'assignments',
            targetStudents: 'First Year',
            facultyId: 'facultyuser',
            facultyName: 'Faculty User',
            uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
            content: 'Solve problems 1-10 from Chapter 1. Due next Monday.'
        });
        localStorage.setItem(materialsKey, JSON.stringify(materials));
        console.log('Default study materials added.');
    }

    // Add sample attendance record for the default student if none exists
    const attendanceKey = 'campus_attendance_records';
    let attendanceRecords = JSON.parse(localStorage.getItem(attendanceKey)) || [];
    const studentAttendanceExists = attendanceRecords.some(rec => 
        (rec.presentStudentIds && rec.presentStudentIds.includes('student_default_01')) ||
        (rec.absentStudentIds && rec.absentStudentIds.includes('student_default_01'))
    );

    if (!studentAttendanceExists) {
        attendanceRecords.push({
            id: `att_sample_cs101_${Date.now()}`,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
            subject: 'Intro to Programming', // Match course name
            classIdentifier: 'CS101-Morning',
            presentStudentIds: ['student_default_01'], 
            absentStudentIds: [],
            markedByUsername: 'facultyuser',
            markedByName: 'Faculty User',
            timestamp: new Date().toISOString()
        });
         attendanceRecords.push({
            id: `att_sample_math101_${Date.now()}`,
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
            subject: 'Calculus I', // Match course name
            classIdentifier: 'MATH101-Afternoon',
            presentStudentIds: [], // Default student absent for this one
            absentStudentIds: ['student_default_01'],
            markedByUsername: 'facultyuser',
            markedByName: 'Faculty User',
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(attendanceKey, JSON.stringify(attendanceRecords));
        console.log('Default attendance records added for student_default_01.');
    }
}

// Set up the Add Student button
function setupAddStudentButton() {
    const addStudentBtn = document.getElementById('add-student-btn');
    if (addStudentBtn) {
        console.log('Setting up Add Student button');
        addStudentBtn.addEventListener('click', function() {
            console.log('Add Student button clicked');
            if (typeof addNewStudent === 'function') {
                addNewStudent();
            } else {
                console.error('addNewStudent function is not defined');
                alert('Unable to add student. Please try again later.');
            }
        });
    } else {
        console.warn('Add Student button not found');
    }
}
