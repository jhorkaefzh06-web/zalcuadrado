const { createClient } = require('@supabase/supabase-js');
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
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env.local.');
  process.exit(1);
}

// Create admin client (bypasses RLS and has full auth control)
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createUser() {
  const email = 'jhorkaefzh06@gmail.com';
  const password = 'admin';
  
  console.log(`Creating auth user ${email} with password "${password}"...`);
  
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (error) {
      console.error(`❌ Failed to create user: ${error.message}`);
      process.exit(1);
    }
    
    console.log(`\n🎉 SUCCESS! User created successfully.\n`);
    console.log(`Email: ${data.user.email}`);
    console.log(`ID: ${data.user.id}`);
    process.exit(0);
  } catch (err) {
    console.error('Failed execution:', err.message);
    process.exit(1);
  }
}

createUser();
