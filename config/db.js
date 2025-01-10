const mysql = require('mysql2');
require('dotenv').config();


const pool = mysql.createConnection({
    user: process.env.USER_NAME,
    host: process.env.HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.PASSWORD,
    port: process.env.PORT
});

pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = pool.promise();