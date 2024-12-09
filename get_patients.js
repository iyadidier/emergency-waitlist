const pool = require('./db'); // Database connection

/**
 * Add a new patient to the queue.
 * @param {string} injury - Type of injury.
 * @param {number} painLevel - Pain level (1-10).
 * @returns {object} - The newly added patient with estimated wait time.
 */
async function addPatient(injury, painLevel) {
    if (!injury || typeof painLevel !== 'number') {
        throw new Error("Invalid injury or pain level");
    }

    console.log("Adding patient with:", { injury, painLevel });

    const query = 'INSERT INTO patients (injury, pain_level) VALUES ($1, $2) RETURNING *';
    const values = [injury, painLevel];

    try {
        const result = await pool.query(query, values);
        const newPatient = result.rows[0];

        // Calculate approximate wait time (e.g., based on queue length or pain level)
        const waitTime = await calculateWaitTime(); // You can adjust how you calculate this
        return { ...newPatient, waitTime };
    } catch (err) {
        throw new Error("Error adding patient: " + err.message);
    }
}

/**
 * Get the list of patients sorted by priority (pain level and timestamp).
 * @returns {Array} - Sorted list of patients.
 */
async function getPatients() {
    const query = 'SELECT * FROM patients ORDER BY pain_level DESC, timestamp ASC';
    try {
        const result = await pool.query(query);
        return result.rows; // Return the list of patients from the database
    } catch (err) {
        throw new Error("Error fetching patients: " + err.message);
    }
}

/**
 * Mark a patient as treated and remove them from the queue.
 * @param {number} id - ID of the patient to mark as treated.
 * @returns {boolean} - True if the patient was successfully removed, false otherwise.
 */
async function markAsTreated(id) {
    const query = 'UPDATE patients SET treated = TRUE WHERE patient_id = $1 RETURNING *';
    const values = [id];
    try {
        const result = await pool.query(query, values);
        return result.rowCount > 0; // Return true if the patient was marked as treated
    } catch (err) {
        throw new Error("Error marking patient as treated: " + err.message);
    }
}

/**
 * Calculate the estimated wait time based on the number of patients in the queue.
 * @returns {number} - Estimated wait time in minutes.
 */
async function calculateWaitTime() {
    const query = 'SELECT COUNT(*) FROM patients WHERE treated = FALSE';
    try {
        const result = await pool.query(query);
        const patientCount = parseInt(result.rows[0].count);
        return patientCount * 10; // Example: 10 minutes per patient in the queue
    } catch (err) {
        throw new Error("Error calculating wait time: " + err.message);
    }
}

module.exports = { addPatient, getPatients, markAsTreated };
