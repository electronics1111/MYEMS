# ✦ Jalal Khan — Wedding Hall Management System

Full-stack project for managing multiple wedding halls — bookings, billing, expenses, staff, vendors, suppliers, inventory, reports, and more.

**Stack:** Frontend (React bundled into single HTML) + Backend (Express + MySQL via Sequelize)

## 📁 Project Structure

```
wedding-hall-management/
├── README.md                  ← This file
├── CURSOR_AI_SETUP.md         ← How to open & use this project in Cursor
├── DEPLOYMENT.md              ← How to deploy frontend + backend live
├── HOW-TO-UPDATE.md           ← How to push updates to your customer
├── .gitignore
│
├── frontend/                  ← The web app (React, bundled into single HTML)
│   ├── package.json
│   ├── build.js               ← Bundles src/app.jsx → dist/wedding-hall-management.html
│   ├── serve.js               ← Local dev server (http://localhost:5000)
│   ├── index.html             ← HTML shell template
│   ├── .env.example
│   ├── src/
│   │   └── app.jsx            ← MAIN REACT SOURCE — edit this
│   └── dist/
│       └── wedding-hall-management.html  ← Built output (deploy this)
│
└── backend/                   ← Express + MySQL API
    ├── package.json
    ├── server.js              ← Main entry
    ├── db.js                  ← Sequelize connection setup
    ├── .env.example
    ├── models/
    │   ├── User.js            ← Email + bcrypt password
    │   └── AppData.js         ← All app data (JSON column)
    ├── routes/
    │   ├── auth.js            ← Login, change-password
    │   ├── users.js           ← Owner-only user management
    │   └── data.js            ← Get / save app data
    ├── middleware/
    │   └── auth.js            ← JWT verification
    └── scripts/
        ├── create-db.js       ← Create the MySQL database
        ├── create-owner.js    ← Bootstrap initial owner
        ├── seed.js            ← Create 4 default users
        └── reset-owner-password.js  ← Recovery script
```

## 🚀 Quick Start

### Option 1 — Frontend only (localStorage, no backend, no MySQL)

The customer's data lives in their browser. No server needed. Simplest.

```bash
cd frontend
npm install
npm run build
```

Open `frontend/dist/wedding-hall-management.html` in any browser. That's it.

### Option 2 — Full-stack (Frontend + Backend + MySQL)

Adds cloud sync, so the same data is accessible from any device.

**Step 1: Install MySQL**

| OS      | How                                                           |
|---------|---------------------------------------------------------------|
| Windows | Install [XAMPP](https://www.apachefriends.org/) — includes MySQL, easiest |
| macOS   | `brew install mysql && brew services start mysql`             |
| Linux   | `sudo apt install mysql-server && sudo systemctl start mysql` |

Verify it works:
```bash
mysql -u root -p
# Enter password (blank by default for XAMPP)
# You should see the mysql> prompt
exit
```

**Step 2: Backend setup**

```bash
cd backend
npm install
cp .env.example .env             # Then edit .env with your MySQL credentials
npm run create-db                # Creates the wedding_hall_db database
npm run create-owner             # Creates the first owner account
npm start                        # Or: npm run dev for auto-reload
```

Backend now running on `http://localhost:4000`. Verify health:
```bash
curl http://localhost:4000/api/health
# Should return: {"status":"ok","database":"mysql",...}
```

**Step 3: Frontend setup (point at backend)**

```bash
cd frontend
npm install

# Build with backend URL
API_BASE_URL=http://localhost:4000/api npm run build

# Serve it
npm run serve
```

Frontend now on `http://localhost:5000`. It auto-detects the backend and uses cloud mode.

## 🔑 Default Login Credentials

After running `npm run seed`:

| Role     | Email                      | Password    |
|----------|----------------------------|-------------|
| Owner    | owner@jalalkhan.com        | owner123    |
| Manager  | mashal@jalalkhan.com       | mashal123   |
| Manager  | deewa@jalalkhan.com        | deewa123    |
| Cashier  | cashier@jalalkhan.com      | cashier123  |

⚠️ **Change these passwords immediately after first login.**

## 🛠 Common Tasks

| Task                          | Command                                            |
|-------------------------------|----------------------------------------------------|
| Build frontend                | `cd frontend && npm run build`                     |
| Watch + auto-rebuild          | `cd frontend && npm run dev`                       |
| Start backend                 | `cd backend && npm start`                          |
| Auto-reload backend           | `cd backend && npm run dev`                        |
| Create MySQL database         | `cd backend && npm run create-db`                  |
| Create initial owner          | `cd backend && npm run create-owner`               |
| Seed all 4 default users      | `cd backend && npm run seed`                       |
| Reset owner password          | `cd backend && npm run reset-owner-password`       |

## 🗄 Database Schema

Sequelize auto-creates two tables on first run:

### `users` table
| Column                | Type         | Notes                          |
|-----------------------|--------------|--------------------------------|
| id                    | INTEGER PK   | Auto-increment                 |
| email                 | VARCHAR(255) | Unique, lowercase, indexed     |
| password              | VARCHAR(255) | bcrypt hash, never exposed     |
| name                  | VARCHAR(255) | Display name                   |
| role                  | ENUM         | 'owner', 'manager', 'cashier'  |
| hallId                | VARCHAR(64)  | For hall-locked managers       |
| active                | BOOLEAN      | Disabled accounts can't log in |
| lastLoginAt           | DATETIME     | Track activity                 |
| mustChangePassword    | BOOLEAN      | Force change on next login     |
| createdAt / updatedAt | DATETIME     | Auto-managed                   |

### `app_data` table (singleton — one row only)
| Column          | Type        | Notes                                |
|-----------------|-------------|--------------------------------------|
| id              | INTEGER PK  | Always row id 1                      |
| data            | JSON        | All bookings, halls, customers, etc. |
| version         | INTEGER     | Incremented on every save            |
| lastModifiedBy  | VARCHAR(255)| Email of user who saved              |
| lastModifiedAt  | DATETIME    | When last saved                      |

## 📚 Next Steps

- [CURSOR_AI_SETUP.md](./CURSOR_AI_SETUP.md) — Using this project in Cursor with AI assistance
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Deploying frontend + backend to production
- [HOW-TO-UPDATE.md](./HOW-TO-UPDATE.md) — Pushing updates to your customer

## 🆘 Troubleshooting

**"ER_ACCESS_DENIED_ERROR"** — Wrong MySQL password. Edit `backend/.env`.

**"ECONNREFUSED"** — MySQL not running. Start it (XAMPP control panel, `brew services start mysql`, or `sudo systemctl start mysql`).

**"Unknown database"** — Run `npm run create-db` first.

**"Cannot connect to backend"** — Verify backend URL: `curl http://localhost:4000/api/health`

**"Build fails"** — Ensure Node.js v18+: `node --version`

**Owner forgot password** — SSH into server, run `cd backend && npm run reset-owner-password`

---

Built with care for Pakistani wedding businesses. 🇵🇰
