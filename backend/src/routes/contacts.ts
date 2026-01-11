import { Router, Request, Response } from 'express';
import { addContact, checkDuplicate, getContactCount, ContactData } from '../services/contactService';

const router = Router();

/**
 * @openapi
 * /api/contacts:
 *   post:
 *     tags:
 *       - Contacts
 *     summary: Create a new contact
 *     description: Save a new contact with name and phone number directly to Google Sheets. Automatically checks for duplicate phone numbers and validates input.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 description: Contact's full name
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 description: Phone number
 *                 example: "08012345678"
 *           examples:
 *             example1:
 *               value:
 *                 name: John Doe
 *                 phone: "08012345678"
 *             example2:
 *               value:
 *                 name: Jane Smith
 *                 phone: "080-1234-5678"
 *     responses:
 *       201:
 *         description: Contact created successfully and added to Google Sheets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Contact saved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *       400:
 *         description: Validation error (missing name or phone, or phone too short)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *             examples:
 *               missingName:
 *                 value:
 *                   success: false
 *                   message: Name is required
 *               missingPhone:
 *                 value:
 *                   success: false
 *                   message: Phone number is required
 *               phoneTooShort:
 *                 value:
 *                   success: false
 *                   message: Phone number must be at least 10 digits
 *       409:
 *         description: Duplicate phone number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: This phone number already exists
 *                 duplicate:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone }: ContactData = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Clean phone number (remove spaces, dashes, etc.)
    const cleanedPhone = phone.replace(/[\s\-()]/g, '');

    // Basic phone validation (at least 10 digits)
    if (cleanedPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be at least 10 digits'
      });
    }

    // Check for duplicate email or phone number
    const duplicateCheck = await checkDuplicate(email, phone);
    if (duplicateCheck.isDuplicate) {
      const message = duplicateCheck.field === 'email'
        ? 'This email address is already registered'
        : 'This phone number is already registered';

      return res.status(409).json({
        success: false,
        message,
        duplicate: true,
        field: duplicateCheck.field
      });
    }

    // Add contact to Google Sheets
    const contact = await addContact({ name, email, phone });

    return res.status(201).json({
      success: true,
      message: 'Contact saved successfully',
      data: contact
    });

  } catch (error: any) {
    console.error('Error creating contact:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

/**
 * @openapi
 * /api/contacts/count:
 *   get:
 *     tags:
 *       - Contacts
 *     summary: Get total contact count
 *     description: Returns the total number of contacts stored in the Google Sheet
 *     responses:
 *       200:
 *         description: Contact count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 42
 *       500:
 *         description: Error counting contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
router.get('/count', async (req: Request, res: Response) => {
  try {
    const count = await getContactCount();

    return res.json({
      success: true,
      count
    });
  } catch (error: any) {
    console.error('Error counting contacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Error counting contacts'
    });
  }
});

/**
 * @openapi
 * /api/contacts/sheet-url:
 *   get:
 *     tags:
 *       - Contacts
 *     summary: Get Google Sheet URL
 *     description: Returns the URL to view the Google Sheet directly
 *     responses:
 *       200:
 *         description: Sheet URL retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 url:
 *                   type: string
 *                   example: https://docs.google.com/spreadsheets/d/your-sheet-id
 */
router.get('/sheet-url', (req: Request, res: Response) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

    return res.json({
      success: true,
      url
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error getting sheet URL'
    });
  }
});

export default router;
