"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const sheets_1 = require("./config/sheets");
const contactService_1 = require("./services/contactService");
const swagger_1 = require("./config/swagger");
const contacts_1 = __importDefault(require("./routes/contacts"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'https://grace-champoins.vercel.app',
        /\.vercel\.app$/ // Allow all Vercel preview deployments
    ],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Grace Champions API Documentation',
}));
// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger_1.swaggerSpec);
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
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Grace Champions API is running',
        timestamp: new Date().toISOString()
    });
});
// API Routes
app.use('/api/contacts', contacts_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
// Start server
const startServer = async () => {
    try {
        // Initialize Google Sheets API
        await (0, sheets_1.initializeSheetsClient)();
        // Initialize spreadsheet with headers
        await (0, contactService_1.initializeSpreadsheet)();
        // Start listening
        app.listen(PORT, () => {
            console.log(`\n🚀 Server is running on port ${PORT}`);
            console.log(`📍 API: http://localhost:${PORT}`);
            console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
            console.log(`💚 Health check: http://localhost:${PORT}/health`);
            console.log(`📊 Google Sheet ID: ${process.env.GOOGLE_SPREADSHEET_ID || 'Not configured'}\n`);
        });
    }
    catch (error) {
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
