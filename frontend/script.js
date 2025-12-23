const API_URL = "http://127.0.0.1:8000/applications";

const tableBody = document.getElementById("applicationsTable");
const form = document.getElementById("jobForm");

// INPUT ELEMENTS
const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const locationInput = document.getElementById("location");
const statusInput = document.getElementById("status");
const dateInput = document.getElementById("applied_date");
const notesInput = document.getElementById("notes");

async function fetchApplications() {
    const res = await fetch(API_URL);
    const data = await res.json();

    tableBody.innerHTML = "";

    data.forEach(app => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${app.id}</td>
            <td>${app.company}</td>
            <td>${app.role}</td>
            <td>${app.status}</td>
            <td>
                <button onclick="deleteApplication(${app.id})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const application = {
        company: companyInput.value,
        role: roleInput.value,
        location: locationInput.value,
        status: statusInput.value,
        applied_date: dateInput.value,
        notes: notesInput.value
    };

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(application)
    });
    alert("Application added successfully!");

    form.reset();
    fetchApplications();
});

async function deleteApplication(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    fetchApplications();
}

fetchApplications();
