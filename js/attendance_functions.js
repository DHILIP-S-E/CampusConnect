/**
 * Attendance Functions for CampusConnect
 * Handles functionality for managing student attendance
 */

// Store fetched students to avoid re-fetching if filters change client-side
// This might be better managed if it's specific to a faculty's students or a course.
// For a general frontend app, we'll assume we load all students.
let allStudentsForAttendance = []; 

// Load students for attendance marking
function loadStudentsForAttendance(yearFilter = 'all', departmentFilter = 'all') { // Added departmentFilter
    console.log('Loading students for attendance with filters:', yearFilter, departmentFilter);
    const tableBody = document.getElementById('attendance-table-body');
    
    if (!tableBody) {
        console.error('attendance-table-body element not found');
        return;
    }
    tableBody.innerHTML = '<tr><td colspan="3" class="text-center">Loading students...</td></tr>';
    
    try {
        // Load all users and filter for students
        const users = JSON.parse(localStorage.getItem('campus_users')) || [];
        allStudentsForAttendance = users.filter(user => user.role === CONFIG.ROLES.STUDENT);
        
        let studentsToDisplay = [...allStudentsForAttendance];
        
        // Filter by year if needed
        if (yearFilter && yearFilter !== 'all') {
            // Assuming student.year is stored like "1", "2" or "First Year", "Second Year"
            // The filter value might be "year1", "year2" from a select.
            // This mapping needs to be consistent with how student year data is stored and how filter values are set.
            // For simplicity, let's assume student.year is "1", "2", etc. and filter value is "1", "2".
            studentsToDisplay = studentsToDisplay.filter(student => student.year === yearFilter.replace('year',''));
        }

        // Filter by department if needed
        if (departmentFilter && departmentFilter !== 'all') {
            studentsToDisplay = studentsToDisplay.filter(student => student.department === departmentFilter);
        }
        
        tableBody.innerHTML = '';
        if (studentsToDisplay.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" class="text-center">No students found for the selected criteria.</td></tr>`;
            return;
        }
        
        studentsToDisplay.forEach(student => {
            const row = document.createElement('tr');
            const studentIdentifier = student.id || student.username; // Use a consistent identifier
            row.innerHTML = `
                <td>${studentIdentifier}</td>
                <td>${student.fullName || student.username}</td>
                <td>
                    <label class="attendance-checkbox">
                        <input type="checkbox" name="attendance-${studentIdentifier}" value="${studentIdentifier}" checked>
                        <span class="checkmark"></span>
                    </label>
                </td>
            `;
            tableBody.appendChild(row);
        });
        console.log('Students loaded successfully for attendance:', studentsToDisplay.length);
    } catch (error) {
        console.error('Error loading students for attendance from localStorage:', error);
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center error-message">An error occurred while loading students</td></tr>';
    }
}

// Mark attendance function
function markAttendance() {
    console.log('Marking attendance');
    const form = document.getElementById('mark-attendance-form');
    const messageElement = document.getElementById('attendance-message');
    
    if (!form || !messageElement) {
        console.error('Attendance form or message element not found');
        alert('Error: Attendance form elements missing.');
        return;
    }
    
    // Assuming form elements have 'name' attributes or use getElementById
    const date = document.getElementById('attendance-date').value; // e.g., <input type="date" id="attendance-date">
    const subject = document.getElementById('attendance-subject').value; // e.g., <input type="text" id="attendance-subject">
    const classIdentifier = document.getElementById('attendance-class').value; // e.g., <input type="text" id="attendance-class" placeholder="e.g., CS101 Morning">
    
    if (!date || !subject || !classIdentifier) {
        messageElement.textContent = 'Please fill in all required fields (Date, Subject, Class/Section)';
        messageElement.className = 'message error-message';
        return;
    }
    
    const presentStudentIds = [];
    const absentStudentIds = [];
    
    const checkboxes = form.querySelectorAll('input[type="checkbox"][name^="attendance-"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            presentStudentIds.push(checkbox.value);
        } else {
            absentStudentIds.push(checkbox.value);
        }
    });

    if (presentStudentIds.length === 0 && absentStudentIds.length === 0) {
        messageElement.textContent = 'No students found in the list to mark attendance for.';
        messageElement.className = 'message error-message';
        return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.username) {
        messageElement.textContent = 'Could not identify faculty marking attendance. Please log in.';
        messageElement.className = 'message error-message';
        return;
    }

    const attendanceRecord = {
        id: `att_${date}_${subject.replace(/\s+/g, '-')}_${classIdentifier.replace(/\s+/g, '-')}_${Date.now()}`,
        date: date,
        subject: subject,
        classIdentifier: classIdentifier, 
        presentStudentIds: presentStudentIds,
        absentStudentIds: absentStudentIds,
        markedByUsername: currentUser.username,
        markedByName: currentUser.fullName || currentUser.username,
        timestamp: new Date().toISOString()
    };
    
    try {
        const allAttendanceRecords = JSON.parse(localStorage.getItem('campus_attendance_records')) || [];
        // Check for duplicate record for the same date, subject, class (optional, depends on requirements)
        const existingRecordIndex = allAttendanceRecords.findIndex(rec => 
            rec.date === date && rec.subject === subject && rec.classIdentifier === classIdentifier
        );

        if (existingRecordIndex > -1) {
            // Update existing record or ask for confirmation
            if (confirm('Attendance for this date, subject, and class already exists. Overwrite?')) {
                allAttendanceRecords[existingRecordIndex] = attendanceRecord;
            } else {
                messageElement.textContent = 'Attendance marking cancelled.';
                messageElement.className = 'message info-message';
                return;
            }
        } else {
            allAttendanceRecords.push(attendanceRecord);
        }
        
        localStorage.setItem('campus_attendance_records', JSON.stringify(allAttendanceRecords));
        
        messageElement.textContent = `Attendance marked successfully and stored locally. Present: ${presentStudentIds.length}, Absent: ${absentStudentIds.length}.`;
        messageElement.className = 'message success-message';
        
        // Optionally, reset parts of the form or clear checkboxes
        // form.reset(); // This would clear date, subject, class too.
        // checkboxes.forEach(cb => cb.checked = true); // Reset to all present for next marking

        // If on faculty page, update dashboard stats if applicable
        if (typeof loadDashboardData === 'function') { 
            loadDashboardData();
        }
        // If there's a view for attendance records, refresh it
        // if (typeof loadAttendanceRecordsView === 'function') loadAttendanceRecordsView();

    } catch (error) {
        console.error('Error marking attendance to localStorage:', error);
        messageElement.textContent = 'An error occurred while marking attendance.';
        messageElement.className = 'message error-message';
    }
}
