"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSpreadsheet = exports.getContactCount = exports.addContact = exports.checkDuplicate = void 0;
const sheets_1 = require("../config/sheets");
const SHEET_NAME = 'Invitees'; // The name of the sheet tab in your Google Spreadsheet
// Clean phone number (remove spaces, dashes, parentheses)
const cleanPhone = (phone) => {
    return phone.replace(/[\s\-()]/g, '');
};
// Check if email or phone number already exists in the sheet
const checkDuplicate = async (email, phone) => {
    try {
        const sheets = (0, sheets_1.getSheetsClient)();
        const spreadsheetId = (0, sheets_1.getSpreadsheetId)();
        const cleanedPhone = cleanPhone(phone);
        const cleanedEmail = email.toLowerCase().trim();
        // Read all data from columns C and D (Email and Phone columns)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${SHEET_NAME}!C:D`,
        });
        const values = response.data.values;
        if (!values || values.length <= 1) {
            // No data or only header row
            return { isDuplicate: false };
        }
        // Check if email or phone exists (skip header row)
        const data = values.slice(1);
        for (const row of data) {
            const [existingEmail, existingPhone] = row;
            if (existingEmail && existingEmail.toLowerCase().trim() === cleanedEmail) {
                return { isDuplicate: true, field: 'email' };
            }
            if (existingPhone && existingPhone === cleanedPhone) {
                return { isDuplicate: true, field: 'phone' };
            }
        }
        return { isDuplicate: false };
    }
    catch (error) {
        console.error('Error checking duplicate:', error);
        // If we can't check, allow the insert (better than blocking valid entries)
        return { isDuplicate: false };
    }
};
exports.checkDuplicate = checkDuplicate;
// Add a new contact to the Google Sheet
const addContact = async (contactData) => {
    try {
        const sheets = (0, sheets_1.getSheetsClient)();
        const spreadsheetId = (0, sheets_1.getSpreadsheetId)();
        const cleanedPhone = cleanPhone(contactData.phone);
        const cleanedEmail = contactData.email.toLowerCase().trim();
        const timestamp = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        // Generate a simple ID (row number will be determined after insert)
        const id = Date.now().toString();
        // Prepare the row data: [ID, Name, Email, Phone, Timestamp]
        const values = [
            [id, contactData.name.trim(), cleanedEmail, cleanedPhone, timestamp]
        ];
        // Append the row to the sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${SHEET_NAME}!A:E`, // Columns A through E
            valueInputOption: 'RAW',
            requestBody: {
                values,
            },
        });
        console.log(`✅ Contact added: ${contactData.name} (${cleanedEmail}, ${cleanedPhone})`);
        return {
            id,
            name: contactData.name.trim(),
            email: cleanedEmail,
            phone: cleanedPhone,
            timestamp,
        };
    }
    catch (error) {
        console.error('Error adding contact to Google Sheets:', error);
        throw new Error(`Failed to add contact: ${error.message}`);
    }
};
exports.addContact = addContact;
// Get total count of contacts
const getContactCount = async () => {
    try {
        const sheets = (0, sheets_1.getSheetsClient)();
        const spreadsheetId = (0, sheets_1.getSpreadsheetId)();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${SHEET_NAME}!A:A`, // Just get column A to count rows
        });
        const values = response.data.values;
        if (!values || values.length <= 1) {
            return 0; // No data or only header
        }
        // Subtract 1 for header row
        return values.length - 1;
    }
    catch (error) {
        console.error('Error getting contact count:', error);
        return 0;
    }
};
exports.getContactCount = getContactCount;
// Initialize the spreadsheet with headers (call this once during setup)
const initializeSpreadsheet = async () => {
    try {
        const sheets = (0, sheets_1.getSheetsClient)();
        const spreadsheetId = (0, sheets_1.getSpreadsheetId)();
        // Check if headers already exist
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${SHEET_NAME}!A1:E1`,
        });
        if (response.data.values && response.data.values.length > 0) {
            console.log('📊 Spreadsheet headers already exist');
            return;
        }
        // Add headers if they don't exist
        const headers = [['ID', 'Name', 'Email', 'Phone Number', 'Date & Time']];
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${SHEET_NAME}!A1:E1`,
            valueInputOption: 'RAW',
            requestBody: {
                values: headers,
            },
        });
        // Format the header row (bold)
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [
                    {
                        repeatCell: {
                            range: {
                                sheetId: 0,
                                startRowIndex: 0,
                                endRowIndex: 1,
                            },
                            cell: {
                                userEnteredFormat: {
                                    textFormat: {
                                        bold: true,
                                    },
                                    backgroundColor: {
                                        red: 0.9,
                                        green: 0.9,
                                        blue: 0.9,
                                    },
                                },
                            },
                            fields: 'userEnteredFormat(textFormat,backgroundColor)',
                        },
                    },
                ],
            },
        });
        console.log('✅ Spreadsheet initialized with headers');
    }
    catch (error) {
        console.error('Error initializing spreadsheet:', error);
        // Don't throw - server can still run even if this fails
    }
};
exports.initializeSpreadsheet = initializeSpreadsheet;
