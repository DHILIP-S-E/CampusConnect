/**
 * Configuration file for CampusConnect application
 * Contains API endpoints and other configuration settings
 */

const CONFIG = {
    // 🔐 Keys used for saving data to localStorage
    STORAGE_KEYS: {
        AUTH_TOKEN: 'campusconnect_auth_token',
        USER_ROLE: 'campusconnect_user_role',
        USER_DATA: 'campusconnect_user_data'
    },

    // 👥 User roles
    ROLES: {
        ADMIN: 'admin',
        FACULTY: 'faculty',
        STUDENT: 'student'
    },

    // ⚙️ Default settings
    DEFAULT_SETTINGS: {
        ITEMS_PER_PAGE: 10,
        SESSION_TIMEOUT: 3600000 // 1 hour
    }
};

// 🔒 Locking CONFIG to avoid unwanted modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.STORAGE_KEYS);
Object.freeze(CONFIG.ROLES);
Object.freeze(CONFIG.DEFAULT_SETTINGS);
