// src/config/database.js - MongoDB connection configuration
// This file handles the connection to MongoDB using Mongoose
// It includes error handling and connection status logging

const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 5000) => {
    try {
        // MongoDB connection string - use environment variable or default to local
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clicksphere';
        
        // Connect to MongoDB with recommended options
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);

        if (retries > 0) {
            console.log(`🔄 Retrying connection in ${delay / 1000} seconds... (${retries} retries left)`);
            setTimeout(() => connectDB(retries - 1, delay), delay);
        } else {
            console.error('❌ All retries exhausted. Exiting process.');
            process.exit(1);
        }
    }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed through app termination');
    process.exit(0);
});

module.exports = connectDB;