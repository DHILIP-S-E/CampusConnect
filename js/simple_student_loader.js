/**
 * Simple Student Loader
 * A simplified version of the student loading functionality to fix errors
 */

// Basic function to load students
function loadStudents(yearFilter = 'all') {
    console.log('Loading students with filter:', yearFilter);
    const tableBody = document.getElementById('students-table-body');
    
    if (!tableBody) {
        console.error('students-table-body element not found');
        return;
    }
    
    // Show loading message
    tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Loading students...</td></tr>';
    
    try {
        // Get students from localStorage or create demo data
        let students = [];
        const customStudents = JSON.parse(localStorage.getItem('custom_students') || '[]');
        
        if (customStudents.length > 0) {
            console.log('Using custom students from localStorage:', customStudents.length);
            students = customStudents;
        } else {
            console.log('Creating demo student data');
            // Create demo data
            students = Array(10).fill().map((_, i) => ({
                id: 'std' + i,
                name: `Student ${i}`,
                email: `student${i}@example.com`,
                department: i % 3 === 0 ? 'Computer Science' : i % 3 === 1 ? 'Electrical Engineering' : 'Business Administration',
                year: i % 4 === 0 ? 'First Year' : i % 4 === 1 ? 'Second Year' : i % 4 === 2 ? 'Third Year' : 'Fourth Year',
                status: 'active'
            }));
        }
        
        // Filter by year if needed
        if (yearFilter !== 'all') {
            const yearMap = {
                'year1': 'First Year',
                'year2': 'Second Year',
                'year3': 'Third Year',
                'year4': 'Fourth Year'
            };
            const filterYear = yearMap[yearFilter] || yearFilter;
            students = students.filter(student => student.year === filterYear);
        }
        
        // Clear table and show results
        tableBody.innerHTML = '';
        
        if (students.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center">No students found.</td></tr>';
            return;
        }
        
        // Update pagination info if elements exist
        const showingStart = document.getElementById('showing-start');
        const showingEnd = document.getElementById('showing-end');
        const totalStudentsCount = document.getElementById('total-students-count');
        
        if (showingStart && showingEnd && totalStudentsCount) {
            showingStart.textContent = '1';
            showingEnd.textContent = students.length;
            totalStudentsCount.textContent = students.length;
        }
        
        // Add students to table
        students.forEach(student => {
            const row = document.createElement('tr');
            
            // Determine student status
            let statusClass = 'status-active';
            let statusText = 'Active';
            
            if (student.status) {
                if (student.status === 'inactive') {
                    statusClass = 'status-inactive';
                    statusText = 'Inactive';
                } else if (student.status === 'suspended') {
                    statusClass = 'status-suspended';
                    statusText = 'Suspended';
                } else if (student.status === 'graduated') {
                    statusClass = 'status-graduated';
                    statusText = 'Graduated';
                }
            }
            
            // Create row HTML
            row.innerHTML = `
                <td><input type="checkbox" class="student-select" data-id="${student.id}"></td>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.department || 'N/A'}</td>
                <td>${student.year || 'N/A'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-secondary view-btn" data-id="${student.id}">View</button>
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${student.id}">Edit</button>
                    <button class="btn btn-sm btn-info more-btn" data-id="${student.id}">More</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', function() {
                const studentId = this.getAttribute('data-id');
                if (typeof viewStudentInPanel === 'function') {
                    viewStudentInPanel(studentId);
                } else if (typeof viewStudentDetails === 'function') {
                    viewStudentDetails(studentId);
                } else {
                    alert('View student details for ID: ' + studentId);
                }
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const studentId = this.getAttribute('data-id');
                if (typeof editStudent === 'function') {
                    editStudent(studentId);
                } else if (typeof editStudentDetails === 'function') {
                    editStudentDetails(studentId);
                } else {
                    alert('Edit student with ID: ' + studentId);
                }
            });
        });
        
        document.querySelectorAll('.more-btn').forEach(button => {
            button.addEventListener('click', function() {
                const studentId = this.getAttribute('data-id');
                alert('More options for student ID: ' + studentId);
            });
        });
        
        console.log('Students loaded successfully:', students.length);
    } catch (error) {
        console.error('Error loading students:', error);
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center error-message">An error occurred while loading students</td></tr>';
    }
}

// Get student details by ID
function getStudentById(studentId) {
    // Try to get from localStorage first
    const customStudents = JSON.parse(localStorage.getItem('custom_students') || '[]');
    const student = customStudents.find(s => s.id === studentId);
    
    if (student) {
        return student;
    }
    
    // Return a demo student if not found
    return {
        id: studentId,
        name: `Student ${studentId.replace('std', '')}`,
        email: `student${studentId.replace('std', '')}@example.com`,
        department: 'Computer Science',
        year: 'Second Year',
        phone: '123-456-7890',
        address: '123 Campus Street, University City',
        dob: '2000-01-01',
        enrollmentDate: '2022-09-01',
        status: 'active'
    };
}