const mysql = require('mysql2/promise');

async function initDatabase() {
  try {
    // Connect without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
    });

    console.log('✓ Connected to MySQL');

    const dbName = process.env.DB_DATABASE || 'coffee_db';

    // Check if database exists
    const [databases] = await connection.execute(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [dbName]
    );

    if (databases.length === 0) {
      console.log(`Creating database "${dbName}"...`);
      await connection.execute(`CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log(`✓ Database "${dbName}" created`);
    } else {
      console.log(`✓ Database "${dbName}" already exists`);
    }

    await connection.end();
    console.log('✓ Database initialization complete');
  } catch (err) {
    console.error('✗ Database initialization failed:', err.message);
    process.exit(1);
  }
}

initDatabase();
