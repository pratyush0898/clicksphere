// src/templates/index.js - HTML template generator with embedded Tailwind CSS
// This file generates the complete HTML page with Tailwind CSS styling
// All styling is handled through Tailwind classes, no separate CSS files needed

function renderHomePage() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ClickSphere - Global Click Counter | Real-time Synchronized Clicking</title>

  <!-- SEO Meta Tags -->
  <meta name="description"
    content="ClickSphere - The world's most engaging global click counter. Join millions in real-time synchronized clicking. Every click counts and syncs instantly across all devices worldwide.">
  <meta name="keywords"
    content="global click counter, real-time clicking, synchronized counter, world click counter, live counter, clicksphere, global clicker game">
  <meta name="author" content="ClickSphere">

  <!-- Open Graph Meta Tags for social sharing -->
  <meta property="og:title" content="ClickSphere - Global Click Counter">
  <meta property="og:description"
    content="Join the global clicking community! Real-time synchronized counter that connects clickers worldwide.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://clicksphere.app">

  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="ClickSphere - Global Click Counter">
  <meta name="twitter:description"
    content="Real-time global click counter. Every click syncs instantly across all devices worldwide!">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Socket.IO Client Library -->
  <script src="/socket.io/socket.io.js"></script>

  <!-- Custom Tailwind Configuration -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'click-blue': '#3b82f6',
            'click-purple': '#8b5cf6',
            'click-green': '#10b981',
          },
          animation: {
            'bounce-slow': 'bounce 2s infinite',
            'pulse-fast': 'pulse 1s infinite',
            'spin-slow': 'spin 3s linear infinite',
          }
        }
      }
    }
  </script>
</head>

<body class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-x-hidden">
  <!-- Animated Background Elements -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-bounce-slow"></div>
    <div class="absolute top-32 right-20 w-16 h-16 bg-purple-500 rounded-full opacity-25 animate-pulse-fast"></div>
    <div class="absolute bottom-20 left-32 w-12 h-12 bg-green-500 rounded-full opacity-30 animate-spin-slow"></div>
    <div class="absolute bottom-40 right-10 w-24 h-24 bg-pink-500 rounded-full opacity-15 animate-bounce"></div>
  </div>

  <!-- Main Container -->
  <div class="relative z-10 flex flex-col items-center justify-start min-h-screen p-4 space-y-8">
    <!-- Header -->
    <div class="text-center mt-8 animate-fade-in px-2">
      <h1
        class="text-5xl sm:text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
        ClickSphere
      </h1>
      <p class="text-lg md:text-2xl text-gray-300 mb-2">Global Click Counter</p>
      <p class="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-2">
        Join millions of clickers worldwide! Every click syncs instantly across all devices in real-time.
      </p>
    </div>

    <!-- Counter Display -->
    <div
      class="bg-black/30 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-12 mb-4 border border-white/10 shadow-2xl w-full max-w-md">
      <div class="text-center">
        <div class="text-sm text-gray-400 mb-2">Global Clicks</div>
        <div id="counter-display"
          class="text-5xl sm:text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
          0
        </div>
        <div id="last-updated" class="text-xs sm:text-sm text-gray-500 mt-2">
          Loading...
        </div>
      </div>
    </div>

    <!-- Main Click Button -->
    <div class="mb-6">
      <button id="click-btn"
        class="relative px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full text-lg sm:text-2xl font-bold shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled>
        <!-- Glow -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity">
        </div>
        <span class="relative z-10">🚀 CLICK ME! 🚀</span>
        <span id="loading-text" class="relative z-10 hidden">Loading...</span>
      </button>
    </div>

    <!-- Statistics Panel -->
    <div
      class="bg-black/20 backdrop-blur-lg rounded-2xl p-4 sm:p-6 mb-6 border border-white/10 w-full max-w-sm mx-auto">
      <h3 class="text-lg sm:text-xl font-bold text-center mb-4 text-yellow-400">📊 Live Stats</h3>
      <div class="grid grid-cols-2 gap-4 text-center">
        <div>
          <div class="text-xl sm:text-2xl font-bold text-green-400" id="total-increments">0</div>
          <div class="text-xs sm:text-sm text-gray-400">Total Clicks</div>
        </div>
        <div>
          <div class="text-xl sm:text-2xl font-bold text-blue-400" id="avg-clicks">0</div>
          <div class="text-xs sm:text-sm text-gray-400">Avg/Day</div>
        </div>
      </div>
      <div class="mt-4 text-center">
        <div class="text-base sm:text-lg font-bold text-purple-400" id="online-users">1</div>
        <div class="text-xs sm:text-sm text-gray-400">Online Clickers</div>
      </div>
    </div>

    <!-- Reset Button (Admin) -->
    <button id="reset-btn"
      class="px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50">
      🔄 Reset Counter
    </button>

    <!-- Connection Status -->
    <div id="connection-status"
      class="fixed top-4 right-4 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-500/80 text-white">
      🟢 Connected
    </div>

    <!-- Click Animation Container -->
    <div id="click-animations" class="fixed inset-0 pointer-events-none z-50"></div>
  </div>

  <!-- JS -->
  <script src="/script.js"></script>

  <!-- Custom Styles -->
  <style>
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fadeIn 1s ease-out;
    }

    .click-animation {
      position: absolute;
      pointer-events: none;
      font-size: 2rem;
      font-weight: bold;
      color: #fbbf24;
      animation: clickFloat 2s ease-out forwards;
    }

    @keyframes clickFloat {
      0% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      100% {
        opacity: 0;
        transform: translateY(-100px) scale(1.5);
      }
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  </style>
</body>
</html>
    `.trim();
}

module.exports = { renderHomePage };