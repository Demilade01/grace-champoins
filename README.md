# Grace Champions - Contact Data Entry System

A fast, lightweight data-entry system that writes contact information **directly to Google Sheets** - perfect for non-technical users who need instant access to data in a familiar spreadsheet format.

## 🚀 Features

- ✅ **Direct to Google Sheets**: Data goes straight to a spreadsheet in real-time
- ✅ **Rapid Data Entry**: Optimized form with auto-focus and keyboard navigation
- ✅ **Two Required Fields**: Name and Phone Number
- ✅ **Instant Save**: No page refresh, immediate feedback
- ✅ **Duplicate Prevention**: Automatic phone number duplicate detection
- ✅ **Real-time Updates**: See new entries instantly in the spreadsheet
- ✅ **Easy Sharing**: Share the Google Sheet with anyone
- ✅ **No Database Setup**: No MongoDB, PostgreSQL, or complex setup needed!
- ✅ **Non-Technical Friendly**: Anyone can view/edit data in Google Sheets
- ✅ **Toast Notifications**: Visual feedback using Sonner
- ✅ **Modern UI**: Beautiful interface built with Shadcn UI components

## 📁 Project Structure

```
grace-champions-invites/
├── backend/                        # Express API server
│   ├── src/
│   │   ├── config/
│   │   │   ├── sheets.ts          # Google Sheets API configuration
│   │   │   └── swagger.ts         # Swagger docs config
│   │   ├── services/
│   │   │   └── contactService.ts  # Google Sheets operations
│   │   ├── routes/
│   │   │   └── contacts.ts        # API endpoints
│   │   └── server.ts              # Express server
│   ├── GOOGLE_SHEETS_SETUP.md     # Detailed setup guide
│   ├── package.json
│   └── tsconfig.json
├── frontend/                       # Vite + React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # Shadcn UI components
│   │   │   ├── ContactForm.tsx    # Main form
│   │   │   ├── theme-provider.tsx
│   │   │   └── sonner.tsx         # Toast notifications
│   │   ├── lib/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Express** - Fast, minimalist web framework
- **TypeScript** - Type safety
- **Google Sheets API** - Direct spreadsheet integration
- **Swagger UI** - Interactive API documentation

### Frontend
- **Vite** - Lightning-fast build tool
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Modern styling
- **Shadcn UI** - Component library
- **Sonner** - Toast notifications

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Google Account** - For Google Sheets access
- **npm** or **yarn** package manager

## 🚀 Quick Start

### Step 1: Google Sheets Setup (15 minutes)

This is the most important step! Follow the detailed guide:

**📚 [backend/GOOGLE_SHEETS_SETUP.md](backend/GOOGLE_SHEETS_SETUP.md)**

Quick summary:
1. Create a Google Sheet
2. Set up Google Cloud Project & enable Sheets API
3. Create Service Account credentials
4. Share the sheet with service account email
5. Add credentials to `.env` file

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your Google Sheets credentials
# See backend/GOOGLE_SHEETS_SETUP.md for detailed instructions
```

Create `backend/.env`:
```env
PORT=5000
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nKey\nHere\n-----END PRIVATE KEY-----\n"
```

```bash
# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

**📚 API Documentation:** Visit `http://localhost:5000/api-docs` for interactive Swagger UI documentation

### Step 3: Setup Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### Step 4: Start Entering Data!

Navigate to `http://localhost:3000` and start entering contacts!

---

## 📊 How It Works

1. **User fills form** → Name and phone number entered
2. **Frontend validation** → Checks required fields
3. **API call** → Sends data to Express backend
4. **Duplicate check** → Reads existing phone numbers from sheet
5. **Google Sheets API** → Appends new row to spreadsheet
6. **Instant update** → Data appears in Google Sheet immediately
7. **Success toast** → User sees confirmation
8. **Form resets** → Auto-focuses for next entry

## 📊 Google Sheet Format

Your spreadsheet will automatically have these columns:

| ID | Name | Phone Number | Date & Time |
|----|------|--------------|-------------|
| 1736598000000 | John Doe | 08012345678 | 01/11/2026, 10:30:00 AM |
| 1736598123456 | Jane Smith | 08098765432 | 01/11/2026, 10:31:15 AM |

- **ID**: Auto-generated unique identifier
- **Name**: Contact's full name
- **Phone Number**: Cleaned phone number
- **Date & Time**: Timestamp when saved

