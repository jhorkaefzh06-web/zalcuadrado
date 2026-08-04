const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env.local not found.');
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
  console.error('Error: DATABASE_URL missing.');
  process.exit(1);
}

async function run() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query('SELECT * FROM products');
    console.log(`Found ${res.rows.length} products in DB:`);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Failed to query:', err);
  } finally {
    await client.end();
  }
}

run();
