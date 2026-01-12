import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { initializeSheetsClient } from './config/sheets';
import { initializeSpreadsheet } from './services/contactService';
import { swaggerSpec } from './config/swagger';
import contactRoutes from './routes/contacts';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://grace-champoins.vercel.app',
    /\.vercel\.app$/  // Allow all Vercel preview deployments
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Grace Champions API Documentation',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check endpoint
 *     description: Returns the current status of the API server
 *     responses:
 *       200:
 *         description: Server is healthy and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Grace Champions API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-01-11T10:30:00.000Z
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Grace Champions API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/contacts', contactRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize Google Sheets API
    await initializeSheetsClient();

    // Initialize spreadsheet with headers
    await initializeSpreadsheet();

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}`);
      console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 Google Sheet ID: ${process.env.GOOGLE_SPREADSHEET_ID || 'Not configured'}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    console.error('\n⚠️  Make sure you have configured Google Sheets credentials in .env file');
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

startServer();

