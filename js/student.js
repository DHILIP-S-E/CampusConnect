/**
 * Student functionality for CampusConnect
 * Handles viewing materials, submitting feedback, reporting lost/found items, and profile management
 */

// Simulate API call (for demo purposes)
async function simulateApiCall(endpoint, data = {}) {
    // This function simulates API calls for demonstration purposes
    // In a real application, this would be replaced with actual API calls
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate different responses based on the endpoint
            switch (endpoint) {
                case CONFIG.ENDPOINTS.GET_CERTIFICATE_DETAILS:
                    // Simulate fetching certificate details
                    const certificate = {
                        id: data.certificateId,
                        studentId: getCurrentUser().id,
                        certificateType: data.certificateId === 'cert1' ? 'Course Completion' : 'Achievement',
                        courseName: data.certificateId === 'cert1' ? 'Introduction to Programming' : 'Hackathon Winner',
                        issueDate: data.certificateId === 'cert1' ? '2023-05-20' : '2023-07-15',
                        issuedBy: data.certificateId === 'cert1' ? 'Prof. Alan Turing' : 'Department of Computer Science'
                    };
                    
                    resolve({
                        success: true,
                        certificate: certificate
                    });
                    break;
                
                case CONFIG.ENDPOINTS.GET_STUDENT_PROFILE:
                    // Simulate fetching student profile
                    const student = {
                        id: getCurrentUser().id,
                        name: getCurrentUser().name,
                        email: `${getCurrentUser().id}@example.com`,
                        department: 'Computer Science',
                        year: 'Second Year',
                        phone: '123-456-7890',
                        address: '123 Campus Street, University City',
                        dob: '2000-05-15',
                        enrollmentDate: '2022-09-01'
                    };
                    
                    resolve({
                        success: true,
                        student: student
                    });
                    break;
                
                case CONFIG.ENDPOINTS.GET_STUDENT_CERTIFICATES:
                    // Simulate fetching student certificates
                    const certificates = [
                        {
                            id: 'cert1',
                            studentId: getCurrentUser().id,
                            certificateType: 'Course Completion',
                            courseName: 'Introduction to Programming',
                            issueDate: '2023-05-20',
                            issuedBy: 'Prof. Alan Turing'
                        },
                        {
                            id: 'cert2',
                            studentId: getCurrentUser().id,
                            certificateType: 'Achievement',
                            courseName: 'Hackathon Winner',
                            issueDate: '2023-07-15',
                            issuedBy: 'Department of Computer Science'
                        }
                    ];
                    
                    resolve({
                        success: true,
                        certificates: certificates
                    });
                    break;
                
                case CONFIG.ENDPOINTS.GET_MATERIALS:
                    // Simulate fetching study materials
                    const materials = [
                        {
                            id: 'mat1',
                            title: 'Introduction to Computer Science',
                            description: 'Basic concepts and principles of computer science',
                            type: 'pdf',
                            fileData: {
                                name: 'intro_cs.pdf',
                                size: 2500000
                            },
                            subject: 'Computer Science',
                            category: 'lectures',
                            target: 'all',
                            uploadDate: '2023-09-15',
                            uploadedBy: 'Prof. Alan Turing'
                        },
                        {
                            id: 'mat2',
                            title: 'Data Structures and Algorithms',
                            description: 'Comprehensive guide to data structures and algorithms',
                            type: 'pdf',
                            fileData: {
                                name: 'dsa_guide.pdf',
                                size: 3800000
                            },
                            subject: 'Computer Science',
                            category: 'notes',
                            target: 'year2',
                            uploadDate: '2023-09-20',
                            uploadedBy: 'Prof. Grace Hopper'
                        },
                        {
                            id: 'mat3',
                            title: 'Calculus I - Video Lectures',
                            description: 'Video lectures covering Calculus I topics',
                            type: 'link',
                            link: 'https://example.com/calculus-videos',
                            subject: 'Mathematics',
                            category: 'lectures',
                            target: 'year1',
                            uploadDate: '2023-09-25',
                            uploadedBy: 'Prof. John Nash'
                        },
                        {
                            id: 'mat4',
                            title: 'Physics Lab Manual',
                            description: 'Laboratory manual for Physics experiments',
                            type: 'pdf',
                            fileData: {
                                name: 'physics_lab.pdf',
                                size: 1800000
                            },
                            subject: 'Physics',
                            category: 'assignments',
                            target: 'year2',
                            uploadDate: '2023-10-05',
                            uploadedBy: 'Prof. Marie Curie'
                        },
                        {
                            id: 'mat5',
                            title: 'Database Management Systems',
                            description: 'Introduction to database concepts and SQL',
                            type: 'text',
                            content: 'This is a sample text content for database management systems...',
                            subject: 'Computer Science',
                            category: 'notes',
                            target: 'year3',
                            uploadDate: '2023-10-10',
                            uploadedBy: 'Prof. Ada Lovelace'
                        }
                    ];
                    
                    resolve({
                        success: true,
                        materials: materials
                    });
                    break;
                
                case 'GET_TUTORING_SESSIONS':
                    // Simulate fetching tutoring sessions
                    const tutoringSessions = [
                        {
                            id: 'tut1',
                            subject: 'Mathematics',
                            topic: 'Calculus I',
                            tutor: 'Michael Johnson',
                            tutorId: 'std10',
                            date: '2023-10-25',
                            time: '14:00 - 15:30',
                            location: 'Library Study Room 3',
                            status: 'upcoming',
                            maxParticipants: 5,
                            currentParticipants: 3
                        },
                        {
                            id: 'tut2',
                            subject: 'Computer Science',
                            topic: 'Data Structures',
                            tutor: 'Emily Davis',
                            tutorId: 'std4',
                            date: '2023-10-26',
                            time: '16:00 - 17:30',
                            location: 'Computer Lab 2',
                            status: 'upcoming',
                            maxParticipants: 8,
                            currentParticipants: 6
                        },
                        {
                            id: 'tut3',
                            subject: 'Physics',
                            topic: 'Mechanics',
                            tutor: 'Robert Wilson',
                            tutorId: 'std15',
                            date: '2023-10-28',
                            time: '10:00 - 11:30',
                            location: 'Physics Lab',
                            status: 'upcoming',
                            maxParticipants: 6,
                            currentParticipants: 2
                        }
                    ];
                    
                    resolve({
                        success: true,
                        tutoringSessions: tutoringSessions
                    });
                    break;
                
                case 'GET_WELLNESS_RESOURCES':
                    // Simulate fetching wellness resources
                    const wellnessResources = [
                        {
                            id: 'well1',
                            title: 'Stress Management Workshop',
                            description: 'Learn effective techniques to manage academic stress',
                            type: 'workshop',
                            date: '2023-10-30',
                            time: '15:00 - 16:30',
                            location: 'Student Center Room 101',
                            facilitator: 'Dr. Sarah Johnson',
                            registrationRequired: true,
                            maxParticipants: 20,
                            currentParticipants: 12
                        },
                        {
                            id: 'well2',
                            title: 'Mindfulness Meditation',
                            description: 'Weekly meditation sessions for mental well-being',
                            type: 'recurring',
                            schedule: 'Every Wednesday',
                            time: '08:00 - 08:30',
                            location: 'Wellness Center',
                            facilitator: 'Prof. David Miller',
                            registrationRequired: false
                        },
                        {
                            id: 'well3',
                            title: 'Nutrition Counseling',
                            description: 'One-on-one nutrition guidance for students',
                            type: 'service',
                            availability: 'By appointment',
                            location: 'Health Center',
                            provider: 'Ms. Jennifer Adams, RD',
                            registrationRequired: true
                        },
                        {
                            id: 'well4',
                            title: 'Sleep Hygiene Guide',
                            description: 'Resources for improving sleep quality',
                            type: 'resource',
                            format: 'PDF Guide',
                            link: '#'
                        }
                    ];
                    
                    resolve({
                        success: true,
                        wellnessResources: wellnessResources
                    });
                    break;
                    
                default:
                    // Forward to the CONFIG.ENDPOINTS version if it exists
                    if (CONFIG.ENDPOINTS[endpoint]) {
                        resolve({
                            success: true,
                            message: 'Operation completed successfully'
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Unknown endpoint'
                        });
                    }
            }
        }, 500); // Simulate network delay
    });
}

