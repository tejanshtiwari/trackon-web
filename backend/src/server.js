import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import apiRouter from './routes/api.js';
import { setIoInstance as setIncidentIo } from './controllers/incidentController.js';
import { setIoInstance as setMaintenanceIo } from './controllers/maintenanceController.js';

const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: 'https://trackon-web.onrender.com',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

setIncidentIo(io);
setMaintenanceIo(io);

// Middleware
app.use(cors({ origin: 'https://trackon-web-backend.onrender.com' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'RailSafe Alert Operations API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Socket.IO Event Handlers
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Employee join room
  socket.on('join', (data) => {
    if (data?.role) {
      socket.join(`role:${data.role}`);
      console.log(`[Socket.IO] Socket ${socket.id} joined role:${data.role}`);
    }
    if (data?.division) {
      socket.join(`division:${data.division}`);
    }
  });

  // Emergency halt broadcast from Station Master / Control Center
  socket.on('emergency:broadcast', (alertData) => {
    console.log('[Socket.IO] EMERGENCY BROADCAST DISPATCHED:', alertData);
    io.emit('emergency:siren', {
      ...alertData,
      broadcastedAt: new Date().toISOString(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  RailSafe Alert Backend Engine LIVE on Port ${PORT}`);
  console.log(`  REST API: http://localhost:${PORT}/api`);
  console.log(`  Real-Time WebSockets: Active (Socket.IO)`);
  console.log(`=======================================================`);
});
