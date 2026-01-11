# Grace Champions Frontend

React + Vite + TypeScript frontend for the contact data entry system.

## Features

- ✅ Clean, modern form interface
- ✅ Two fields: Name and Phone
- ✅ Auto-focus after submission for rapid data entry
- ✅ Real-time validation
- ✅ Duplicate phone number prevention
- ✅ Toast notifications for feedback
- ✅ Excel export button
- ✅ Contact counter
- ✅ Keyboard-friendly navigation

## Tech Stack

- **Vite** - Lightning-fast build tool
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Beautiful component library
- **Radix UI** - Accessible primitives

## Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

3. **Make sure the backend is running:**
   The frontend expects the backend API at `http://localhost:5000`

## Development

The Vite dev server includes a proxy configuration that forwards `/api/*` requests to the backend server at `http://localhost:5000`.

### File Structure

```
src/
├── components/
│   ├── ui/                 # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── card.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   └── ContactForm.tsx     # Main form component
├── hooks/
│   └── use-toast.ts        # Toast notification hook
├── lib/
│   └── utils.ts            # Utility functions
├── App.tsx                 # Root component
├── main.tsx                # Entry point
└── index.css               # Global styles
```

## Usage

### Rapid Data Entry

1. Enter name
2. Press `Tab` to move to phone field
3. Enter phone number
4. Press `Enter` to save
5. Form automatically clears and focuses on name field
6. Repeat for next contact

### Keyboard Shortcuts

- **Tab** - Navigate between fields
- **Enter** - Submit form (from any field)
- **Escape** - Dismiss toast notifications

### Features

- **Validation**: Both fields are required
- **Duplicate Prevention**: Phone numbers are checked for duplicates
- **Success Feedback**: Green toast notification when contact is saved
- **Error Feedback**: Red toast notification for errors or duplicates
- **Contact Counter**: Shows total number of contacts in database
- **Excel Export**: Click button to download all contacts

## Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## API Integration

The frontend communicates with the backend API:

- `POST /api/contacts` - Save new contact
- `GET /api/contacts/count` - Get total count
- `GET /api/contacts/export` - Download Excel file
