/**
 * Lost and Found functionality for CampusConnect
 * Handles reporting and viewing lost and found items
 */

// Report lost item
function reportLostItem() {
    const itemName = document.getElementById('lost-item-name').value;
    const description = document.getElementById('lost-item-description').value;
    const dateLost = document.getElementById('lost-item-date').value;
    const location = document.getElementById('lost-item-location').value;
    const contact = document.getElementById('lost-item-contact').value;
    const messageElement = document.getElementById('lost-item-message');
    
    if (!itemName || !description || !dateLost || !location || !contact) {
        messageElement.textContent = 'Please fill in all fields';
        messageElement.className = 'message error-message';
        return;
    }
    
    try {
        const currentUser = getCurrentUser(); // Assumes this returns { username: '...', ... }
        if (!currentUser || !currentUser.username) {
            messageElement.textContent = 'Could not identify current user. Please log in.';
            messageElement.className = 'message error-message';
            return;
        }

        const lostItems = JSON.parse(localStorage.getItem('campus_lost_items')) || [];
        const newLostItem = {
            id: `lost_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            itemName,
            description,
            dateLost,
            locationLost: location,
            contactInfo: contact,
            reportedByUsername: currentUser.username,
            reportedByName: currentUser.fullName || currentUser.username,
            reportedAt: new Date().toISOString(),
            status: 'Reported' // Initial status
        };

        lostItems.push(newLostItem);
        localStorage.setItem('campus_lost_items', JSON.stringify(lostItems));
        
        messageElement.textContent = 'Lost item reported successfully and stored locally.';
        messageElement.className = 'message success-message';
        document.getElementById('report-lost-item-form').reset();
        if (typeof loadMyLostItems === 'function') loadMyLostItems();
        if (typeof loadAllLostItems === 'function') loadAllLostItems(); // If there's a general view

    } catch (error) {
        console.error('Error reporting lost item to localStorage:', error);
        messageElement.textContent = 'An error occurred while reporting the lost item';
        messageElement.className = 'message error-message';
    }
}

// Load my reported lost items
function loadMyLostItems() {
    const lostItemsContainer = document.getElementById('my-lost-items-list');
    if (!lostItemsContainer) return;
    lostItemsContainer.innerHTML = '<p>Loading your lost items...</p>';
    
    try {
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.username) {
            lostItemsContainer.innerHTML = '<p class="error-message">Please log in to see your reported items.</p>';
            return;
        }
        
        const allLostItems = JSON.parse(localStorage.getItem('campus_lost_items')) || [];
        const myItems = allLostItems.filter(item => item.reportedByUsername === currentUser.username);
        
        // Sort by reportedAt date, newest first
        myItems.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));

        lostItemsContainer.innerHTML = '';
        if (myItems.length === 0) {
            lostItemsContainer.innerHTML = '<p>You have not reported any lost items yet.</p>';
            return;
        }
        myItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'material-card'; // Reusing class for styling
            itemElement.innerHTML = `
                <h4>${item.itemName}</h4>
                <p>${item.description}</p>
                <p><strong>Date Lost:</strong> ${new Date(item.dateLost).toLocaleDateString()}</p>
                <p><strong>Location:</strong> ${item.locationLost}</p>
                <p><strong>Contact:</strong> ${item.contactInfo}</p>
                <p><strong>Status:</strong> <span class="status-${item.status.toLowerCase()}">${item.status}</span></p>
                <p class="material-meta">Reported on ${new Date(item.reportedAt).toLocaleDateString()}</p>
                ${item.status !== 'Found' && item.status !== 'Claimed' ? `<button class="btn btn-danger btn-sm delete-lost-item" data-id="${item.id}">Delete Report</button> <button class="btn btn-success btn-sm mark-as-found-btn" data-id="${item.id}">Mark as Found</button>` : ''}
            `;
            lostItemsContainer.appendChild(itemElement);
        });
        
        document.querySelectorAll('.delete-lost-item').forEach(button => {
            button.addEventListener('click', function() { deleteLostItem(this.getAttribute('data-id')); });
        });
        document.querySelectorAll('.mark-as-found-btn').forEach(button => {
            button.addEventListener('click', function() { markItemStatus(this.getAttribute('data-id'), 'Found', 'lost'); });
        });

    } catch (error) {
        console.error('Error loading lost items from localStorage:', error);
        lostItemsContainer.innerHTML = '<p class="error-message">An error occurred while loading your lost items</p>';
    }
}

// Delete lost item report
function deleteLostItem(itemId) {
    if (confirm('Are you sure you want to delete this lost item report?')) {
        try {
            let allLostItems = JSON.parse(localStorage.getItem('campus_lost_items')) || [];
            const initialLength = allLostItems.length;
            allLostItems = allLostItems.filter(item => item.id !== itemId);
            
            if (allLostItems.length < initialLength) {
                localStorage.setItem('campus_lost_items', JSON.stringify(allLostItems));
                alert('Lost item report deleted successfully.');
                if (typeof loadMyLostItems === 'function') loadMyLostItems();
                if (typeof loadAllLostItems === 'function') loadAllLostItems();
            } else {
                alert('Lost item report not found or already deleted.');
            }
        } catch (error) {
            console.error('Error deleting lost item from localStorage:', error);
            alert('An error occurred while deleting the lost item report');
        }
    }
}

// Report found item
function reportFoundItem() {
    const itemName = document.getElementById('found-item-name').value;
    const description = document.getElementById('found-item-description').value;
    const dateFound = document.getElementById('found-item-date').value;
    const location = document.getElementById('found-item-location').value;
    const contact = document.getElementById('found-item-contact').value; // Contact for person who found it
    const messageElement = document.getElementById('found-item-message');
    
    if (!itemName || !description || !dateFound || !location || !contact) {
        messageElement.textContent = 'Please fill in all fields';
        messageElement.className = 'message error-message';
        return;
    }
    
    try {
        const currentUser = getCurrentUser(); // User reporting it
        const foundItems = JSON.parse(localStorage.getItem('campus_found_items')) || [];
        const newFoundItem = {
            id: `found_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            itemName,
            description,
            dateFound,
            locationFound: location,
            finderContactInfo: contact,
            reportedByUsername: currentUser?.username || 'anonymous',
            reportedByName: currentUser?.fullName || currentUser?.username || 'Anonymous',
            reportedAt: new Date().toISOString(),
            status: 'Available' // Initial status
        };

        foundItems.push(newFoundItem);
        localStorage.setItem('campus_found_items', JSON.stringify(foundItems));
        
        messageElement.textContent = 'Found item reported successfully and stored locally.';
        messageElement.className = 'message success-message';
        document.getElementById('report-found-item-form').reset();
        if (typeof loadFoundItems === 'function') loadFoundItems(); // This is the general view
    } catch (error) {
        console.error('Error reporting found item to localStorage:', error);
        messageElement.textContent = 'An error occurred while reporting the found item';
        messageElement.className = 'message error-message';
    }
}

