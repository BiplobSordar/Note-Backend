import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.local",
});

const DB_NAME = process.env.DB_NAME;

let pool;

const sslOptions = process.env.DB_CA_PATH
  ? { ca: fs.readFileSync(process.env.DB_CA_PATH), rejectUnauthorized: true }
  : { rejectUnauthorized: false }; 
const initDB = async () => {
  let tempPool;

  try {
    tempPool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
      waitForConnections: true,
      ssl: sslOptions,
      connectionLimit: 1,
    });

    
    if (process.env.NODE_ENV !== 'production') {
      await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
      console.log(`Database '${DB_NAME}' ensured`);
    }
  } catch (err) {
    console.error("Error creating initial pool:", err.message);
    process.exit(1);
  } finally {
    if (tempPool) await tempPool.end();
  }

 
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      ssl: sslOptions,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("Main connection pool created");
  } catch (err) {
    console.error("Error creating main pool:", err.message);
    process.exit(1);
  }
};

// Tables
const createTables = async () => {
  try {
    const conn = await pool.getConnection();

    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log("Tables ensured");
    conn.release();
  } catch (err) {
    console.error("Error creating tables:", err.message);
  }
};

await initDB();
await createTables();

export default pool;
