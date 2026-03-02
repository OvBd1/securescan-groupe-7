import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export const getConnection = async () => {
  try {
    const connection = await mysql.createConnection(db);
    console.log('Database connection established');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

export default db;