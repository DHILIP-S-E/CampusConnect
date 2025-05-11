// Admin Settings functionality

// Initialize settings tabs and functionality
function initializeSettings() {
    setupSettingsTabs();
}

// Setup settings tabs
function setupSettingsTabs() {
    // Get all tab buttons and content
    const tabButtons = document.querySelectorAll('.settings-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.settings-tab-content');
    
    // Show the first tab by default
    if (tabContents.length > 0) {
        tabContents[0].style.display = 'block';
    }
    
    // Add click event to each tab button
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab content
            tabContents.forEach(content => content.style.display = 'none');
            
            // Show the selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).style.display = 'block';
        });
    });
    
    // Setup form submissions for each settings form
    setupSettingsFormSubmissions();
}

// Setup form submissions for settings
function setupSettingsFormSubmissions() {
    // General Settings Form
    const generalSettingsForm = document.getElementById('general-settings-form');
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const messageElement = document.getElementById('general-settings-message');
            
            // Get form values
            const systemName = document.getElementById('system-name').value;
            const institutionName = document.getElementById('institution-name').value;
            const adminEmail = document.getElementById('admin-email').value;
            
            // Validate form
            if (!systemName || !institutionName || !adminEmail) {
                messageElement.textContent = 'Please fill in all required fields';
                messageElement.className = 'message error-message';
                return;
            }
            
            // Show success message with specific details
            messageElement.textContent = `General settings saved successfully! System name updated to "${systemName}" for ${institutionName}.`;
            messageElement.className = 'message success-message';
            
            // Apply some visual changes to show settings were applied
            document.querySelector('.nav-logo').textContent = systemName;
            
            setTimeout(() => { 
                messageElement.textContent = ''; 
            }, 3000);
        });
    }
    
    // Security Settings Form
    const securitySettingsForm = document.getElementById('security-settings-form');
    if (securitySettingsForm) {
        securitySettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const messageElement = document.getElementById('security-settings-message');
            
            // Get form values
            const passwordPolicy = document.getElementById('password-policy').value;
            const sessionTimeout = document.getElementById('session-timeout').value;
            const loginAttempts = document.getElementById('login-attempts').value;
            const enable2FA = document.getElementById('enable-2fa').checked;
            
            // Validate form
            if (!passwordPolicy || !sessionTimeout || !loginAttempts) {
                messageElement.textContent = 'Please fill in all required fields';
                messageElement.className = 'message error-message';
                return;
            }
            
            // Show success message with specific details
            let securityDetails = `Password policy set to "${passwordPolicy}", session timeout set to ${sessionTimeout} minutes, max login attempts set to ${loginAttempts}.`;
            if (enable2FA) {
                securityDetails += ' Two-factor authentication enabled for admins.';
            } else {
                securityDetails += ' Two-factor authentication disabled.';
            }
            
            messageElement.textContent = 'Security settings saved successfully! ' + securityDetails;
            messageElement.className = 'message success-message';
            
            setTimeout(() => { 
                messageElement.textContent = ''; 
            }, 5000);
        });
    }
    
    // Notification Settings Form
    const notificationSettingsForm = document.getElementById('notification-settings-form');
    if (notificationSettingsForm) {
        notificationSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const messageElement = document.getElementById('notification-settings-message');
            
            // Get form values
            const emailNewUser = document.getElementById('email-new-user').checked;
            const emailCourseAdded = document.getElementById('email-course-added').checked;
            const notifyLoginAttempts = document.getElementById('notify-login-attempts').checked;
            const notificationFrequency = document.getElementById('notification-frequency').value;
            
            // Show success message with specific details
            let notificationDetails = `Notification frequency set to "${notificationFrequency}".`;
            let enabledNotifications = [];
            
            if (emailNewUser) enabledNotifications.push('New User Registration');
            if (emailCourseAdded) enabledNotifications.push('New Course Added');
            if (notifyLoginAttempts) enabledNotifications.push('Failed Login Attempts');
            
            if (enabledNotifications.length > 0) {
                notificationDetails += ` Enabled notifications: ${enabledNotifications.join(', ')}.`;
            } else {
                notificationDetails += ' All email notifications are disabled.';
            }
            
            messageElement.textContent = 'Notification settings saved successfully! ' + notificationDetails;
            messageElement.className = 'message success-message';
            
            setTimeout(() => { 
                messageElement.textContent = ''; 
            }, 4000);
        });
    }
    
    // Appearance Settings Form
    const appearanceSettingsForm = document.getElementById('appearance-settings-form');
    if (appearanceSettingsForm) {
        appearanceSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const messageElement = document.getElementById('appearance-settings-message');
            
            // Get form values
            const themeColor = document.getElementById('theme-color').value;
            const fontSize = document.getElementById('font-size').value;
            
            // Apply theme changes to demonstrate functionality
            const container = document.querySelector('.container');
            
            // Reset previous styles
            container.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-red', 'theme-orange');
            container.classList.remove('font-small', 'font-medium', 'font-large');
            
            // Apply new styles
            container.classList.add('theme-' + themeColor);
            container.classList.add('font-' + fontSize);
            
            // Add temporary styles to show theme change
            document.querySelector('header').style.backgroundColor = getThemeColor(themeColor);
            document.querySelectorAll('.btn-primary').forEach(btn => {
                btn.style.backgroundColor = getThemeColor(themeColor);
            });
            
            // Set font size
            document.body.style.fontSize = getFontSize(fontSize);
            
            messageElement.textContent = `Appearance settings saved successfully! Theme color set to "${themeColor}" and font size set to "${fontSize}".`;
            messageElement.className = 'message success-message';
            
            setTimeout(() => { 
                messageElement.textContent = ''; 
            }, 3000);
        });
    }
    
    // Integration Settings Form
    const integrationSettingsForm = document.getElementById('integration-settings-form');
    if (integrationSettingsForm) {
        integrationSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const messageElement = document.getElementById('integration-settings-message');
            
            // Get form values
            const googleCalendar = document.getElementById('google-calendar').checked;
            const googleDrive = document.getElementById('google-drive').checked;
            const msTeams = document.getElementById('ms-teams').checked;
            const msOffice = document.getElementById('ms-office').checked;
            const paypal = document.getElementById('paypal').checked;
            const stripe = document.getElementById('stripe').checked;
            
            // Show success message with specific details
            let integrationDetails = 'Enabled integrations: ';
            let enabledIntegrations = [];
            
            if (googleCalendar) enabledIntegrations.push('Google Calendar');
            if (googleDrive) enabledIntegrations.push('Google Drive');
            if (msTeams) enabledIntegrations.push('Microsoft Teams');
            if (msOffice) enabledIntegrations.push('Microsoft Office');
            if (paypal) enabledIntegrations.push('PayPal');
            if (stripe) enabledIntegrations.push('Stripe');
            
            if (enabledIntegrations.length > 0) {
                integrationDetails += enabledIntegrations.join(', ') + '.';
            } else {
                integrationDetails = 'All integrations are currently disabled.';
            }
            
            messageElement.textContent = 'Integration settings saved successfully! ' + integrationDetails;
            messageElement.className = 'message success-message';
            
            setTimeout(() => { 
                messageElement.textContent = ''; 
            }, 4000);
        });
    }
    
    // Reset buttons
    setupResetButtons();
    
    // Generate API Key button
    const generateApiKey = document.getElementById('generate-api-key');
    if (generateApiKey) {
        generateApiKey.addEventListener('click', function() {
            if (confirm('Generate a new API key? This will invalidate the current key.')) {
                const newApiKey = 'sk_test_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                document.getElementById('api-key').value = newApiKey;
                
                const messageElement = document.getElementById('integration-settings-message');
                messageElement.textContent = 'New API key generated successfully!';
                messageElement.className = 'message success-message';
                setTimeout(() => { messageElement.textContent = ''; }, 3000);
            }
        });
    }
}

