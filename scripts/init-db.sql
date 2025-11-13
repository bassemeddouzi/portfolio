-- ============================================
-- Portfolio Database Initialization SQL Script
-- ============================================
-- This script creates all necessary tables for the Portfolio application
-- Run this script in your PostgreSQL database (Neon, Supabase, etc.)
-- 
-- Usage:
--   1. Connect to your database using a SQL client (pgAdmin, DBeaver, etc.)
--   2. Or use the Neon/Supabase SQL editor
--   3. Copy and paste this entire script
--   4. Execute it
-- ============================================

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE skill_category AS ENUM ('Frontend', 'Backend', 'Outils & Technologies');

-- ============================================
-- Table: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role user_role DEFAULT 'admin',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table: abouts
-- ============================================
CREATE TABLE IF NOT EXISTS abouts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  "jobTitle" VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  "imageUrl" VARCHAR(255),
  stats JSONB DEFAULT '{}',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table: skills
-- ============================================
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
  category skill_category NOT NULL,
  icon VARCHAR(255),
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table: experiences
-- ============================================
CREATE TABLE IF NOT EXISTS experiences (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  period VARCHAR(255) NOT NULL,
  description TEXT[] NOT NULL DEFAULT '{}',
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table: projects
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  technologies VARCHAR(255)[] NOT NULL DEFAULT '{}',
  "githubUrl" VARCHAR(255),
  "demoUrl" VARCHAR(255),
  "imageUrl" VARCHAR(255),
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table: settings
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Create default admin user
-- ============================================
-- IMPORTANT: You need to generate a bcrypt hash for the password 'admin123'
-- 
-- Option 1: Run the helper script (recommended):
--   node scripts/generate-admin-hash.js
--   This will output the correct INSERT statement with the hash
-- 
-- Option 2: Generate hash manually:
--   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(h => console.log(h))"
-- 
-- Option 3: Use online tool: https://bcrypt-generator.com/
--   - Rounds: 10
--   - Password: admin123
-- 
-- Option 4: Skip this and use init-db.js script which handles hashing automatically
-- 
-- After generating the hash, uncomment and update the INSERT below:
-- ============================================
-- INSERT INTO users (email, password, name, role)
-- VALUES (
--   'admin@example.com',
--   'YOUR_BCRYPT_HASH_HERE', -- Replace with generated hash for 'admin123'
--   'Administrateur',
--   'admin'
-- )
-- ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Verification
-- ============================================
-- Uncomment the following lines to verify tables were created:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_type = 'BASE TABLE'
-- ORDER BY table_name;

-- ============================================
-- Success Message
-- ============================================
-- If you see this message, all tables have been created successfully!
-- 
-- Default Admin Credentials:
--   Email: admin@example.com
--   Password: admin123
-- 
-- ⚠️ IMPORTANT: Change the admin password after first login!
-- ============================================

