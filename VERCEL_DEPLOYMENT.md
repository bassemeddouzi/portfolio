# 🚀 Vercel Deployment Guide - Step by Step

This guide will walk you through deploying your Portfolio application to Vercel.

## 📋 Prerequisites

- ✅ GitHub account (or GitLab/Bitbucket)
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ PostgreSQL database (we'll use Vercel Postgres or external provider)

---

## Step 1: Prepare Your Code Repository

### 1.1 Push to GitHub

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket):

```bash
# If not already initialized
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

### 1.2 Verify Build Locally

Test that your build works:

```bash
npm run build
```

If the build succeeds, you're ready to deploy!

---

## Step 2: Set Up Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in (you can use GitHub to sign in)
3. Complete the onboarding process

---

## Step 3: Deploy Your Project

### Option A: Deploy via Vercel Dashboard (Recommended for First Time)

1. **Import Project**
   - Click "Add New..." → "Project"
   - Import your Git repository
   - Select your repository from the list

2. **Configure Project**
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

3. **Click "Deploy"** (don't add environment variables yet - we'll do that next)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

---

## Step 4: Set Up Database

You have two options for PostgreSQL:

### Option A: Vercel Postgres (Easiest - Recommended)

1. **In your Vercel project dashboard:**
   - Go to the "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose a plan (Hobby plan is free for small projects)
   - Click "Create"

2. **Get Connection Details:**
   - After creation, go to the "Storage" tab
   - Click on your Postgres database
   - Go to the ".env.local" tab
   - You'll see connection details like:
     ```
     POSTGRES_URL=postgres://...
     POSTGRES_PRISMA_URL=postgres://...
     POSTGRES_URL_NON_POOLING=postgres://...
     POSTGRES_USER=...
     POSTGRES_HOST=...
     POSTGRES_PASSWORD=...
     POSTGRES_DATABASE=...
     ```

3. **Extract Individual Values:**
   - `POSTGRES_HOST` → Use for `DB_HOST`
   - `POSTGRES_USER` → Use for `DB_USER`
   - `POSTGRES_PASSWORD` → Use for `DB_PASSWORD`
   - `POSTGRES_DATABASE` → Use for `DB_NAME`
   - Port is usually `5432` → Use for `DB_PORT`
   - Set `DB_SSL=true` (Vercel Postgres requires SSL)

### Option B: External PostgreSQL Provider

Use any PostgreSQL provider:
- **Neon** (free tier available): [neon.tech](https://neon.tech)
- **Supabase** (free tier): [supabase.com](https://supabase.com)
- **Railway**: [railway.app](https://railway.app)
- **AWS RDS**
- **Any other PostgreSQL provider**

Get connection details from your provider:
- Host
- Port (usually 5432)
- Database name
- Username
- Password
- SSL requirement (usually `true` for cloud providers)

---

## Step 5: Configure Environment Variables

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Environment Variables"

2. **Add the following variables:**

   | Variable Name | Value | Notes |
   |--------------|-------|-------|
   | `DB_HOST` | Your database host | From Step 4 |
   | `DB_PORT` | `5432` | Usually 5432 |
   | `DB_NAME` | Your database name | From Step 4 |
   | `DB_USER` | Your database username | From Step 4 |
   | `DB_PASSWORD` | Your database password | From Step 4 |
   | `DB_SSL` | `true` | Set to `true` for Vercel Postgres or cloud providers |
   | `NEXTAUTH_URL` | `https://your-app.vercel.app` | Replace with your actual Vercel URL |
   | `NEXTAUTH_SECRET` | Generate a random string | See below |
   | `NODE_ENV` | `production` | Set to production |

3. **Generate NEXTAUTH_SECRET:**

   **On Windows (PowerShell):**
   ```powershell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
   ```

   **On Mac/Linux:**
   ```bash
   openssl rand -base64 32
   ```

   **Or use an online generator:**
   - Visit: https://generate-secret.vercel.app/32
   - Copy the generated secret

4. **Set Environment for Each Variable:**
   - For each variable, select:
     - ✅ Production
     - ✅ Preview
     - ✅ Development (optional)

5. **Click "Save"**

---

## Step 6: Initialize Database

Since the `/api/init` endpoint is disabled in production, you need to initialize the database manually.

### Option 1: Use Vercel Postgres SQL Editor

1. Go to your Vercel project → Storage → Postgres
2. Click on "Data" or "SQL Editor" tab
3. Run the initialization script (see below)

### Option 2: Use a Database Client

Connect to your database using:
- **pgAdmin**
- **DBeaver**
- **TablePlus**
- **VS Code PostgreSQL extension**
- **Any PostgreSQL client**

### Option 3: Create a Migration Script

Create a temporary API route or use the existing `scripts/init-db.js` script locally with production credentials.

