# 🤖 Using This Project in Cursor AI

Cursor is an AI-powered code editor based on VS Code. It can edit code, run commands, and answer questions about your codebase.

## 📥 Opening the Project

1. Download and install Cursor: https://cursor.com
2. Open Cursor → **File → Open Folder** → select the `wedding-hall-management/` folder
3. Cursor will index the codebase (takes ~30 seconds the first time)

## 🚀 First-Time Setup in Cursor

Open the integrated terminal (**Ctrl/Cmd + `**) and run:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Set up backend environment
cp .env.example .env
# Now edit .env in Cursor — set MONGO_URI and JWT_SECRET

# Create the initial owner account
npm run create-owner

# Start the backend
npm start
```

Open a second terminal tab for the frontend:
```bash
cd frontend
npm run dev   # auto-rebuilds when you save changes
```

In a third tab (optional, for testing):
```bash
cd frontend
npm run serve   # serves http://localhost:5000
```

## 💬 Useful AI Prompts for Cursor

Once the project is open, use **Ctrl/Cmd + K** (inline edit) or **Ctrl/Cmd + L** (chat) to ask Cursor:

### Adding features
- *"Add a new field 'venue manager' to the booking form in src/app.jsx"*
- *"Add a route POST /api/bookings/:id/notes to backend/routes/data.js"*
- *"Create a new report that shows top 5 customers by total spending"*

### Fixing bugs
- *"The discount field isn't being saved when editing a booking — find and fix it"*
- *"Make the search bar case-insensitive"*

### Refactoring
- *"Split src/app.jsx into multiple files by module (BookingModule, BillingModule, etc.)"*
- *"Extract the date formatting helpers into a separate utils file"*

### Understanding the code
- *"Where is the booking total calculated?"*
- *"Explain how cloud sync works between frontend and backend"*
- *"What does the migrateUsers function do and where is it called?"*

## 📂 What Files to Edit

| Want to change…                | Edit this file                                |
|--------------------------------|-----------------------------------------------|
| Anything in the UI             | `frontend/src/app.jsx`                        |
| API endpoints                  | `backend/routes/*.js`                         |
| Database schema                | `backend/models/*.js`                         |
| Auth / JWT logic               | `backend/middleware/auth.js`                  |
| Initial users                  | `backend/scripts/seed.js`                     |
| Color theme                    | `frontend/src/app.jsx` (search for `:root {`) |

## 🧪 After Editing

The frontend uses esbuild. When you save changes to `src/app.jsx`:

- If `npm run dev` is running → auto-rebuilds in <1 second
- Otherwise → run `npm run build` manually

Refresh your browser to see changes.

## ⚠️ Important Notes

- **`src/app.jsx` is a single large file (~6300 lines).** Cursor handles this fine, but if you ask it to "rewrite the whole file" it may struggle. Instead, ask for specific changes: *"In the BookingModule, change X to Y"*.
- **Don't commit `.env`** — it contains secrets. The `.gitignore` already excludes it.
- **The customer's data is stored separately** — code changes don't affect their bookings, customers, etc. See `HOW-TO-UPDATE.md`.

## 🐛 Common Cursor Issues

| Issue                                  | Fix                                                                     |
|----------------------------------------|-------------------------------------------------------------------------|
| Cursor doesn't see new files           | **File → Revert to Saved**, or restart Cursor                           |
| Type-checking errors on JSX            | Add `// @ts-nocheck` to the top of `app.jsx` (it's plain JSX, not TSX)  |
| Terminal can't find npm                | Install Node.js v18+ from https://nodejs.org                            |
| Mongoose deprecation warnings          | Safe to ignore, or update Mongoose version in `package.json`            |

Happy building! 🛠
