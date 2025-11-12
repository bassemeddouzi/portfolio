# 🚀 Deployment Guide

This guide will help you deploy your Portfolio application to production.

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud provider)
- Git repository
- Deployment platform account (Vercel, Netlify, Railway, etc.)

## 🔧 Pre-Deployment Checklist

### 1. Environment Variables

Ensure all required environment variables are set in your deployment platform:

#### Required Variables:
- `DB_HOST` - Database host URL
- `DB_PORT` - Database port (usually 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `NEXTAUTH_URL` - Your production URL (e.g., `https://yourdomain.com`)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

#### Optional Variables:
- `DB_SSL` - Set to `true` if your database requires SSL (e.g., Vercel Postgres, AWS RDS)
- `NODE_ENV` - Set to `production` in production

### 2. Database Setup

1. **Create a PostgreSQL database** on your provider:
   - Vercel Postgres
   - AWS RDS
   - Railway
   - Supabase
   - Neon
   - Or any other PostgreSQL provider

2. **Get connection details**:
   - Host
   - Port
   - Database name
   - Username
   - Password
   - SSL requirement

3. **Initialize the database**:
   - The database will be automatically initialized on first run if using the `/api/init` endpoint (development only)
   - For production, you can:
     - Run migrations manually
     - Use a database initialization script
     - Use Sequelize migrations (recommended)

### 3. Security Considerations

- ✅ Change default admin credentials (`admin@example.com` / `admin123`)
- ✅ Use a strong `NEXTAUTH_SECRET`
- ✅ Enable SSL for database connections in production
- ✅ Set `NODE_ENV=production`
- ✅ Use environment variables for all sensitive data
- ✅ The `/api/init` endpoint is disabled in production

## 🌐 Deployment Platforms

### Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables**:
   - Go to your project settings on Vercel
   - Navigate to "Environment Variables"
   - Add all required variables

4. **Database**:
   - Use Vercel Postgres (recommended) or external PostgreSQL
   - If using Vercel Postgres, enable SSL and use the provided connection string
   - Set `DB_SSL=true` if using Vercel Postgres

5. **Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Railway

1. **Connect your repository** to Railway
2. **Add PostgreSQL** service
3. **Set environment variables**:
   - Railway automatically provides database connection variables
   - Add `NEXTAUTH_URL` and `NEXTAUTH_SECRET`
4. **Deploy**: Railway will automatically detect Next.js and deploy

### Netlify

1. **Connect your repository** to Netlify
2. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Set environment variables** in Netlify dashboard
4. **Note**: Netlify may require additional configuration for serverless functions

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t portfolio .
docker run -p 3000:3000 --env-file .env portfolio
```

## 🔄 Database Migration

### Option 1: Automatic (Development Only)
Visit `/api/init` in development to automatically create tables and default admin user.

### Option 2: Manual Migration
Run the migration script:
```bash
node scripts/init-db.js
```

### Option 3: Sequelize Migrations (Recommended)
Create migration files and run them before deployment.

## ✅ Post-Deployment

1. **Verify deployment**:
   - Check that the site loads
   - Test API endpoints
   - Verify database connection

2. **Initialize admin user**:
   - Create an admin user through the database or admin panel
   - Change default credentials

3. **Monitor**:
   - Check logs for errors
   - Monitor database connections
   - Set up error tracking (Sentry, etc.)

## 🐛 Troubleshooting

### Build Errors

- **Type errors**: Run `npm run build` locally to check for TypeScript errors
- **Missing environment variables**: Ensure all required variables are set
- **Database connection**: Verify database credentials and network access

### Runtime Errors

- **Database connection failed**: Check database credentials and SSL settings
- **Authentication errors**: Verify `NEXTAUTH_SECRET` is set correctly
- **API routes not working**: Check that routes are marked as dynamic (`export const dynamic = 'force-dynamic'`)

### Common Issues

1. **"Missing required environment variables"**:
   - Check that all required variables are set in your deployment platform
   - Verify variable names match exactly

2. **"Database connection timeout"**:
   - Check database host and port
   - Verify network access (firewall, VPN, etc.)
   - Check SSL settings if required

3. **"NEXTAUTH_SECRET is required"**:
   - Generate a new secret: `openssl rand -base64 32`
   - Set it in your environment variables

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html)

## 🔒 Security Best Practices

1. **Never commit** `.env` files
2. **Use strong passwords** for database and admin accounts
3. **Enable SSL** for database connections in production
4. **Rotate secrets** periodically
5. **Use environment variables** for all configuration
6. **Disable development endpoints** in production (already done for `/api/init`)
7. **Keep dependencies updated**: Run `npm audit` regularly
8. **Use HTTPS** for your production domain

## 📝 Notes

- The `/api/init` endpoint is automatically disabled in production
- All API routes using authentication are marked as dynamic
- Database connection includes SSL support for cloud providers
- Environment variables are validated on startup

