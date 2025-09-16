// src/public/script.js - Client-side JavaScript for ClickSphere
// This file handles all frontend interactions, Socket.IO real-time updates,
// API calls, animations, and user interface updates

// Initialize Socket.IO connection for real-time updates
const socket = io();

// DOM element references
const counterDisplay = document.getElementById('counter-display');
const clickBtn = document.getElementById('click-btn');
const resetBtn = document.getElementById('reset-btn');
const lastUpdatedDisplay = document.getElementById('last-updated');
const connectionStatus = document.getElementById('connection-status');
const totalIncrementsDisplay = document.getElementById('total-increments');
const avgClicksDisplay = document.getElementById('avg-clicks');
const onlineUsersDisplay = document.getElementById('online-users');
const loadingText = document.getElementById('loading-text');
const clickAnimationsContainer = document.getElementById('click-animations');

// Application state
let currentCount = 0;
let isConnected = false;
let onlineUsers = 1;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ClickSphere initialized!');
    loadInitialCounter();
    setupEventListeners();
    loadStatistics();
});

// Load the initial counter value from the server
async function loadInitialCounter() {
    try {
        showLoading(true);
        
        const response = await fetch('/api/count');
        const data = await response.json();
        
        if (data.success) {
            updateCounterDisplay(data.count);
            updateLastUpdated(data.lastUpdated);
            currentCount = data.count;
        } else {
            console.error('Failed to load counter:', data.error);
            showError('Failed to load counter');
        }
    } catch (error) {
        console.error('Error loading counter:', error);
        showError('Connection error');
    } finally {
        showLoading(false);
    }
}

// Load and display statistics
async function loadStatistics() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        if (data.success) {
            totalIncrementsDisplay.textContent = data.stats.totalIncrements.toLocaleString();
            avgClicksDisplay.textContent = data.stats.averageClicksPerDay;
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Main click button event
    clickBtn.addEventListener('click', handleClick);
    
    // Reset button event (with confirmation)
    resetBtn.addEventListener('click', handleReset);
    
    // Socket.IO event listeners for real-time updates
    setupSocketListeners();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyPress);
    
    // Prevent right-click context menu on click button
    clickBtn.addEventListener('contextmenu', (e) => e.preventDefault());
}

// Handle the main click action
async function handleClick() {
    if (!isConnected) {
        showError('Not connected to server');
        return;
    }
    
    try {
        // Disable button to prevent spam clicking
        clickBtn.disabled = true;
        
        // Show immediate visual feedback
        animateButton();
        createClickAnimation();
        
        // Send increment request to server
        const response = await fetch('/api/increment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update local display immediately for better UX
            currentCount = data.count;
            updateCounterDisplay(currentCount);
            updateLastUpdated(data.lastUpdated);
            
            // Emit socket event for other users
            socket.emit('counter-increment', {
                count: currentCount,
                lastUpdated: data.lastUpdated,
                totalIncrements: data.totalIncrements
            });
            
            // Update statistics
            totalIncrementsDisplay.textContent = data.totalIncrements.toLocaleString();
            
        } else {
            console.error('Failed to increment counter:', data.error);
            showError('Failed to increment counter');
        }
        
    } catch (error) {
        console.error('Error clicking:', error);
        showError('Click failed');
    } finally {
        // Re-enable button after short delay
        setTimeout(() => {
            clickBtn.disabled = false;
        }, 100);
    }
}

// Handle reset button with confirmation
async function handleReset() {
    if (!confirm('Are you sure you want to reset the global counter to 0? This action cannot be undone!')) {
        return;
    }
    
    try {
        const response = await fetch('/api/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentCount = 0;
            updateCounterDisplay(0);
            updateLastUpdated(data.lastUpdated);
            showSuccess('Counter reset successfully!');
            
            // Emit reset event to other users
            socket.emit('counter-increment', {
                count: 0,
                lastUpdated: data.lastUpdated,
                totalIncrements: data.totalIncrements,
                reset: true
            });
            
            // Update statistics
            loadStatistics();
        } else {
            showError('Failed to reset counter');
        }
    } catch (error) {
        console.error('Error resetting:', error);
        showError('Reset failed');
    }
}

// Set up Socket.IO event listeners for real-time updates
function setupSocketListeners() {
    // Connection established
    socket.on('connect', () => {
        console.log('✅ Connected to ClickSphere server');
        isConnected = true;
        updateConnectionStatus(true);
        clickBtn.disabled = false;
    });
    
    // Connection lost
    socket.on('disconnect', () => {
        console.log('❌ Disconnected from ClickSphere server');
        isConnected = false;
        updateConnectionStatus(false);
        clickBtn.disabled = true;
    });
    
    // Real-time counter updates from other users
    socket.on('counter-updated', (data) => {
        // Only update if the count is different from our local count
        if (data.count !== currentCount) {
            currentCount = data.count;
            updateCounterDisplay(data.count);
            updateLastUpdated(data.lastUpdated);
            
            // Show notification for updates from other users
            if (!data.reset) {
                showNotification('Someone clicked! 🎉');
                createRemoteClickAnimation();
            } else {
                showNotification('Counter was reset! 🔄');
            }
            
            // Update statistics if provided
            if (data.totalIncrements) {
                totalIncrementsDisplay.textContent = data.totalIncrements.toLocaleString();
            }
        }
    });
    
    // Handle connection errors
    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        showError('Connection failed');
    });
}

