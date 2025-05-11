/**
 * Admin functionality for CampusConnect
 * Handles user management, student listing, entry logs, certificates, events, and notifications
 */

// Add a new user (student or faculty)
function addUser() {
    const fullName = document.getElementById('user-name').value; // Ensure this matches HTML id
    const email = document.getElementById('user-email').value;
    const username = document.getElementById('user-username').value;
    const password = document.getElementById('user-password').value;
    const role = document.getElementById('user-role').value;
    const messageElement = document.getElementById('user-message');
    
    if (!fullName || !email || !username || !password || !role) {
        messageElement.textContent = 'Please fill in all fields';
        messageElement.className = 'message error-message';
        return;
    }
    
    try {
        // Use the same key as index.html and init.js for storing users
        const usersKey = 'campus_users'; 
        const users = JSON.parse(localStorage.getItem(usersKey)) || [];

        // Check if username or email already exists
        if (users.find(user => user.username === username)) {
            messageElement.textContent = 'Username already exists.';
            messageElement.className = 'message error-message';
            return;
        }
        if (users.find(user => user.email === email)) {
            messageElement.textContent = 'Email already registered.';
            messageElement.className = 'message error-message';
            return;
        }

        const newUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Simple unique ID
            fullName, // Use fullName to match the variable name from getElementById
            email,
            username,
            password, // Storing plain text - highly insecure, for demo only
            role,
            // Add other role-specific fields if necessary, e.g., department, year for students
            department: role === CONFIG.ROLES.STUDENT ? (document.getElementById('user-department')?.value || '') : undefined,
            year: role === CONFIG.ROLES.STUDENT ? (document.getElementById('user-year')?.value || '') : undefined,
        };

        users.push(newUser);
        localStorage.setItem(usersKey, JSON.stringify(users));
        
        messageElement.textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} added successfully`;
        messageElement.className = 'message success-message';
        document.getElementById('add-user-form').reset();
        
        if (role === CONFIG.ROLES.STUDENT && typeof loadStudents === 'function') {
            loadStudents();
        }
        if (typeof loadAdminDashboardData === 'function') {
            loadAdminDashboardData();
        }

    } catch (error) {
        console.error('Error adding user:', error);
        messageElement.textContent = 'An error occurred while adding the user';
        messageElement.className = 'message error-message';
    }
}

// Load all students
function loadStudents() {
    const tableBody = document.getElementById('students-table-body');
    tableBody.innerHTML = '<tr><td colspan="6">Loading students...</td></tr>';
    
    try {
        const usersKey = 'campus_users'; // Use the same key
        const users = JSON.parse(localStorage.getItem(usersKey)) || [];
        const students = users.filter(user => user.role === CONFIG.ROLES.STUDENT);
        
        tableBody.innerHTML = '';
        if (students.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">No students found.</td></tr>';
            return;
        }
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id || ''}</td>
                <td>${student.fullName || ''}</td>
                <td>${student.email || ''}</td>
                <td>${student.department || ''}</td>
                <td>${student.year || ''}</td>
                <td>
                    <button class="btn btn-secondary btn-sm view-student" data-id="${student.id}">View</button>
                    <button class="btn btn-danger btn-sm delete-student" data-id="${student.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        document.querySelectorAll('.view-student').forEach(button => {
            button.addEventListener('click', function() { viewStudent(this.getAttribute('data-id')); });
        });
        document.querySelectorAll('.delete-student').forEach(button => {
            button.addEventListener('click', function() { deleteStudent(this.getAttribute('data-id')); });
        });
    } catch (error) {
        console.error('Error loading students:', error);
        tableBody.innerHTML = '<tr><td colspan="6" class="error-message">An error occurred while loading students</td></tr>';
    }
}

// Add a new entry log
function addLog() {
    const logType = document.getElementById('log-type').value;
    const name = document.getElementById('log-name').value;
    const date = document.getElementById('log-date').value;
    const time = document.getElementById('log-time').value;
    const purpose = document.getElementById('log-purpose').value;
    const messageElement = document.getElementById('log-message');
    
    if (!logType || !name || !date || !time || !purpose) {
        messageElement.textContent = 'Please fill in all fields';
        messageElement.className = 'message error-message';
        return;
    }
    
    try {
        const logs = JSON.parse(localStorage.getItem('campus_logs')) || [];
        const newLog = {
            id: `log_${Date.now()}`,
            logType,
            name,
            date,
            time,
            purpose,
            timestamp: new Date().toISOString()
        };
        logs.push(newLog);
        localStorage.setItem('campus_logs', JSON.stringify(logs));
        
        messageElement.textContent = 'Entry added successfully';
        messageElement.className = 'message success-message';
        document.getElementById('add-log-form').reset();
        if (typeof loadLogs === 'function') {
            loadLogs();
        }
    } catch (error) {
        console.error('Error adding entry:', error);
        messageElement.textContent = 'An error occurred while adding the entry';
        messageElement.className = 'message error-message';
    }
}

// Load entry logs
function loadLogs() {
    const tableBody = document.getElementById('logs-table-body');
    tableBody.innerHTML = '<tr><td colspan="5">Loading logs...</td></tr>';
    try {
        const logs = JSON.parse(localStorage.getItem('campus_logs')) || [];
        
        tableBody.innerHTML = '';
        if (logs.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No logs found.</td></tr>';
            return;
        }
        // Sort logs by timestamp, newest first
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        logs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.logType}</td>
                <td>${log.name}</td>
                <td>${new Date(log.date).toLocaleDateString()}</td>
                <td>${log.time}</td>
                <td>${log.purpose}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading logs:', error);
        tableBody.innerHTML = '<tr><td colspan="5" class="error-message">An error occurred while loading logs</td></tr>';
    }
}

// Load students for certificate issuance
function loadStudentsForCertificate() {
    const selectElement = document.getElementById('certificate-student');
    try {
        const users = JSON.parse(localStorage.getItem('campus_users')) || [];
        const students = users.filter(user => user.role === CONFIG.ROLES.STUDENT);

        selectElement.innerHTML = '<option value="">Select Student</option>';
        if (students.length > 0) {
            students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = `${student.fullName} (${student.id})`;
                selectElement.appendChild(option);
            });
        } else {
             selectElement.innerHTML = '<option value="">No students found</option>';
        }
    } catch (error) {
        console.error('Error loading students for certificate:', error);
        selectElement.innerHTML = '<option value="">Error loading students</option>';
    }
}

// Issue a certificate
function issueCertificate() {
    const studentId = document.getElementById('certificate-student').value;
    const certificateType = document.getElementById('certificate-type').value;
    const courseName = document.getElementById('certificate-course').value;
    const issueDate = document.getElementById('certificate-date').value;
    const messageElement = document.getElementById('certificate-message');
    
    if (!studentId || !certificateType || !courseName || !issueDate) {
        messageElement.textContent = 'Please fill in all fields';
        messageElement.className = 'message error-message';
        return;
    }
    
    try {
        const certificates = JSON.parse(localStorage.getItem('campus_certificates')) || [];
        const newCertificate = {
            id: `cert_${Date.now()}`,
            studentId,
            certificateType,
            courseName,
            issueDate,
            issuedBy: 'Admin', // Assuming admin issues it
            timestamp: new Date().toISOString()
        };
        certificates.push(newCertificate);
        localStorage.setItem('campus_certificates', JSON.stringify(certificates));

        messageElement.textContent = 'Certificate issued successfully';
        messageElement.className = 'message success-message';
        document.getElementById('issue-certificate-form').reset();
        
        // Potentially reload dashboard data if it shows certificate counts
        if (typeof loadAdminDashboardData === 'function') {
            loadAdminDashboardData();
        }
        // Also, if there's a list of issued certificates on the admin page, reload it.
        // e.g., if (typeof loadIssuedCertificates === 'function') loadIssuedCertificates();

    } catch (error) {
        console.error('Error issuing certificate:', error);
        messageElement.textContent = 'An error occurred while issuing the certificate';
        messageElement.className = 'message error-message';
    }
}

// Send a notification
function sendNotification(statusMessageElementId = 'notification-status-message') {
    const title = document.getElementById('notification-title').value;
    const messageText = document.getElementById('notification-message-text').value;
    const target = document.getElementById('notification-target').value; // e.g., 'all', 'students', 'faculty', or specific user ID
    const priority = document.getElementById('notification-priority').value;
    const messageElement = document.getElementById(statusMessageElementId);
    
    if (!title || !messageText || !target || !priority) {
        messageElement.textContent = 'Please fill in all fields';
        messageElement.className = 'message error-message';
        return;
    }
    
    try {
        const notifications = JSON.parse(localStorage.getItem('campus_notifications')) || [];
        const newNotification = {
            id: `notif_${Date.now()}`,
            title,
            message: messageText,
            target,
            priority,
            timestamp: new Date().toISOString(),
            status: 'sent' // Could be 'pending', 'read' etc. later
        };
        notifications.push(newNotification);
        localStorage.setItem('campus_notifications', JSON.stringify(notifications));

        messageElement.textContent = 'Notification stored locally successfully';
        messageElement.className = 'message success-message';
        document.getElementById('send-notification-form').reset();
        
        // In a real frontend-only app, "sending" would mean making it available for users to see.
        // This might involve updating a shared notifications list that other roles can view.
        // For now, it's just stored.
        alert(`Notification "${title}" for ${target} (Priority: ${priority}) has been created and stored locally.`);

    } catch (error) {
        console.error('Error creating notification:', error);
        messageElement.textContent = 'An error occurred while creating the notification';
        messageElement.className = 'message error-message';
    }
}

// View student details
function viewStudent(studentId) {
    const users = JSON.parse(localStorage.getItem('campus_users')) || [];
    const student = users.find(user => user.id === studentId && user.role === CONFIG.ROLES.STUDENT);

    if (student) {
        // For now, just an alert. A modal or dedicated view would be better.
        alert(`Student Details:\nID: ${student.id || ''}\nName: ${student.fullName || ''}\nEmail: ${student.email || ''}\nDepartment: ${student.department || ''}\nYear: ${student.year || ''}`);
    } else {
        alert(`Student with ID: ${studentId} not found.`);
    }
}

// Delete a student (or any user by ID)
function deleteStudent(userId) { // Renamed to userId for clarity, as it can delete any user
    if (confirm(`Are you sure you want to delete user with ID: ${userId}?`)) {
        try {
            let users = JSON.parse(localStorage.getItem('campus_users')) || [];
            const userToDelete = users.find(user => user.id === userId);
            
            if (!userToDelete) {
                alert(`User with ID: ${userId} not found.`);
                return;
            }

            users = users.filter(user => user.id !== userId);
            localStorage.setItem('campus_users', JSON.stringify(users));

            alert(`${userToDelete.role.charAt(0).toUpperCase() + userToDelete.role.slice(1)} deleted successfully.`);
            
            if (userToDelete.role === CONFIG.ROLES.STUDENT && typeof loadStudents === 'function') {
                loadStudents();
            }
            if (typeof loadAdminDashboardData === 'function') {
                loadAdminDashboardData();
            }
            // If deleting faculty, and there's a faculty list, reload it.
            // if (userToDelete.role === CONFIG.ROLES.FACULTY && typeof loadFaculty === 'function') loadFaculty();

        } catch (error) {
            console.error('Error deleting user:', error);
            alert('An error occurred while deleting the user.');
        }
    }
}

// Load dashboard data for Admin
function loadAdminDashboardData() {
    try {
        const users = JSON.parse(localStorage.getItem('campus_users')) || [];
        
        const studentCount = users.filter(user => user.role === CONFIG.ROLES.STUDENT).length;
        document.getElementById('total-students').textContent = studentCount;

        const facultyCount = users.filter(user => user.role === CONFIG.ROLES.FACULTY).length;
        document.getElementById('total-faculty').textContent = facultyCount;

        // For courses and departments, these would need to be managed in localStorage as well
        // For now, keeping them as N/A or placeholder values.
        const courses = JSON.parse(localStorage.getItem('campus_courses')) || [];
        document.getElementById('total-courses').textContent = courses.length;
        
        const departments = JSON.parse(localStorage.getItem('campus_departments')) || [];
        document.getElementById('total-departments').textContent = departments.length;


    } catch (error) {
        console.error('Error loading admin dashboard data:', error);
        document.getElementById('total-students').textContent = 'Error';
        document.getElementById('total-faculty').textContent = 'Error';
        document.getElementById('total-courses').textContent = 'Error';
        document.getElementById('total-departments').textContent = 'Error';
    }
}


// Create a new event
function createEvent() {
    const title = document.getElementById('event-title').value;
    const description = document.getElementById('event-description').value;
    const startDate = document.getElementById('event-start-date').value;
    const endDate = document.getElementById('event-end-date').value;
    const location = document.getElementById('event-location').value;
    const organizer = document.getElementById('event-organizer').value;
    const capacity = parseInt(document.getElementById('event-capacity').value) || 0;
    const type = document.getElementById('event-type').value;
    const isPublic = document.getElementById('event-visibility').value === 'true';
    const messageElement = document.getElementById('event-message');
    
    if (!title || !description || !startDate || !endDate || !location || !organizer || !type) { // Capacity can be 0
        messageElement.textContent = 'Please fill in all required fields';
        messageElement.className = 'message error-message';
        return;
    }
    
    try {
        const events = JSON.parse(localStorage.getItem('campus_events')) || [];
        const newEvent = {
            id: `event_${Date.now()}`,
            title,
            description,
            startDate,
            endDate,
            location,
            organizer,
            capacity,
            type,
            isPublic,
            registeredCount: 0, // Initialize registered count
            attendees: [], // Initialize attendees list
            timestamp: new Date().toISOString()
        };
        events.push(newEvent);
        localStorage.setItem('campus_events', JSON.stringify(events));

        messageElement.textContent = 'Event created successfully and stored locally.';
        messageElement.className = 'message success-message';
        document.getElementById('create-event-form').reset();
        if (typeof loadEvents === 'function') {
            loadEvents();
        }
    } catch (error) {
        console.error('Error creating event:', error);
        messageElement.textContent = 'An error occurred while creating the event';
        messageElement.className = 'message error-message';
    }
}

// Load all events
function loadEvents(typeFilter = 'all', statusFilter = 'all') {
    const tableBody = document.getElementById('events-table-body');
    tableBody.innerHTML = '<tr><td colspan="8">Loading events...</td></tr>';
    try {
        let events = JSON.parse(localStorage.getItem('campus_events')) || [];

        // Apply filters
        if (typeFilter !== 'all') {
            events = events.filter(event => event.type === typeFilter);
        }
        if (statusFilter !== 'all') {
            events = events.filter(event => {
                const now = new Date();
                const eventStartDate = new Date(event.startDate);
                const eventEndDate = new Date(event.endDate);
                let currentStatus = 'Upcoming';
                if (now > eventEndDate) currentStatus = 'Past';
                else if (now >= eventStartDate && now <= eventEndDate) currentStatus = 'Ongoing';
                return currentStatus.toLowerCase() === statusFilter.toLowerCase();
            });
        }
        
        tableBody.innerHTML = '';
        if (events.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8">No events found matching criteria.</td></tr>';
            loadEventAnalytics([]); // Pass empty array to clear analytics
            return;
        }

        // Sort events by start date, newest first
        events.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        events.forEach(event => {
            const row = document.createElement('tr');
            let status = 'Upcoming';
            const now = new Date();
            const eventStartDate = new Date(event.startDate);
            const eventEndDate = new Date(event.endDate);
            if (now > eventEndDate) status = 'Past';
            else if (now >= eventStartDate && now <= eventEndDate) status = 'Ongoing';
            
            row.innerHTML = `
                <td>${event.title}</td>
                <td>${formatEventDate(event.startDate)}</td>
                <td>${event.location}</td>
                <td>${event.type}</td>
                <td>${event.capacity}</td>
                <td>${event.registeredCount || 0}</td>
                <td><span class="status-badge status-${status.toLowerCase()}">${status}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm view-event" data-id="${event.id}">View</button>
                    <button class="btn btn-primary btn-sm edit-event" data-id="${event.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-event" data-id="${event.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        document.querySelectorAll('.view-event').forEach(button => {
            button.addEventListener('click', function() { viewEvent(this.getAttribute('data-id')); });
        });
        document.querySelectorAll('.edit-event').forEach(button => {
            button.addEventListener('click', function() { editEvent(this.getAttribute('data-id')); });
        });
        document.querySelectorAll('.delete-event').forEach(button => {
            button.addEventListener('click', function() { deleteEventHandler(this.getAttribute('data-id')); });
        });
        loadEventAnalytics(events); // Pass the filtered events
    } catch (error) {
        console.error('Error loading events:', error);
        tableBody.innerHTML = '<tr><td colspan="8" class="error-message">An error occurred while loading events</td></tr>';
        loadEventAnalytics([]); // Pass empty array on error
    }
}

