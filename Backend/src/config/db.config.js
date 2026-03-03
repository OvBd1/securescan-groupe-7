import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const db = mysql.createConnection(config).promise();

db.connect()
  .then(() => console.log('Connecté à la base de données MySQL'))
  .catch(err => console.error('Erreur de connexion à la base de données:', err));

export default db;