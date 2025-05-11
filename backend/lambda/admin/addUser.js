/**
 * Lambda function for adding a new user
 * Endpoint: /addUser
 */

const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { verifyToken } = require('../utils/auth');

// Initialize DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Salt rounds for bcrypt
const SALT_ROUNDS = 10;

/**
 * Handler function for adding a new user
 */
exports.handler = async (event) => {
    try {
        // Verify JWT token
        const user = verifyToken(event);
        if (!user) {
            return formatResponse(401, {
                success: false,
                message: 'Unauthorized'
            });
        }
        
        // Check if user has admin role
        if (user.role !== 'admin') {
            return formatResponse(403, {
                success: false,
                message: 'Forbidden: Admin access required'
            });
        }
        
        // Parse request body
        const requestBody = JSON.parse(event.body);
        const { name, email, username, password, role } = requestBody;
        
        // Validate input
        if (!name || !email || !username || !password || !role) {
            return formatResponse(400, {
                success: false,
                message: 'Name, email, username, password, and role are required'
            });
        }
        
        // Check if username already exists
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return formatResponse(409, {
                success: false,
                message: 'Username already exists'
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        // Create user object
        const userId = uuidv4();
        const newUser = {
            id: userId,
            name,
            email,
            username,
            password: hashedPassword,
            role,
            createdAt: new Date().toISOString(),
            createdBy: user.sub
        };
        
        // Save user to DynamoDB
        await saveUser(newUser);
        
        // Return success response
        return formatResponse(201, {
            success: true,
            message: 'User created successfully',
            userId
        });
    } catch (error) {
        console.error('Error adding user:', error);
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
 * Save user to DynamoDB
 */
async function saveUser(user) {
    const params = {
        TableName: process.env.USERS_TABLE || 'CampusConnect_Users',
        Item: user
    };
    
    try {
        await dynamoDB.put(params).promise();
    } catch (error) {
        console.error('Error saving user:', error);
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