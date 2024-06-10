import 'dotenv/config';
import mysql from 'mysql2/promise';

// Using a pool to manage multiple connections
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verify the connection
pool.getConnection()
    .then(conn => {
        console.log('Connected successfully to the database!');
        conn.release();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


export default pool;