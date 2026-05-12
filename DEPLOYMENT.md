# 🚀 Deployment Guide (MySQL)

This guide walks you through deploying the system to production.

## 🗺 Recommended Architecture

```
┌──────────────────────┐         ┌──────────────────────┐         ┌──────────────────────┐
│    Customer's       │   →    │    Frontend       │   →    │    Backend       │   →    MySQL Database
│    Browser          │         │   (GitHub Pages,  │         │    (Railway,    │       (PlanetScale,
│                     │         │    Vercel,        │         │     Render,     │        Railway MySQL,
│                     │         │    Netlify)       │         │     Hostinger)  │        AWS RDS)
└──────────────────────┘         └──────────────────────┘         └──────────────────────┘
```

## 📦 Frontend Deployment

Same as before — the frontend is just static HTML:

### Option A: GitHub Pages (free)

```bash
cd frontend
API_BASE_URL=https://your-backend-url/api npm run build
cp dist/wedding-hall-management.html /path/to/github-pages-repo/
cd /path/to/github-pages-repo/
git add . && git commit -m "Update" && git push
```

### Option B: Netlify / Vercel

Connect your GitHub repo, set:
- Build command: `cd frontend && npm install && npm run build`
- Publish directory: `frontend/dist`
- Env variable: `API_BASE_URL = https://your-backend-url/api`

## 🖥 Backend Deployment

### Railway (recommended for full-stack)

Railway gives you BOTH Express hosting AND a MySQL database in one place.

1. Sign up at https://railway.app
2. Create a new project → **Add MySQL** (database service)
   - Railway auto-provisions a MySQL instance and gives you connection details
