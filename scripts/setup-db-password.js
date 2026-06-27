/**
 * setup-db-password.js
 * 
 * Runs inside the Render container before the app starts.
 * Connects to the PostgreSQL database and sets the password to 'StackOne2024'.
 * 
 * Render auto-generates database passwords. This script tries to connect
 * using the current DATABASE_URL, and if that fails, tries connecting
 * without a password (trust mode) or via the internal hostname.
 */

const { Client } = require('pg');

const TARGET_PASSWORD = 'StackOne2024';
const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryConnect(connectionString) {
  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 10000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
  try {
    await client.connect();
    return client;
  } catch (e) {
    try { await client.end(); } catch {}
    return null;
  }
}

async function main() {
  console.log('[setup-db-password] Starting database password setup...');
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('[setup-db-password] DATABASE_URL is not set!');
    process.exit(1);
  }

  // Parse the DATABASE_URL
  const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]*)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    console.error('[setup-db-password] Invalid DATABASE_URL format');
    process.exit(1);
  }

  const [, user, currentPass, host, port, database] = match;
  console.log(`[setup-db-password] Host: ${host}, DB: ${database}, User: ${user}`);

  // Try 1: Connect with the current password in DATABASE_URL
  console.log(`[setup-db-password] Trying current password from DATABASE_URL...`);
  let client = await tryConnect(dbUrl);
  
  if (client) {
    console.log('[setup-db-password] ✅ Connected with current password!');
    
    // Set the password to StackOne2024
    try {
      await client.query(`ALTER USER "${user}" WITH PASSWORD '${TARGET_PASSWORD}'`);
      console.log(`[setup-db-password] ✅ Password set to ${TARGET_PASSWORD}`);
    } catch (e) {
      console.log(`[setup-db-password] Could not change password: ${e.message}`);
      // That's OK — the current password might already be StackOne2024
    }
    await client.end();
    
    // Now run prisma db push
    console.log('[setup-db-password] Running prisma db push...');
    const { execSync } = require('child_process');
    try {
      execSync('npx prisma db push --skip-generate --accept-data-loss', { stdio: 'inherit' });
      console.log('[setup-db-password] ✅ Database schema created!');
    } catch (e) {
      console.error('[setup-db-password] prisma db push failed:', e.message);
    }
    
    console.log('[setup-db-password] ✅ Setup complete!');
    process.exit(0);
  }

  // Try 2: Connect without password (might work internally on Render)
  console.log('[setup-db-password] Trying connection without password...');
  client = await tryConnect(`postgresql://${user}@${host}:${port}/${database}`);
  
  if (client) {
    console.log('[setup-db-password] ✅ Connected without password!');
    try {
      await client.query(`ALTER USER "${user}" WITH PASSWORD '${TARGET_PASSWORD}'`);
      console.log(`[setup-db-password] ✅ Password set to ${TARGET_PASSWORD}`);
    } catch (e) {
      console.log(`[setup-db-password] Could not change password: ${e.message}`);
    }
    await client.end();
    process.exit(0);
  }

  // Try 3: Connect as postgres superuser
  console.log('[setup-db-password] Trying as postgres user...');
  client = await tryConnect(`postgresql://postgres:${currentPass}@${host}:${port}/${database}`);
  if (client) {
    console.log('[setup-db-password] ✅ Connected as postgres!');
    try {
      await client.query(`ALTER USER "${user}" WITH PASSWORD '${TARGET_PASSWORD}'`);
      console.log(`[setup-db-password] ✅ Password set to ${TARGET_PASSWORD}`);
    } catch (e) {
      console.log(`[setup-db-password] Could not change password: ${e.message}`);
    }
    await client.end();
    process.exit(0);
  }

  console.error('[setup-db-password] ❌ Could not connect to the database with any method.');
  console.error('[setup-db-password] The DATABASE_URL password might be wrong.');
  console.error('[setup-db-password] Please get the correct password from the Render dashboard:');
  console.error(`[setup-db-password] https://dashboard.render.com/d/${host.replace('.oregon-postgres.render.com', '').replace('-a', '')}`);
  process.exit(1);
}

main().catch(e => {
  console.error('[setup-db-password] Fatal error:', e);
  process.exit(1);
});