// Setup reset buttons for all settings forms
function setupResetButtons() {
    const resetGeneralSettings = document.getElementById('reset-general-settings');
    if (resetGeneralSettings) {
        resetGeneralSettings.addEventListener('click', function() {
            if (confirm('Reset general settings to default values?')) {
                document.getElementById('general-settings-form').reset();
                document.getElementById('system-name').value = 'CampusConnect';
                document.getElementById('institution-name').value = 'University';
                document.getElementById('admin-email').value = 'admin@example.com';
                document.getElementById('timezone').value = 'EST';
                document.getElementById('date-format').value = 'MM/DD/YYYY';
                document.getElementById('academic-year').value = '2023-2024';
                
                const messageElement = document.getElementById('general-settings-message');
                messageElement.textContent = 'General settings reset to default values.';
                messageElement.className = 'message info-message';
                setTimeout(() => { messageElement.textContent = ''; }, 3000);
            }
        });
    }
    
    const resetSecuritySettings = document.getElementById('reset-security-settings');
    if (resetSecuritySettings) {
        resetSecuritySettings.addEventListener('click', function() {
            if (confirm('Reset security settings to default values?')) {
                document.getElementById('security-settings-form').reset();
                document.getElementById('password-policy').value = 'medium';
                document.getElementById('session-timeout').value = '30';
                document.getElementById('login-attempts').value = '5';
                document.getElementById('enable-2fa').checked = true;
                document.getElementById('enable-encryption').checked = true;
                
                const messageElement = document.getElementById('security-settings-message');
                messageElement.textContent = 'Security settings reset to default values.';
                messageElement.className = 'message info-message';
                setTimeout(() => { messageElement.textContent = ''; }, 3000);
            }
        });
    }
    
    const resetNotificationSettings = document.getElementById('reset-notification-settings');
    if (resetNotificationSettings) {
        resetNotificationSettings.addEventListener('click', function() {
            if (confirm('Reset notification settings to default values?')) {
                document.getElementById('notification-settings-form').reset();
                document.getElementById('email-new-user').checked = true;
                document.getElementById('email-course-added').checked = true;
                document.getElementById('email-system-updates').checked = true;
                document.getElementById('notify-login-attempts').checked = true;
                document.getElementById('notify-data-backup').checked = true;
                document.getElementById('notification-frequency').value = 'daily';
                
                const messageElement = document.getElementById('notification-settings-message');
                messageElement.textContent = 'Notification settings reset to default values.';
                messageElement.className = 'message info-message';
                setTimeout(() => { messageElement.textContent = ''; }, 3000);
            }
        });
    }
    
    const resetAppearanceSettings = document.getElementById('reset-appearance-settings');
    if (resetAppearanceSettings) {
        resetAppearanceSettings.addEventListener('click', function() {
            if (confirm('Reset appearance settings to default values?')) {
                document.getElementById('appearance-settings-form').reset();
                document.getElementById('theme-color').value = 'blue';
                document.getElementById('font-size').value = 'medium';
                document.getElementById('show-welcome').checked = true;
                document.getElementById('show-stats').checked = true;
                document.getElementById('show-recent').checked = true;
                
                // Reset appearance
                const container = document.querySelector('.container');
                container.classList.remove('theme-green', 'theme-purple', 'theme-red', 'theme-orange');
                container.classList.remove('font-small', 'font-large');
                container.classList.add('theme-blue');
                container.classList.add('font-medium');
                
                document.querySelector('header').style.backgroundColor = getThemeColor('blue');
                document.querySelectorAll('.btn-primary').forEach(btn => {
                    btn.style.backgroundColor = getThemeColor('blue');
                });
                document.body.style.fontSize = getFontSize('medium');
                
                const messageElement = document.getElementById('appearance-settings-message');
                messageElement.textContent = 'Appearance settings reset to default values.';
                messageElement.className = 'message info-message';
                setTimeout(() => { messageElement.textContent = ''; }, 3000);
            }
        });
    }
    
    const resetIntegrationSettings = document.getElementById('reset-integration-settings');
    if (resetIntegrationSettings) {
        resetIntegrationSettings.addEventListener('click', function() {
            if (confirm('Reset integration settings to default values?')) {
                document.getElementById('integration-settings-form').reset();
                document.getElementById('google-calendar').checked = true;
                document.getElementById('google-drive').checked = false;
                document.getElementById('ms-teams').checked = false;
                document.getElementById('ms-office').checked = false;
                document.getElementById('paypal').checked = true;
                document.getElementById('stripe').checked = false;
                document.getElementById('api-key').value = 'sk_test_51HG7...';
                
                const messageElement = document.getElementById('integration-settings-message');
                messageElement.textContent = 'Integration settings reset to default values.';
                messageElement.className = 'message info-message';
                setTimeout(() => { messageElement.textContent = ''; }, 3000);
            }
        });
    }
}

// Helper function to get theme color
function getThemeColor(theme) {
    switch(theme) {
        case 'blue': return '#0056b3';
        case 'green': return '#28a745';
        case 'purple': return '#6f42c1';
        case 'red': return '#dc3545';
        case 'orange': return '#fd7e14';
        default: return '#0056b3';
    }
}

// Helper function to get font size
function getFontSize(size) {
    switch(size) {
        case 'small': return '0.9rem';
        case 'medium': return '1rem';
        case 'large': return '1.1rem';
        default: return '1rem';
    }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the admin page
    if (document.querySelector('.role-admin')) {
        initializeSettings();
    }
});