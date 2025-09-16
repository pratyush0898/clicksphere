// index.js - Main Express.js server file
// This file sets up the Express server, Socket.IO for real-time updates,
// connects to MongoDB, and handles HTTP routes

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

// Import custom modules
const connectDB = require('./src/config/database');
const apiRoutes = require('./src/routes/api');
const { renderHomePage } = require('./src/templates/app');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB database
connectDB();

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'src/public'))); // Serve static files

// API routes for counter operations
app.use('/api', apiRoutes);

// Main route - serves the homepage with Tailwind CSS
app.get('/', (req, res) => {
    const html = renderHomePage();
    res.send(html);
});

// Socket.IO connection handling for real-time updates
// When a user connects, we listen for counter updates and broadcast them
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Listen for counter increment events from clients
    socket.on('counter-increment', (data) => {
        // Broadcast the new counter value to all connected clients
        io.emit('counter-updated', data);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Page not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 ClickSphere server running on http://localhost:${PORT}`);
    console.log(`📊 Global click counter is live and syncing across all devices!`);
});