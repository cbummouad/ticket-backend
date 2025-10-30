require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const ticketRoutes = require('./routes/ticketRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Conditionally set up Socket.IO only if not in serverless environment (e.g., Vercel)
let server, io;
if (!process.env.VERCEL) {
  const { createServer } = require('http');
  const { Server } = require('socket.io');
  const { authenticateSocket } = require('./middleware/auth');
  server = createServer(app);
  io = new Server(server, {
    cors: {
      origin: "*", // Configure this for production
      methods: ["GET", "POST"]
    }
  });
}

const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ticket Management API',
      version: '1.0.0',
      description: 'API for managing tickets, users, and roles',
    },
    servers: [
      {
        url: 'https://ticket-backend-sepia.vercel.app',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
const AllowedCors = ['http://localhost:5173', 'https://ticket-backend-sepia.vercel.app'];

// Middleware
app.use(cors(

  {
    origin : AllowedCors,
    credentials : true,
  })
);
app.use(express.json({ limit: '10mb' })); // Increase payload size limit for file uploads
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/notifications', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Ticket Management Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// WebSocket connection handling (only if Socket.IO is enabled)
if (io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Authenticate socket connection
    socket.on('authenticate', async (token) => {
      const { authenticateSocket } = require('./middleware/auth');
      const isAuthenticated = await authenticateSocket(socket, token);
      if (isAuthenticated) {
        socket.emit('authenticated', { message: 'Authenticated successfully' });
      } else {
        socket.emit('unauthenticated', { error: 'Authentication failed' });
      }
    });

    // Join user-specific room for notifications
    socket.on('join', (userId) => {
      if (socket.userId === userId) {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined their notification room`);
      } else {
        socket.emit('error', { message: 'Authentication required to join room' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Make io accessible in routes/controllers
  app.set('io', io);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;

// Start server if this file is run directly (only if not in serverless)
if (require.main === module && !process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