---

## 🔌 API Endpoints

### Interactive Documentation

**Swagger UI:** http://localhost:5000/api-docs

All endpoints are fully documented with interactive testing capabilities via Swagger UI.

### Backend API (`http://localhost:5000`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/contacts` | Save new contact to sheet |
| GET | `/api/contacts/count` | Get total contact count |
| GET | `/api/contacts/sheet-url` | Get Google Sheets URL |

### Example: Save Contact

```bash
# Using HTTPie
http POST localhost:5000/api/contacts name="John Doe" phone="08012345678"

# Using curl
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","phone":"08012345678"}'
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

---

## 💡 Usage Guide

### Rapid Data Entry Workflow

1. **Enter Name** - Type the person's full name
2. **Press Tab** - Move to phone number field
3. **Enter Phone** - Type the phone number
4. **Press Enter** - Submit the form
5. **Repeat** - Form automatically clears and focuses on name field

This workflow allows you to enter contacts continuously without touching the mouse!

### Features

- **Validation**: Both name and phone are required
- **Duplicate Check**: System prevents duplicate phone numbers
- **Success Toast**: Green notification when contact is saved
- **Error Toast**: Red notification for errors or duplicates
- **Contact Counter**: Shows total contacts at top of form
- **View Sheet**: Click button to open Google Sheet directly

### Keyboard Shortcuts

- `Tab` - Navigate forward between fields
- `Shift + Tab` - Navigate backward
- `Enter` - Submit form (works from any field)
- `Escape` - Dismiss toast notifications

---

## 🤝 Sharing Access to Data

To give someone access to view/edit the contacts:

1. Open your Google Sheet
2. Click **Share** button (top right)
3. Add their email address
4. Choose permission level:
   - **Viewer**: Can only view data
   - **Commenter**: Can view and add comments
   - **Editor**: Can edit the data
5. Click **Send**

They'll receive an email with a link and can access it from any device!

---

## 🏗️ Production Deployment

### Backend

```bash
cd backend
npm run build
npm start
```

Deploy to:
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean App Platform**

Set environment variables in your hosting platform's dashboard.

### Frontend

```bash
cd frontend
npm run build
```

Deploy the `dist/` folder to:
- **Vercel**
- **Netlify**
- **Cloudflare Pages**
- **AWS S3 + CloudFront**

Update the API proxy in `vite.config.ts` to point to your production backend URL.

---

## 🐛 Troubleshooting

### Backend won't start

- Check if Google Sheets credentials are correct in `.env`
- Verify the spreadsheet is shared with service account email
- See [backend/GOOGLE_SHEETS_SETUP.md](backend/GOOGLE_SHEETS_SETUP.md) for detailed troubleshooting

### Frontend can't connect to backend

- Ensure backend is running on port 5000
- Check Vite proxy configuration in `vite.config.ts`
- Verify no CORS issues in browser console

### "Permission denied" error

- Make sure you shared the Google Sheet with the service account email
- Check that the service account has "Editor" access

### Data not appearing in sheet

- Verify `GOOGLE_SPREADSHEET_ID` is correct
- Check that sheet tab is named "Contacts"
- Look at backend logs for error messages

---

## 📝 Environment Variables

### Backend `.env`

```env
PORT=5000
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

See [backend/GOOGLE_SHEETS_SETUP.md](backend/GOOGLE_SHEETS_SETUP.md) for how to get these values.

---

## 🔒 Security

- ✅ Never commit `.env` file to Git (already in `.gitignore`)
- ✅ Keep JSON credentials file secure
- ✅ Don't share the service account private key
- ✅ Use platform environment variables in production
- ✅ Set appropriate permissions on the Google Sheet
- ✅ Consider rotating credentials periodically

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - feel free to use this project for any purpose.

---

## 🙏 Credits

Built with:
- [Express](https://expressjs.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sonner](https://sonner.emilkowal.ski/)

---

## 📞 Support

For issues or questions:
1. Check [backend/GOOGLE_SHEETS_SETUP.md](backend/GOOGLE_SHEETS_SETUP.md) for setup help
2. Review the troubleshooting section above
3. Open an issue on GitHub

---

**Built with ❤️ for Grace Champions**

*Perfect for events, registrations, sign-ups, and any situation where you need fast data collection with easy access for non-technical users!*
