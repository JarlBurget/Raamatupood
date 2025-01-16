const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'qwerty',
    database: 'web_shop'
})

module.exports = pool.promise()