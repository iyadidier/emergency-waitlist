// Role Selection
document.getElementById('role-selector').addEventListener('change', function () {
    const role = this.value;

    document.getElementById('admin-login').style.display = role === 'admin' ? 'block' : 'none';
    document.getElementById('patient-form').style.display = role === 'patient' ? 'block' : 'none';
    document.getElementById('admin-dashboard').style.display = 'none'; // Hide dashboard initially
});

// Admin Login Form Submission
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

// Patient Submission Form
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

// Refresh Admin Queue
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
});

