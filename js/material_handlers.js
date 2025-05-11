// Material handlers for student dashboard

// Download material function
function downloadMaterial(materialId) {
    // Create sample file content based on material ID
    let fileContent = '';
    let fileName = '';
    
    switch(materialId) {
        case 'material1':
            fileName = 'Introduction_to_Programming_Concepts.pdf';
            fileContent = 'Introduction to Programming Concepts - Lecture Notes';
            break;
        case 'material2':
            fileName = 'Data_Types_and_Operators.pptx';
            fileContent = 'Data Types and Operators - Presentation Slides';
            break;
        case 'material4':
            fileName = 'Integration_Techniques.pdf';
            fileContent = 'Integration Techniques - Lecture Notes';
            break;
        case 'material5':
            fileName = 'Series_and_Sequences_Practice.pdf';
            fileContent = 'Practice Problems: Series and Sequences';
            break;
        case 'material6':
            fileName = 'Research_Paper_Guidelines.pdf';
            fileContent = 'Research Paper Guidelines';
            break;
        case 'material7':
            fileName = 'Citation_Styles.pptx';
            fileContent = 'Citation Styles Presentation';
            break;
        default:
            fileName = `material_${materialId}.pdf`;
            fileContent = `Content for material ${materialId}`;
    }
    
    // Create a Blob with the file content
    const blob = new Blob([fileContent], { type: 'text/plain' });
    
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    
    // Append to the document, click it, and remove it
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Show success message
    showNotification(`Downloaded: ${fileName}`, 'success');
}

