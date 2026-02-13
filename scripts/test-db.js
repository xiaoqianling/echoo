const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Function to parse .env file
function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const result = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes if present
      result[key] = value;
    }
  });
  return result;
}

// Load env from apps/server/.env
const envPath = path.join(__dirname, '../apps/server/.env');
const envConfig = parseEnv(envPath);

const config = {
  user: envConfig.DB_USERNAME || process.env.DB_USERNAME || 'postgres',
  password: envConfig.DB_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  host: envConfig.DB_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(envConfig.DB_PORT || process.env.DB_PORT || '5432', 10),
  database: envConfig.DB_NAME || process.env.DB_NAME || 'echoo',
};

async function testConnection() {
  console.log('Testing database connection with config:', { ...config, password: '****' });
  
  const client = new Client(config);

  try {
    await client.connect();
    console.log('✅ Successfully connected to the database!');
    
    const res = await client.query('SELECT NOW() as now');
    console.log('Database time:', res.rows[0].now);
    
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

testConnection();
