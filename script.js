// script.js

document.getElementById('patient-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const patientName = document.getElementById('patient-name').value;
    const patientCode = document.getElementById('patient-code').value;

    // Send the patient data to the server
    fetch('/patient', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: patientName, code: patientCode })
    })
    .then(response => response.json())
    .then(data => {
        // Display the patient's wait time or any relevant info
        document.getElementById('wait-time-display').textContent = `Hello, ${data.first_name}. Your estimated wait time is ${data.wait_time} minutes.`;
    })
    .catch(err => {
        document.getElementById('wait-time-display').textContent = 'Error retrieving wait time. Please try again.';
    });
});

// WebSocket for real-time updates
const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('message', (event) => {
    console.log('Received:', event.data);
    // Update the UI dynamically with the new data
    document.getElementById('wait-time-display').textContent = event.data;
});
