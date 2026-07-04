/*
    Member Manager v4 - members.js  (Day 4 capstone)
    ================================================
    Yesterday this file kept its members in a hard-coded array, so anything you
    added vanished on refresh. Today the data lives on a real server, and the
    Member Manager becomes a complete CRUD app - Create, Read, Update, Delete -
    over a REST API. Added members STICK. This is the Day 1 promise, paid in
    full: "the form talks to a real server by Thursday."

    >>> START THE SERVER FIRST. In a terminal in this folder (the one with
    >>> db.json), run EXACTLY:
    >>>
    >>>     npx json-server@0.17.4 --watch db.json --port 3000
    >>>
    >>> Leave it running. Stop it with Ctrl+C. Reset the data any time by
    >>> stopping the server, copying db.backup.json over db.json, and restarting.

    Everything here uses only what today taught:
      - fetch with async/await + try/catch, checking response.ok   (Block 2)
      - JSON.stringify to send, the reply parsed for us             (Block 1-2)
      - destructuring & spread                                      (Block 2)
      - the four verbs: GET (read), POST (create), PUT (update),
        DELETE (delete)                                             (Blocks 3-4)
    ...on top of the Day 3 DOM skills (createElement, textContent, events).

    The live search still works - but now it filters the members we FETCHED,
    not a hard-coded array.
*/

/* ---- One place for the server address -------------------------------------
   If your server runs on a different port, change it here, once. */
const API = "http://localhost:3000/members";

/* ---- Grab the page elements we need, once --------------------------------- */
const tableBody = document.querySelector("#memberRows");
const tableStatus = document.querySelector("#tableStatus");
const searchBox = document.querySelector("#searchBox");
const addForm = document.querySelector("#addForm");
const nameInput = document.querySelector("#txtName");
const emailInput = document.querySelector("#txtEmail");
const activeInput = document.querySelector("#chkActive");
const feedback = document.querySelector("#formFeedback");

/* The members we last loaded from the server. Live search filters THIS, so we
   don't hit the server on every keystroke. Refreshed after every write. */
let allMembers = [];

/* ---- Small helper for the table's loading/error/loaded line --------------- */
function setTableStatus(text, isError) {
    tableStatus.textContent = text;
    tableStatus.className = isError ? "table-status error" : "table-status";
}

/* ==== READ: load all members with GET ======================================
   The week's standard request shape: async/await, response.ok, try/catch, and
   a loading state while it's in flight, an error state if it fails. */
