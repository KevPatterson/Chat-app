// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { PORT } from './config/index.js';
import { formatMessage } from './utils/messageFormatter.js';

const app = express();
const server = http.createServer(app);

// Configuración de Socket.IO con CORS
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : "*",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
});

// Middleware de seguridad y optimización
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : "*",
  credentials: true
}));

app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas requests desde esta IP, intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Servir carpeta pública con cache headers
app.use(express.static('public', {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  etag: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Almacén de usuarios conectados
const connectedUsers = new Map();

io.on('connection', socket => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Unirse a la sala general
  socket.join('general');

  // Manejar entrada de usuario
  socket.on('join', (username) => {
    connectedUsers.set(socket.id, username);
    socket.username = username;
    
    // Notificar a todos sobre el nuevo usuario
    io.to('general').emit('userJoined', {
      username,
      timestamp: new Date().toISOString(),
      userCount: connectedUsers.size
    });
    
    console.log(`${username} se unió al chat`);
  });

  // Indicador de escritura
  socket.on('typing', (username) => {
    socket.broadcast.to('general').emit('typing', username);
  });

  socket.on('stopTyping', () => {
    socket.broadcast.to('general').emit('stopTyping');
  });

  // Mensaje recibido
  socket.on('chatMessage', ({ username, text }) => {
    if (!username || !text || text.trim().length === 0) {
      return;
    }
    
    // Sanitizar el mensaje
    const sanitizedText = text.trim().substring(0, 1000); // Limitar longitud
    
    const msg = formatMessage(username, sanitizedText);
    io.to('general').emit('message', msg);
    
    console.log(`Mensaje de ${username}: ${sanitizedText}`);
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
    const username = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);
    
    if (username) {
      io.to('general').emit('userLeft', {
        username,
        timestamp: new Date().toISOString(),
        userCount: connectedUsers.size
      });
      console.log(`${username} se desconectó`);
    }
  });

  // Manejar errores de socket
  socket.on('error', (error) => {
    console.error('Error de socket:', error);
  });
});

// Manejo de errores del servidor
server.on('error', (error) => {
  console.error('Error del servidor:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Iniciado: ${new Date().toISOString()}`);
});
