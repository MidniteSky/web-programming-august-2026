/*
    LIVE BUILD - STEP 6 of 6: UPDATE (edit in place) - THE FILE IS COMPLETE
    =======================================================================
    render -> search+add -> the switch -> create -> delete [UPDATE] ... done!

    CATCHING UP? Copy this ENTIRE file over members.js and you have the
    finished CRUD app. Everything marked  NEW (Step 6)  is what this final
    step adds; the rest is Steps 1-5, unchanged.

    WHAT THIS STEP ADDS - the last verb, and the fiddliest UI so far:
      - an Edit button beside each Delete. Clicking it swaps the Name and
        Email cells for INPUT BOXES, and the buttons for Save/Cancel.
        You edit right where the data lives.
      - the three moves of in-place editing:
          startEdit()   - remember the originals (on the inputs themselves,
                          via dataset), swap text for inputs
          cancelEdit()  - put the originals back; the server never hears
                          about it
          saveEdit()    - validate, PUT the WHOLE member, re-fetch
      - why PUT sends everything: PUT means "REPLACE the record at this
        URL". Send only { name }, and email and active would be gone. The
        spread (...member) copies every existing field, then name and email
        are written over the top with the edits. Copy all, change some.

    WHAT YOU SHOULD SEE when it works:
      - Edit on Alice: her name and email become editable boxes
      - Cancel: originals return, no request sent (check the Network tab)
      - edit and Save: table redraws with the change, status line confirms;
        refresh - it stuck, because the server has it
      - blank out a name and Save: refused politely, nothing sent

    NOTHING is "not working yet" any more. Look how far this file came:
    it started with six hard-coded members trapped in a page, and it ends
    as a complete CRUD app - all four verbs over a real REST API, plus
    live search - where the data outlives the page. It's the same app as
    day5/starter/members.js (that copy's comments are written as revision
    notes rather than a build diary). Next: Bootstrap dresses it up -
    modals, toasts and badges - without changing a single verb underneath.

    >>> THE SERVER MUST BE RUNNING (in this folder, which has db.json):
    >>>     npx json-server@0.17.4 --watch db.json --port 3000
*/

/* ---- One place for the server address -------------------------------------- */
const API = "http://localhost:3000/members";

/* ---- Page elements, grabbed once ------------------------------------------- */
const tableBody = document.querySelector("#memberRows");
const tableStatus = document.querySelector("#tableStatus");
const searchBox = document.querySelector("#searchBox");
const addForm = document.querySelector("#addForm");
const nameInput = document.querySelector("#txtName");
const emailInput = document.querySelector("#txtEmail");
const activeInput = document.querySelector("#chkActive");
const feedback = document.querySelector("#formFeedback");

/* The members we last loaded. Live search filters THIS (no request per key). */
let allMembers = [];

/* ---- Small helper for the table's loading/error/loaded line ---------------- */
function setTableStatus(text, isError) {
    tableStatus.textContent = text;
    tableStatus.className = isError ? "table-status error" : "table-status";
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

/* ---- Build one row, with per-row Edit and Delete ---------------------------
   All the inner functions share this call's `member` - each row's handlers
   remember THEIR member (the Day 3 closure idea). They also share the
   row's cells, which is what lets Edit rebuild the middle of its own row
   without touching any other. */
function buildRow(member) {
    const { id, name, email, active } = member;

    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = id;

    const nameCell = document.createElement("td");
    nameCell.textContent = name;

    const emailCell = document.createElement("td");
    emailCell.textContent = email;

    /* Active reuses the Day 2 colour classes. */
    const activeCell = document.createElement("td");
    activeCell.textContent = active ? "yes" : "no";
    activeCell.className = active ? "active-yes" : "active-no";

    const actionCell = document.createElement("td");

    /* --- Normal state: the row's buttons. Called again by cancelEdit and
       after renders, which is exactly why it's a function. --- */
    function showButtons() {
        actionCell.textContent = "";

        /* NEW (Step 6): the Edit button joins the family. */
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

    /* NEW (Step 6) --- UPDATE, move one: swap text for inputs ---
       Each input is pre-filled with the current value, and ALSO carries the
       original in a data- attribute (dataset.originalValue) - parked on the
       element itself, right where Cancel will look for it. */
    function startEdit() {
        const nameField = document.createElement("input");
        nameField.type = "text";
        nameField.value = member.name;
        nameField.dataset.originalValue = member.name;
        nameCell.textContent = "";
        nameCell.append(nameField);

        const emailField = document.createElement("input");
        emailField.type = "text";
        emailField.value = member.email;
        emailField.dataset.originalValue = member.email;
        emailCell.textContent = "";
        emailCell.append(emailField);

        /* The buttons change roles too: Edit/Delete out, Save/Cancel in.
           Arrow functions pass the two inputs along to the handlers. */
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

    /* NEW (Step 6) --- UPDATE, move two: change your mind ---
       Restore the parked originals, bring the normal buttons back. The
       server never finds out. */
    function cancelEdit(nameField, emailField) {
        nameCell.textContent = nameField.dataset.originalValue;
        emailCell.textContent = emailField.dataset.originalValue;
        showButtons();
    }

    /* NEW (Step 6) --- UPDATE, move three: PUT, then re-fetch ---
       PUT REPLACES the record at this URL, so the body must be the whole
       member: spread copies every existing field (id and active included),
       then name and email overwrite with the edits. */
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

            /* Re-fetch so the screen matches the server exactly - the
               redraw also puts the row back to its normal state. */
            await loadMembers();
            setTableStatus(`Saved changes to ${newName}.`, false);
        } catch (error) {
            console.log("PUT failed:", error.message);
            setTableStatus("Could not save. Is json-server running on port 3000?", true);
        }
    }

    /* --- DELETE: confirm, then remove, then reload --- */
    async function onDelete() {
        /* !!! TEMPORARY: the browser's built-in confirm() is a stop-gap.
           It's ugly, it freezes the page, and it can't be styled. This
           afternoon's Bootstrap modal replaces it. !!! */
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

/* ==== Live search ========================================================== */
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

/* ==== First load =========================================================== */
loadMembers();
