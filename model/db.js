const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    password: '120306',
    host: 'localhost',
    port: 5432,
    database: 'Node_4',
});

module.exports = pool;
