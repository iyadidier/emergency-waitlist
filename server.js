// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { Client } = require('pg');
const WebSocket = require('ws');

const app = express();
const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'your_db_user',
    password: 'your_db_password',
    database: 'hospital_triage',
});

client.connect();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html as the default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to get patient by 3-letter code
app.post('/patient', (req, res) => {
    const { name, code } = req.body;

    // Query database for patient by code
    const query = 'SELECT * FROM patients WHERE patient_code = $1';
    client.query(query, [code], (err, result) => {
        if (err) {
            return res.status(500).send('Error retrieving patient data');
        }
        if (result.rows.length > 0) {
            return res.json(result.rows[0]); // Send patient data back
        } else {
            return res.status(404).send('Patient not found');
        }
    });
});

// WebSocket for real-time updates
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send a message every time a new patient arrives or wait time changes
    setInterval(() => {
        ws.send('Updated wait time information');
    }, 10000); // Send updates every 10 seconds
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
