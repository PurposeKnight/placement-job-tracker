const API_URL = "http://127.0.0.1:8000/applications";
let editingId = null;


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
        <button onclick="editApplication(${app.id})">Edit</button>
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

    if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(application)
        });
        editingId = null;
        form.querySelector("button").innerText = "Add Application";
    } else {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(application)
        });
    }

    form.reset();
    fetchApplications();
});


async function deleteApplication(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    fetchApplications();
}
function editApplication(id) {
    const row = [...tableBody.children].find(
        tr => tr.children[0].innerText == id
    );

    companyInput.value = row.children[1].innerText;
    roleInput.value = row.children[2].innerText;
    statusInput.value = row.children[3].innerText;

    editingId = id;
    form.querySelector("button").innerText = "Update Application";
}


fetchApplications();
