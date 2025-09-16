// src/models/Counter.js - MongoDB schema for the global counter
// This file defines the Counter model using Mongoose
// It stores the global click count and tracks when it was last updated

const mongoose = require('mongoose');

// Define the Counter schema
const counterSchema = new mongoose.Schema({
    // The name/identifier for this counter (allows for multiple counters in future)
    name: {
        type: String,
        required: true,
        unique: true,
        default: 'global'
    },
    
    // The current count value
    count: {
        type: Number,
        required: true,
        default: 0,
        min: 0 // Prevent negative counts
    },
    
    // Track when the counter was last incremented
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    
    // Optional: track total number of increment operations
    totalIncrements: {
        type: Number,
        default: 0
    }
}, {
    // Add timestamps for createdAt and updatedAt
    timestamps: true
});

// Static method to get or create the global counter
counterSchema.statics.getGlobalCounter = async function() {
    try {
        // Try to find the global counter
        let counter = await this.findOne({ name: 'global' });
        
        // If it doesn't exist, create it
        if (!counter) {
            counter = new this({ 
                name: 'global', 
                count: 0,
                totalIncrements: 0 
            });
            await counter.save();
            console.log('✨ Created new global counter');
        }
        
        return counter;
    } catch (error) {
        console.error('Error getting global counter:', error);
        throw error;
    }
};

// Instance method to increment the counter
counterSchema.methods.increment = async function() {
    try {
        this.count += 1;
        this.totalIncrements += 1;
        this.lastUpdated = new Date();
        
        await this.save();
        console.log(`🔢 Counter incremented to: ${this.count}`);
        
        return this;
    } catch (error) {
        console.error('Error incrementing counter:', error);
        throw error;
    }
};

// Instance method to reset the counter
counterSchema.methods.reset = async function() {
    try {
        this.count = 0;
        this.lastUpdated = new Date();
        
        await this.save();
        console.log('🔄 Counter reset to 0');
        
        return this;
    } catch (error) {
        console.error('Error resetting counter:', error);
        throw error;
    }
};

// Create and export the model
const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;