3. In the same project → **Add Service** → Deploy from GitHub → select `backend/` folder
4. Railway will auto-detect Node.js. Set these environment variables:
   - `DATABASE_URL` — copy from your Railway MySQL service (it's available as a "Variable Reference")
   - `JWT_SECRET` — generate one: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
   - `INITIAL_OWNER_EMAIL` — your owner email
   - `INITIAL_OWNER_PASSWORD` — temporary password
   - `CORS_ORIGINS` — your frontend's URL (e.g. `https://username.github.io`)
5. Railway will deploy. Once running, run these one-off commands:
   - `node scripts/create-db.js` — NOT needed on Railway (DB is auto-created)
   - `node scripts/create-owner.js` — Run via Railway's "Run command" feature

### Hostinger / shared cPanel hosting (most common in Pakistan)

Many Pakistani hosting providers (Hostinger, Bluehost) offer:
- Node.js hosting
- Built-in MySQL databases (via phpMyAdmin)

**Steps:**
1. Buy hosting that includes Node.js + MySQL
2. Create a MySQL database via cPanel:
   - Go to **MySQL Databases** in cPanel
   - Create a new database (e.g. `wedding_hall_db`)
   - Create a user, give them ALL privileges on that database
   - Note the connection details: host, port, user, password, database name
3. Upload backend code via FTP or Git
4. Create `.env` on the server with the MySQL credentials
5. SSH in (or use the hosting panel's terminal):
   ```bash
   cd ~/your-app
   npm install
   node scripts/create-owner.js
   npm start
   ```
6. Set up the app to start on boot (PM2 or your host's process manager)

### Self-hosted VPS (DigitalOcean, Linode, AWS EC2)

If you want full control:

```bash
# 1. SSH into your server
ssh root@your-server

# 2. Install Node.js and MySQL
apt update
apt install -y mysql-server
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Set up MySQL
mysql_secure_installation   # Set root password, etc.
mysql -u root -p
> CREATE DATABASE wedding_hall_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong-password-here';
> GRANT ALL PRIVILEGES ON wedding_hall_db.* TO 'app_user'@'localhost';
> FLUSH PRIVILEGES;
> exit;

# 4. Clone the backend code
git clone https://github.com/yourname/wedding-hall.git
cd wedding-hall/backend
npm install --production

# 5. Create .env
cat > .env <<EOF
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=strong-password-here
DB_NAME=wedding_hall_db
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
CORS_ORIGINS=https://your-frontend-domain.com
EOF

# 6. Bootstrap and start
npm run create-owner
npm install -g pm2
pm2 start server.js --name wedding-hall-api
pm2 startup
pm2 save
```

## 🗄 Database Hosting Options

### PlanetScale (modern MySQL, free tier)

1. Sign up at https://planetscale.com
2. Create a database (free tier: 5GB)
3. Get the connection string from "Connect" → "General" → "Node.js"
4. Use it as `DATABASE_URL` in your backend's env

⚠️ PlanetScale doesn't support FOREIGN KEY constraints natively, but our schema doesn't use them. Safe.

### Railway MySQL (easiest with Railway backend)

When you add MySQL to a Railway project, it provides a `DATABASE_URL` variable you can reference directly from your backend service. No external setup needed.

### Hostinger MySQL (cheap, traditional)

Comes with most hosting plans. Use cPanel → MySQL Databases to create.

### AWS RDS (enterprise scale)

Reliable but more setup. Use `db.t3.micro` for cheap hosting (~$15/month).

## 🔒 Production Security Checklist

Before going live with real users:

- [ ] Change `JWT_SECRET` to a long random string (NOT the default)
- [ ] Change the owner password from the default
- [ ] Set up CORS to only allow your frontend's domain (`CORS_ORIGINS` env var)
- [ ] Use HTTPS for both frontend and backend (Railway/Render/Vercel do this automatically)
- [ ] Use a strong MySQL password (not "root" with empty password!)
- [ ] Restrict MySQL access to backend's IP only (not 0.0.0.0/0)
- [ ] Set up automated daily MySQL backups (most hosts have this built-in)
- [ ] Test the "Forgot password" flow before delivery
- [ ] Test login from a different device to verify cloud sync works
- [ ] Update `INITIAL_OWNER_*` env vars to remove default placeholder values
- [ ] Enable MySQL slow query log for monitoring

## 💰 Estimated Monthly Costs

| Service                    | Free tier covers       | Paid cost          |
|----------------------------|------------------------|--------------------|
| Frontend (Vercel/Netlify)  | Forever                | $0                 |
| Backend (Railway)          | 500 hours/month free   | $5/month always-on |
| MySQL (Railway)            | Included with above    | $5/month for 1GB   |
| MySQL (PlanetScale)        | 5GB free               | $29/month for more |
| MySQL (Hostinger shared)   | Bundled with hosting   | ~$3/month total    |
| Domain (optional)          | -                      | $10/year           |
| **Total**                  | **$0 for testing**     | **~$15-30/month**  |

For a single wedding hall business, free tiers are usually plenty.

## 🔧 Database Backup & Restore

### Automated daily backups (production)

Most hosts have this built-in. Enable it in your provider's dashboard.

### Manual backup

```bash
# Export
mysqldump -h DB_HOST -u DB_USER -p DB_NAME > backup.sql

# Restore
mysql -h DB_HOST -u DB_USER -p DB_NAME < backup.sql
```

### From within the app

The "Data Backup" feature in Admin & Security lets the customer download a JSON file of all their data. That works regardless of the backend.

## 🔧 Updating After Initial Deploy

### Frontend update:
1. Make changes in `frontend/src/app.jsx`
2. `npm run build`
3. Push to GitHub — your hosting service auto-deploys
4. Customer sees update (see `HOW-TO-UPDATE.md`)

### Backend update:
1. Make changes in `backend/`
2. Push to GitHub — Railway/Render auto-deploys
3. Customer's session continues (JWT tokens survive deploys)

### Database schema changes:
- New column → add to model, restart server (`sequelize.sync()` adds it)
- Renamed/removed column → write a migration script
- Be careful: `sync({ force: true })` DROPS ALL DATA. Never use in production.

## 🆘 Troubleshooting

**"ER_ACCESS_DENIED_ERROR"** — MySQL user/password is wrong. Verify in your provider's dashboard.

**"ECONNREFUSED"** — MySQL not running or wrong host. Check `DB_HOST` and that MySQL is alive.

**"Unknown database 'wedding_hall_db'"** — Run `npm run create-db` first (or create it via cPanel/phpMyAdmin).

**"503 Service Unavailable"** — Free tier hit limits, or database connection pool exhausted. Restart the service.

**Backup not restoring** — MySQL versions don't always match. Use mysqldump from same major version as target.