### Database Initialization SQL

You can run this SQL to create tables (or use Sequelize sync):

```sql
-- This is a simplified version. Your actual schema might differ.
-- It's better to use the init-db.js script or Sequelize sync.

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create other tables (About, Skills, Projects, Experiences, Settings)
-- Refer to your models for the exact schema
```

**Recommended:** Use the `scripts/init-db.js` script locally with production database credentials (temporarily) to initialize:

```bash
# Set production env vars temporarily
$env:DB_HOST="your-production-host"
$env:DB_PORT="5432"
$env:DB_NAME="your-db-name"
$env:DB_USER="your-username"
$env:DB_PASSWORD="your-password"
$env:DB_SSL="true"

# Run init script
node scripts/init-db.js
```

**⚠️ Important:** After initialization, create an admin user and change the default password!

---

## Step 7: Redeploy with Environment Variables

1. **Trigger a new deployment:**
   - Go to "Deployments" tab
   - Click the "..." menu on the latest deployment
   - Click "Redeploy"
   - Or push a new commit to trigger automatic deployment

2. **Verify the deployment:**
   - Check the build logs for any errors
   - Ensure all environment variables are loaded

---

## Step 8: Verify Your Deployment

1. **Visit your site:**
   - Go to `https://your-app.vercel.app`
   - Check if the homepage loads

2. **Test API endpoints:**
   - Try accessing `/api/about` (should return data or empty)
   - Check browser console for errors

3. **Test Admin Panel:**
   - Visit `/admin/login`
   - Log in with your admin credentials
   - Verify you can access the dashboard

4. **Check Vercel Logs:**
   - Go to "Deployments" → Click on deployment → "Functions" tab
   - Check for any runtime errors

---

## Step 9: Set Up Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to "Settings" → "Domains"
   - Add your domain
   - Follow DNS configuration instructions

2. **Update NEXTAUTH_URL:**
   - Update the `NEXTAUTH_URL` environment variable to your custom domain
   - Redeploy

---

## 🔧 Troubleshooting

### Build Fails

**Error: Missing environment variables**
- ✅ Ensure all required env vars are set in Vercel
- ✅ Check variable names match exactly (case-sensitive)
- ✅ Redeploy after adding variables

**Error: TypeScript errors**
- ✅ Run `npm run build` locally to check for errors
- ✅ Fix any TypeScript issues before deploying

### Runtime Errors

**Error: Database connection failed**
- ✅ Verify database credentials are correct
- ✅ Check `DB_SSL` is set to `true` for Vercel Postgres
- ✅ Ensure database allows connections from Vercel IPs
- ✅ Check database is running and accessible

**Error: NEXTAUTH_SECRET is required**
- ✅ Generate and set `NEXTAUTH_SECRET` in environment variables
- ✅ Ensure it's set for Production environment

**Error: API routes return 500**
- ✅ Check Vercel function logs
- ✅ Verify database connection
- ✅ Ensure API routes have `export const dynamic = 'force-dynamic'`

### Database Issues

**Tables don't exist**
- ✅ Initialize database using one of the methods in Step 6
- ✅ Check database connection is working

**Can't connect to database**
- ✅ Verify all connection details are correct
- ✅ Check if database requires SSL (`DB_SSL=true`)
- ✅ Ensure database firewall allows Vercel IPs (if applicable)

---

## 📝 Quick Reference: Environment Variables

```env
# Database (Required)
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_SSL=true

# NextAuth (Required)
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here

# Node Environment (Optional but recommended)
NODE_ENV=production
```

---

## ✅ Post-Deployment Checklist

- [ ] Site loads successfully
- [ ] Database connection works
- [ ] API endpoints respond correctly
- [ ] Admin panel accessible
- [ ] Admin user created with secure password
- [ ] Default credentials changed
- [ ] SSL/HTTPS working
- [ ] Environment variables set correctly
- [ ] No errors in Vercel logs
- [ ] Custom domain configured (if applicable)

---

## 🎉 You're Done!

Your portfolio should now be live on Vercel! 

**Next Steps:**
- Monitor your deployment in Vercel dashboard
- Set up error tracking (Sentry, etc.)
- Configure automatic deployments from Git
- Set up database backups
- Update your README with the live URL

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 💡 Pro Tips

1. **Automatic Deployments:** Vercel automatically deploys on every push to your main branch
2. **Preview Deployments:** Every pull request gets a preview deployment URL
3. **Environment Variables:** Use different values for Production, Preview, and Development
4. **Database Backups:** Set up regular backups for your production database
5. **Monitoring:** Use Vercel Analytics and Logs to monitor your application
6. **Performance:** Vercel automatically optimizes Next.js apps with edge functions

---

**Need Help?** Check the [Vercel Community](https://github.com/vercel/vercel/discussions) or your project's deployment logs.

