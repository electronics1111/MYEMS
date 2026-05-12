# 🤖 Using This Project in Cursor AI

Cursor is an AI-powered code editor based on VS Code. It can edit code, run commands, and answer questions about your codebase.

## 📥 Opening the Project

1. Download and install Cursor: https://cursor.com
2. Open Cursor → **File → Open Folder** → select the `wedding-hall-management/` folder
3. Cursor will index the codebase (takes ~30 seconds the first time)

## 🚀 First-Time Setup in Cursor

### Step 1 — Install MySQL on your machine

Don't have MySQL yet?

| OS      | How                                                           |
|---------|---------------------------------------------------------------|
| Windows | Install [XAMPP](https://www.apachefriends.org/) — easiest. Start the MySQL service from XAMPP control panel. |
| macOS   | `brew install mysql && brew services start mysql`             |
| Linux   | `sudo apt install mysql-server && sudo systemctl start mysql` |

Verify MySQL works:
```bash
mysql -u root -p
# Enter password (blank for XAMPP default)
# You should see the mysql> prompt
exit
```

### Step 2 — Install project dependencies

Open the integrated terminal in Cursor (**Ctrl/Cmd + `**):

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### Step 3 — Configure backend

```bash
cd backend
cp .env.example .env
```

Open `.env` in Cursor and set:
- `DB_PASSWORD` — your MySQL root password (blank for XAMPP default)
- `JWT_SECRET` — any long random string for now (e.g. `dev-secret-jalalkhan-2026`)
- Leave the rest as default

### Step 4 — Create database & owner

```bash
cd backend
npm run create-db      # Creates wedding_hall_db
npm run create-owner   # Creates owner@jalalkhan.com / changeme123
npm start              # Starts server on http://localhost:4000
```

### Step 5 — Run the frontend (in a new terminal)

```bash
cd frontend
API_BASE_URL=http://localhost:4000/api npm run build
npm run serve
```

Open `http://localhost:5000` — log in with `owner@jalalkhan.com` / `changeme123`.

## 💬 Useful AI Prompts for Cursor

Once the project is open, use **Ctrl/Cmd + K** (inline edit) or **Ctrl/Cmd + L** (chat) to ask Cursor:

### Database queries
- *"Add a new model for 'Transactions' with columns: id, bookingId, amount, type, date"*
- *"Write a Sequelize query to find all bookings for a specific hall in the past 30 days"*
- *"Add an index on the bookings.eventDate field"*

### Adding features
- *"Add a new field 'venue manager' to the booking form in src/app.jsx"*
- *"Add a route POST /api/bookings/:id/notes to backend/routes/data.js"*
- *"Create a new report that shows top 5 customers by total spending"*

### Fixing bugs
- *"The discount field isn't being saved when editing a booking — find and fix it"*
- *"Make the search bar case-insensitive"*

### Database admin
- *"Write a script to export all bookings to a CSV file"*
- *"Add a migration to rename the 'username' column to 'email' if needed"*
- *"Show me how to back up the MySQL database from command line"*

### Understanding the code
- *"Where is the booking total calculated?"*
- *"Explain how cloud sync works between frontend and backend"*
- *"What's stored in the app_data table?"*

## 📂 What Files to Edit

| Want to change…                | Edit this file                                |
|--------------------------------|-----------------------------------------------|
| Anything in the UI             | `frontend/src/app.jsx`                        |
| API endpoints                  | `backend/routes/*.js`                         |
| Database tables                | `backend/models/*.js`                         |
| Auth / JWT logic               | `backend/middleware/auth.js`                  |
| Initial users                  | `backend/scripts/seed.js`                     |
| MySQL connection settings      | `backend/db.js` and `backend/.env`            |
| Color theme                    | `frontend/src/app.jsx` (search for `:root {`) |

## 🧪 After Editing

The frontend uses esbuild. When you save changes to `src/app.jsx`:

- If `npm run dev` is running → auto-rebuilds in <1 second
- Otherwise → run `npm run build` manually

The backend uses nodemon when run with `npm run dev` — auto-restarts on file save.

Refresh your browser to see frontend changes.

## 🗄 MySQL Tips for Cursor Users

### Browsing data visually

- **XAMPP users:** open `http://localhost/phpmyadmin` → select `wedding_hall_db`
- **MySQL Workbench:** free official GUI tool — https://dev.mysql.com/downloads/workbench/
- **TablePlus:** beautiful paid tool with free trial — https://tableplus.com

### Adding a new table from Cursor

1. Ask Cursor: *"Create a new Sequelize model called 'Booking' with these fields..."*
2. Cursor generates `backend/models/Booking.js`
3. Import it in `server.js` (so Sequelize knows about it)
4. Restart the backend — `sequelize.sync()` creates the table automatically

### Changing an existing table

If you add a column to a model, Sequelize doesn't auto-add it to existing tables. Two options:

**Option A (development only):** drop and recreate the table:
```javascript
// Add this temporarily to server.js, run once, then remove:
await sequelize.sync({ alter: true });  // Adds/changes columns to match models
```

**Option B (production-safe):** write a migration script in `backend/scripts/`:
```javascript
await sequelize.query("ALTER TABLE bookings ADD COLUMN venue_manager VARCHAR(255)");
```

⚠️ **Never use `sync({ force: true })` in production — it DROPS all tables.**

## ⚠️ Important Notes

- **`src/app.jsx` is a single large file (~6300 lines).** Cursor handles this fine, but if you ask it to "rewrite the whole file" it may struggle. Instead, ask for specific changes: *"In the BookingModule, change X to Y"*.
- **Don't commit `.env`** — it contains DB passwords and JWT secrets. The `.gitignore` excludes it.
- **The customer's data is stored in MySQL** — code changes don't affect their bookings, customers, etc. See `HOW-TO-UPDATE.md`.
- **MySQL must be running for the backend to start.** Forgot? `brew services start mysql` (Mac) or start the XAMPP MySQL service (Windows).

## 🐛 Common Cursor Issues

| Issue                                  | Fix                                                                     |
|----------------------------------------|-------------------------------------------------------------------------|
| Cursor doesn't see new files           | **File → Revert to Saved**, or restart Cursor                           |
| Type-checking errors on JSX            | Add `// @ts-nocheck` to top of `app.jsx` (it's plain JSX, not TSX)      |
| Terminal can't find npm                | Install Node.js v18+ from https://nodejs.org                            |
| "Access denied for user 'root'"        | Wrong MySQL password in .env                                            |
| "ECONNREFUSED" on backend start        | MySQL isn't running. Start it.                                          |
| Sequelize deprecation warnings         | Safe to ignore                                                          |

Happy building! 🛠
