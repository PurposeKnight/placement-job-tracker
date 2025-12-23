// ================= CONFIG =================
const API_URL = "https://placement-job-tracker-3.onrender.com/applications";

// ================= WAIT FOR DOM =================
document.addEventListener("DOMContentLoaded", () => {
    console.log("SCRIPT LOADED");

    // ================= DOM ELEMENTS =================
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

    let allApplications = [];
    let editingId = null;

    // ================= FETCH APPLICATIONS =================
    async function fetchApplications() {
        try {
            console.log("Fetching applications...");

            const res = await fetch(API_URL);

            if (!res.ok) {
                throw new Error(`Fetch failed with status ${res.status}`);
            }

            const data = await res.json();
            console.log("Fetched data:", data);

            allApplications = data;
            renderTable(data);
        } catch (err) {
            console.error("Error fetching applications:", err);
        }
    }

    // ================= RENDER TABLE =================
    function renderTable(data) {
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">No applications found</td>
                </tr>
            `;
            return;
        }

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

    // ================= FILTER + SEARCH =================
    function applyFilters() {
        let filtered = allApplications;

        if (filterStatus.value !== "All") {
            filtered = filtered.filter(app => app.status === filterStatus.value);
        }

        const search = searchInput.value.toLowerCase();
        if (search) {
            filtered = filtered.filter(app =>
                app.company.toLowerCase().includes(search) ||
                app.role.toLowerCase().includes(search)
            );
        }

        renderTable(filtered);
    }

    // ================= ADD / UPDATE =================
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

        try {
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
        } catch (err) {
            console.error("Error saving application:", err);
        }
    });

    // ================= DELETE =================
    window.deleteApplication = async function (id) {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            fetchApplications();
        } catch (err) {
            console.error("Error deleting application:", err);
        }
    };

    // ================= EDIT =================
    window.editApplication = function (id) {
        const app = allApplications.find(a => a.id === id);

        companyInput.value = app.company;
        roleInput.value = app.role;
        locationInput.value = app.location || "";
        statusInput.value = app.status;
        dateInput.value = app.applied_date;
        notesInput.value = app.notes || "";

        editingId = id;
        form.querySelector("button").innerText = "Update Application";
    };

    // ================= EVENTS =================
    filterStatus.addEventListener("change", applyFilters);
    searchInput.addEventListener("input", applyFilters);

    // ================= INITIAL LOAD =================
    fetchApplications();
});
