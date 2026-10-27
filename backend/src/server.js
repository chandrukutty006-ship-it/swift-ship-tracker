require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const db = require('./db/database');
const socketService = require('./services/socketService');
const gpsSimulator = require('./services/gpsSimulator');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 1. Initialize SQLite Database
    console.log('[Database] Initializing SQLite database...');
    await db.init();
    console.log('[Database] SQLite Database initialized.');

    // 2. Create HTTP server and attach Socket.IO
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    // 3. Initialize Socket Service
    socketService.initSocket(io);
    console.log('[Socket.IO] Real-time engine attached.');

    // 4. Initialize Live GPS Background Simulator
    gpsSimulator.init();

    // 5. Start listening
    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚢 Swift Ship Tracker API Server running on port ${PORT}`);
      console.log(`📡 Real-time GPS Telemetry: Active`);
      console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`====================================================`);
    });

    // Graceful shutdown
    const handleShutdown = () => {
      console.log('\nGracefully shutting down Swift Ship Tracker server...');
      gpsSimulator.stop();
      db.saveImmediate();
      server.close(() => {
        console.log('Server closed. Goodbye!');
        process.exit(0);
      });
    };

    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);
  } catch (err) {
    console.error('Fatal error starting Swift Ship Tracker server:', err);
    process.exit(1);
  }
}

startServer();
