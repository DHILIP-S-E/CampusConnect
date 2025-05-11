/**
 * Authentication utilities for Lambda functions
 */

const jwt = require('jsonwebtoken');

// JWT secret key (in a real application, this would be stored in AWS Secrets Manager)
const JWT_SECRET = process.env.JWT_SECRET || 'campus-connect-jwt-secret';

/**
 * Verify JWT token from Authorization header
 * @param {Object} event - API Gateway event
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
function verifyToken(event) {
    try {
        // Get Authorization header
        const authHeader = event.headers.Authorization || event.headers.authorization;
        if (!authHeader) {
            return null;
        }
        
        // Extract token from Bearer scheme
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            return null;
        }
        
        // Verify and decode token
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
}

/**
 * Check if user has required role
 * @param {Object} user - Decoded user from token
 * @param {string|Array} requiredRole - Required role(s)
 * @returns {boolean} - True if user has required role
 */
function hasRole(user, requiredRole) {
    if (!user || !user.role) {
        return false;
    }
    
    if (Array.isArray(requiredRole)) {
        return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
}

/**
 * Format API Gateway response
 * @param {number} statusCode - HTTP status code
 * @param {Object} body - Response body
 * @returns {Object} - Formatted response
 */
function formatResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(body)
    };
}

module.exports = {
    verifyToken,
    hasRole,
    formatResponse
};