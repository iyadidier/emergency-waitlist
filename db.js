const { Pool } = require('pg');

// Set up the pool connection to the PostgreSQL database
const pool = new Pool({
    user: 'postgres',          
    host: 'localhost',
    database: 'emergency_waitlist', 
    password: 'didier',        
    port: 5432,
});

// Connect to the database and handle errors
pool.connect()
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Error connecting to the database', err));

// Export the pool to use in other files
module.exports = pool;
