/**
 * Script to generate bcrypt hash for admin password
 * Run: node scripts/generate-admin-hash.js
 * 
 * This will output the SQL INSERT statement with the correct hash
 */

const bcrypt = require('bcryptjs')

async function generateHash() {
  const password = 'admin123'
  const hash = await bcrypt.hash(password, 10)
  
  console.log('\n✅ Generated bcrypt hash for password:', password)
  console.log('\n📋 SQL INSERT statement:')
  console.log('─'.repeat(80))
  console.log(`
INSERT INTO users (email, password, name, role)
VALUES (
  'admin@example.com',
  '${hash}',
  'Administrateur',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
`)
  console.log('─'.repeat(80))
  console.log('\n💡 Copy the INSERT statement above and add it to init-db.sql')
  console.log('   Or run the init-db.js script which handles this automatically.\n')
}

generateHash().catch(console.error)

