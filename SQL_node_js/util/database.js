const mysql = require('mysql2');

//two ways to connect the database
//each time need to close the connection the best practise

//connection pool 
//manage multiple connection
const pool = mysql.createPool({

    host: 'localhost',
    user: 'root',
    database: 'node_database',
    password: 'root',
});

//promise asyncoronous Data
module.exports = pool.promise();