// View material function
function viewMaterial(materialId) {
    // Create a modal for viewing the material
    const viewModal = document.createElement('div');
    viewModal.className = 'modal';
    viewModal.style.display = 'block';
    
    // Create content for the modal based on material ID
    let materialContent = '';
    let materialTitle = '';
    
    switch(materialId) {
        case 'material1':
            materialTitle = 'Introduction to Programming Concepts';
            materialContent = `
                <h2>Introduction to Programming Concepts</h2>
                <p>Lecture notes covering basic programming concepts, variables, and control structures.</p>
                <div class="material-preview">
                    <h3>Contents:</h3>
                    <ol>
                        <li>What is Programming?</li>
                        <li>Variables and Data Types</li>
                        <li>Basic Operators</li>
                        <li>Control Structures (if/else, loops)</li>
                        <li>Functions and Procedures</li>
                    </ol>
                    <div class="preview-content">
                        <h4>1. What is Programming?</h4>
                        <p>Programming is the process of creating a set of instructions that tell a computer how to perform a task. These instructions are written in a programming language that the computer can understand and execute.</p>
                        
                        <h4>2. Variables and Data Types</h4>
                        <p>Variables are used to store information that can be referenced and manipulated in a program. They provide a way of labeling data with a descriptive name.</p>
                        <p>Common data types include:</p>
                        <ul>
                            <li>Integer: Whole numbers (e.g., 1, 42, -7)</li>
                            <li>Float: Decimal numbers (e.g., 3.14, 2.5)</li>
                            <li>String: Text (e.g., "Hello, World!")</li>
                            <li>Boolean: True/False values</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
        case 'material2':
            materialTitle = 'Data Types and Operators';
            materialContent = `
                <h2>Data Types and Operators</h2>
                <p>Presentation slides covering various data types and operators in programming languages.</p>
                <div class="material-preview">
                    <div class="slide">
                        <h3>Slide 1: Introduction to Data Types</h3>
                        <ul>
                            <li>Primitive Types vs. Reference Types</li>
                            <li>Type Systems: Static vs. Dynamic</li>
                            <li>Type Conversion and Casting</li>
                        </ul>
                    </div>
                    <div class="slide">
                        <h3>Slide 2: Operators Overview</h3>
                        <ul>
                            <li>Arithmetic Operators: +, -, *, /, %</li>
                            <li>Comparison Operators: ==, !=, >, <, >=, <=</li>
                            <li>Logical Operators: &&, ||, !</li>
                            <li>Assignment Operators: =, +=, -=, *=, /=</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
        case 'material3':
            materialTitle = 'Algorithm Design Tutorial';
            materialContent = `
                <h2>Algorithm Design Tutorial</h2>
                <p>Video tutorial explaining the basics of algorithm design and analysis.</p>
                <div class="material-preview">
                    <div class="video-player">
                        <div class="video-placeholder">
                            <p>Video Player: Algorithm Design Tutorial</p>
                            <p>Duration: 45 minutes</p>
                            <button class="btn btn-primary">▶ Play Video</button>
                        </div>
                    </div>
                    <div class="video-description">
                        <h3>Video Contents:</h3>
                        <ol>
                            <li>Introduction to Algorithms (0:00 - 5:30)</li>
                            <li>Problem-Solving Approach (5:31 - 12:45)</li>
                            <li>Algorithm Analysis Basics (12:46 - 22:15)</li>
                            <li>Big O Notation (22:16 - 32:00)</li>
                            <li>Common Algorithm Patterns (32:01 - 45:00)</li>
                        </ol>
                    </div>
                </div>
            `;
            break;
        case 'material4':
            materialTitle = 'Integration Techniques';
            materialContent = `
                <h2>Integration Techniques</h2>
                <p>Comprehensive notes on various integration techniques including substitution and parts.</p>
                <div class="material-preview">
                    <h3>Contents:</h3>
                    <ol>
                        <li>Basic Integration Rules</li>
                        <li>Integration by Substitution</li>
                        <li>Integration by Parts</li>
                        <li>Trigonometric Integrals</li>
                        <li>Partial Fractions</li>
                    </ol>
                    <div class="preview-content">
                        <h4>1. Basic Integration Rules</h4>
                        <p>This section covers the fundamental integration rules and formulas that form the foundation of calculus.</p>
                        
                        <h4>2. Integration by Substitution</h4>
                        <p>The substitution method involves replacing a complicated variable with a simpler one to make the integration more manageable.</p>
                    </div>
                </div>
            `;
            break;
        case 'material5':
            materialTitle = 'Series and Sequences Practice Problems';
            materialContent = `
                <h2>Series and Sequences Practice Problems</h2>
                <p>Collection of practice problems on convergence tests and power series.</p>
                <div class="material-preview">
                    <h3>Problem Set:</h3>
                    <ol>
                        <li>Determine if the following series converge or diverge using the appropriate test.</li>
                        <li>Find the radius and interval of convergence for the given power series.</li>
                        <li>Evaluate the sum of the given convergent series.</li>
                    </ol>
                    <div class="preview-content">
                        <h4>Sample Problem:</h4>
                        <p>Determine whether the series Σ(n=1 to ∞) n/(n²+1) converges or diverges.</p>
                    </div>
                </div>
            `;
            break;
        case 'material6':
            materialTitle = 'Research Paper Guidelines';
            materialContent = `
                <h2>Research Paper Guidelines</h2>
                <p>Comprehensive guide on structuring and formatting academic research papers.</p>
                <div class="material-preview">
                    <h3>Contents:</h3>
                    <ol>
                        <li>Research Paper Structure</li>
                        <li>Formatting Guidelines</li>
                        <li>Citation Styles</li>
                        <li>Research Methods</li>
                        <li>Common Mistakes to Avoid</li>
                    </ol>
                    <div class="preview-content">
                        <h4>1. Research Paper Structure</h4>
                        <p>A well-structured research paper typically includes the following sections:</p>
                        <ul>
                            <li>Abstract</li>
                            <li>Introduction</li>
                            <li>Literature Review</li>
                            <li>Methodology</li>
                            <li>Results</li>
                            <li>Discussion</li>
                            <li>Conclusion</li>
                            <li>References</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
        case 'material7':
            materialTitle = 'Citation Styles Presentation';
            materialContent = `
                <h2>Citation Styles Presentation</h2>
                <p>Slides covering APA, MLA, and Chicago citation styles with examples.</p>
                <div class="material-preview">
                    <div class="slide">
                        <h3>Slide 1: APA Citation Style</h3>
                        <ul>
                            <li>Used primarily in social sciences</li>
                            <li>Author-date citation system</li>
                            <li>Reference list format</li>
                            <li>Example: Smith, J. (2020). Title of book. Publisher.</li>
                        </ul>
                    </div>
                    <div class="slide">
                        <h3>Slide 2: MLA Citation Style</h3>
                        <ul>
                            <li>Used primarily in humanities</li>
                            <li>Author-page citation system</li>
                            <li>Works Cited format</li>
                            <li>Example: Smith, John. Title of Book. Publisher, 2020.</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
        default:
            materialTitle = `Material ${materialId}`;
            materialContent = `<p>Preview for material ${materialId} is not available.</p>`;
    }
    
    // Create the modal content
    viewModal.innerHTML = `
        <div class="modal-content">
            <span class="close-view-modal">&times;</span>
            <div class="material-view-content">
                ${materialContent}
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary download-from-view" data-id="${materialId}">Download</button>
                <button class="btn btn-secondary close-view-btn">Close</button>
            </div>
        </div>
    `;
    
    // Add the modal to the document
    document.body.appendChild(viewModal);
    
    // Add event listeners for closing the modal
    const closeViewModal = viewModal.querySelector('.close-view-modal');
    const closeViewBtn = viewModal.querySelector('.close-view-btn');
    const downloadFromView = viewModal.querySelector('.download-from-view');
    
    closeViewModal.addEventListener('click', function() {
        document.body.removeChild(viewModal);
    });
    
    closeViewBtn.addEventListener('click', function() {
        document.body.removeChild(viewModal);
    });
    
    downloadFromView.addEventListener('click', function() {
        const materialId = this.getAttribute('data-id');
        downloadMaterial(materialId);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === viewModal) {
            document.body.removeChild(viewModal);
        }
    });
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}-notification`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    
    // Set color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#d4edda';
        notification.style.color = '#155724';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f8d7da';
        notification.style.color = '#721c24';
    } else {
        notification.style.backgroundColor = '#cce5ff';
        notification.style.color = '#004085';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Setup materials filters and interactions
function setupMaterialsFilters() {
    // Materials search functionality
    document.getElementById('materials-search-btn')?.addEventListener('click', function() {
        const searchTerm = document.getElementById('materials-search').value.toLowerCase();
        filterMaterials(searchTerm);
    });
    
    // Materials course filter
    document.getElementById('materials-course-filter')?.addEventListener('change', function() {
        const filterValue = this.value;
        filterMaterialsByCourse(filterValue);
    });
    
    // Materials type filter
    document.getElementById('materials-type-filter')?.addEventListener('change', function() {
        const filterValue = this.value;
        filterMaterialsByType(filterValue);
    });
    
    // Attach event listeners to material buttons
    attachMaterialButtonListeners();
}

// Attach event listeners to material buttons
function attachMaterialButtonListeners() {
    // Remove existing event listeners (to prevent duplicates)
    document.querySelectorAll('.download-material').forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    document.querySelectorAll('.view-material').forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // Add new event listeners
    document.querySelectorAll('.download-material').forEach(button => {
        button.addEventListener('click', function() {
            const materialId = this.getAttribute('data-id');
            downloadMaterial(materialId);
        });
    });
    
    document.querySelectorAll('.view-material').forEach(button => {
        button.addEventListener('click', function() {
            const materialId = this.getAttribute('data-id');
            viewMaterial(materialId);
        });
    });
}

// Filter materials by search term
function filterMaterials(searchTerm) {
    const materialItems = document.querySelectorAll('.material-item');
    
    materialItems.forEach(item => {
        const materialTitle = item.querySelector('h4').textContent.toLowerCase();
        const materialDescription = item.querySelector('p').textContent.toLowerCase();
        
        if (materialTitle.includes(searchTerm) || materialDescription.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Filter materials by course
function filterMaterialsByCourse(course) {
    const materialCategories = document.querySelectorAll('.material-category');
    
    materialCategories.forEach(category => {
        const categoryTitle = category.querySelector('h3').textContent;
        
        if (course === 'all' || categoryTitle.includes(course)) {
            category.style.display = '';
        } else {
            category.style.display = 'none';
        }
    });
}

// Filter materials by type
function filterMaterialsByType(type) {
    const materialItems = document.querySelectorAll('.material-item');
    
    materialItems.forEach(item => {
        const materialType = item.querySelector('.material-type').textContent.toLowerCase();
        
        if (type === 'all' || materialType.toLowerCase().includes(type.toLowerCase())) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}