// View event details
function viewEvent(eventId) {
    const events = JSON.parse(localStorage.getItem('campus_events')) || [];
    const event = events.find(e => e.id === eventId);
    if (event) {
        // Simple alert for now. A modal would be better.
        alert(`Event: ${event.title}\nDescription: ${event.description}\nDate: ${formatEventDate(event.startDate)} - ${formatEventDate(event.endDate)}\nLocation: ${event.location}\nOrganizer: ${event.organizer}\nCapacity: ${event.capacity}\nRegistered: ${event.registeredCount || 0}`);
    } else {
        alert('Event not found.');
    }
}

// Edit an event - Placeholder for now, would require a form similar to createEvent
function editEvent(eventId) {
    console.log(`Request to edit event with ID: ${eventId}`);
    // In a real app, this would populate a form with event data for editing.
    // For now, just a placeholder.
    alert(`Editing event with ID: ${eventId}. (Full edit functionality requires a form and update logic similar to createEvent, saving back to localStorage)`);
    // Example:
    // const events = JSON.parse(localStorage.getItem('campus_events')) || [];
    // const eventToEdit = events.find(e => e.id === eventId);
    // if (eventToEdit) {
    //   // Populate form fields with eventToEdit data
    //   // Add a save button that updates the event in localStorage and reloads events
    // }
}

