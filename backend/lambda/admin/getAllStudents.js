/**
 * Lambda function for getting all students
 * Endpoint: /getAllStudents
 */

const AWS = require('aws-sdk');
const { verifyToken, hasRole, formatResponse } = require('../utils/auth');

// Initialize DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * Handler function for getting all students
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
        
        // Check if user has admin or faculty role
        if (!hasRole(user, ['admin', 'faculty'])) {
            return formatResponse(403, {
                success: false,
                message: 'Forbidden: Admin or Faculty access required'
            });
        }
        
        // Get query parameters
        const queryParams = event.queryStringParameters || {};
        const { yearFilter, departmentFilter } = queryParams;
        
        // Get all students from DynamoDB
        const students = await getStudents(yearFilter, departmentFilter);
        
        // Return success response
        return formatResponse(200, {
            success: true,
            students
        });
    } catch (error) {
        console.error('Error getting students:', error);
        return formatResponse(500, {
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Get students from DynamoDB with optional filters
 */
async function getStudents(yearFilter, departmentFilter) {
    // Base params
    const params = {
        TableName: process.env.USERS_TABLE || 'CampusConnect_Users',
        FilterExpression: 'role = :role',
        ExpressionAttributeValues: {
            ':role': 'student'
        }
    };
    
    // Add year filter if provided
    if (yearFilter && yearFilter !== 'all') {
        params.FilterExpression += ' AND #year = :year';
        params.ExpressionAttributeValues[':year'] = yearFilter;
        
        // Add ExpressionAttributeNames if not already added
        if (!params.ExpressionAttributeNames) {
            params.ExpressionAttributeNames = {};
        }
        params.ExpressionAttributeNames['#year'] = 'year';
    }
    
    // Add department filter if provided
    if (departmentFilter && departmentFilter !== 'all') {
        params.FilterExpression += ' AND department = :department';
        params.ExpressionAttributeValues[':department'] = departmentFilter;
    }
    
    try {
        const result = await dynamoDB.scan(params).promise();
        
        // Map to return only necessary fields
        return result.Items.map(student => ({
            id: student.id,
            name: student.name,
            email: student.email,
            department: student.department,
            year: student.year,
            enrollmentDate: student.enrollmentDate
        }));
    } catch (error) {
        console.error('Error scanning students:', error);
        throw error;
    }
}