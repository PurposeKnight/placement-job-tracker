const API_URL = "http://127.0.0.1:8000/applications";

const tableBody = document.getElementById("applicationsTable");
const form = document.getElementById("jobForm");

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
        company: company.value,
        role: role.value,
        location: location.value,
        status: status.value,
        applied_date: applied_date.value,
        notes: notes.value
    };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(application)
    });

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