async function loadMembers() {
    setTableStatus("Loading members...", false);
    try {
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error(`Server answered ${response.status}`);
        }
        /* Keep the fetched list so search can filter it. */
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

    /* No term -> show everyone; otherwise keep name/email matches. */
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

    /* Friendly single row when a search matches nothing (kept from Day 3). */
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

/* ---- Build one row (normal state), with per-row Edit and Delete -----------
   The member object is captured in this function's scope, so the row's own
   handlers can read and update it. */
function buildRow(member) {
    /* Destructure the fields we display (taught today). */
    const { id, name, email, active } = member;

    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = id;

    const nameCell = document.createElement("td");
    nameCell.textContent = name;

    const emailCell = document.createElement("td");
    emailCell.textContent = email;

    /* Active cell reuses the Day 2 colour classes. */
    const activeCell = document.createElement("td");
    activeCell.textContent = active ? "yes" : "no";
    activeCell.className = active ? "active-yes" : "active-no";

    const actionCell = document.createElement("td");

    /* --- Normal state: Edit + Delete buttons --- */
    function showButtons() {
        actionCell.textContent = "";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "row-btn edit-btn";
        editBtn.addEventListener("click", startEdit);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "row-btn delete-btn";
        deleteBtn.addEventListener("click", onDelete);

        actionCell.append(editBtn, deleteBtn);
    }

    /* --- UPDATE: turn the row into inputs, remembering the originals --- */
    function startEdit() {
        const nameField = document.createElement("input");
        nameField.type = "text";
        nameField.value = member.name;
        /* Remember the starting value ON the input, so Cancel can restore it. */
        nameField.dataset.originalValue = member.name;
        nameCell.textContent = "";
        nameCell.append(nameField);

        const emailField = document.createElement("input");
        emailField.type = "text";
        emailField.value = member.email;
        emailField.dataset.originalValue = member.email;
        emailCell.textContent = "";
        emailCell.append(emailField);

        actionCell.textContent = "";

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.className = "row-btn save-btn";
        saveBtn.addEventListener("click", () => saveEdit(nameField, emailField));

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.className = "row-btn cancel-btn";
        cancelBtn.addEventListener("click", () => cancelEdit(nameField, emailField));

        actionCell.append(saveBtn, cancelBtn);
    }

    /* --- Cancel: restore the originals from the data- attribute, no server --- */
    function cancelEdit(nameField, emailField) {
        nameCell.textContent = nameField.dataset.originalValue;
        emailCell.textContent = emailField.dataset.originalValue;
        showButtons();
    }

    /* --- Save: PUT the WHOLE member (spread keeps every field), then reload --- */
    async function saveEdit(nameField, emailField) {
        const newName = nameField.value.trim();
        const newEmail = emailField.value.trim();
        if (newName === "" || newEmail === "") {
            setTableStatus("Name and email can't be blank.", true);
            return;
        }

        /* PUT replaces the record, so send everything - the id and active come
           along via spread; name and email are the edits. */
        const updated = { ...member, name: newName, email: newEmail };

        try {
            const response = await fetch(`${API}/${member.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated)
            });
            if (!response.ok) throw new Error(`Server answered ${response.status}`);

            /* Re-fetch so the screen matches the server exactly. */
            await loadMembers();
            setTableStatus(`Saved changes to ${newName}.`, false);
        } catch (error) {
            console.log("PUT failed:", error.message);
            setTableStatus("Could not save. Is json-server running on port 3000?", true);
        }
    }

    /* --- DELETE: confirm, then remove, then reload --- */
    async function onDelete() {
        /* !!! TEMPORARY: the browser's built-in confirm() is a stop-gap for
           Day 4 ONLY. It's ugly, it freezes the page, and it can't be styled.
           Day 5 replaces it with a proper pop-up dialog of our own. !!! */
        if (!confirm(`Delete ${member.name}? This cannot be undone.`)) {
            return;   // user clicked Cancel
        }

        try {
            const response = await fetch(`${API}/${member.id}`, { method: "DELETE" });
            if (!response.ok) throw new Error(`Server answered ${response.status}`);

            await loadMembers();
            setTableStatus(`Deleted ${member.name}.`, false);
        } catch (error) {
            console.log("DELETE failed:", error.message);
            setTableStatus("Could not delete. Is json-server running on port 3000?", true);
        }
    }

    showButtons();
    row.append(idCell, nameCell, emailCell, activeCell, actionCell);
    return row;
}

/* ==== Live search ==========================================================
   Now filters the FETCHED members (allMembers), not a hard-coded array. No new
   request per keystroke - we already have the data. */
searchBox.addEventListener("input", renderFiltered);

/* ==== CREATE: add a member with POST ======================================= */
addForm.addEventListener("submit", async (event) => {
    /* Stop the browser's own submit (the Day 1 URL thread). */
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    if (name === "") {
        feedback.textContent = "Please enter a name.";
        feedback.className = "form-feedback error";
        return;
    }
    if (email === "") {
        feedback.textContent = "Please enter an email.";
        feedback.className = "form-feedback error";
        return;
    }

    /* Build the new member WITHOUT an id - the server assigns it. */
    const newMember = { name, email, active: activeInput.checked };

    try {
        feedback.textContent = "Saving...";
        feedback.className = "form-feedback";

        const response = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMember)
        });
        if (!response.ok) throw new Error(`Server answered ${response.status}`);

        const saved = await response.json();
        console.log("Server saved:", saved);

        /* Re-fetch the whole list so the new member appears (with its real id).
           And this time it SURVIVES a refresh - that's the whole point of today. */
        addForm.reset();
        activeInput.checked = false;
        searchBox.value = "";
        await loadMembers();

        feedback.textContent = `Added ${saved.name}. It's saved on the server now.`;
        feedback.className = "form-feedback ok";
    } catch (error) {
        console.log("POST failed:", error.message);
        feedback.textContent =
            "Could not save. Is json-server running on port 3000?";
        feedback.className = "form-feedback error";
    }
});

/* ==== First load ===========================================================
   Ask the server for the members as soon as the page opens. */
loadMembers();
