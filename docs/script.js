console.log("SCRIPT LOADED");

const API_URL = "https://placement-job-tracker-3.onrender.com/applications";

document.addEventListener("DOMContentLoaded", () => {

    const tableBody = document.getElementById("applicationsTable");
    const form = document.getElementById("jobForm");
    const filterStatus = document.getElementById("filterStatus");
    const searchInput = document.getElementById("searchInput");

    let allApplications = [];
    let editingId = null;

    async function fetchApplications() {
        const res = await fetch(API_URL);
        const data = await res.json();
        allApplications = data;
        renderTable(data);
    }

    function renderTable(data) {
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

    filterStatus.addEventListener("change", applyFilters);
    searchInput.addEventListener("input", applyFilters);

    fetchApplications();
});
