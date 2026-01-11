import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

let sheetsClient: any = null;

export const initializeSheetsClient = async () => {
  try {
    // Option 1: Using Service Account (recommended for production)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const auth = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        undefined,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        SCOPES
      );

      sheetsClient = google.sheets({ version: 'v4', auth });
      console.log('✅ Google Sheets API initialized with Service Account');
      return sheetsClient;
    }

    // Option 2: Using API Key (simpler, but less secure - only for reading public sheets)
    if (process.env.GOOGLE_API_KEY) {
      const auth = process.env.GOOGLE_API_KEY;
      sheetsClient = google.sheets({ version: 'v4', auth });
      console.log('✅ Google Sheets API initialized with API Key');
      return sheetsClient;
    }

    throw new Error('No Google Sheets credentials found. Please set up credentials in .env file.');
  } catch (error) {
    console.error('❌ Failed to initialize Google Sheets client:', error);
    throw error;
  }
};

export const getSheetsClient = () => {
  if (!sheetsClient) {
    throw new Error('Google Sheets client not initialized. Call initializeSheetsClient first.');
  }
  return sheetsClient;
};

export const getSpreadsheetId = (): string => {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SPREADSHEET_ID not set in environment variables');
  }
  return spreadsheetId;
};

