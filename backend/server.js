require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');
const { initSockets } = require('./src/sockets');

// Connect to Database & Redis
connectDB();
connectRedis();

const server = http.createServer(app);

// Initialize Socket.io
initSockets(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