// Delete an event
function deleteEventHandler(eventId) {
    if (confirm(`Are you sure you want to delete event with ID: ${eventId}?`)) {
        try {
            let events = JSON.parse(localStorage.getItem('campus_events')) || [];
            events = events.filter(event => event.id !== eventId);
            localStorage.setItem('campus_events', JSON.stringify(events));
            
            alert('Event deleted successfully');
            if (typeof loadEvents === 'function') {
                loadEvents(); // Refresh the list
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('An error occurred while deleting the event.');
        }
    }
}

// Load event analytics (basic implementation with localStorage data)
function loadEventAnalytics(events) {
    console.log('Loading event analytics with data:', events);
    const eventsByTypeChart = document.getElementById('events-by-type-chart');
    const popularLocationsChart = document.getElementById('popular-locations-chart');
    const attendanceRateChart = document.getElementById('attendance-rate-chart');
    const registrationTrendsChart = document.getElementById('registration-trends-chart');

    // Ensure chart elements exist before trying to update them
    if (eventsByTypeChart) {
        if (!events || events.length === 0) {
            eventsByTypeChart.innerHTML = '<p>No event data for analytics.</p>';
        } else {
            const eventsByType = {};
            events.forEach(event => {
                eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
            });
            eventsByTypeChart.innerHTML = `<p><strong>Events by Type:</strong></p><ul>${Object.entries(eventsByType).map(([type, count]) => `<li>${type}: ${count}</li>`).join('')}</ul>`;
        }
    } else {
        console.warn('Events by type chart placeholder not found.');
    }

    if (popularLocationsChart) {
        if (!events || events.length === 0) {
            popularLocationsChart.innerHTML = '';
        } else {
            const locationCounts = {};
            events.forEach(event => {
                locationCounts[event.location] = (locationCounts[event.location] || 0) + 1;
            });
            popularLocationsChart.innerHTML = `<p><strong>Popular Locations:</strong></p><ul>${Object.entries(locationCounts).map(([loc, count]) => `<li>${loc}: ${count}</li>`).join('')}</ul>`;
        }
    } else {
        console.warn('Popular locations chart placeholder not found.');
    }
    
    if (attendanceRateChart) {
        if (!events || events.length === 0) {
            attendanceRateChart.innerHTML = '';
        } else {
            let totalRegistrations = 0;
            let totalCapacity = 0;
            events.forEach(event => {
                totalRegistrations += (parseInt(event.registeredCount) || 0);
                totalCapacity += parseInt(event.capacity);
            });
            const attendanceRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;
            attendanceRateChart.innerHTML = `<p><strong>Overall Event Attendance Rate:</strong> ${attendanceRate}% (${totalRegistrations}/${totalCapacity})</p>`;
        }
    } else {
        console.warn('Attendance rate chart placeholder not found.');
    }

    if (registrationTrendsChart) {
        if (!events || events.length === 0) {
            registrationTrendsChart.innerHTML = '';
        } else {
            // Placeholder for actual trend chart logic
            registrationTrendsChart.innerHTML = `<p>Registration Trends: (Chart placeholder - ${events.length} events total)</p>`;
        }
    } else {
        console.warn('Registration trends chart placeholder not found.');
    }
}

// Department Management Functions
function addDepartment() {
    const deptName = document.getElementById('dept-name').value;
    const deptCode = document.getElementById('dept-code').value;
    const deptHead = document.getElementById('dept-head').value;
    const deptDescription = document.getElementById('dept-description').value;
    const messageElement = document.getElementById('department-message');

    if (!deptName || !deptCode) {
        messageElement.textContent = 'Department Name and Code are required.';
        messageElement.className = 'message error-message';
        return;
    }

    try {
        const departments = JSON.parse(localStorage.getItem('campus_departments')) || [];
        
        // Check if department code already exists
        if (departments.find(dept => dept.code === deptCode)) {
            messageElement.textContent = 'Department code already exists.';
            messageElement.className = 'message error-message';
            return;
        }

        const newDepartment = {
            id: `dept_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: deptName,
            code: deptCode,
            head: deptHead,
            description: deptDescription,
            createdAt: new Date().toISOString()
        };

        departments.push(newDepartment);
        localStorage.setItem('campus_departments', JSON.stringify(departments));

        messageElement.textContent = 'Department added successfully!';
        messageElement.className = 'message success-message';
        document.getElementById('add-department-form').reset();
        loadDepartments(); // Refresh the list
        loadAdminDashboardData(); // Refresh dashboard counts
    } catch (error) {
        console.error('Error adding department:', error);
        messageElement.textContent = 'An error occurred while adding the department.';
        messageElement.className = 'message error-message';
    }
}

function loadDepartments() {
    const tableBody = document.getElementById('departments-table-body');
    if (!tableBody) {
        console.error('Departments table body not found.');
        return;
    }
    tableBody.innerHTML = '<tr><td colspan="5">Loading departments...</td></tr>';

    try {
        const departments = JSON.parse(localStorage.getItem('campus_departments')) || [];
        departments.sort((a,b) => a.name.localeCompare(b.name)); // Sort by name

        tableBody.innerHTML = '';
        if (departments.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No departments found. Add one above.</td></tr>';
            return;
        }

        departments.forEach(dept => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dept.id || ''}</td>
                <td>${dept.name || ''}</td>
                <td>${dept.code || ''}</td>
                <td>${dept.head || ''}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="editDepartment('${dept.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDepartment('${dept.id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading departments:', error);
        tableBody.innerHTML = '<tr><td colspan="5" class="error-message">An error occurred while loading departments.</td></tr>';
    }
}

function editDepartment(deptId) {
    // Placeholder: In a real app, this would populate the add/edit form with the department's data.
    const departments = JSON.parse(localStorage.getItem('campus_departments')) || [];
    const dept = departments.find(d => d.id === deptId);
    if (dept) {
        document.getElementById('dept-name').value = dept.name;
        document.getElementById('dept-code').value = dept.code;
        document.getElementById('dept-head').value = dept.head || '';
        document.getElementById('dept-description').value = dept.description || '';
        // Ideally, change button to "Update Department" and handle update logic.
        // For now, just pre-fills. User would need to delete old and add new if they want to "update".
        alert(`Editing Department: ${dept.name}. Form pre-filled. To update, delete the old entry and add a new one after making changes.`);
    } else {
        alert('Department not found for editing.');
    }
}

function deleteDepartment(deptId) {
    if (confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
        try {
            let departments = JSON.parse(localStorage.getItem('campus_departments')) || [];
            departments = departments.filter(dept => dept.id !== deptId);
            localStorage.setItem('campus_departments', JSON.stringify(departments));
            
            alert('Department deleted successfully.');
            loadDepartments(); // Refresh the list
            loadAdminDashboardData(); // Refresh dashboard counts
        } catch (error) {
            console.error('Error deleting department:', error);
            alert('An error occurred while deleting the department.');
        }
    }
}


// Event Analytics (modified to be more robust if elements are missing)
function loadEventAnalytics(events) {
    console.log('Loading event analytics with data:', events);
    const eventsByTypeChart = document.getElementById('events-by-type-chart');
    const popularLocationsChart = document.getElementById('popular-locations-chart');
    const attendanceRateChart = document.getElementById('attendance-rate-chart');
    const registrationTrendsChart = document.getElementById('registration-trends-chart');

    // Ensure chart elements exist before trying to update them
    if (eventsByTypeChart) {
        if (!events || events.length === 0) {
            eventsByTypeChart.innerHTML = '<p>No event data for analytics.</p>';
        } else {
            const eventsByType = {};
            events.forEach(event => {
                eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
            });
            eventsByTypeChart.innerHTML = `<p><strong>Events by Type:</strong></p><ul>${Object.entries(eventsByType).map(([type, count]) => `<li>${type}: ${count}</li>`).join('')}</ul>`;
        }
    } else {
        console.warn('Events by type chart placeholder not found.');
    }

    if (popularLocationsChart) {
        if (!events || events.length === 0) {
            popularLocationsChart.innerHTML = '';
        } else {
            const locationCounts = {};
            events.forEach(event => {
                locationCounts[event.location] = (locationCounts[event.location] || 0) + 1;
            });
            popularLocationsChart.innerHTML = `<p><strong>Popular Locations:</strong></p><ul>${Object.entries(locationCounts).map(([loc, count]) => `<li>${loc}: ${count}</li>`).join('')}</ul>`;
        }
    } else {
        console.warn('Popular locations chart placeholder not found.');
    }
    
    if (attendanceRateChart) {
        if (!events || events.length === 0) {
            attendanceRateChart.innerHTML = '';
        } else {
            let totalRegistrations = 0;
            let totalCapacity = 0;
            events.forEach(event => {
                totalRegistrations += (parseInt(event.registeredCount) || 0);
                totalCapacity += parseInt(event.capacity);
            });
            const attendanceRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;
            attendanceRateChart.innerHTML = `<p><strong>Overall Event Attendance Rate:</strong> ${attendanceRate}% (${totalRegistrations}/${totalCapacity})</p>`;
        }
    } else {
        console.warn('Attendance rate chart placeholder not found.');
    }

    if (registrationTrendsChart) {
        if (!events || events.length === 0) {
            registrationTrendsChart.innerHTML = '';
        } else {
            // Placeholder for actual trend chart logic
            registrationTrendsChart.innerHTML = `<p>Registration Trends: (Chart placeholder - ${events.length} events total)</p>`;
        }
    } else {
        console.warn('Registration trends chart placeholder not found.');
    }
}

// Course Management Functions
function addCourse() {
    const courseName = document.getElementById('course-name').value;
    const courseCode = document.getElementById('course-code').value;
    const courseDepartment = document.getElementById('course-department').value;
    const courseCredits = document.getElementById('course-credits').value;
    const courseInstructor = document.getElementById('course-instructor').value;
    const courseDescription = document.getElementById('course-description').value;
    const messageElement = document.getElementById('course-message');

    if (!courseName || !courseCode || !courseDepartment || !courseCredits) {
        messageElement.textContent = 'Course Name, Code, Department, and Credits are required.';
        messageElement.className = 'message error-message';
        return;
    }

    try {
        const courses = JSON.parse(localStorage.getItem('campus_courses')) || [];
        
        if (courses.find(course => course.code === courseCode)) {
            messageElement.textContent = 'Course code already exists.';
            messageElement.className = 'message error-message';
            return;
        }

        const newCourse = {
            id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: courseName,
            code: courseCode,
            departmentId: courseDepartment, // Store department ID
            departmentName: document.getElementById('course-department').selectedOptions[0]?.textContent || courseDepartment,
            credits: parseInt(courseCredits),
            instructor: courseInstructor,
            description: courseDescription,
            createdAt: new Date().toISOString()
        };

        courses.push(newCourse);
        localStorage.setItem('campus_courses', JSON.stringify(courses));

        messageElement.textContent = 'Course added successfully!';
        messageElement.className = 'message success-message';
        document.getElementById('add-course-form').reset();
        loadCourses(); // Refresh the list
        loadAdminDashboardData(); // Refresh dashboard counts
    } catch (error) {
        console.error('Error adding course:', error);
        messageElement.textContent = 'An error occurred while adding the course.';
        messageElement.className = 'message error-message';
    }
}

function loadCourses() {
    const tableBody = document.getElementById('courses-table-body');
    if (!tableBody) {
        console.error('Courses table body not found.');
        return;
    }
    tableBody.innerHTML = '<tr><td colspan="7">Loading courses...</td></tr>';

    try {
        const courses = JSON.parse(localStorage.getItem('campus_courses')) || [];
        courses.sort((a,b) => a.name.localeCompare(b.name));

        tableBody.innerHTML = '';
        if (courses.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">No courses found. Add one above.</td></tr>';
            return;
        }

        courses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.id || ''}</td>
                <td>${course.name || ''}</td>
                <td>${course.code || ''}</td>
                <td>${course.departmentName || course.departmentId || ''}</td>
                <td>${course.credits || ''}</td>
                <td>${course.instructor || ''}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="editCourse('${course.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCourse('${course.id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading courses:', error);
        tableBody.innerHTML = '<tr><td colspan="7" class="error-message">An error occurred while loading courses.</td></tr>';
    }
}

function editCourse(courseId) {
    const courses = JSON.parse(localStorage.getItem('campus_courses')) || [];
    const course = courses.find(c => c.id === courseId);
    if (course) {
        document.getElementById('course-name').value = course.name;
        document.getElementById('course-code').value = course.code;
        document.getElementById('course-department').value = course.departmentId;
        document.getElementById('course-credits').value = course.credits;
        document.getElementById('course-instructor').value = course.instructor || '';
        document.getElementById('course-description').value = course.description || '';
        alert(`Editing Course: ${course.name}. Form pre-filled. To update, delete the old entry and add a new one after making changes.`);
    } else {
        alert('Course not found for editing.');
    }
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
        try {
            let courses = JSON.parse(localStorage.getItem('campus_courses')) || [];
            courses = courses.filter(course => course.id !== courseId);
            localStorage.setItem('campus_courses', JSON.stringify(courses));
            
            alert('Course deleted successfully.');
            loadCourses(); 
            loadAdminDashboardData();
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('An error occurred while deleting the course.');
        }
    }
}

function loadDepartmentsForCourseForm() {
    const selectElement = document.getElementById('course-department');
    if (!selectElement) return;

    try {
        const departments = JSON.parse(localStorage.getItem('campus_departments')) || [];
        selectElement.innerHTML = '<option value="">Select Department</option>'; // Clear existing options except placeholder
        if (departments.length > 0) {
            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.id; // Use department ID as value
                option.textContent = `${dept.name} (${dept.code})`;
                selectElement.appendChild(option);
            });
        } else {
            selectElement.innerHTML = '<option value="">No departments available. Please add a department first.</option>';
        }
    } catch (error) {
        console.error('Error loading departments for course form:', error);
        selectElement.innerHTML = '<option value="">Error loading departments</option>';
    }
}

// Settings Functions
function clearAllApplicationData() {
    if (confirm('Are you sure you want to clear ALL application data from localStorage? This includes users, departments, courses, logs, events, etc. This action cannot be undone.')) {
        try {
            // List of all localStorage keys used by the application
            const appKeys = [
                'campus_users',
                'campus_logs',
                'campus_certificates',
                'campus_notifications',
                'campus_events',
                'campus_departments',
                'campus_courses',
                'campus_materials', // Assuming this key is used for study materials
                'campus_feedback',
                'campus_lost_items',
                'campus_found_items',
                'campus_attendance_records',
                // Add any other keys that might be used, e.g., for student favorites
                // 'student_favorites_studentuser', // Example, would need to iterate if dynamic
                'currentUser', // Current logged-in user session
                CONFIG.STORAGE_KEYS.AUTH_TOKEN, // From config.js
                CONFIG.STORAGE_KEYS.USER_ROLE,  // From config.js
                CONFIG.STORAGE_KEYS.USER_DATA   // From config.js
            ];

            // Iterate over known keys and remove them
            appKeys.forEach(key => {
                localStorage.removeItem(key);
            });

            // For dynamically created keys like student favorites (e.g., student_favorites_USERNAME)
            // We might need to iterate all localStorage keys and remove ones matching a pattern
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('student_favorites_')) {
                    localStorage.removeItem(key);
                }
            }
            
            const messageElement = document.getElementById('settings-message');
            if (messageElement) {
                messageElement.textContent = 'All application data has been cleared from localStorage. Please refresh the page or log out and log back in.';
                messageElement.className = 'message success-message';
            }
            alert('All application data cleared. You might need to refresh or log in again.');
            // Optionally, redirect to login page
            // window.location.href = '../index.html';
            loadAdminDashboardData(); // Refresh dashboard counts (they should all be 0)
        } catch (error) {
            console.error('Error clearing application data:', error);
            const messageElement = document.getElementById('settings-message');
            if (messageElement) {
                messageElement.textContent = 'An error occurred while clearing data.';
                messageElement.className = 'message error-message';
            }
            alert('An error occurred while clearing data.');
        }
    }
}


// Format event date for display
function formatEventDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
        return dateString; // fallback to original if parsing fails
    }
}
