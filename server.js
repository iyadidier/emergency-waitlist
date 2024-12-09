// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // For logging HTTP requests
const { addPatient, getPatients, markAsTreated } = require('./get_patients');

// Create the Express app
const app = express();
const PORT = 3000;

// Admin credentials
const adminCredentials = {
    username: "admin",
    password: "1234"
};

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON payloads
app.use(express.static('public')); // Serve static files from the "public" directory
app.use(morgan('dev')); // Log HTTP requests for debugging

// Routes

/**
 * Admin Login Route
 * Endpoint: POST /admin-login
 * Request Body: { username: string, password: string }
 */
app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;

    if (username === adminCredentials.username && password === adminCredentials.password) {
        res.status(200).json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ error: 'Invalid username or password.' });
    }
});

/**
 * Add a new patient to the queue.
 * Endpoint: POST /add-patient
 * Request Body: { injury: string, painLevel: number }
 */
app.post('/add-patient', (req, res) => {
    const { injury, painLevel } = req.body;

    // Validate input
    if (!injury || typeof painLevel !== 'number') {
        return res.status(400).json({ error: 'Injury and pain level are required and must be valid.' });
    }

    try {
        const newPatient = addPatient(injury, painLevel);
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(500).json({ error: 'Could not add patient.' });
    }
});

/**
 * Get the sorted list of all patients.
 * Endpoint: GET /get-patients
 */
app.get('/get-patients', (req, res) => {
    try {
        const patients = getPatients();
        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({ error: 'Could not retrieve patients.' });
    }
});

/**
 * Mark a patient as treated.
 * Endpoint: POST /mark-as-treated
 * Request Body: { id: number }
 */
app.post('/mark-as-treated', (req, res) => {
    const { id } = req.body;

    // Validate input
    if (!id || typeof id !== 'number') {
        return res.status(400).json({ error: 'Valid patient ID is required.' });
    }

    try {
        const success = markAsTreated(id);
        if (success) {
            res.status(200).json({ message: 'Patient marked as treated.' });
        } else {
            res.status(404).json({ error: 'Patient not found.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Could not mark patient as treated.' });
    }
});

// Fallback route for undefined endpoints
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found.' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