// Load study materials
async function loadMaterials(subjectFilter = 'all') {
    const materialsContainer = document.getElementById('materials-list');
    const filterSelect = document.getElementById('material-filter');
    
    try {
        // In a real application, this would be an actual API call
        const response = await simulateApiCall(CONFIG.ENDPOINTS.GET_MATERIALS);
        
        if (response.success) {
            // Clear existing materials
            materialsContainer.innerHTML = '';
            
            // Update subject filter options if not already populated
            if (filterSelect.options.length === 1) {
                const subjects = [...new Set(response.materials.map(material => material.subject))];
                subjects.forEach(subject => {
                    const option = document.createElement('option');
                    option.value = subject;
                    option.textContent = subject;
                    filterSelect.appendChild(option);
                });
            }
            
            // Filter materials by subject if needed
            let materials = response.materials;
            if (subjectFilter !== 'all') {
                materials = materials.filter(material => material.subject === subjectFilter);
            }
            
            if (materials.length === 0) {
                materialsContainer.innerHTML = '<p>No materials available for the selected subject.</p>';
                return;
            }
            
            // Add materials to container
            materials.forEach(material => {
                const materialElement = document.createElement('div');
                materialElement.className = 'material-card';
                
                let materialContent = '';
                if (material.type === 'pdf') {
                    materialContent = `<p><strong>File:</strong> <a href="#" onclick="downloadStudyMaterial('${material.id}'); return false;">${material.fileData.name}</a> (${formatFileSize(material.fileData.size)})</p>`;
                } else if (material.type === 'link') {
                    materialContent = `<p><strong>Link:</strong> <a href="${material.link}" target="_blank">${material.link}</a></p>`;
                } else if (material.type === 'text') {
                    materialContent = `<p>${material.content}</p>`;
                } else if (material.type === 'video') {
                    materialContent = `<p><strong>Video:</strong> <a href="${material.videoUrl}" target="_blank">Watch Video</a></p>`;
                }
                
                materialElement.innerHTML = `
                    <h4>${material.title}</h4>
                    <p>${material.description}</p>
                    ${materialContent}
                    <p><strong>Subject:</strong> ${material.subject}</p>
                    <p><strong>Category:</strong> ${material.category || 'General'}</p>
                    <p class="material-meta">Uploaded on ${material.uploadDate}</p>
                    <div class="material-actions">
                        <button class="btn btn-sm btn-primary" onclick="saveToFavorites('${material.id}')">Save to Favorites</button>
                        <button class="btn btn-sm btn-secondary more-details-btn" onclick="viewMaterialDetails('${material.id}')">More Details</button>
                    </div>
                `;
                
                materialsContainer.appendChild(materialElement);
            });
        } else {
            materialsContainer.innerHTML = `<p class="error-message">${response.message || 'Failed to load materials'}</p>`;
        }
    } catch (error) {
        console.error('Error loading materials:', error);
        materialsContainer.innerHTML = '<p class="error-message">An error occurred while loading materials</p>';
    }
}

