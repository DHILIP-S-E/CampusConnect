/**
 * Events module for CampusConnect
 * Handles event creation, management, registration, and viewing
 * Shared functionality across admin, faculty, and student roles
 */

// Get all events with optional filters
async function getEvents(filters = {}) {
    try {
        // In a real application, this would be an actual API call
        const response = await simulateApiCall(CONFIG.ENDPOINTS.GET_EVENTS, filters);
        return response;
    } catch (error) {
        console.error('Error fetching events:', error);
        return { success: false, message: 'Failed to fetch events' };
    }
}

// Get event details by ID
async function getEventById(eventId) {
    try {
        const response = await simulateApiCall(CONFIG.ENDPOINTS.GET_EVENTS, { eventId });
        return response;
    } catch (error) {
        console.error('Error fetching event details:', error);
        return { success: false, message: 'Failed to fetch event details' };
    }
}

// Create a new event (admin and faculty only)
async function createEvent(eventData) {
    try {
        // Check if user has permission to create events
        const userRole = getUserRole();
        if (userRole !== CONFIG.ROLES.ADMIN && userRole !== CONFIG.ROLES.FACULTY) {
            return { success: false, message: 'You do not have permission to create events' };
        }
        
        const response = await simulateApiCall(CONFIG.ENDPOINTS.CREATE_EVENT, eventData);
        return response;
    } catch (error) {
        console.error('Error creating event:', error);
        return { success: false, message: 'Failed to create event' };
    }
}

// Update an existing event (admin and faculty only)
async function updateEvent(eventId, eventData) {
    try {
        // Check if user has permission to update events
        const userRole = getUserRole();
        if (userRole !== CONFIG.ROLES.ADMIN && userRole !== CONFIG.ROLES.FACULTY) {
            return { success: false, message: 'You do not have permission to update events' };
        }
        
        const response = await simulateApiCall(CONFIG.ENDPOINTS.UPDATE_EVENT, { eventId, ...eventData });
        return response;
    } catch (error) {
        console.error('Error updating event:', error);
        return { success: false, message: 'Failed to update event' };
    }
}

// Delete an event (admin only)
async function deleteEvent(eventId) {
    try {
        // Check if user has permission to delete events
        const userRole = getUserRole();
        if (userRole !== CONFIG.ROLES.ADMIN) {
            return { success: false, message: 'You do not have permission to delete events' };
        }
        
        const response = await simulateApiCall(CONFIG.ENDPOINTS.DELETE_EVENT, { eventId });
        return response;
    } catch (error) {
        console.error('Error deleting event:', error);
        return { success: false, message: 'Failed to delete event' };
    }
}

// Register for an event (student only)
async function registerForEvent(eventId) {
    try {
        // Check if user has permission to register for events
        const userRole = getUserRole();
        if (userRole !== CONFIG.ROLES.STUDENT) {
            return { success: false, message: 'Only students can register for events' };
        }
        
        const userId = getCurrentUser().id;
        const response = await simulateApiCall(CONFIG.ENDPOINTS.REGISTER_FOR_EVENT, { eventId, userId });
        return response;
    } catch (error) {
        console.error('Error registering for event:', error);
        return { success: false, message: 'Failed to register for event' };
    }
}

// Cancel registration for an event (student only)
async function cancelEventRegistration(eventId) {
    try {
        // Check if user has permission to cancel registration
        const userRole = getUserRole();
        if (userRole !== CONFIG.ROLES.STUDENT) {
            return { success: false, message: 'Only students can cancel event registrations' };
        }
        
        const userId = getCurrentUser().id;
        const response = await simulateApiCall(CONFIG.ENDPOINTS.REGISTER_FOR_EVENT, { 
            eventId, 
            userId,
            action: 'cancel'
        });
        return response;
    } catch (error) {
        console.error('Error canceling event registration:', error);
        return { success: false, message: 'Failed to cancel event registration' };
    }
}

// Get events registered by the current user (student only)
async function getRegisteredEvents() {
    try {
        // Check if user has permission to view registered events
        const userRole = getUserRole();
        if (userRole !== CONFIG.ROLES.STUDENT) {
            return { success: false, message: 'Only students can view registered events' };
        }
        
        const userId = getCurrentUser().id;
        const response = await simulateApiCall(CONFIG.ENDPOINTS.GET_REGISTERED_EVENTS, { userId });
        return response;
    } catch (error) {
        console.error('Error fetching registered events:', error);
        return { success: false, message: 'Failed to fetch registered events' };
    }
}

// Get attendees for an event (admin and faculty only)
async function getEventAttendees(eventId) {
    try {
        // Check if user has permission to view attendees
        const userRole = getUserRole();
        if (userRole !== CONFIG.ROLES.ADMIN && userRole !== CONFIG.ROLES.FACULTY) {
            return { success: false, message: 'You do not have permission to view event attendees' };
        }
        
        const response = await simulateApiCall(CONFIG.ENDPOINTS.GET_EVENT_ATTENDEES, { eventId });
        return response;
    } catch (error) {
        console.error('Error fetching event attendees:', error);
        return { success: false, message: 'Failed to fetch event attendees' };
    }
}

// Format event date for display
function formatEventDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Check if an event is upcoming
function isUpcomingEvent(eventDate) {
    const now = new Date();
    const event = new Date(eventDate);
    return event > now;
}

