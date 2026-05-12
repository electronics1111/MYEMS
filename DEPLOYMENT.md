# 🚀 Deployment Guide

This guide walks you through deploying the system to production.

## 🗺 Recommended Architecture

```
┌──────────────────────┐         ┌──────────────────────┐         ┌──────────────────────┐
│    Customer's       │   →    │    Frontend       │   →    │    Backend       │   →    Database
│    Browser          │         │   (GitHub Pages,  │         │    (Railway,    │       (MongoDB
│                     │         │    Vercel,        │         │     Render,     │        Atlas)
│                     │         │    Netlify)       │         │     Fly.io)     │
└──────────────────────┘         └──────────────────────┘         └──────────────────────┘
```

Each box can be hosted on a different service (and many have free tiers).

## 📦 Frontend Deployment

### Option A: GitHub Pages (free, simplest, what you already have)

1. Build the frontend with your backend URL baked in:
   ```bash
   cd frontend
   API_BASE_URL=https://your-backend.railway.app/api npm run build
   ```
2. Copy `frontend/dist/wedding-hall-management.html` to your GitHub Pages repo
3. Push & wait 1-2 minutes — GitHub Pages auto-publishes

### Option B: Netlify / Vercel (free, slightly better performance)

1. Create a new project pointing at your GitHub repo
2. Set the build command: `cd frontend && npm install && npm run build`
3. Set the publish directory: `frontend/dist`
4. Set environment variable: `API_BASE_URL = https://your-backend-url/api`

## 🖥 Backend Deployment

### Railway (recommended, easiest)

1. Sign up at https://railway.app (free tier available)
2. Create a new project → Deploy from GitHub repo → select the `backend/` folder
3. Add environment variables in the Railway dashboard:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — generate one: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
   - `INITIAL_OWNER_EMAIL` — owner email
   - `INITIAL_OWNER_PASSWORD` — temporary password
4. Once deployed, Railway gives you a URL like `https://wedding-hall-production.up.railway.app`
5. Visit `https://your-url/api/health` — should return `{"status":"ok",...}`
6. Run the owner-creation script once:
   - In Railway dashboard → your service → Settings → Deploy → "Run a one-off command"
   - Command: `node scripts/create-owner.js`

### Render

Similar steps as Railway — create a Web Service, point at the `backend/` folder, set env vars.

### Fly.io / DigitalOcean / Self-hosted VPS

Same backend, deployed manually. Make sure to:
- Run `npm install --production`
- Use a process manager (PM2 or systemd)
- Set up HTTPS (Let's Encrypt + nginx reverse proxy)
- Open port 4000 (or whatever you configure)

## 🗄 Database Deployment (MongoDB Atlas — FREE tier)

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a new free cluster (M0 tier — 512MB free forever)
3. Database Access → Add new user → choose username + password
4. Network Access → Add IP Address → 0.0.0.0/0 (allows all IPs) — OR add your backend's specific IP
5. Connect → Drivers → copy the connection string. Looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/wedding-hall-db?retryWrites=true&w=majority
   ```
6. Paste this as `MONGO_URI` in your backend's env variables

## 🔒 Production Security Checklist

Before going live with real users:

- [ ] Change `JWT_SECRET` to a long random string (NOT the default)
- [ ] Change the owner password from the default
- [ ] Set up CORS to only allow your frontend's domain (edit `backend/server.js`)
- [ ] Use HTTPS for both frontend and backend (Railway/Render/Vercel do this automatically)
- [ ] Restrict MongoDB Atlas IP whitelist to your backend's IPs (not 0.0.0.0/0)
- [ ] Set up regular automated backups of your MongoDB data
- [ ] Test the "Forgot password" flow before delivery
- [ ] Test login from a different device to verify cloud sync works
- [ ] Update `INITIAL_OWNER_*` env vars to remove default placeholder values

## 💰 Estimated Monthly Costs (production-ready)

| Service           | Free tier covers       | Paid tier cost (if needed) |
|-------------------|------------------------|----------------------------|
| Frontend (Vercel) | Forever                | $0                         |
| Backend (Railway) | 500 hours/month free   | $5/month for always-on     |
| Database (Atlas)  | 512MB forever          | $9/month for 2GB           |
| Domain (optional) | -                      | $10/year                   |
| **Total**         | **$0 for testing**     | **~$15/month for production** |

For a single wedding hall business with moderate use, free tiers are usually plenty.

## 🔧 Updating After Initial Deploy

### Frontend update:
1. Make changes in `frontend/src/app.jsx`
2. `npm run build`
3. Push to GitHub — your hosting service auto-deploys
4. Customer sees update (see `HOW-TO-UPDATE.md` for details)

### Backend update:
1. Make changes in `backend/`
2. Push to GitHub — Railway/Render auto-deploys
3. Customer's session continues (JWT tokens survive deploys)

### Database changes (adding fields):
- New fields → no migration needed (Mongoose is flexible)
- Renamed/removed fields → write a migration script and run it once

## 🆘 Troubleshooting

**"Cannot connect to backend"** — verify:
- Backend URL has `/api` at the end in frontend's `API_BASE_URL`
- Backend health endpoint responds: `curl https://your-backend/api/health`
- CORS isn't blocking the frontend

**"Invalid credentials" on login** — verify:
- The owner was actually created — check MongoDB Atlas → Browse Collections → users
- Email is lowercase (the system normalizes to lowercase)

**"503 Service Unavailable"** — your free tier may have hit limits. Check provider dashboard.