// View material details
async function viewMaterialDetails(materialId) {
    try {
        // In a real application, this would be an actual API call
        const response = await simulateApiCall(CONFIG.ENDPOINTS.GET_MATERIALS);
        
        if (response.success) {
            // Find the material with the given ID
            const material = response.materials.find(m => m.id === materialId);
            
            if (!material) {
                alert('Material not found');
                return;
            }
            
            // Create modal for material details
            const modalHTML = `
                <div class="modal" id="materialDetailsModal">
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <h2>${material.title}</h2>
                        <div class="material-details">
                            <p><strong>Description:</strong> ${material.description}</p>
                            <p><strong>Subject:</strong> ${material.subject}</p>
                            <p><strong>Category:</strong> ${material.category || 'General'}</p>
                            <p><strong>Upload Date:</strong> ${material.uploadDate}</p>
                            <p><strong>Uploaded By:</strong> ${material.uploadedBy || 'Faculty'}</p>
                            
                            ${material.type === 'pdf' ? 
                                `<p><strong>File:</strong> ${material.fileData.name} (${formatFileSize(material.fileData.size)})</p>
                                <button class="btn btn-primary" onclick="downloadStudyMaterial('${material.id}')">Download</button>` : 
                                material.type === 'link' ? 
                                `<p><strong>Link:</strong> <a href="${material.link}" target="_blank">${material.link}</a></p>` : 
                                material.type === 'video' ? 
                                `<p><strong>Video:</strong> <a href="${material.videoUrl}" target="_blank">Watch Video</a></p>` : 
                                `<p>${material.content}</p>`
                            }
                        </div>
                        <div class="modal-actions">
                            <button class="btn btn-primary" onclick="saveToFavorites('${material.id}')">Save to Favorites</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal to the page
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer.firstElementChild);
            
            // Show the modal
            const modal = document.getElementById('materialDetailsModal');
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
        } else {
            alert('Failed to load material details');
        }
    } catch (error) {
        console.error('Error showing material details:', error);
        alert('An error occurred while loading material details');
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes < 1024) {
        return bytes + ' bytes';
    } else if (bytes < 1048576) {
        return (bytes / 1024).toFixed(2) + ' KB';
    } else {
        return (bytes / 1048576).toFixed(2) + ' MB';
    }
}

// Submit feedback
async function submitFeedback() {
    const form = document.getElementById('submit-feedback-form');
    const messageElement = document.getElementById('feedback-message');
    
    try {
        const formData = {
            subject: form.elements['subject'].value,
            facultyId: form.elements['facultyId'].value,
            rating: form.elements['rating'].value,
            comments: form.elements['comments'].value,
            studentId: getCurrentUser().id,
            date: new Date().toISOString().split('T')[0]
        };
        
        // In a real application, this would be an actual API call
        const response = await simulateApiCall(CONFIG.ENDPOINTS.SUBMIT_FEEDBACK, formData);
        
        if (response.success) {
            messageElement.textContent = 'Feedback submitted successfully!';
            messageElement.className = 'message success-message';
            form.reset();
            
            // Update dashboard stats
            loadDashboardData();
        } else {
            messageElement.textContent = response.message || 'Failed to submit feedback';
            messageElement.className = 'message error-message';
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        messageElement.textContent = 'An error occurred while submitting feedback';
        messageElement.className = 'message error-message';
    }
}

// Load faculty for feedback form
async function loadFaculty() {
    const facultySelect = document.getElementById('feedback-faculty');
    
    try {
        // In a real application, this would be an actual API call
        const response = await simulateApiCall(CONFIG.ENDPOINTS.GET_FACULTY);
        
        if (response.success) {
            // Clear existing options except the first one
            while (facultySelect.options.length > 1) {
                facultySelect.remove(1);
            }
            
            // Add faculty options
            response.faculty.forEach(faculty => {
                const option = document.createElement('option');
                option.value = faculty.id;
                option.textContent = faculty.name;
                facultySelect.appendChild(option);
            });
        } else {
            console.error('Failed to load faculty:', response.message);
        }
    } catch (error) {
        console.error('Error loading faculty:', error);
    }
}

// Report lost item
async function reportLostItem() {
    const form = document.getElementById('report-lost-item-form');
    const messageElement = document.getElementById('lost-item-message');
    
    try {
        const formData = {
            itemName: form.elements['itemName'].value,
            description: form.elements['description'].value,
            dateLost: form.elements['dateLost'].value,
            location: form.elements['location'].value,
            contact: form.elements['contact'].value,
            studentId: getCurrentUser().id,
            reportDate: new Date().toISOString().split('T')[0]
        };
        
        // In a real application, this would be an actual API call
        const response = await simulateApiCall(CONFIG.ENDPOINTS.REPORT_LOST_ITEM, formData);
        
        if (response.success) {
            messageElement.textContent = 'Lost item reported successfully!';
            messageElement.className = 'message success-message';
            form.reset();
            loadMyLostItems();
            
            // Update dashboard stats
            loadDashboardData();
        } else {
            messageElement.textContent = response.message || 'Failed to report lost item';
            messageElement.className = 'message error-message';
        }
    } catch (error) {
        console.error('Error reporting lost item:', error);
        messageElement.textContent = 'An error occurred while reporting lost item';
        messageElement.className = 'message error-message';
    }
}

// Load my lost items
async function loadMyLostItems() {
    const lostItemsContainer = document.getElementById('my-lost-items-list');
    
    try {
        // In a real application, this would be an actual API call
        const response = await simulateApiCall(CONFIG.ENDPOINTS.GET_LOST_ITEMS, {
            studentId: getCurrentUser().id
        });
        
        if (response.success) {
            // Clear existing items
            lostItemsContainer.innerHTML = '';
            
            if (response.lostItems.length === 0) {
                lostItemsContainer.innerHTML = '<p>You have not reported any lost items.</p>';
                return;
            }
            
            // Add lost items to container
            response.lostItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'item-card';
                itemElement.innerHTML = `
                    <h4>${item.itemName}</h4>
                    <p>${item.description}</p>
                    <p><strong>Date Lost:</strong> ${item.dateLost}</p>
                    <p><strong>Location:</strong> ${item.location}</p>
                    <p><strong>Contact:</strong> ${item.contact}</p>
                    <p class="item-meta">Reported on ${item.reportDate}</p>
                    <p class="item-status ${item.status === 'found' ? 'status-found' : ''}">
                        Status: ${item.status === 'found' ? 'Found' : 'Still Lost'}
                    </p>
                `;
                
                lostItemsContainer.appendChild(itemElement);
            });
        } else {
            lostItemsContainer.innerHTML = `<p class="error-message">${response.message || 'Failed to load lost items'}</p>`;
        }
    } catch (error) {
        console.error('Error loading lost items:', error);
        lostItemsContainer.innerHTML = '<p class="error-message">An error occurred while loading lost items</p>';
    }
}

// Report found item
async function reportFoundItem() {
    const form = document.getElementById('report-found-item-form');
    const messageElement = document.getElementById('found-item-message');
    
    try {
        const formData = {
            itemName: form.elements['itemName'].value,
            description: form.elements['description'].value,
            dateFound: form.elements['dateFound'].value,
            location: form.elements['location'].value,
            contact: form.elements['contact'].value,
            studentId: getCurrentUser().id,
            reportDate: new Date().toISOString().split('T')[0]
        };
        
        // In a real application, this would be an actual API call
        const response = await simulateApiCall(CONFIG.ENDPOINTS.REPORT_FOUND_ITEM, formData);
        
        if (response.success) {
            messageElement.textContent = 'Found item reported successfully!';
            messageElement.className = 'message success-message';
            form.reset();
            loadFoundItems();
        } else {
            messageElement.textContent = response.message || 'Failed to report found item';
            messageElement.className = 'message error-message';
        }
    } catch (error) {
        console.error('Error reporting found item:', error);
        messageElement.textContent = 'An error occurred while reporting found item';
        messageElement.className = 'message error-message';
    }
}

// Load found items
async function loadFoundItems() {
    const foundItemsContainer = document.getElementById('found-items-list');
    
    try {
        // In a real application, this would be an actual API call
        const response = await simulateApiCall(CONFIG.ENDPOINTS.GET_FOUND_ITEMS);
        
        if (response.success) {
            // Clear existing items
            foundItemsContainer.innerHTML = '';
            
            if (response.foundItems.length === 0) {
                foundItemsContainer.innerHTML = '<p>No found items have been reported.</p>';
                return;
            }
            
            // Add found items to container
            response.foundItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'item-card';
                itemElement.innerHTML = `
                    <h4>${item.itemName}</h4>
                    <p>${item.description}</p>
                    <p><strong>Date Found:</strong> ${item.dateFound}</p>
                    <p><strong>Location:</strong> ${item.location}</p>
                    <p><strong>Contact:</strong> ${item.contact}</p>
                    <p class="item-meta">Reported on ${item.reportDate}</p>
                    <p class="item-status ${item.status === 'claimed' ? 'status-claimed' : ''}">
                        Status: ${item.status === 'claimed' ? 'Claimed' : 'Unclaimed'}
                    </p>
                `;
                
                foundItemsContainer.appendChild(itemElement);
            });
        } else {
            foundItemsContainer.innerHTML = `<p class="error-message">${response.message || 'Failed to load found items'}</p>`;
        }
    } catch (error) {
        console.error('Error loading found items:', error);
        foundItemsContainer.innerHTML = '<p class="error-message">An error occurred while loading found items</p>';
    }
}