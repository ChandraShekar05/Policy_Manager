const mysql = require('mysql2');
require('dotenv').config();


const pool = mysql.createConnection({
    user: 'uosfsxgv0mkjudef',
    host: 'bb7za5hx3mvyhaq0ovn8-mysql.services.clever-cloud.com',
    database: 'bb7za5hx3mvyhaq0ovn8',
    password: 'TCHae9cAi5wTmLcQxSTO',
    port: 3306
});

pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = pool.promise();