// Check if an event is ongoing
function isOngoingEvent(startDate, endDate) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
}

// Generate calendar view for events
function generateEventCalendar(events, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Group events by month and year
    const eventsByMonth = {};
    events.forEach(event => {
        const date = new Date(event.startDate);
        const monthYear = `${date.getMonth()}-${date.getFullYear()}`;
        if (!eventsByMonth[monthYear]) {
            eventsByMonth[monthYear] = [];
        }
        eventsByMonth[monthYear].push(event);
    });
    
    // Clear container
    container.innerHTML = '';
    
    // Create calendar for each month
    Object.keys(eventsByMonth).forEach(monthYear => {
        const [month, year] = monthYear.split('-');
        const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
        
        const monthContainer = document.createElement('div');
        monthContainer.className = 'calendar-month';
        monthContainer.innerHTML = `<h3>${monthName} ${year}</h3>`;
        
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'calendar-events';
        
        eventsByMonth[monthYear].forEach(event => {
            const eventDate = new Date(event.startDate);
            const eventElement = document.createElement('div');
            eventElement.className = 'calendar-event';
            eventElement.innerHTML = `
                <div class="event-date">${eventDate.getDate()}</div>
                <div class="event-details">
                    <h4>${event.title}</h4>
                    <p>${event.location}</p>
                    <p>${formatEventTime(event.startDate)}</p>
                </div>
            `;
            eventElement.addEventListener('click', () => showEventDetails(event.id));
            eventsContainer.appendChild(eventElement);
        });
        
        monthContainer.appendChild(eventsContainer);
        container.appendChild(monthContainer);
    });
}

// Format event time (helper function)
function formatEventTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Show event details in a modal
function showEventDetails(eventId) {
    // Implementation would depend on the UI framework/approach
    // For this example, we'll just log the event ID
    console.log('Showing details for event:', eventId);
    
    // In a real implementation, you would:
    // 1. Fetch the event details using getEventById
    // 2. Populate and show a modal with the event details
    // 3. Add action buttons based on user role (register, edit, delete, etc.)
}

// Simulate API call for events (for demo purposes)
// In a real application, this would be replaced with actual API calls
function simulateApiCall(endpoint, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Generate mock data based on the endpoint
            switch (endpoint) {
                case CONFIG.ENDPOINTS.GET_EVENTS:
                    resolve({
                        success: true,
                        events: generateMockEvents(10)
                    });
                    break;
                    
                case CONFIG.ENDPOINTS.CREATE_EVENT:
                case CONFIG.ENDPOINTS.UPDATE_EVENT:
                    resolve({
                        success: true,
                        event: {
                            id: 'event-' + Math.random().toString(36).substring(2),
                            ...data,
                            createdAt: new Date().toISOString()
                        },
                        message: 'Event saved successfully'
                    });
                    break;
                    
                case CONFIG.ENDPOINTS.DELETE_EVENT:
                    resolve({
                        success: true,
                        message: 'Event deleted successfully'
                    });
                    break;
                    
                case CONFIG.ENDPOINTS.REGISTER_FOR_EVENT:
                    if (data.action === 'cancel') {
                        resolve({
                            success: true,
                            message: 'Event registration canceled successfully'
                        });
                    } else {
                        resolve({
                            success: true,
                            message: 'Registered for event successfully'
                        });
                    }
                    break;
                    
                case CONFIG.ENDPOINTS.GET_REGISTERED_EVENTS:
                    resolve({
                        success: true,
                        events: generateMockEvents(5)
                    });
                    break;
                    
                case CONFIG.ENDPOINTS.GET_EVENT_ATTENDEES:
                    resolve({
                        success: true,
                        attendees: Array(15).fill().map((_, i) => ({
                            id: 'user-' + Math.random().toString(36).substring(2),
                            name: `Student ${i+1}`,
                            email: `student${i+1}@example.com`,
                            registeredAt: new Date().toISOString()
                        }))
                    });
                    break;
                    
                default:
                    resolve({
                        success: false,
                        message: 'Endpoint not implemented in demo'
                    });
            }
        }, 300); // Simulate network delay
    });
}

// Generate mock events for demo
function generateMockEvents(count) {
    const eventTypes = ['Workshop', 'Seminar', 'Conference', 'Cultural Event', 'Sports Event', 'Tech Fest', 'Hackathon'];
    const locations = ['Main Auditorium', 'Seminar Hall', 'Sports Complex', 'Library', 'Computer Lab', 'Outdoor Stage'];
    const departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration'];
    
    return Array(count).fill().map((_, i) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30)); // Random date in next 30 days
        
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + Math.floor(Math.random() * 8) + 1); // 1-8 hours duration
        
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const department = departments[Math.floor(Math.random() * departments.length)];
        
        return {
            id: 'event-' + Math.random().toString(36).substring(2),
            title: `${eventType}: ${department} ${i+1}`,
            description: `This is a ${eventType.toLowerCase()} organized by the ${department} department.`,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            location: locations[Math.floor(Math.random() * locations.length)],
            organizer: department,
            capacity: Math.floor(Math.random() * 100) + 50,
            registeredCount: Math.floor(Math.random() * 50),
            type: eventType.toLowerCase().replace(' ', '-'),
            isPublic: Math.random() > 0.3, // 70% chance of being public
            createdAt: new Date().toISOString()
        };
    });
}