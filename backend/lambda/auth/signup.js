/**
 * Lambda function for user registration
 * Endpoint: /signup
 */

const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Initialize DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Salt rounds for bcrypt
const SALT_ROUNDS = 10;

/**
 * Handler function for user registration
 */
exports.handler = async (event) => {
    try {
        // Parse request body
        const requestBody = JSON.parse(event.body);
        const { fullName, email, username, password, role } = requestBody;
        
        // Validate input
        if (!fullName || !email || !username || !password || !role) {
            return formatResponse(400, {
                success: false,
                message: 'Full name, email, username, password, and role are required'
            });
        }
        
        // Validate role (only student and faculty roles are allowed for self-registration)
        if (role !== 'student' && role !== 'faculty') {
            return formatResponse(403, {
                success: false,
                message: 'Invalid role. Only student and faculty roles are allowed for registration'
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
        
        // Check if email already exists
        const existingEmail = await getUserByEmail(email);
        if (existingEmail) {
            return formatResponse(409, {
                success: false,
                message: 'Email already exists'
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        // Create user object
        const userId = uuidv4();
        const newUser = {
            id: userId,
            name: fullName,
            email,
            username,
            password: hashedPassword,
            role,
            createdAt: new Date().toISOString(),
            status: 'pending' // New users are pending until approved by admin
        };
        
        // Save user to DynamoDB
        await saveUser(newUser);
        
        // Return success response
        return formatResponse(201, {
            success: true,
            message: 'Registration successful. Your account is pending approval.',
            userId
        });
    } catch (error) {
        console.error('Error during registration:', error);
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
        console.error('Error querying user by username:', error);
        throw error;
    }
}

/**
 * Get user by email from DynamoDB
 */
async function getUserByEmail(email) {
    const params = {
        TableName: process.env.USERS_TABLE || 'CampusConnect_Users',
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email
        }
    };
    
    try {
        const result = await dynamoDB.query(params).promise();
        return result.Items[0];
    } catch (error) {
        console.error('Error querying user by email:', error);
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