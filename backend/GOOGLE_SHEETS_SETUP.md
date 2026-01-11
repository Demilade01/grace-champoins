# Google Sheets API Setup Guide

This guide will walk you through setting up Google Sheets API access for the Grace Champions contact system.

## Prerequisites

- A Google account
- Access to Google Cloud Console

---

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name it something like "Grace Champions Contacts"
4. **Important:** Note the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0/edit
                                           ^^^^^^^^^^^^^^^^^^^^
                                           This is your Spreadsheet ID
   ```
5. Rename the first sheet tab to **"Contacts"** (bottom left)

---

## Step 2: Set Up Google Cloud Project

### 2.1 Create a Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Name it "Grace Champions" (or any name you prefer)
4. Click **Create**

### 2.2 Enable Google Sheets API

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click on it and press **Enable**

---

## Step 3: Create Service Account Credentials

### 3.1 Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **Service Account**
3. Fill in the details:
   - **Service account name:** grace-champions-bot
   - **Service account ID:** (auto-generated)
   - **Description:** Service account for Grace Champions contact form
4. Click **Create and Continue**
5. **Grant this service account access to project:**
   - Role: **Editor** (or just create without role)
6. Click **Continue** → **Done**

### 3.2 Generate Private Key

1. Find your newly created service account in the list
2. Click on it to open details
3. Go to the **Keys** tab
4. Click **Add Key** → **Create new key**
5. Choose **JSON** format
6. Click **Create**
7. A JSON file will be downloaded automatically
8. **Keep this file secure!** It contains sensitive credentials

### 3.3 Get Service Account Email

Open the downloaded JSON file. You'll need two pieces of information:
- `client_email` (looks like: `grace-champions-bot@project-id.iam.gserviceaccount.com`)
- `private_key` (a long string starting with `-----BEGIN PRIVATE KEY-----`)

---

## Step 4: Share the Google Sheet with Service Account

**This is critical!** The service account needs permission to write to your spreadsheet.

1. Open your Google Sheet
2. Click the **Share** button (top right)
3. Paste the **service account email** (from step 3.3)
4. Make sure it has **Editor** access
5. **Uncheck** "Notify people" (it's a bot account, not a person)
6. Click **Share** or **Send**

---

## Step 5: Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000

# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
```

### Important Notes:

1. **GOOGLE_SPREADSHEET_ID**: Copy from the URL of your Google Sheet (Step 1)

2. **GOOGLE_SERVICE_ACCOUNT_EMAIL**: Copy `client_email` from the JSON file

3. **GOOGLE_PRIVATE_KEY**:
   - Copy `private_key` from the JSON file
   - **Keep the quotes** around the entire key
   - The `\n` characters should remain as literal `\n` (not actual newlines)
   - Example format:
     ```env
     GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
     ```

---

## Step 6: Verify Setup

1. Start the backend server:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. You should see:
   ```
   ✅ Google Sheets API initialized with Service Account
   ✅ Spreadsheet initialized with headers
   🚀 Server is running on port 5000
   ```

3. Open your Google Sheet - you should see headers automatically added:
   ```
   | ID | Name | Phone Number | Date & Time |
   ```

4. Test adding a contact via the API or frontend!

---

## Troubleshooting

### Error: "The caller does not have permission"

**Solution:** Make sure you shared the Google Sheet with the service account email (Step 4)

### Error: "GOOGLE_SPREADSHEET_ID not set"

**Solution:** Check that your `.env` file is in the `backend/` directory and the variable is set correctly

### Error: "Unable to parse private key"

**Solution:**
- Make sure the private key is wrapped in quotes
- Keep the `\n` characters as literal `\n`
- Don't add extra line breaks in the `.env` file

### Headers not appearing in sheet

**Solution:**
- Rename your sheet tab to exactly "Contacts"
- Restart the server

### Error: "Requested entity was not found"

**Solution:** Double-check your Spreadsheet ID is correct

---

## Alternative Setup (API Key - Read Only)

If you only need to read data (not recommended for this use case), you can use an API key instead:

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API Key**
3. Copy the API key
4. Make your Google Sheet public (File → Share → Anyone with the link can view)
5. In `.env` use:
   ```env
   GOOGLE_API_KEY=your-api-key-here
   ```

**Note:** This method doesn't work for writing data, so it's not suitable for our contact form.

---

## Security Best Practices

1. **Never commit your `.env` file to Git** (it's already in `.gitignore`)
2. **Keep the JSON credentials file secure**
3. **Don't share the service account private key**
4. **For production:** Use environment variables from your hosting platform (Heroku, Vercel, etc.)
5. **Consider rotating keys** periodically for security

---

## Next Steps

Once setup is complete:
1. Start both backend and frontend servers
2. Test the contact form
3. Check your Google Sheet to see entries appearing in real-time!
4. Share the Google Sheet with your team member who needs access

---

## Support

If you encounter issues:
1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure the Google Sheet is shared with the service account
4. Try the troubleshooting steps above