// Load found items (for anyone to view)
function loadFoundItems() {
    const foundItemsContainer = document.getElementById('found-items-list');
    if (!foundItemsContainer) return;
    foundItemsContainer.innerHTML = '<p>Loading found items...</p>';
    
    try {
        const allFoundItems = JSON.parse(localStorage.getItem('campus_found_items')) || [];
        
        // Sort by reportedAt date, newest first
        allFoundItems.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));

        foundItemsContainer.innerHTML = '';
        if (allFoundItems.length === 0) {
            foundItemsContainer.innerHTML = '<p>No found items have been reported yet.</p>';
            return;
        }
        allFoundItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'material-card';
            itemElement.innerHTML = `
                <h4>${item.itemName}</h4>
                <p>${item.description}</p>
                <p><strong>Date Found:</strong> ${new Date(item.dateFound).toLocaleDateString()}</p>
                <p><strong>Location:</strong> ${item.locationFound}</p>
                <p><strong>Contact for Claim:</strong> ${item.finderContactInfo}</p>
                <p><strong>Reported by:</strong> ${item.reportedByName}</p>
                <p><strong>Status:</strong> <span class="status-${item.status.toLowerCase()}">${item.status}</span></p>
                <p class="material-meta">Reported on ${new Date(item.reportedAt).toLocaleDateString()}</p>
                ${item.status === 'Available' ? `<button class="btn btn-sm btn-primary claim-item-btn" data-id="${item.id}">Claim Item</button>` : ''}
            `;
            foundItemsContainer.appendChild(itemElement);
        });

        document.querySelectorAll('.claim-item-btn').forEach(button => {
            button.addEventListener('click', function() { markItemStatus(this.getAttribute('data-id'), 'Claimed', 'found'); });
        });
    } catch (error) {
        console.error('Error loading found items from localStorage:', error);
        foundItemsContainer.innerHTML = '<p class="error-message">An error occurred while loading found items</p>';
    }
}

// Generic function to update item status (e.g., "Found", "Claimed")
function markItemStatus(itemId, newStatus, itemType) { // itemType can be 'lost' or 'found'
    const storageKey = itemType === 'lost' ? 'campus_lost_items' : 'campus_found_items';
    let items = JSON.parse(localStorage.getItem(storageKey)) || [];
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex > -1) {
        items[itemIndex].status = newStatus;
        if (newStatus === 'Claimed') {
            items[itemIndex].claimedAt = new Date().toISOString();
            const currentUser = getCurrentUser();
            items[itemIndex].claimedBy = currentUser?.username || 'unknown_claimer';
        }
        localStorage.setItem(storageKey, JSON.stringify(items));
        alert(`Item marked as ${newStatus}.`);
        
        // Refresh relevant lists
        if (itemType === 'lost' && typeof loadMyLostItems === 'function') loadMyLostItems();
        if (itemType === 'lost' && typeof loadAllLostItems === 'function') loadAllLostItems(); // If a general lost items view exists
        if (itemType === 'found' && typeof loadFoundItems === 'function') loadFoundItems();
    } else {
        alert('Item not found.');
    }
}
