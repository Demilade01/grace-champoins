# Grace Champions Backend API

Express + TypeScript backend that writes contact data directly to Google Sheets.

## Features

- ✅ Save contact information (name + phone) directly to Google Sheets
- ✅ Duplicate phone number prevention
- ✅ Real-time updates to shared spreadsheet
- ✅ Auto-generated IDs and timestamps
- ✅ Interactive API documentation (Swagger UI)
- ✅ No database setup needed!

## 📊 Why Google Sheets?

Data goes **directly** to a Google Sheet that anyone can access:
- ✅ Non-technical users can view/edit in their browser
- ✅ No export needed - data is already in a spreadsheet
- ✅ Multiple people can access simultaneously
- ✅ Automatic backups by Google
- ✅ Set permissions (view-only, edit, etc.)

## Setup

### 1. Google Sheets Setup (Required First!)

**📚 Follow the detailed guide:** [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)

Quick summary:
1. Create a Google Sheet
2. Set up Google Cloud Project
3. Enable Google Sheets API
4. Create Service Account credentials
5. Share the sheet with the service account email
6. Configure environment variables

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

Create a `.env` file in the `backend` folder:

```env
# Server Configuration
PORT=5000

# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-from-url
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
```

**See [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) for detailed instructions on getting these values.**

### 4. Start the Server

```bash
npm run dev
```

The server will:
- Initialize Google Sheets API connection
- Add headers to your spreadsheet (if not present)
- Start listening on port 5000

You should see:
```
✅ Google Sheets API initialized with Service Account
✅ Spreadsheet initialized with headers
🚀 Server is running on port 5000
📚 Swagger Docs: http://localhost:5000/api-docs
```

---

## 📚 API Documentation

Interactive API documentation is available via **Swagger UI**:

🔗 **http://localhost:5000/api-docs**

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Try-it-out functionality to test endpoints directly
- Example requests and responses
- Error handling documentation

You can also access the raw OpenAPI spec at: `http://localhost:5000/api-docs.json`

---

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Save Contact
```
POST /api/contacts
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "08012345678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact saved successfully",
  "data": {
    "id": "1736598000000",
    "name": "John Doe",
    "phone": "08012345678",
    "timestamp": "01/11/2026, 10:30:00 AM"
  }
}
```

**Error (Duplicate):**
```json
{
  "success": false,
  "message": "This phone number already exists",
  "duplicate": true
}
```

### Get Total Count
```
GET /api/contacts/count
```
Returns the total number of contacts in the sheet.

### Get Sheet URL
```
GET /api/contacts/sheet-url
```
Returns the Google Sheets URL for direct access.

---

## Google Sheet Structure

The spreadsheet will have the following columns:

| Column | Description |
|--------|-------------|
| **ID** | Auto-generated unique identifier |
| **Name** | Contact's full name |
| **Phone Number** | Phone number (cleaned) |
| **Date & Time** | Timestamp when record was created |

Headers are automatically added when the server starts.

---

## How It Works

1. **Form Submission** → Contact data sent to backend API
2. **Validation** → Name and phone validated, duplicates checked
3. **Google Sheets API** → Data appended as new row
4. **Real-time Update** → Sheet updates instantly
5. **Access** → Anyone with sheet access sees new data

---

## Sharing the Sheet

To give someone access to view/edit the data:

1. Open your Google Sheet
2. Click **Share** (top right)
3. Add their email address
4. Choose permission level:
   - **Viewer**: Can only view data
   - **Commenter**: Can view and comment
   - **Editor**: Can edit the data
5. Click **Send**

They'll receive an email with a link to the sheet!

---

## Production Build

```bash
npm run build
npm start
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `GOOGLE_SPREADSHEET_ID` | ID from Google Sheet URL | Yes |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email | Yes |
| `GOOGLE_PRIVATE_KEY` | Service account private key | Yes |

---

## Troubleshooting

### "The caller does not have permission"
**Fix:** Share the Google Sheet with your service account email

### "GOOGLE_SPREADSHEET_ID not set"
**Fix:** Add the spreadsheet ID to your `.env` file

### "Unable to parse private key"
**Fix:**
- Keep the private key in quotes
- Keep `\n` as literal `\n` (not actual newlines)
- Check for any extra spaces or line breaks

### Headers not appearing
**Fix:**
- Rename your sheet tab to "Contacts"
- Restart the server

See [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) for more troubleshooting help.

---

## Security Notes

- Never commit `.env` file to Git
- Keep the JSON credentials file secure
- Don't share the service account private key
- For production: Use platform environment variables
- Consider rotating keys periodically

---

## Tech Stack

- **Express** - Web framework
- **TypeScript** - Type safety
- **Google Sheets API** - Data storage
- **Swagger UI** - API documentation
