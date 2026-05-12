# ✦ Jalal Khan — Wedding Hall Management System

Full-stack project for managing multiple wedding halls — bookings, billing, expenses, staff, vendors, suppliers, inventory, reports, and more.

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
└── backend/                   ← Express + MongoDB API
    ├── package.json
    ├── server.js              ← Main entry
    ├── .env.example
    ├── models/
    │   ├── User.js            ← Email + bcrypt password
    │   └── AppData.js         ← All app data (bookings, halls, etc.)
    ├── routes/
    │   ├── auth.js            ← Login, change-password
    │   ├── users.js           ← Owner-only user management
    │   └── data.js            ← Get / save app data
    ├── middleware/
    │   └── auth.js            ← JWT verification
    └── scripts/
        ├── create-owner.js    ← Bootstrap initial owner
        ├── seed.js            ← Create 4 default users
        └── reset-owner-password.js  ← Recovery script
```

## 🚀 Quick Start

### Option 1 — Frontend only (localStorage, no backend)

This is the simplest. The customer's data lives in their browser. No server needed.

```bash
cd frontend
npm install
npm run build
```

Open `frontend/dist/wedding-hall-management.html` in any browser. That's it.

### Option 2 — Full-stack (frontend + backend + MongoDB)

This adds cloud sync, so the same data is accessible from any device.

**1. Backend setup:**
```bash
cd backend
npm install
cp .env.example .env             # then edit .env with your MongoDB URI & JWT secret
npm run create-owner             # creates the first owner account
npm start                        # or  npm run dev  for auto-reload
```

Backend now running on `http://localhost:4000`

**2. Frontend setup (point it at the backend):**
```bash
cd frontend
npm install

# Edit .env to set API_BASE_URL (or set inline):
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
| Create initial owner          | `cd backend && npm run create-owner`               |
| Seed all 4 default users      | `cd backend && npm run seed`                       |
| Reset owner password          | `cd backend && npm run reset-owner-password`       |

## 📚 Next Steps

- [CURSOR_AI_SETUP.md](./CURSOR_AI_SETUP.md) — Using this project in Cursor with AI assistance
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Deploying frontend + backend to production
- [HOW-TO-UPDATE.md](./HOW-TO-UPDATE.md) — Pushing updates to your customer

## 🆘 Troubleshooting

- **MongoDB connection error** — verify `MONGO_URI` in `backend/.env`. For MongoDB Atlas, whitelist your IP.
- **CORS error** — verify backend is running on the URL the frontend points to via `API_BASE_URL`.
- **Build fails** — ensure Node.js v18+ is installed: `node --version`
- **Owner forgot password** — SSH into server, run `npm run reset-owner-password` from `backend/`

---

Built with care for Pakistani wedding businesses. 🇵🇰