// Handle keyboard shortcuts
function handleKeyPress(event) {
    // Spacebar or Enter to click
    if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        if (!clickBtn.disabled) {
            handleClick();
        }
    }
    
    // Ctrl+R to reset (with confirmation)
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        handleReset();
    }
}

// Update the counter display with animation
function updateCounterDisplay(count) {
    counterDisplay.style.transform = 'scale(1.1)';
    counterDisplay.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        counterDisplay.textContent = count.toLocaleString();
        counterDisplay.style.transform = 'scale(1)';
    }, 100);
}

// Update the last updated timestamp
function updateLastUpdated(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp);
        const timeString = date.toLocaleTimeString();
        const dateString = date.toLocaleDateString();
        lastUpdatedDisplay.textContent = `Last updated: ${timeString} on ${dateString}`;
    } else {
        lastUpdatedDisplay.textContent = 'Just now';
    }
}

// Update connection status indicator
function updateConnectionStatus(connected) {
    if (connected) {
        connectionStatus.innerHTML = '🟢 Connected';
        connectionStatus.className = 'fixed top-4 right-4 px-3 py-1 rounded-full text-sm font-medium bg-green-500/80 text-white';
    } else {
        connectionStatus.innerHTML = '🔴 Disconnected';
        connectionStatus.className = 'fixed top-4 right-4 px-3 py-1 rounded-full text-sm font-medium bg-red-500/80 text-white';
    }
}

// Animate the click button
function animateButton() {
    clickBtn.style.transform = 'scale(0.95)';
    clickBtn.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
        clickBtn.style.transform = 'scale(1)';
    }, 100);
}

// Create click animation effect
function createClickAnimation() {
    const animation = document.createElement('div');
    animation.className = 'click-animation';
    animation.textContent = '+1';
    
    // Position randomly around the button
    const buttonRect = clickBtn.getBoundingClientRect();
    const x = buttonRect.left + (buttonRect.width / 2) + (Math.random() - 0.5) * 100;
    const y = buttonRect.top + (buttonRect.height / 2);
    
    animation.style.left = x + 'px';
    animation.style.top = y + 'px';
    
    clickAnimationsContainer.appendChild(animation);
    
    // Remove animation after it completes
    setTimeout(() => {
        if (animation.parentNode) {
            animation.parentNode.removeChild(animation);
        }
    }, 2000);
}

// Create animation for remote clicks (from other users)
function createRemoteClickAnimation() {
    const animation = document.createElement('div');
    animation.className = 'click-animation';
    animation.textContent = '✨';
    animation.style.color = '#10b981'; // Green color for remote clicks
    
    // Random position on screen
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 100);
    
    animation.style.left = x + 'px';
    animation.style.top = y + 'px';
    
    clickAnimationsContainer.appendChild(animation);
    
    setTimeout(() => {
        if (animation.parentNode) {
            animation.parentNode.removeChild(animation);
        }
    }, 2000);
}

// Show loading state
function showLoading(loading) {
    if (loading) {
        clickBtn.disabled = true;
        loadingText.classList.remove('hidden');
        clickBtn.querySelector('span:not(#loading-text)').style.opacity = '0.5';
    } else {
        clickBtn.disabled = false;
        loadingText.classList.add('hidden');
        clickBtn.querySelector('span:not(#loading-text)').style.opacity = '1';
    }
}

// Show success message
function showSuccess(message) {
    showToast(message, 'success');
}

// Show error message
function showError(message) {
    showToast(message, 'error');
}

// Show info notification
function showNotification(message) {
    showToast(message, 'info');
}

// Generic toast notification system
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-4 px-4 py-2 rounded-lg text-white text-sm font-medium z-50 transform translate-x-full transition-transform duration-300`;
    
    // Set toast color based on type
    switch (type) {
        case 'success':
            toast.classList.add('bg-green-500/90');
            break;
        case 'error':
            toast.classList.add('bg-red-500/90');
            break;
        case 'info':
        default:
            toast.classList.add('bg-blue-500/90');
            break;
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        toast.style.transform = 'translateX(full)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Update online users count (simulated)
function updateOnlineUsers() {
    // This is a simple simulation - in a real app, you'd track actual connections
    onlineUsers = Math.floor(Math.random() * 50) + 1;
    onlineUsersDisplay.textContent = onlineUsers.toLocaleString();
}

// Simulate online users updates
setInterval(updateOnlineUsers, 30000); // Update every 30 seconds

// Page visibility handling - pause updates when tab is not active
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('📱 ClickSphere paused (tab not active)');
    } else {
        console.log('📱 ClickSphere resumed (tab active)');
        // Refresh counter when tab becomes active again
        loadInitialCounter();
        loadStatistics();
    }
});

// Performance monitoring
let clickCount = 0;
let startTime = Date.now();

// Track performance metrics
function trackPerformance() {
    clickCount++;
    const elapsed = (Date.now() - startTime) / 1000;
    const clicksPerSecond = (clickCount / elapsed).toFixed(2);
    
    console.log(`📊 Performance: ${clickCount} clicks in ${elapsed.toFixed(1)}s (${clicksPerSecond} clicks/sec)`);
}

// Add click tracking to the main click handler
const originalHandleClick = handleClick;
handleClick = function() {
    trackPerformance();
    return originalHandleClick.apply(this, arguments);
};

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (socket) {
        socket.disconnect();
    }
});

// Initialize online users display
updateOnlineUsers();

console.log('🎯 ClickSphere client ready! Press Space or Enter to click, Ctrl+R to reset.');