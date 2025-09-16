# ClickSphere - Global Click Counter 🌐

**ClickSphere** is a real-time, globally synchronized click counter application that connects users worldwide. Every click is instantly shared across all devices, creating an engaging, collaborative clicking experience.

## 🚀 Features

- **Real-time Synchronization**: All clicks sync instantly across devices using Socket.IO
- **Global Counter**: Persistent counter stored in MongoDB that survives server restarts
- **Beautiful UI**: Modern, responsive design with Tailwind CSS and smooth animations
- **Live Statistics**: Track total clicks, daily averages, and online users
- **Cross-Device Compatible**: Works seamlessly on desktop, tablet, and mobile
- **SEO Optimized**: Meta tags and structured data for better search visibility
- **Performance Monitoring**: Built-in click tracking and performance metrics

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO for WebSocket connections
- **Frontend**: Vanilla JavaScript with Tailwind CSS
- **Styling**: Tailwind CSS (no external CSS files needed)

## 📁 Project Structure

```
clicksphere/
├── package.json              # Project dependencies and scripts
├── index.js                  # Main Express server with Socket.IO
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection configuration
│   ├── models/
│   │   └── Counter.js        # MongoDB schema for counter data
│   ├── routes/
│   │   └── api.js            # REST API endpoints for counter operations
│   ├── templates/
│   │   └── app.js            # HTML template generator with Tailwind CSS
│   └── public/
│       └── script.js         # Client-side JavaScript and Socket.IO handling
└── README.md                 # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16.0.0 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone or create the project:**
   ```bash
   mkdir clicksphere
   cd clicksphere
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up MongoDB:**
   - **Local MongoDB**: Make sure MongoDB is running on `mongodb://localhost:27017`
   - **MongoDB Atlas**: Create a `.env` file with your connection string:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clicksphere
     PORT=3000
     ```

4. **Start the application:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🎮 How to Use

1. **Click the Button**: Press the big blue "CLICK ME!" button or use keyboard shortcuts
2. **Watch Real-time Updates**: See clicks from other users appear instantly
3. **View Statistics**: Monitor total clicks, daily averages, and online users
4. **Reset Counter**: Use the reset button to start over (with confirmation)
5. **Keyboard Shortcuts**:
   - `Space` or `Enter`: Click the button
   - `Ctrl+R`: Reset counter (with confirmation)

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/count` | Get current counter value and metadata |
| POST | `/api/increment` | Increment counter by 1 |
| POST | `/api/reset` | Reset counter to 0 |
| GET | `/api/stats` | Get detailed statistics |

### Example API Response

```json
{
  "success": true,
  "count": 1337,
  "lastUpdated": "2024-01-15T10:30:00.000Z",
  "totalIncrements": 1337,
  "message": "Counter incremented successfully"
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/clicksphere

# Server Configuration
PORT=3000
NODE_ENV=production

# Optional: Authentication (for future features)
JWT_SECRET=your-secret-key
```

### MongoDB Setup

The application will automatically create the database and collections on first run. The counter document structure:

```javascript
{
  name: "global",
  count: 0,
  totalIncrements: 0,
  lastUpdated: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Heroku Deployment

1. **Install Heroku CLI** and login
2. **Create Heroku app:**
   ```bash
   heroku create your-clicksphere-app
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-atlas-uri
   ```

4. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy ClickSphere"
   git push heroku main
   ```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t clicksphere .
docker run -p 3000:3000 -e MONGODB_URI=your-uri clicksphere
```

## 📈 Performance & Scalability

- **MongoDB Indexing**: Automatic indexes on frequently queried fields
- **Socket.IO Clustering**: Ready for horizontal scaling with Redis adapter
- **Caching**: Counter values cached in memory for faster responses
- **Rate Limiting**: Built-in protection against spam clicking
- **Error Handling**: Comprehensive error handling and logging

## 🛡️ Security Features

- **Input Validation**: All API inputs validated and sanitized
- **CORS Protection**: Configurable cross-origin request handling
- **Rate Limiting**: Prevents abuse and spam clicking
- **MongoDB Security**: Parameterized queries prevent injection attacks
- **Error Handling**: Secure error messages that don't expose internals

## 🎨 Customization

### Styling
- All styles use Tailwind CSS utility classes
- Easy to customize colors, animations, and layout
- No external CSS files required

### Features
- Add user authentication for personalized counters
- Implement multiple counter categories
- Add sound effects and haptic feedback
- Create leaderboards and achievements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Repository**: [GitHub Repository]
- **Issues**: [Report Issues]
- **Documentation**: [Full Documentation]

## 👨‍💻 Author

Created with JavaScript by Pratyush

---

**ClickSphere** - Connecting the world, one click at a time! 🌍✨