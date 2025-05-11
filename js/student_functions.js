/**
 * Student Functions for CampusConnect
 * Handles study materials functionality and profile management for students
 */

// Load study materials by category
function loadStudyMaterialsByCategory(category = 'all') {
    const materialsContainer = document.getElementById('study-materials-list');
    if (!materialsContainer) {
        console.error('study-materials-list element not found.');
        return;
    }
    materialsContainer.innerHTML = '<p>Loading study materials...</p>';
    
    try {
        let allMaterials = JSON.parse(localStorage.getItem('campus_materials')) || [];
        
        if (category !== 'all') {
            allMaterials = allMaterials.filter(material => material.category === category);
        }
        
        // Sort by upload date, newest first
        allMaterials.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

        materialsContainer.innerHTML = '';
        if (allMaterials.length === 0) {
            materialsContainer.innerHTML = '<p>No study materials available for the selected category.</p>';
            return;
        }
        
        allMaterials.forEach(material => {
            const materialElement = document.createElement('div');
            materialElement.className = 'material-card';
            
            let materialContent = '';
            if (material.type === 'pdf' && material.fileName) {
                materialContent = `<p><strong>File:</strong> ${material.fileName} (${material.fileType || 'N/A'})</p>
                                   <p class="info-text">(Download/viewing of actual file content is not supported in this demo)</p>`;
            } else if (material.type === 'link' && material.link) {
                materialContent = `<p><strong>Link:</strong> <a href="${material.link}" target="_blank" rel="noopener noreferrer">${material.link}</a></p>`;
            } else if (material.type === 'text' && material.content) {
                const snippet = material.content.length > 200 ? material.content.substring(0, 197) + "..." : material.content;
                materialContent = `<p><strong>Content Preview:</strong> <pre>${snippet}</pre></p>`;
            } else if (material.type === 'video' && material.videoUrl) {
                materialContent = `<p><strong>Video:</strong> <a href="${material.videoUrl}" target="_blank" rel="noopener noreferrer">Watch Video</a></p>`;
            }
            
            materialElement.innerHTML = `
                <h4>${material.title}</h4>
                <p>${material.description}</p>
                ${materialContent}
                <p><strong>Subject:</strong> ${material.subject}</p>
                <p><strong>Category:</strong> ${material.category || 'General'}</p>
                <p><strong>Uploaded by:</strong> ${material.facultyName || 'Faculty'}</p>
                <p class="material-meta">Uploaded on ${new Date(material.uploadDate).toLocaleDateString()}</p>
                <button class="btn btn-sm btn-primary" onclick="saveToFavorites('${material.id}')">Save to Favorites</button>
                <button class="btn btn-sm btn-secondary more-details-btn" onclick="showMoreDetails('${material.id}')">More Details</button>
            `;
            materialsContainer.appendChild(materialElement);
        });
    } catch (error) {
        console.error('Error loading study materials from localStorage:', error);
        materialsContainer.innerHTML = '<p class="error-message">An error occurred while loading study materials</p>';
    }
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Show more details about a study material
function showMoreDetails(materialId) {
    try {
        const allMaterials = JSON.parse(localStorage.getItem('campus_materials')) || [];
        const material = allMaterials.find(m => m.id === materialId);
        
        if (material) {
            let materialSpecificContent = '';
            if (material.type === 'pdf' && material.fileName) {
                materialSpecificContent = `<p><strong>File:</strong> ${material.fileName} (${material.fileType || 'N/A'})</p>
                                           <p class="info-text">(Download/viewing of actual file content is not supported in this demo)</p>
                                           <button class="btn btn-primary" disabled>Download (Demo)</button>`;
            } else if (material.type === 'link' && material.link) {
                materialSpecificContent = `<p><strong>Link:</strong> <a href="${material.link}" target="_blank" rel="noopener noreferrer">${material.link}</a></p>`;
            } else if (material.type === 'text' && material.content) {
                materialSpecificContent = `<div><strong>Full Content:</strong><pre class="material-full-content">${material.content}</pre></div>`;
            } else if (material.type === 'video' && material.videoUrl) {
                materialSpecificContent = `<p><strong>Video:</strong> <a href="${material.videoUrl}" target="_blank" rel="noopener noreferrer">Watch Video</a></p>`;
            }

            const modalHTML = `
                <div class="modal" id="materialDetailsModal" style="display:block;">
                    <div class="modal-content">
                        <span class="close-modal" onclick="this.closest('.modal').remove();">&times;</span>
                        <h2>${material.title}</h2>
                        <div class="material-details">
                            <p><strong>Description:</strong> ${material.description}</p>
                            <p><strong>Subject:</strong> ${material.subject}</p>
                            <p><strong>Category:</strong> ${material.category || 'General'}</p>
                            <p><strong>Uploaded By:</strong> ${material.facultyName || 'Faculty'}</p>
                            <p><strong>Upload Date:</strong> ${new Date(material.uploadDate).toLocaleDateString()}</p>
                            ${materialSpecificContent}
                        </div>
                        <div class="modal-actions">
                            <button class="btn btn-primary" onclick="saveToFavorites('${material.id}'); this.closest('.modal').remove();">Save to Favorites</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Remove any existing modal first
            const existingModal = document.getElementById('materialDetailsModal');
            if (existingModal) existingModal.remove();

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
        } else {
            alert('Material details not found.');
        }
    } catch (error) {
        console.error('Error showing material details from localStorage:', error);
        alert('An error occurred while loading material details');
    }
}

// Download study material (placeholder)
function downloadStudyMaterial(materialId) {
    alert(`Download for material ID: ${materialId} is a placeholder. Actual file download requires server-side logic or more complex client-side handling for locally selected files.`);
}

// Save study material to favorites
function saveToFavorites(materialId) {
    const messageElement = document.getElementById('study-material-message') || document.getElementById('favorites-message');
    try {
        const currentUser = getCurrentUser(); // Assumes getCurrentUser() returns { username: '...' } or similar
        if (!currentUser || !currentUser.username) {
            if(messageElement) showMessage(messageElement.id, 'You must be logged in to save favorites.', 'error');
            else alert('You must be logged in to save favorites.');
            return;
        }
        
        const favoritesKey = `student_favorites_${currentUser.username}`;
        let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
        
        if (!favorites.includes(materialId)) {
            favorites.push(materialId);
            localStorage.setItem(favoritesKey, JSON.stringify(favorites));
            if(messageElement) showMessage(messageElement.id, 'Material saved to favorites!', 'success');
            else alert('Material saved to favorites!');
        } else {
            if(messageElement) showMessage(messageElement.id, 'Material already in favorites.', 'info');
            else alert('Material already in favorites.');
        }
    } catch (error) {
        console.error('Error saving to favorites in localStorage:', error);
        if(messageElement) showMessage(messageElement.id, 'An error occurred while saving to favorites', 'error');
        else alert('An error occurred while saving to favorites');
    }
}

// Load favorite study materials
function loadFavorites() {
    const favoritesContainer = document.getElementById('favorites-list');
    if (!favoritesContainer) {
        return;
    }
    favoritesContainer.innerHTML = '<p>Loading favorites...</p>';
    
    try {
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.username) {
            favoritesContainer.innerHTML = '<p class="error-message">Please log in to see your favorites.</p>';
            return;
        }

        const favoritesKey = `student_favorites_${currentUser.username}`;
        const favoriteIds = JSON.parse(localStorage.getItem(favoritesKey)) || [];
        const allMaterials = JSON.parse(localStorage.getItem('campus_materials')) || [];
        
        const favoriteMaterials = allMaterials.filter(material => favoriteIds.includes(material.id));
        
        // Sort by upload date, newest first (optional, or by date favorited)
        favoriteMaterials.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

        favoritesContainer.innerHTML = '';
        if (favoriteMaterials.length === 0) {
            favoritesContainer.innerHTML = '<p>You have no favorite study materials.</p>';
            return;
        }
        favoriteMaterials.forEach(material => {
            const materialElement = document.createElement('div');
            materialElement.className = 'material-card';
            // Simplified display for favorites list, can be expanded like loadStudyMaterialsByCategory
            let materialContent = '';
             if (material.type === 'pdf' && material.fileName) {
                materialContent = `<p><strong>File:</strong> ${material.fileName}</p>`;
            } else if (material.type === 'link' && material.link) {
                materialContent = `<p><strong>Link:</strong> <a href="${material.link}" target="_blank" rel="noopener noreferrer">${material.link}</a></p>`;
            } else if (material.type === 'video' && material.videoUrl) {
                materialContent = `<p><strong>Video:</strong> <a href="${material.videoUrl}" target="_blank" rel="noopener noreferrer">Watch Video</a></p>`;
            }

            materialElement.innerHTML = `
                <h4>${material.title}</h4>
                <p>${material.description.substring(0,100)}...</p>
                ${materialContent}
                <p><strong>Subject:</strong> ${material.subject}</p>
                <p><strong>Uploaded by:</strong> ${material.facultyName || 'Faculty'}</p>
                <button class="btn btn-sm btn-danger" onclick="removeFromFavorites('${material.id}')">Remove from Favorites</button>
                <button class="btn btn-sm btn-secondary" onclick="showMoreDetails('${material.id}')">View Details</button>
            `;
            favoritesContainer.appendChild(materialElement);
        });
    } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
        favoritesContainer.innerHTML = '<p class="error-message">An error occurred while loading favorites</p>';
    }
}

// Remove from favorites
function removeFromFavorites(materialId) {
    const messageElement = document.getElementById('favorites-message') || document.getElementById('study-material-message');
    try {
        const currentUser = getCurrentUser();
         if (!currentUser || !currentUser.username) {
            if(messageElement) showMessage(messageElement.id, 'You must be logged in.', 'error');
            else alert('You must be logged in.');
            return;
        }
        
        const favoritesKey = `student_favorites_${currentUser.username}`;
        let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
        
        const initialLength = favorites.length;
        favorites = favorites.filter(id => id !== materialId);
        
        if (favorites.length < initialLength) {
            localStorage.setItem(favoritesKey, JSON.stringify(favorites));
            if(messageElement) showMessage(messageElement.id, 'Material removed from favorites!', 'success');
            else alert('Material removed from favorites!');
            if (typeof loadFavorites === 'function') loadFavorites(); // Refresh the list
        } else {
             if(messageElement) showMessage(messageElement.id, 'Material not found in favorites.', 'info');
             else alert('Material not found in favorites.');
        }
    } catch (error) {
        console.error('Error removing from favorites in localStorage:', error);
        if(messageElement) showMessage(messageElement.id, 'An error occurred while removing from favorites', 'error');
        else alert('An error occurred while removing from favorites');
    }
}

// Load profile data
function loadProfileData() {
    const profileDetailsContainer = document.getElementById('profile-details');
    const certificatesContainer = document.getElementById('certificates-list'); 
    const studentNameDashboard = document.getElementById('student-name'); // For dashboard welcome message
    const totalCertificatesDashboard = document.getElementById('total-certificates'); // For dashboard stat card

    if (!profileDetailsContainer) {
        console.warn('Profile details container not found.');
    }
    if (!certificatesContainer) {
        console.warn('Certificates container not found.');
    }
    
    try {
        const currentUser = getCurrentUser(); 
        if (!currentUser || !currentUser.username) { 
            if (profileDetailsContainer) profileDetailsContainer.innerHTML = '<p class="error-message">Could not identify current user. Please log in again.</p>';
            if (certificatesContainer) certificatesContainer.innerHTML = '';
            if (studentNameDashboard) studentNameDashboard.textContent = 'Student';
            if (totalCertificatesDashboard) totalCertificatesDashboard.textContent = '0';
            return;
        }

        if (studentNameDashboard) studentNameDashboard.textContent = currentUser.fullName || currentUser.username;

        const allUsers = JSON.parse(localStorage.getItem('campus_users')) || [];
        const studentData = allUsers.find(user => user.username === currentUser.username && user.role === CONFIG.ROLES.STUDENT);

        if (studentData && profileDetailsContainer) {
            profileDetailsContainer.innerHTML = `
                <div class="profile-info">
                    <p><strong>ID:</strong> ${studentData.id || studentData.username}</p>
                    <p><strong>Name:</strong> ${studentData.fullName}</p>
                    <p><strong>Email:</strong> ${studentData.email}</p>
                    <p><strong>Department:</strong> ${studentData.department || 'N/A'}</p>
                    <p><strong>Year:</strong> ${studentData.year || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${studentData.phone || 'Not provided'}</p>
                    <p><strong>Address:</strong> ${studentData.address || 'Not provided'}</p>
                    <p><strong>Date of Birth:</strong> ${studentData.dob ? new Date(studentData.dob).toLocaleDateString() : 'Not provided'}</p>
                    <p><strong>Enrollment Date:</strong> ${studentData.enrollmentDate ? new Date(studentData.enrollmentDate).toLocaleDateString() : 'Not provided'}</p>
                </div>`;
            
            const editProfileBtn = document.getElementById('edit-profile-btn');
            const editProfileCard = document.getElementById('edit-profile-card');
            const cancelProfileEditBtn = document.getElementById('cancel-profile-edit');
            const editProfileForm = document.getElementById('edit-profile-form');

            if (editProfileBtn && editProfileCard && editProfileForm) {
                editProfileBtn.addEventListener('click', () => {
                    editProfileCard.style.display = 'block';
                    // Populate form with current studentData
                    // Ensure form elements exist before trying to set their value
                    if(editProfileForm.elements['profile-name']) editProfileForm.elements['profile-name'].value = studentData.fullName || '';
                    if(editProfileForm.elements['profile-email']) editProfileForm.elements['profile-email'].value = studentData.email || '';
                    if(editProfileForm.elements['profile-department']) editProfileForm.elements['profile-department'].value = studentData.department || '';
                    if(editProfileForm.elements['profile-year']) editProfileForm.elements['profile-year'].value = studentData.year || '';
                    if(editProfileForm.elements['profile-phone']) editProfileForm.elements['profile-phone'].value = studentData.phone || '';
                    if(editProfileForm.elements['profile-address']) editProfileForm.elements['profile-address'].value = studentData.address || '';
                    if(editProfileForm.elements['profile-dob']) editProfileForm.elements['profile-dob'].value = studentData.dob || '';
                });
                if(cancelProfileEditBtn) {
                    cancelProfileEditBtn.addEventListener('click', () => {
                        editProfileCard.style.display = 'none';
                    });
                }
                editProfileForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    updateProfile();
                });
            }
        } else if (profileDetailsContainer) {
            profileDetailsContainer.innerHTML = `<p class="error-message">Failed to load profile data. User not found or not a student.</p>`;
        }

        if (certificatesContainer || totalCertificatesDashboard) {
            const allCertificates = JSON.parse(localStorage.getItem('campus_certificates')) || [];
            // Consistently use currentUser.id if available, otherwise username, for fetching student-specific data
            const studentIdentifier = currentUser.id || currentUser.username; 
            const studentCertificates = allCertificates.filter(cert => cert.studentId === studentIdentifier);

            if (totalCertificatesDashboard) {
                totalCertificatesDashboard.textContent = studentCertificates.length;
            }

            if (certificatesContainer) {
                certificatesContainer.innerHTML = '';
                if (studentCertificates.length === 0) {
                    certificatesContainer.innerHTML = '<p>You have not received any certificates yet.</p>';
                } else {
                    studentCertificates.sort((a,b) => new Date(b.issueDate) - new Date(a.issueDate)); 
                    studentCertificates.forEach(cert => {
                        const certElement = document.createElement('div');
                        certElement.className = 'certificate-item';
                        certElement.innerHTML = `
                            <div class="certificate-type">${cert.certificateType}</div>
                            <div class="certificate-details">
                                <p><strong>Course/Event:</strong> ${cert.courseName}</p>
                                <p><strong>Issue Date:</strong> ${new Date(cert.issueDate).toLocaleDateString()}</p>
                                <p><strong>Issued By:</strong> ${cert.issuedByName || cert.issuedByUsername || 'Campus Administration'}</p>
                            </div>
                            <div class="certificate-actions">
                                <button class="btn btn-sm btn-primary" onclick="viewCertificate('${cert.id}')">View</button>
                                <button class="btn btn-sm btn-secondary" onclick="downloadCertificate('${cert.id}')" disabled>Download (Demo)</button>
                            </div>`;
                        certificatesContainer.appendChild(certElement);
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error loading profile data from localStorage:', error);
        if(profileDetailsContainer) profileDetailsContainer.innerHTML = '<p class="error-message">An error occurred while loading profile data</p>';
        if(certificatesContainer) certificatesContainer.innerHTML = '<p class="error-message">An error occurred while loading certificates</p>';
        if (totalCertificatesDashboard) totalCertificatesDashboard.textContent = 'Error';
    }
}

// Update profile
function updateProfile() {
    const form = document.getElementById('edit-profile-form'); // Ensure this is the correct ID of your form
    const messageElement = document.getElementById('profile-message'); // Ensure this element exists for messages
    
    if (!form || !messageElement) {
        console.error("Profile form or message element not found.");
        alert("Error: Profile update cannot proceed due to missing form elements.");
        return;
    }

    try {
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.username) {
            showMessage(messageElement.id, 'Error: Not logged in or user data missing.', 'error');
            return;
        }

        const updatedProfileData = {
            fullName: form.elements['profile-name'].value, // Ensure form field names match
            email: form.elements['profile-email'].value,
            department: form.elements['profile-department'].value,
            year: form.elements['profile-year'].value,
            phone: form.elements['profile-phone'].value,
            address: form.elements['profile-address'].value,
            dob: form.elements['profile-dob'].value
            // Note: username and role should generally not be updatable by the user directly.
            // ID is also not updatable.
        };

        let allUsers = JSON.parse(localStorage.getItem('campus_users')) || [];
        const userIndex = allUsers.findIndex(user => user.username === currentUser.username && user.role === CONFIG.ROLES.STUDENT);

        if (userIndex > -1) {
            // Preserve existing fields not in the form, and update the ones that are
            allUsers[userIndex] = { ...allUsers[userIndex], ...updatedProfileData };
            localStorage.setItem('campus_users', JSON.stringify(allUsers));

            // Update the 'currentUser' in localStorage if it's used for quick display elsewhere (e.g., header)
            const updatedCurrentUser = { ...currentUser, ...updatedProfileData };
            localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser)); // Assuming 'currentUser' is the key for the logged-in user object

            showMessage(messageElement.id, 'Profile updated successfully!', 'success');
            
            // Update name in header if applicable
            const studentNameElement = document.getElementById('student-name'); // Assuming an element with this ID displays the name
            if (studentNameElement) studentNameElement.textContent = updatedProfileData.fullName;
            
            setTimeout(() => {
                const editProfileCard = document.getElementById('edit-profile-card');
                if (editProfileCard) editProfileCard.style.display = 'none';
                if (typeof loadProfileData === 'function') loadProfileData(); // Reload profile data to reflect changes
            }, 1500);
        } else {
            showMessage(messageElement.id, 'Failed to update profile: User not found.', 'error');
        }
    } catch (error) {
        console.error('Error updating profile in localStorage:', error);
        showMessage(messageElement.id, 'An error occurred while updating profile.', 'error');
    }
}

// View certificate
function viewCertificate(certificateId) {
    try {
        const allCertificates = JSON.parse(localStorage.getItem('campus_certificates')) || [];
        const certificate = allCertificates.find(cert => cert.id === certificateId);
        
        if (certificate) {
            const currentUser = getCurrentUser(); // For student's name
            const studentName = currentUser?.fullName || currentUser?.username || 'Student'; // Fallback if name not in currentUser

            const modalHTML = `
                <div class="modal certificate-modal" id="certificateModal" style="display:block;">
                    <div class="modal-content certificate-modal-content">
                        <span class="close-modal" onclick="this.closest('.modal').remove();">&times;</span>
                        <div class="certificate-container">
                            <div class="certificate">
                                <div class="certificate-header">
                                    <div class="certificate-logo">CampusConnect</div>
                                    <h2>Certificate of ${certificate.certificateType}</h2>
                                </div>
                                <div class="certificate-body">
                                    <p class="certificate-text">This is to certify that</p>
                                    <p class="certificate-name">${studentName}</p>
                                    <p class="certificate-text">has successfully completed</p>
                                    <p class="certificate-course">${certificate.courseName}</p>
                                    <p class="certificate-text">on</p>
                                    <p class="certificate-date">${new Date(certificate.issueDate).toLocaleDateString()}</p>
                                </div>
                                <div class="certificate-footer">
                                    <div class="certificate-signature">
                                        <div class="signature-line"></div>
                                        <p>${certificate.issuedBy || 'Campus Administration'}</p>
                                    </div>
                                    <div class="certificate-seal"></div>
                                </div>
                            </div>
                        </div>
                        <div class="certificate-actions">
                            <button class="btn btn-primary" onclick="downloadCertificate('${certificateId}')" disabled>Download (Demo)</button>
                        </div>
                    </div>
                </div>`;
            
            const existingModal = document.getElementById('certificateModal');
            if (existingModal) existingModal.remove();
            document.body.insertAdjacentHTML('beforeend', modalHTML);

        } else {
            alert('Certificate details not found.');
        }
    } catch (error) {
        console.error('Error viewing certificate from localStorage:', error);
        alert('An error occurred while loading certificate');
    }
}

// Download certificate (placeholder)
function downloadCertificate(certificateId) {
    alert(`Download for certificate ID: ${certificateId}. This is a placeholder. Actual PDF generation and download would require significant client-side libraries or server-side processing.`);
}


// Helper function to show messages (if not already in a global utils.js)
function showMessage(elementId, message, type = 'info') {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}-message`; // Ensure 'message' base class is present
        
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'message';
        }, 3000);
    } else {
        console.warn(`Message element with ID '${elementId}' not found.`);
    }
}

// Load Student Attendance Records
function loadStudentAttendance(subjectFilter = 'all') {
    const tableBody = document.getElementById('student-attendance-table-body');
    const summaryDiv = document.getElementById('attendance-summary');
    const subjectFilterSelect = document.getElementById('attendance-subject-filter');

    if (!tableBody || !summaryDiv || !subjectFilterSelect) {
        console.error('Required elements for student attendance not found.');
        return;
    }

    tableBody.innerHTML = '<tr><td colspan="4">Loading attendance...</td></tr>';
    summaryDiv.innerHTML = '';

    try {
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.username) { // Use username or a consistent ID
            tableBody.innerHTML = '<tr><td colspan="4" class="error-message">Could not identify student. Please log in.</td></tr>';
            return;
        }
        const studentIdentifier = currentUser.id || currentUser.username;

        const allAttendanceRecords = JSON.parse(localStorage.getItem('campus_attendance_records')) || [];
        let studentRecords = [];
        let totalDays = 0;
        let presentDays = 0;
        const subjects = new Set();

        allAttendanceRecords.forEach(record => {
            subjects.add(record.subject); // Collect all subjects for filter
            if (record.presentStudentIds && record.presentStudentIds.includes(studentIdentifier)) {
                studentRecords.push({ ...record, status: 'Present' });
                totalDays++;
                presentDays++;
            } else if (record.absentStudentIds && record.absentStudentIds.includes(studentIdentifier)) {
                studentRecords.push({ ...record, status: 'Absent' });
                totalDays++;
            }
        });
        
        // Populate subject filter
        const currentFilterValue = subjectFilterSelect.value;
        subjectFilterSelect.innerHTML = '<option value="all">All Subjects</option>'; // Reset
        subjects.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub;
            option.textContent = sub;
            subjectFilterSelect.appendChild(option);
        });
        subjectFilterSelect.value = currentFilterValue; // Preserve filter if already set

        // Apply subject filter if not 'all'
        if (subjectFilter !== 'all') {
            studentRecords = studentRecords.filter(rec => rec.subject === subjectFilter);
            // Recalculate summary for filtered subject
            totalDays = 0;
            presentDays = 0;
            studentRecords.forEach(rec => {
                totalDays++;
                if (rec.status === 'Present') presentDays++;
            });
        }
        
        studentRecords.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

        tableBody.innerHTML = '';
        if (studentRecords.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4">No attendance records found${subjectFilter !== 'all' ? ' for ' + subjectFilter : ''}.</td></tr>`;
        } else {
            studentRecords.forEach(rec => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(rec.date).toLocaleDateString()}</td>
                    <td>${rec.subject}</td>
                    <td>${rec.classIdentifier}</td>
                    <td class="status-${rec.status.toLowerCase()}">${rec.status}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        const overallPercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : '0'; // Default to 0 if no days
        summaryDiv.innerHTML = `<p><strong>${subjectFilter === 'all' ? 'Overall' : subjectFilter} Attendance:</strong> ${overallPercentage}% (${presentDays}/${totalDays} days)</p>`;
        
        // Update dashboard stat card if it exists
        const attendanceRateDashboard = document.getElementById('attendance-rate');
        if (attendanceRateDashboard && subjectFilter === 'all') { // Only update dashboard with overall rate
            attendanceRateDashboard.textContent = `${overallPercentage}%`;
        }
        
        // Add event listener to filter if not already added
        if (!subjectFilterSelect.hasAttribute('listener')) {
            subjectFilterSelect.setAttribute('listener', 'true');
            subjectFilterSelect.addEventListener('change', function() {
                loadStudentAttendance(this.value);
            });
        }

    } catch (error) {
        console.error('Error loading student attendance:', error);
        tableBody.innerHTML = '<tr><td colspan="4" class="error-message">An error occurred while loading attendance records.</td></tr>';
        summaryDiv.innerHTML = '<p class="error-message">Could not calculate attendance summary.</p>';
    }
}

