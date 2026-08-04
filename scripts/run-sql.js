const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Helper to load env variables from .env.local
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env.local file not found. Create it in root directory first.');
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.replace(/^"|"/g, '');
      }
      env[key] = value.trim();
    }
  });
  return env;
}

const env = loadEnv();
const databaseUrl = env.DATABASE_URL;

if (!databaseUrl) {
  console.error('Error: DATABASE_URL missing in .env.local.');
  process.exit(1);
}

async function runSQL() {
  const sqlPath = path.resolve(process.cwd(), 'supabase', 'schema.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error(`Error: SQL schema file not found at ${sqlPath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  console.log('Connecting to PostgreSQL database...');

  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false // Required for Supabase SSL connections
    }
  });

  try {
    await client.connect();
    console.log('Connected successfully. Running schema.sql query...');
    await client.query(sqlContent);
    console.log('Database tables and policies created successfully!');
  } catch (err) {
    console.error('Database execution failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSQL();
