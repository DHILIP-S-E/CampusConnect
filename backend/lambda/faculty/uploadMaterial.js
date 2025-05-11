/**
 * Lambda function for uploading study materials
 * Endpoint: /uploadMaterial
 */

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { verifyToken, hasRole, formatResponse } = require('../utils/auth');

// Initialize DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Initialize S3 client (for file uploads)
const s3 = new AWS.S3();

/**
 * Handler function for uploading study materials
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
        
        // Check if user has faculty role
        if (!hasRole(user, 'faculty')) {
            return formatResponse(403, {
                success: false,
                message: 'Forbidden: Faculty access required'
            });
        }
        
        // Parse request body
        const requestBody = JSON.parse(event.body);
        const { title, description, type, subject, target } = requestBody;
        
        // Validate required fields
        if (!title || !description || !type || !subject || !target) {
            return formatResponse(400, {
                success: false,
                message: 'Title, description, type, subject, and target are required'
            });
        }
        
        // Validate type-specific fields
        if (type === 'pdf' && !requestBody.fileData) {
            return formatResponse(400, {
                success: false,
                message: 'File data is required for PDF materials'
            });
        } else if (type === 'link' && !requestBody.link) {
            return formatResponse(400, {
                success: false,
                message: 'Link is required for link materials'
            });
        } else if (type === 'text' && !requestBody.content) {
            return formatResponse(400, {
                success: false,
                message: 'Content is required for text materials'
            });
        }
        
        // Create material object
        const materialId = uuidv4();
        const material = {
            id: materialId,
            title,
            description,
            type,
            subject,
            target,
            uploadedBy: user.sub,
            uploadDate: new Date().toISOString()
        };
        
        // Add type-specific fields
        if (type === 'pdf') {
            // In a real application, we would upload the file to S3
            // For this demo, we'll just store the file metadata
            material.fileData = requestBody.fileData;
            material.s3Key = `materials/${materialId}/${requestBody.fileData.name}`;
        } else if (type === 'link') {
            material.link = requestBody.link;
        } else if (type === 'text') {
            material.content = requestBody.content;
        }
        
        // Save material to DynamoDB
        await saveMaterial(material);
        
        // Return success response
        return formatResponse(201, {
            success: true,
            message: 'Material uploaded successfully',
            materialId
        });
    } catch (error) {
        console.error('Error uploading material:', error);
        return formatResponse(500, {
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Save material to DynamoDB
 */
async function saveMaterial(material) {
    const params = {
        TableName: process.env.MATERIALS_TABLE || 'CampusConnect_Materials',
        Item: material
    };
    
    try {
        await dynamoDB.put(params).promise();
    } catch (error) {
        console.error('Error saving material:', error);
        throw error;
    }
}