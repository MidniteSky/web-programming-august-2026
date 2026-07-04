/*
    Member Manager v5 - members.js  (Day 5 capstone)
    ================================================
    The CRUD logic is the SAME as Day 4 - every fetch, every verb, the live
    search, the in-place editing - because it already worked. What changed today
    is the user experience, using Bootstrap's interactive components:

      - ADD is now a MODAL dialog. We open it with data attributes (in the HTML)
        and close it from here after a successful save.
      - DELETE now asks in a MODAL, replacing Day 4's ugly confirm() box. The old
        confirm() line is left commented below so you can see exactly what it
        became.
      - a TOAST slides in after saving or deleting ("Member saved" / "deleted").

    So: same engine, nicer dashboard. That's the shape of a lot of real work -
    improving how something feels without rewriting what it does.

    >>> START THE SERVER FIRST (in this folder, which has db.json):
    >>>     npx json-server@0.17.4 --watch db.json --port 3000
*/

/* ---- One place for the server address --------------------------------------
   Runs against your local practice server by default.
   TO DEPLOY (GitHub Pages can't reach localhost - see
   demos/GITHUB-PAGES-DEPLOY.md), swap this one line to a hosted API:
       const API = "[MOCKAPI-URL]";                                            */
const API = "http://localhost:3000/members";

/* ---- Page elements, grabbed once ------------------------------------------- */
const tableBody = document.querySelector("#memberRows");
const tableStatus = document.querySelector("#tableStatus");
const searchBox = document.querySelector("#searchBox");

/* Add-member modal + its form fields. */
const addForm = document.querySelector("#addForm");
const nameInput = document.querySelector("#txtName");
const emailInput = document.querySelector("#txtEmail");
const activeInput = document.querySelector("#chkActive");
const feedback = document.querySelector("#formFeedback");

/* Delete-confirm modal + its pieces. */
const deleteMessage = document.querySelector("#deleteMessage");
const confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");

/* ---- Bootstrap component controllers (need the JS bundle, loaded first) -----
   Each turns a modal/toast element into an object with .show() / .hide(). */
const addModal = new bootstrap.Modal(document.querySelector("#addModal"));
const deleteModal = new bootstrap.Modal(document.querySelector("#deleteModal"));
const appToast = new bootstrap.Toast(document.querySelector("#appToast"));
const toastBody = document.querySelector("#toastBody");

/* The members we last loaded. Live search filters THIS (no request per key). */
let allMembers = [];

/* Which member the delete modal is currently about. Set when Delete is clicked,
   read when the modal's "Yes, delete" is confirmed. */
let memberPendingDelete = null;

/* ---- Small helpers --------------------------------------------------------- */

/* The table's loading/loaded/error line, in Bootstrap text colours. */
function setTableStatus(text, isError) {
    tableStatus.textContent = text;
    tableStatus.className = isError ? "fw-bold text-danger" : "fw-bold text-secondary";
}

/* Set the toast's message and pop it. Reused for save and delete. */
function showToast(message) {
    toastBody.textContent = message;
    appToast.show();
}

/* ==== READ: load all members with GET ====================================== */
async function loadMembers() {
    setTableStatus("Loading members...", false);
    try {
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error(`Server answered ${response.status}`);
        }
        allMembers = await response.json();
        renderFiltered();
        setTableStatus(`Loaded ${allMembers.length} members.`, false);
    } catch (error) {
        console.log("Load failed:", error.message);
        setTableStatus(
            "Could not load members. Is json-server running on port 3000?", true);
    }
}

/* ---- Render whatever matches the current search --------------------------- */
function renderFiltered() {
    const term = searchBox.value.trim().toLowerCase();

    const matches = term === ""
        ? allMembers
        : allMembers.filter((member) => {
            const inName = member.name.toLowerCase().includes(term);
            const inEmail = member.email.toLowerCase().includes(term);
            return inName || inEmail;
        });

    renderTable(matches);
}

/* ---- Draw a list of members into the table -------------------------------- */
function renderTable(list) {
    tableBody.textContent = "";

    if (list.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.textContent = "No members match your search.";
        cell.colSpan = 5;
        row.append(cell);
        tableBody.append(row);
        return;
    }

    list.forEach((member) => tableBody.append(buildRow(member)));
}

