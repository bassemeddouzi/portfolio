# ✅ Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## 📋 Pre-Deployment

- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] Local build successful (`npm run build`)
- [ ] No TypeScript errors
- [ ] All dependencies installed
- [ ] `.env` file is in `.gitignore` (not committed)

## 🔐 Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

- [ ] `DB_HOST` - Database host
- [ ] `DB_PORT` - `5432`
- [ ] `DB_NAME` - Database name
- [ ] `DB_USER` - Database username
- [ ] `DB_PASSWORD` - Database password
- [ ] `DB_SSL` - `true` (for Vercel Postgres or cloud providers)
- [ ] `NEXTAUTH_URL` - Your Vercel URL (e.g., `https://your-app.vercel.app`)
- [ ] `NEXTAUTH_SECRET` - Generated secret (use PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))`)
- [ ] `NODE_ENV` - `production`

**Set for:** Production ✅ | Preview ✅ | Development (optional)

## 🗄️ Database Setup

- [ ] PostgreSQL database created (Vercel Postgres or external)
- [ ] Database connection details obtained
- [ ] Database initialized (tables created)
- [ ] Admin user created (change default credentials!)

## 🚀 Deployment Steps

- [ ] Vercel account created
- [ ] Project imported from Git repository
- [ ] Framework detected as Next.js
- [ ] Environment variables added
- [ ] First deployment completed
- [ ] Database initialized
- [ ] Redeployed with all environment variables

## ✅ Post-Deployment Verification

- [ ] Site loads at `https://your-app.vercel.app`
- [ ] Homepage displays correctly
- [ ] API endpoints work (`/api/about`, etc.)
- [ ] Admin login accessible at `/admin/login`
- [ ] Can log in to admin panel
- [ ] No errors in Vercel logs
- [ ] Database connection working
- [ ] SSL/HTTPS enabled

## 🔒 Security

- [ ] Default admin credentials changed
- [ ] Strong `NEXTAUTH_SECRET` generated
- [ ] `DB_SSL=true` for production database
- [ ] No secrets in code or committed files

## 📝 Optional

- [ ] Custom domain configured
- [ ] `NEXTAUTH_URL` updated to custom domain
- [ ] Analytics/monitoring set up
- [ ] Database backups configured

---

**Need help?** Check [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md) for detailed instructions.

