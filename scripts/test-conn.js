const { Client } = require('pg');

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'ca-central-1', 'sa-east-1',
  'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 'eu-central-2', 'eu-south-1', 'eu-south-2',
  'ap-southeast-1', 'ap-southeast-2', 'ap-southeast-3', 'ap-southeast-4',
  'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3', 'ap-south-1', 'ap-south-2',
  'me-central-1', 'me-south-1', 'af-south-1'
];
const password = 'Jhork@ef321';
const projectRef = 'jcjdyezyvyksngrgsokd';

async function testRegions() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const connectionString = `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@${host}:6543/postgres`;
    
    console.log(`Testing connection to region ${region} via ${host}...`);
    
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 4000
    });

    try {
      await client.connect();
      console.log(`\n🎉 SUCCESS! The active region is: ${region}!\n`);
      await client.end();
      process.exit(0);
    } catch (err) {
      if (err.message.includes('password authentication failed')) {
        console.log(`\n🔑 FOUND REGION! The active region is: ${region}, but password check failed!`);
        console.log(`Please double check the Database Password you provided.\n`);
        process.exit(1);
      }
      console.log(`❌ Failed for ${region}: ${err.message}`);
    }
  }
  
  console.log('\nCould not connect to any test region. Please check password or region.');
  process.exit(1);
}

testRegions();