/* ---- Build one row, with per-row Edit and Delete --------------------------- */
function buildRow(member) {
    const { id, name, email, active } = member;

    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = id;

    const nameCell = document.createElement("td");
    nameCell.textContent = name;

    const emailCell = document.createElement("td");
    emailCell.textContent = email;

    /* Active shown as a Bootstrap badge (green/grey) instead of coloured text. */
    const activeCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = active ? "badge text-bg-success" : "badge text-bg-secondary";
    badge.textContent = active ? "yes" : "no";
    activeCell.append(badge);

    const actionCell = document.createElement("td");

    /* --- Normal state: Edit + Delete buttons (Bootstrap + icons) --- */
    function showButtons() {
        actionCell.textContent = "";

        /* Icon-only buttons: build the <i> with createElement (the same safe
           habit as everywhere else - no innerHTML), and give each button an
           aria-label so screen readers announce its purpose. */
        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn btn-sm btn-outline-secondary me-1";
        editBtn.setAttribute("aria-label", `Edit ${member.name}`);
        const editIcon = document.createElement("i");
        editIcon.className = "bi bi-pencil";
        editIcon.setAttribute("aria-hidden", "true");
        editBtn.append(editIcon);
        editBtn.addEventListener("click", startEdit);

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-sm btn-danger";
        deleteBtn.setAttribute("aria-label", `Delete ${member.name}`);
        const deleteIcon = document.createElement("i");
        deleteIcon.className = "bi bi-trash";
        deleteIcon.setAttribute("aria-hidden", "true");
        deleteBtn.append(deleteIcon);
        deleteBtn.addEventListener("click", askDelete);

        actionCell.append(editBtn, deleteBtn);
    }

    /* --- UPDATE: turn the row into inputs, remembering the originals --- */
    function startEdit() {
        const nameField = document.createElement("input");
        nameField.type = "text";
        nameField.className = "form-control form-control-sm";
        nameField.value = member.name;
        nameField.dataset.originalValue = member.name;
        nameCell.textContent = "";
        nameCell.append(nameField);

        const emailField = document.createElement("input");
        emailField.type = "text";
        emailField.className = "form-control form-control-sm";
        emailField.value = member.email;
        emailField.dataset.originalValue = member.email;
        emailCell.textContent = "";
        emailCell.append(emailField);

        actionCell.textContent = "";

        const saveBtn = document.createElement("button");
        saveBtn.type = "button";
        saveBtn.className = "btn btn-sm btn-success me-1";
        saveBtn.textContent = "Save";
        saveBtn.addEventListener("click", () => saveEdit(nameField, emailField));

        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.className = "btn btn-sm btn-secondary";
        cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", () => cancelEdit(nameField, emailField));

        actionCell.append(saveBtn, cancelBtn);
    }

    /* --- Cancel: restore the originals, no server call --- */
    function cancelEdit(nameField, emailField) {
        nameCell.textContent = nameField.dataset.originalValue;
        emailCell.textContent = emailField.dataset.originalValue;
        showButtons();
    }

    /* --- Save: PUT the whole member (spread), then reload + toast --- */
    async function saveEdit(nameField, emailField) {
        const newName = nameField.value.trim();
        const newEmail = emailField.value.trim();
        if (newName === "" || newEmail === "") {
            setTableStatus("Name and email can't be blank.", true);
            return;
        }

        const updated = { ...member, name: newName, email: newEmail };

        try {
            const response = await fetch(`${API}/${member.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated)
            });
            if (!response.ok) throw new Error(`Server answered ${response.status}`);

            await loadMembers();
            showToast(`Saved changes to ${newName}.`);
        } catch (error) {
            console.log("PUT failed:", error.message);
            setTableStatus("Could not save. Is json-server running on port 3000?", true);
        }
    }

    /* --- DELETE: ask in the modal (this is the confirm() replacement) ---
       Day 4 did this with the browser's built-in confirm(), like so:

           if (!confirm(`Delete ${member.name}? This cannot be undone.`)) return;
           // ...then the DELETE fetch ran right here.

       That box was ugly and froze the page. Now we OPEN A MODAL and remember
       which member it's about; the actual delete waits for the modal's own
       "Yes, delete" button (handled once, below). */
    function askDelete() {
        memberPendingDelete = member;
        deleteMessage.textContent = `Delete ${member.name}? This cannot be undone.`;
        deleteModal.show();
    }

    showButtons();
    row.append(idCell, nameCell, emailCell, activeCell, actionCell);
    return row;
}

/* ==== The delete modal's confirm button (attached ONCE) ====================
   Runs the DELETE for whichever member askDelete() remembered. */
confirmDeleteBtn.addEventListener("click", async () => {
    if (memberPendingDelete === null) {
        return;
    }
    const member = memberPendingDelete;

    try {
        const response = await fetch(`${API}/${member.id}`, { method: "DELETE" });
        if (!response.ok) throw new Error(`Server answered ${response.status}`);

        deleteModal.hide();
        memberPendingDelete = null;
        await loadMembers();
        showToast(`Deleted ${member.name}.`);
    } catch (error) {
        console.log("DELETE failed:", error.message);
        deleteModal.hide();
        setTableStatus("Could not delete. Is json-server running on port 3000?", true);
    }
});

/* ==== Live search ========================================================== */
searchBox.addEventListener("input", renderFiltered);

/* ==== CREATE: add a member with POST (from the modal form) ================== */
addForm.addEventListener("submit", async (event) => {
    /* Stop the browser's own submit (the Day 1 URL thread). */
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    if (name === "") {
        feedback.textContent = "Please enter a name.";
        return;
    }
    if (email === "") {
        feedback.textContent = "Please enter an email.";
        return;
    }
    feedback.textContent = "";

    /* Build the new member WITHOUT an id - the server assigns it. */
    const newMember = { name, email, active: activeInput.checked };

    try {
        const response = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMember)
        });
        if (!response.ok) throw new Error(`Server answered ${response.status}`);

        const saved = await response.json();
        console.log("Server saved:", saved);

        /* Close the modal, tidy the form, refresh the table, toast the result. */
        addModal.hide();
        addForm.reset();
        searchBox.value = "";
        await loadMembers();
        showToast(`Added ${saved.name}. It's saved on the server now.`);
    } catch (error) {
        console.log("POST failed:", error.message);
        feedback.textContent = "Could not save. Is json-server running on port 3000?";
    }
});

/* ==== First load =========================================================== */
loadMembers();
