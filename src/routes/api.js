// src/routes/api.js - API routes for counter operations
// This file handles all API endpoints for the counter functionality
// Routes: GET /count, POST /increment, POST /reset

const express = require('express');
const Counter = require('../models/Counter');

const router = express.Router();

// GET /api/count - Get the current counter value
// This endpoint retrieves the current global counter value
router.get('/count', async (req, res) => {
    try {
        // Get or create the global counter
        const counter = await Counter.getGlobalCounter();
        
        // Return the counter data
        res.json({
            success: true,
            count: counter.count,
            lastUpdated: counter.lastUpdated,
            totalIncrements: counter.totalIncrements
        });
        
    } catch (error) {
        console.error('Error fetching counter:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch counter'
        });
    }
});

// POST /api/increment - Increment the counter by 1
// This endpoint increases the global counter and returns the new value
router.post('/increment', async (req, res) => {
    try {
        // Get the global counter
        const counter = await Counter.getGlobalCounter();
        
        // Increment the counter
        await counter.increment();
        
        // Return the updated counter data
        res.json({
            success: true,
            count: counter.count,
            lastUpdated: counter.lastUpdated,
            totalIncrements: counter.totalIncrements,
            message: 'Counter incremented successfully'
        });
        
    } catch (error) {
        console.error('Error incrementing counter:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to increment counter'
        });
    }
});

// POST /api/reset - Reset the counter to 0
// This endpoint resets the global counter back to zero
router.post('/reset', async (req, res) => {
    try {
        // Get the global counter
        const counter = await Counter.getGlobalCounter();
        
        // Reset the counter
        await counter.reset();
        
        // Return the reset counter data
        res.json({
            success: true,
            count: counter.count,
            lastUpdated: counter.lastUpdated,
            totalIncrements: counter.totalIncrements,
            message: 'Counter reset successfully'
        });
        
    } catch (error) {
        console.error('Error resetting counter:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to reset counter'
        });
    }
});

// GET /api/stats - Get detailed counter statistics
// This endpoint provides additional statistics about the counter
router.get('/stats', async (req, res) => {
    try {
        const counter = await Counter.getGlobalCounter();
        
        // Calculate some basic statistics
        const createdDate = counter.createdAt || new Date();
        const daysSinceCreated = Math.floor((Date.now() - createdDate) / (1000 * 60 * 60 * 24));
        const avgClicksPerDay = daysSinceCreated > 0 ? (counter.totalIncrements / daysSinceCreated).toFixed(2) : counter.totalIncrements;
        
        res.json({
            success: true,
            stats: {
                currentCount: counter.count,
                totalIncrements: counter.totalIncrements,
                createdAt: counter.createdAt,
                lastUpdated: counter.lastUpdated,
                daysSinceCreated: daysSinceCreated,
                averageClicksPerDay: parseFloat(avgClicksPerDay)
            }
        });
        
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch statistics'
        });
    }
});

module.exports = router;