/**
 * Lambda function for submitting feedback
 * Endpoint: /submitFeedback
 */

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { verifyToken, hasRole, formatResponse } = require('../utils/auth');

// Initialize DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * Handler function for submitting feedback
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
        
        // Check if user has student role
        if (!hasRole(user, 'student')) {
            return formatResponse(403, {
                success: false,
                message: 'Forbidden: Student access required'
            });
        }
        
        // Parse request body
        const requestBody = JSON.parse(event.body);
        const { subject, facultyId, rating, comments } = requestBody;
        
        // Validate required fields
        if (!subject || !facultyId || !rating || !comments) {
            return formatResponse(400, {
                success: false,
                message: 'Subject, facultyId, rating, and comments are required'
            });
        }
        
        // Validate rating
        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return formatResponse(400, {
                success: false,
                message: 'Rating must be a number between 1 and 5'
            });
        }
        
        // Create feedback object
        const feedbackId = uuidv4();
        const feedback = {
            id: feedbackId,
            subject,
            facultyId,
            rating: ratingNum,
            comments,
            studentId: user.sub,
            submissionDate: new Date().toISOString(),
            isAnonymous: requestBody.isAnonymous || false
        };
        
        // Save feedback to DynamoDB
        await saveFeedback(feedback);
        
        // Return success response
        return formatResponse(201, {
            success: true,
            message: 'Feedback submitted successfully',
            feedbackId
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return formatResponse(500, {
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Save feedback to DynamoDB
 */
async function saveFeedback(feedback) {
    const params = {
        TableName: process.env.FEEDBACK_TABLE || 'CampusConnect_Feedback',
        Item: feedback
    };
    
    try {
        await dynamoDB.put(params).promise();
    } catch (error) {
        console.error('Error saving feedback:', error);
        throw error;
    }
}