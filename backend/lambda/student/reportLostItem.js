/**
 * Lambda function for reporting lost items
 * Endpoint: /reportLostItem
 */

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { verifyToken, formatResponse } = require('../utils/auth');

// Initialize DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * Handler function for reporting lost items
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
        
        // Parse request body
        const requestBody = JSON.parse(event.body);
        const { itemName, description, dateLost, location, contact } = requestBody;
        
        // Validate required fields
        if (!itemName || !description || !dateLost || !location || !contact) {
            return formatResponse(400, {
                success: false,
                message: 'Item name, description, date lost, location, and contact are required'
            });
        }
        
        // Create lost item object
        const itemId = uuidv4();
        const lostItem = {
            id: itemId,
            itemName,
            description,
            dateLost,
            location,
            contact,
            reportedBy: user.sub,
            reportDate: new Date().toISOString(),
            status: 'Lost',
            type: 'lost'
        };
        
        // Save lost item to DynamoDB
        await saveLostItem(lostItem);
        
        // Return success response
        return formatResponse(201, {
            success: true,
            message: 'Lost item reported successfully',
            itemId
        });
    } catch (error) {
        console.error('Error reporting lost item:', error);
        return formatResponse(500, {
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Save lost item to DynamoDB
 */
async function saveLostItem(lostItem) {
    const params = {
        TableName: process.env.LOST_FOUND_TABLE || 'CampusConnect_LostFound',
        Item: lostItem
    };
    
    try {
        await dynamoDB.put(params).promise();
    } catch (error) {
        console.error('Error saving lost item:', error);
        throw error;
    }
}