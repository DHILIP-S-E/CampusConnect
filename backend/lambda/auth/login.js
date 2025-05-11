/**
 * Lambda function for user authentication
 * Endpoint: /login
 */

const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Initialize DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// JWT secret key (in a real application, this would be stored in AWS Secrets Manager)
const JWT_SECRET = process.env.JWT_SECRET || 'campus-connect-jwt-secret';

// JWT expiration time (1 day)
const JWT_EXPIRATION = '1d';

/**
 * Handler function for login requests
 */
exports.handler = async (event) => {
    try {
        // Parse request body
        const requestBody = JSON.parse(event.body);
        const { username, password, role } = requestBody;
        
        // Validate input
        if (!username || !password || !role) {
            return formatResponse(400, {
                success: false,
                message: 'Username, password, and role are required'
            });
        }
        
        // Get user from DynamoDB
        const user = await getUserByUsername(username);
        
        // Check if user exists
        if (!user) {
            return formatResponse(401, {
                success: false,
                message: 'Invalid username or password'
            });
        }
        
        // Check if user role matches
        if (user.role !== role) {
            return formatResponse(403, {
                success: false,
                message: 'Invalid role for this user'
            });
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return formatResponse(401, {
                success: false,
                message: 'Invalid username or password'
            });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            {
                sub: user.id,
                username: user.username,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );
        
        // Return success response with token
        return formatResponse(200, {
            success: true,
            message: 'Login successful',
            token,
            userData: {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return formatResponse(500, {
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Get user by username from DynamoDB
 */
async function getUserByUsername(username) {
    const params = {
        TableName: process.env.USERS_TABLE || 'CampusConnect_Users',
        IndexName: 'UsernameIndex',
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': username
        }
    };
    
    try {
        const result = await dynamoDB.query(params).promise();
        return result.Items[0];
    } catch (error) {
        console.error('Error querying user:', error);
        throw error;
    }
}

/**
 * Format API Gateway response
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