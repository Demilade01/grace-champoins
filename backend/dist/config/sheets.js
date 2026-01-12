"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpreadsheetId = exports.getSheetsClient = exports.initializeSheetsClient = void 0;
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
let sheetsClient = null;
const initializeSheetsClient = async () => {
    try {
        // Option 1: Using Service Account (recommended for production)
        if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
            const auth = new googleapis_1.google.auth.JWT(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, undefined, process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), SCOPES);
            sheetsClient = googleapis_1.google.sheets({ version: 'v4', auth });
            console.log('✅ Google Sheets API initialized with Service Account');
            return sheetsClient;
        }
        // Option 2: Using API Key (simpler, but less secure - only for reading public sheets)
        if (process.env.GOOGLE_API_KEY) {
            const auth = process.env.GOOGLE_API_KEY;
            sheetsClient = googleapis_1.google.sheets({ version: 'v4', auth });
            console.log('✅ Google Sheets API initialized with API Key');
            return sheetsClient;
        }
        throw new Error('No Google Sheets credentials found. Please set up credentials in .env file.');
    }
    catch (error) {
        console.error('❌ Failed to initialize Google Sheets client:', error);
        throw error;
    }
};
exports.initializeSheetsClient = initializeSheetsClient;
const getSheetsClient = () => {
    if (!sheetsClient) {
        throw new Error('Google Sheets client not initialized. Call initializeSheetsClient first.');
    }
    return sheetsClient;
};
exports.getSheetsClient = getSheetsClient;
const getSpreadsheetId = () => {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    if (!spreadsheetId) {
        throw new Error('GOOGLE_SPREADSHEET_ID not set in environment variables');
    }
    return spreadsheetId;
};
exports.getSpreadsheetId = getSpreadsheetId;
