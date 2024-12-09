# Emergency Queue Management System

This application is designed to manage and streamline patient queues in emergency scenarios. It provides an interface for administrators to manage patient data and for patients to register their cases and receive estimated wait times.

---

## Developer Guide

### Setup Instructions

1. **Clone the Repository**  
   Clone the repository to your local machine and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd <repository-directory>` 

2.  **Install Dependencies**  
    Ensure you have Node.js installed. Install the required dependencies by running:
    
    bash
    
    Copy code
    
    `npm install` 
    
3.  **Start the Server**  
    To run the application locally, use:
    
    bash
    
    Copy code
    
    `npm start` 
    
    The server will start at `http://localhost:3000`.
    
4.  **API Endpoints**  
    The following API endpoints are available:
    
    -   **`POST /admin-login`**: Authenticates the admin.
    -   **`POST /add-patient`**: Adds a new patient to the queue.
    -   **`GET /get-patients`**: Retrieves the list of patients sorted by priority.
    -   **`POST /mark-as-treated`**: Marks a patient as treated.
5.  **Front-End Development**
    
    -   Static files (HTML, CSS, JavaScript) are located in the `public` directory.
    -   To make modifications, edit the files in the `public` folder.

----------

## User Guide

### For Patients

1.  **Select Role**
    
    -   On the landing page, choose "Patient" from the role selector dropdown.
2.  **Submit Your Case**
    
    -   Fill in the required details:
        -   Type of injury.
        -   Pain level (1-10).
    -   Submit the form to register your case.
    -   The system will display your estimated wait time.
3.  **Wait for Treatment**
    
    -   Once your wait time is over, you will be attended by the admin team.

----------

### For Admins

1.  **Select Role**
    
    -   On the landing page, choose "Admin" from the role selector dropdown.
2.  **Log In**
    
    -   Enter your admin credentials (username and password) to access the admin dashboard.
3.  **Manage Patient Queue**
    
    -   View the current queue of patients, sorted by priority (pain level and timestamp).
    -   The dashboard displays:
        -   Injury type.
        -   Pain level.
        -   Time since the patient joined the queue.
    -   Click "Mark as Treated" to remove a patient from the queue once treated.
4.  **Refresh Queue**
    
    -   Click "Refresh Queue" to update the list of patients in real time.

----------

## Key Features

-   **Dynamic Role-Based Views**  
    The interface adapts based on the selected role (admin or patient).
    
-   **Real-Time Queue Management**  
    Admins can view and update the patient queue dynamically.
    
-   **Estimated Wait Times**  
    Patients receive an estimated wait time based on their position in the queue.
    
-   **Priority Handling**  
    Patients are prioritized based on their pain level and time of submission.
    

----------

## Troubleshooting

-   **Issues with API Requests**
    
    -   Check server logs for errors by viewing the terminal running `npm start`.
    -   Ensure the server is running on the expected port.
-   **UI Not Loading Properly**
    
    -   Verify that static files are being served correctly.
-   **Patient Queue Not Updating**
    
    -   Use the "Refresh Queue" button to load the latest data.

----------

## Code Overview

### Role Selection Logic

The application dynamically adjusts the interface based on the selected role:

javascript

    document.getElementById('role-selector').addEventListener('change', function () {
    const role = this.value;
    document.getElementById('admin-login').style.display = role === 'admin' ? 'block' : 'none';
    document.getElementById('patient-form').style.display = role === 'patient' ? 'block' : 'none';
    document.getElementById('admin-dashboard').style.display = 'none'; // Hide dashboard initially
    });


### Admin Login Handling

Admins log in using their credentials to access the dashboard:


    document.getElementById('admin-login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
   
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    const response = await fetch('/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.status === 200) {
        alert(data.message);
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
    } else {
        alert(data.error);
    }
    }); 

### Patient Submission Form

Patients can submit their cases, and the system calculates their wait time:



    document.getElementById('patient-input-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const injury = document.getElementById('injury').value;
    const painLevel = parseInt(document.getElementById('pain-level').value);
    const waitTimeMessage = document.getElementById('wait-time');

    waitTimeMessage.textContent = ''; // Clear previous wait time message

    try {
        const response = await fetch('/add-patient', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ injury, painLevel }),
        });

        const data = await response.json();

        if (response.status === 201) {
            waitTimeMessage.textContent = `Your estimated wait time is approximately ${data.waitTime} minutes.`;
            waitTimeMessage.style.color = 'green';
        } else {
            waitTimeMessage.textContent = `Error: ${data.error}`;
            waitTimeMessage.style.color = 'red';
        }
    } catch (error) {
        waitTimeMessage.textContent = 'An unexpected error occurred. Please try again later.';
        waitTimeMessage.style.color = 'red';
    }
    });


### Refresh Admin Queue

Admins can refresh the patient list to see updated data:


    document.getElementById('refresh-queue').addEventListener('click', async function () {
    const response = await fetch('/get-patients');
    const patients = await response.json();
    
    const tableBody = document.getElementById('patient-table');
    tableBody.innerHTML = ''; // Clear existing rows

    patients.forEach((patient, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${patient.injury}</td>
            <td>${patient.painLevel}</td>
            <td>${Math.ceil((Date.now() - patient.timestamp) / 60000)} mins ago</td>
            <td><button class="mark-treated" data-id="${patient.id}">Mark as Treated</button></td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners for "Mark as Treated" buttons
    document.querySelectorAll('.mark-treated').forEach(button => {
        button.addEventListener('click', async function () {
            const id = parseInt(this.getAttribute('data-id'));

            const response = await fetch('/mark-as-treated', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (response.status === 200) {
                alert('Patient marked as treated!');
                this.parentElement.parentElement.remove(); // Remove the row
            } else {
                alert('Failed to mark patient as treated.');
            }
        });
    });
