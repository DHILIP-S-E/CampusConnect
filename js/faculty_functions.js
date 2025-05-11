/**
 * Faculty specific functions for CampusConnect
 */

function uploadMaterial() {
    const form = document.getElementById('upload-material-form');
    const messageElement = document.getElementById('material-message');
    
    if (!form || !messageElement) {
        console.error('Upload material form or message element not found.');
        if (messageElement) {
            messageElement.textContent = 'Error: Form elements missing.';
            messageElement.className = 'message error-message';
        }
        return;
    }

    const title = form.elements['title'].value;
    const description = form.elements['description'].value;
    const type = form.elements['type'].value;
    const subject = form.elements['subject'].value;
    const category = form.elements['category'].value;
    const target = form.elements['target'].value; // e.g. "All Students", "Year 1 CS"

    const currentUser = getCurrentUser(); // Assumes getCurrentUser() is defined and returns user object
    if (!currentUser || !currentUser.username) { // Check for username or a unique ID
        messageElement.textContent = 'Error: Could not identify current user.';
        messageElement.className = 'message error-message';
        return;
    }

    const materialData = {
        id: `mat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        type,
        subject,
        category,
        targetStudents: target,
        facultyId: currentUser.username, // Use username or a unique ID from currentUser
        facultyName: currentUser.fullName || currentUser.username, // Store faculty name
        uploadDate: new Date().toISOString(),
        fileName: null,
        fileType: null,
        link: null,
        content: null,
        videoUrl: null,
    };

    if (type === 'pdf') {
        const fileInput = form.elements['file'];
        if (fileInput.files.length > 0) {
            materialData.fileName = fileInput.files[0].name;
            materialData.fileType = fileInput.files[0].type;
            // For frontend-only, we can't actually "upload" the file.
            // We'll just store its name and type.
            // If you needed to display it, you'd need to handle FileReader to show a preview or link.
            // For this exercise, storing metadata is sufficient.
            console.log(`File selected: ${materialData.fileName} (${materialData.fileType})`);
        } else {
            messageElement.textContent = 'Please select a PDF file.';
            messageElement.className = 'message error-message';
            return;
        }
    } else if (type === 'link') {
        materialData.link = form.elements['link'].value;
        if (!materialData.link) {
            messageElement.textContent = 'Please enter an external link.';
            messageElement.className = 'message error-message';
            return;
        }
    } else if (type === 'text') {
        materialData.content = form.elements['content'].value;
        if (!materialData.content) {
            messageElement.textContent = 'Please enter some text content.';
            messageElement.className = 'message error-message';
            return;
        }
    } else if (type === 'video') {
        materialData.videoUrl = form.elements['videoUrl'].value;
        if (!materialData.videoUrl) {
            messageElement.textContent = 'Please enter a video URL.';
            messageElement.className = 'message error-message';
            return;
        }
    }

    if (!title || !description || !type || !subject || !category || !target) {
        messageElement.textContent = 'Please fill in all required fields.';
        messageElement.className = 'message error-message';
        return;
    }

    try {
        const allMaterials = JSON.parse(localStorage.getItem('campus_materials')) || [];
        allMaterials.push(materialData);
        localStorage.setItem('campus_materials', JSON.stringify(allMaterials));
        
        messageElement.textContent = 'Study material saved locally successfully!';
        messageElement.className = 'message success-message';
        form.reset();
        if (typeof loadFacultyMaterials === 'function') {
            loadFacultyMaterials();
        }
        // Assuming loadDashboardData might be on faculty.html to update counts
        if (typeof loadDashboardData === 'function') { 
            loadDashboardData();
        }
    } catch (error) {
        console.error('Error saving material locally:', error);
        messageElement.textContent = 'An error occurred while saving the material.';
        messageElement.className = 'message error-message';
    }
}

// Function to load materials uploaded by the current faculty
function loadFacultyMaterials() {
    const materialsListContainer = document.getElementById('materials-list');
    if (!materialsListContainer) {
        console.warn('Materials list container not found in faculty page.');
        return;
    }
    materialsListContainer.innerHTML = '<p>Loading your uploaded materials...</p>';

    try {
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.username) {
            materialsListContainer.innerHTML = '<p class="error-message">Could not identify current user to load materials.</p>';
            return;
        }
        
        const allMaterials = JSON.parse(localStorage.getItem('campus_materials')) || [];
        const facultyMaterials = allMaterials.filter(material => material.facultyId === currentUser.username);
        
        // Sort by upload date, newest first
        facultyMaterials.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

        if (facultyMaterials.length === 0) {
            materialsListContainer.innerHTML = '<p>You have not uploaded any materials yet.</p>';
        } else {
            materialsListContainer.innerHTML = ''; 
            facultyMaterials.forEach(material => {
                const materialCard = document.createElement('div');
                materialCard.className = 'material-card';
                
                let contentHtml = '';
                if (material.type === 'pdf' && material.fileName) {
                    contentHtml = `<p><strong>File:</strong> ${material.fileName} (${material.fileType || 'unknown type'})</p>
                                   <p class="info-text">(File content not stored/displayed in this demo)</p>`;
                } else if (material.type === 'link' && material.link) {
                    contentHtml = `<p><strong>Link:</strong> <a href="${material.link}" target="_blank" rel="noopener noreferrer">${material.link}</a></p>`;
                } else if (material.type === 'text' && material.content) {
                    // Displaying a snippet of text content
                    const snippet = material.content.length > 150 ? material.content.substring(0, 147) + "..." : material.content;
                    contentHtml = `<p><strong>Content:</strong> <pre>${snippet}</pre></p>`;
                } else if (material.type === 'video' && material.videoUrl) {
                    contentHtml = `<p><strong>Video:</strong> <a href="${material.videoUrl}" target="_blank" rel="noopener noreferrer">Watch Video</a></p>`;
                }

                materialCard.innerHTML = `
                    <h4>${material.title}</h4>
                    <p>${material.description}</p>
                    ${contentHtml}
                    <p><strong>Subject:</strong> ${material.subject}</p>
                    <p><strong>Category:</strong> ${material.category}</p>
                    <p><strong>Target:</strong> ${material.targetStudents || 'N/A'}</p>
                    <p class="material-meta">Uploaded on: ${new Date(material.uploadDate).toLocaleDateString()}</p>
                    <div class="actions">
                        <button class="btn btn-sm btn-secondary" onclick="editMaterial('${material.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteMaterial('${material.id}')">Delete</button>
                    </div>
                `;
                materialsListContainer.appendChild(materialCard);
            });
        }
    } catch (error) {
        console.error('Error loading faculty materials from localStorage:', error);
        materialsListContainer.innerHTML = '<p class="error-message">An error occurred while loading your materials.</p>';
    }
}

function editMaterial(materialId) {
    // This would pre-fill the upload form with the material's data for editing.
    // For now, it's a placeholder.
    alert(`Edit material with ID: ${materialId}. This would involve loading the material data into the form, allowing edits, and then re-saving it to localStorage, replacing the old entry.`);
    
    // Example of how it might start:
    // const allMaterials = JSON.parse(localStorage.getItem('campus_materials')) || [];
    // const materialToEdit = allMaterials.find(m => m.id === materialId);
    // if (materialToEdit) {
    //     document.getElementById('title').value = materialToEdit.title;
    //     // ... populate other form fields ...
    //     // Change form submit button to "Update Material" and handle update logic
    // }
}

function deleteMaterial(materialId) {
    if (confirm('Are you sure you want to delete this material?')) {
        try {
            let allMaterials = JSON.parse(localStorage.getItem('campus_materials')) || [];
            const initialLength = allMaterials.length;
            allMaterials = allMaterials.filter(material => material.id !== materialId);

            if (allMaterials.length < initialLength) {
                localStorage.setItem('campus_materials', JSON.stringify(allMaterials));
                alert('Material deleted successfully.');
                if (typeof loadFacultyMaterials === 'function') loadFacultyMaterials();
                 // Assuming loadDashboardData might be on faculty.html to update counts
                if (typeof loadDashboardData === 'function') { 
                    loadDashboardData();
                }
            } else {
                alert('Material not found or already deleted.');
            }
        } catch (error) {
            console.error('Error deleting material from localStorage:', error);
            alert('An error occurred while deleting material.');
        }
    }
}
