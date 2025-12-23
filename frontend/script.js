// ================== CONFIG ==================
const API_URL = "https://placement-job-tracker-3.onrender.com/docs";

// ================== DOM ELEMENTS ==================
const tableBody = document.getElementById("applicationsTable");
const form = document.getElementById("jobForm");

const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const locationInput = document.getElementById("location");
const statusInput = document.getElementById("status");
const dateInput = document.getElementById("applied_date");
const notesInput = document.getElementById("notes");

const filterStatus = document.getElementById("filterStatus");
const searchInput = document.getElementById("searchInput");

// ================== STATE ==================
let allApplications = [];
let editingId = null;

// ================== FETCH DATA ==================
async function fetchApplications() {
    const res = await fetch(API_URL);
    const data = await res.json();

    allApplications = data;
    renderTable(data);
}

// ================== RENDER TABLE ==================
function renderTable(data) {
    tableBody.innerHTML = "";

    data.forEach(app => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${app.id}</td>
            <td>${app.company}</td>
            <td>${app.role}</td>
            <td>
    <span class="status ${app.status.toLowerCase()}">
        ${app.status}
    </span>
</td>

            <td>
                <button onclick="editApplication(${app.id})">Edit</button>
                <button onclick="deleteApplication(${app.id})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// ================== FILTER + SEARCH ==================
function applyFilters() {
    let filtered = allApplications;

    const status = filterStatus.value;
    const search = searchInput.value.toLowerCase();

    if (status !== "All") {
        filtered = filtered.filter(app => app.status === status);
    }

    if (search) {
        filtered = filtered.filter(app =>
            app.company.toLowerCase().includes(search) ||
            app.role.toLowerCase().includes(search)
        );
    }

    renderTable(filtered);
}

// ================== EDIT ==================
function editApplication(id) {
    const app = allApplications.find(a => a.id === id);

    companyInput.value = app.company;
    roleInput.value = app.role;
    locationInput.value = app.location || "";
    statusInput.value = app.status;
    dateInput.value = app.applied_date;
    notesInput.value = app.notes || "";

    editingId = id;
    form.querySelector("button").innerText = "Update Application";
}

// ================== DELETE ==================
async function deleteApplication(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    fetchApplications();
}

// ================== ADD / UPDATE ==================
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

// ================== EVENTS ==================
filterStatus.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

// ================== INITIAL LOAD ==================
fetchApplications();
