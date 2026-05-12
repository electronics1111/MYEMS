# 📤 How to Push Updates to Your Customer

This explains how to update the software after you've already delivered it.

## ✅ Key Promise: Customer Data is Safe

When you push code updates, **the customer's data is NOT affected**:
- Their bookings, customers, expenses → stay
- Their staff, suppliers, halls → stay
- Their login credentials → stay
- Only the **app code** changes

**Why?** The app code lives in the HTML file. The customer's data lives separately in either:
- Their browser's localStorage (standalone mode), OR
- Your MongoDB database (cloud mode)

Updating the HTML doesn't touch either.

## 🔄 The Update Workflow

### Step 1 — Make code changes in Cursor

Edit `frontend/src/app.jsx` (or backend files for API changes).

### Step 2 — Build the new HTML

```bash
cd frontend
npm run build
```

This produces a fresh `dist/wedding-hall-management.html`.

### Step 3 — Test locally

```bash
npm run serve
# Open http://localhost:5000 — verify your changes work
```

If using cloud mode, also test against your actual backend:
```bash
API_BASE_URL=https://your-backend.railway.app/api npm run build
npm run serve
```

### Step 4 — Push to GitHub

```bash
cd ..   # back to project root
git add .
git commit -m "Update: added [your feature description]"
git push
```

If you're using GitHub Pages, also copy the HTML to wherever it's hosted:

```bash
cp frontend/dist/wedding-hall-management.html /path/to/github-pages-repo/
cd /path/to/github-pages-repo/
git add wedding-hall-management.html
git commit -m "Update v1.0.1"
git push
```

### Step 5 — Wait 1-2 minutes

GitHub Pages takes 1-2 minutes to publish. After that, the URL serves the new file.

### Step 6 — The customer sees the update

On their next page load (or refresh), the browser fetches the new HTML.

⚠️ **Browser caching gotcha:** Browsers may cache the OLD HTML aggressively. If the customer reports "I don't see the update":
- Tell them to do a hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
- OR add `?v=2` to the URL (cache-bust query string)
- OR build with an auto-update banner (see "Auto-Update Banner" section below)

## ⚠️ When Data Structure Changes

Sometimes a code change needs new data fields. Examples:
- Adding `customerEmail` field to bookings
- Renaming `username` to `email`
- Adding a new `vipStatus` flag to customers

### Backward compatibility (recommended)

Write code that handles both old and new data:

```javascript
// Old data may not have 'email' field — fall back to deriving from username
const email = user.email || (user.username ? `${user.username}@example.com` : "");
```

We did this when we added email to users — the `migrateUsers` function auto-fills missing emails.

### Forward migration (if needed)

If you can't make it backward compatible, write a migration script:

```javascript
// backend/scripts/migrate-add-email.js
const User = require("../models/User");
await User.updateMany(
  { email: { $exists: false } },
  [{ $set: { email: { $concat: ["$username", "@jalalkhan.com"] } } }]
);
```

Run it once after deploying: `node scripts/migrate-add-email.js`

## 🔔 Auto-Update Banner (Optional)

To notify customers automatically when an update is available, you can add a version checker:

1. Add this to `frontend/src/app.jsx`:
   ```javascript
   const APP_VERSION = "1.0.1";  // bump this on every release
   ```

2. Create `frontend/dist/version.json` (alongside the HTML):
   ```json
   {
     "version": "1.0.1",
     "releaseDate": "2026-05-15",
     "notes": "Added new export feature, fixed calendar bug"
   }
   ```

3. The frontend already has logic to:
   - Check `version.json` on load
   - Compare with `APP_VERSION` baked into the HTML
   - Show a banner if newer version available
   - Force a hard reload when customer clicks "Update Now"

So your workflow becomes:
1. Edit code → bump `APP_VERSION`
2. Build HTML
3. Update `version.json` with same version
4. Push both to GitHub
5. Customer auto-sees the banner

## 📋 Version Numbering

Use semantic versioning: `MAJOR.MINOR.PATCH`

- `1.0.0` → `1.0.1` — Bug fix or tiny tweak
- `1.0.0` → `1.1.0` — New feature added
- `1.0.0` → `2.0.0` — Major redesign or breaking change

## 🆘 What If Customer's Data Breaks After Update?

This usually means a data structure mismatch.

**Recovery steps:**
1. Customer goes to **Admin → Data Backup → Download Backup File** (do this BEFORE accepting updates)
2. If new version breaks data → restore from the backup
3. You fix the migration bug in the code
4. Push fixed version

**Prevention:**
- Test the new version against a copy of customer's data first
- Never rename or remove fields without a migration path
- Always make field additions optional (use `|| default` patterns)

## 💡 Tips

- Keep a CHANGELOG.md noting what each version changed
- Test on a fresh browser (incognito mode) to simulate first-time use
- Test on the customer's exact data structure if possible (ask them for a backup)
- Don't push updates on Fridays — if something breaks, you can't fix it until Monday
- Tag releases in git: `git tag v1.0.1 && git push --tags`
