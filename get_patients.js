// In-memory data for patients
let patients = [];

/**
 * Add a new patient to the queue.
 * @param {string} injury - Type of injury.
 * @param {number} painLevel - Pain level (1-10).
 * @returns {object} - The newly added patient with estimated wait time.
 */
function addPatient(injury, painLevel) {
    if (!injury || typeof painLevel !== 'number') {
        throw new Error("Invalid injury or pain level");
    }

    console.log("Adding patient with:", { injury, painLevel });

    const newPatient = {
        id: patients.length + 1,
        injury,
        painLevel,
        timestamp: Date.now(),
    };

    patients.push(newPatient);

    // Calculate approximate wait time (e.g., based on queue length or pain level)
    const waitTime = patients.length * 10; // Example: 10 minutes per patient
    return { ...newPatient, waitTime };
}

/**
 * Get the list of patients sorted by priority (pain level and timestamp).
 * @returns {Array} - Sorted list of patients.
 */
function getPatients() {
    return patients.sort((a, b) => {
        if (b.painLevel !== a.painLevel) return b.painLevel - a.painLevel;
        return a.timestamp - b.timestamp;
    });
}

/**
 * Mark a patient as treated and remove them from the queue.
 * @param {number} id - ID of the patient to mark as treated.
 * @returns {boolean} - True if the patient was successfully removed, false otherwise.
 */
function markAsTreated(id) {
    const index = patients.findIndex(patient => patient.id === id);
    if (index !== -1) {
        patients.splice(index, 1);
        return true;
    }
    return false;
}

module.exports = { addPatient, getPatients, markAsTreated };
