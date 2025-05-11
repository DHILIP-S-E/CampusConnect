/**
 * Lambda function for reporting found items
 * Endpoint: /reportFoundItem
 */

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { verifyToken, formatResponse } = require('../utils/auth');

// Initialize DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * Handler function for reporting found items
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
        const { itemName, description, dateFound, location, contact } = requestBody;
        
        // Validate required fields
        if (!itemName || !description || !dateFound || !location || !contact) {
            return formatResponse(400, {
                success: false,
                message: 'Item name, description, date found, location, and contact are required'
            });
        }
        
        // Create found item object
        const itemId = uuidv4();
        const foundItem = {
            id: itemId,
            itemName,
            description,
            dateFound,
            location,
            contact,
            reportedBy: user.sub,
            reportDate: new Date().toISOString(),
            status: 'Available',
            type: 'found'
        };
        
        // Save found item to DynamoDB
        await saveFoundItem(foundItem);
        
        // Check if there are any matching lost items
        await checkForMatches(foundItem);
        
        // Return success response
        return formatResponse(201, {
            success: true,
            message: 'Found item reported successfully',
            itemId
        });
    } catch (error) {
        console.error('Error reporting found item:', error);
        return formatResponse(500, {
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Save found item to DynamoDB
 */
async function saveFoundItem(foundItem) {
    const params = {
        TableName: process.env.LOST_FOUND_TABLE || 'CampusConnect_LostFound',
        Item: foundItem
    };
    
    try {
        await dynamoDB.put(params).promise();
    } catch (error) {
        console.error('Error saving found item:', error);
        throw error;
    }
}

/**
 * Check for potential matches with lost items
 * In a real application, this would send notifications to users who reported matching lost items
 */
async function checkForMatches(foundItem) {
    const params = {
        TableName: process.env.LOST_FOUND_TABLE || 'CampusConnect_LostFound',
        FilterExpression: 'type = :type AND status = :status',
        ExpressionAttributeValues: {
            ':type': 'lost',
            ':status': 'Lost'
        }
    };
    
    try {
        const result = await dynamoDB.scan(params).promise();
        
        // Simple matching algorithm based on item name (case-insensitive)
        const potentialMatches = result.Items.filter(lostItem => 
            lostItem.itemName.toLowerCase().includes(foundItem.itemName.toLowerCase()) ||
            foundItem.itemName.toLowerCase().includes(lostItem.itemName.toLowerCase())
        );
        
        // In a real application, we would send notifications to users who reported these lost items
        console.log(`Found ${potentialMatches.length} potential matches for item ${foundItem.id}`);
        
        // For demo purposes, we'll just log the matches
        potentialMatches.forEach(match => {
            console.log(`Potential match: Lost item ${match.id} (${match.itemName}) matches found item ${foundItem.id} (${foundItem.itemName})`);
        });
    } catch (error) {
        console.error('Error checking for matches:', error);
        // Don't throw the error, as this is a secondary operation
    }
}