// Load Courses for Student Dashboard
function loadStudentCourses(departmentFilter = 'all') {
    const tableBody = document.getElementById('student-courses-table-body');
    const filterSelect = document.getElementById('course-department-filter'); // Department filter dropdown

    if (!tableBody || !filterSelect) {
        console.error('Required elements for student courses not found.');
        return;
    }

    tableBody.innerHTML = '<tr><td colspan="5">Loading courses...</td></tr>';

    try {
        let courses = JSON.parse(localStorage.getItem('campus_courses')) || [];
        const departments = JSON.parse(localStorage.getItem('campus_departments')) || [];

        // Populate department filter
        const currentFilterValue = filterSelect.value;
        filterSelect.innerHTML = '<option value="all">All Departments</option>'; // Reset
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id; // Assuming dept.id is used in course.departmentId
            option.textContent = dept.name;
            filterSelect.appendChild(option);
        });
        filterSelect.value = currentFilterValue; // Preserve filter

        // Apply department filter
        if (departmentFilter !== 'all') {
            courses = courses.filter(course => course.departmentId === departmentFilter);
        }

        courses.sort((a, b) => a.name.localeCompare(b.name));

        tableBody.innerHTML = '';
        if (courses.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5">No courses found${departmentFilter !== 'all' ? ' for the selected department' : ''}.</td></tr>`;
        } else {
            courses.forEach(course => {
                const row = document.createElement('tr');
                // Find department name using departmentId from course
                const dept = departments.find(d => d.id === course.departmentId);
                const deptName = dept ? dept.name : 'N/A';

                row.innerHTML = `
                    <td>${course.name}</td>
                    <td>${course.code}</td>
                    <td>${deptName}</td>
                    <td>${course.credits}</td>
                    <td>${course.instructor || 'N/A'}</td>
                `;
                tableBody.appendChild(row);
            });
        }
        
        // Add event listener to filter if not already added
        if (!filterSelect.hasAttribute('listener')) {
            filterSelect.setAttribute('listener', 'true');
            filterSelect.addEventListener('change', function() {
                loadStudentCourses(this.value);
            });
        }
        
        // Update dashboard stat card for total courses (this might be total available, not enrolled)
        const totalCoursesDashboard = document.getElementById('total-courses');
        if (totalCoursesDashboard && departmentFilter === 'all') { // Only update with overall count
             const allCourses = JSON.parse(localStorage.getItem('campus_courses')) || [];
             totalCoursesDashboard.textContent = allCourses.length;
        }


    } catch (error) {
        console.error('Error loading student courses:', error);
        tableBody.innerHTML = '<tr><td colspan="5" class="error-message">An error occurred while loading courses.</td></tr>';
    }
}


// AI Tutor and Virtual Campus Tour functions are extensive and seem self-contained with their own simulateApiCall or direct logic.
// Refactoring them would be a larger step, focusing on the core student data functions first.
// initializeAIAssistant, showTypingIndicator, hideTypingIndicator, addUserMessage, addAIMessage, processAIQuery
// initializeCampusTour, showTooltip, hideTooltip, showLocation, navigateLocation, startGuidedTour, toggleLabels, toggleFullscreen
// loadTutoringData, registerForTutoring, contactTutor
// loadWellnessData, registerForWellness, moreInfoWellness
// These are currently not using the main simulateApiCall that I'm replacing.
