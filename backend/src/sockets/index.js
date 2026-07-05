const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initSockets = (server) => {
  io = socketIo(server, {
    cors: {
      origin: '*', // We'll configure this properly in production
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  // Socket Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.id})`);

    // Users can join a room specific to a project to receive updates
    socket.on('join_project', (projectId) => {
      socket.join(projectId);
      console.log(`User ${socket.user.username} joined project room: ${projectId}`);
    });

    socket.on('leave_project', (projectId) => {
      socket.leave(projectId);
      console.log(`User ${socket.user.username} left project room: ${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username} (${socket.id})`);
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = {
  initSockets,
  getIo
};
