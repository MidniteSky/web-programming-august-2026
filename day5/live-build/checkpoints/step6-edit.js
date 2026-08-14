/*
    LIVE BUILD - STEP 6 of 6: UPDATE (edit in place) - THE FILE IS COMPLETE
    =======================================================================
    read -> search -> create -> toast -> delete [UPDATE] ... done!

    CATCHING UP? Copy this ENTIRE file over members.js and you have the
    finished Day 5 members.js. Everything marked  NEW (Step 6)  is what
    this final step adds; the rest is Steps 1-5, unchanged.

    WHAT THIS STEP ADDS - the last verb, and the fiddliest UI of the week:
      - a pencil (Edit) button beside each bin. Clicking it swaps the Name
        and Email cells for INPUT BOXES, and the buttons for Save/Cancel.
        No modal this time - you edit right where the data lives.
      - the three moves of in-place editing:
          startEdit()   - remember the originals (on the inputs themselves,
                          via dataset), swap text for inputs
          cancelEdit()  - put the originals back; the server never hears
                          about it
          saveEdit()    - validate, PUT the WHOLE member, re-fetch, toast
      - why PUT sends everything: PUT means "REPLACE the record at this
        URL". Send only { name }, and email and active would be gone. The
        spread (...member) copies every existing field, then name and email
        are written over the top with the edits. Copy all, change some.

    WHAT YOU SHOULD SEE when it works:
      - pencil on Alice: her name and email become editable boxes
      - Cancel: originals return, no request sent (check the Network tab)
      - edit and Save: table redraws with the change, toast confirms;
        refresh - it stuck, because the server has it
      - blank out a name and Save: refused politely, nothing sent

    NOTHING is "not working yet" any more. Compare this file with
    ../../solutions/membermanager/members.js - same app (that copy's
    comments are written as revision notes rather than a build diary).
    Then: run Lighthouse on the page, and on to the deploy - this file is
    exactly what goes live.

    >>> START THE SERVER FIRST (in this folder, which has db.json):
    >>>     npx json-server@0.17.4 --watch db.json --port 3000
*/

/* ---- One place for the server address --------------------------------------
   Runs against your local practice server by default. When you DEPLOY
   (GitHub Pages can't reach localhost - see demos/GITHUB-PAGES-DEPLOY.md),
   this is the one line you swap for a hosted API. */
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

/* ---- Bootstrap component controllers (need the JS bundle, loaded first) ----
   Each turns a modal/toast element into an object with .show() / .hide().
   Made ONCE each, up here - never inside a handler. */
const addModal = new bootstrap.Modal(document.querySelector("#addModal"));
const deleteModal = new bootstrap.Modal(document.querySelector("#deleteModal"));
const appToast = new bootstrap.Toast(document.querySelector("#appToast"));
const toastBody = document.querySelector("#toastBody");

/* The members we last loaded. Live search filters THIS (no request per key). */
let allMembers = [];

/* Which member the delete modal is currently about. Set when Delete is
   clicked (ask now), read when "Yes, delete" is confirmed (act later). */
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

/* ---- Build one row, with per-row Edit and Delete ---------------------------
   All the inner functions share this call's `member` - each row's handlers
   remember THEIR member (the Day 3 closure idea, now earning its keep).
   They also share the row's cells, which is what lets Edit rebuild the
   middle of its own row without touching any other. */
function buildRow(member) {
    const { id, name, email, active } = member;

    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = id;

    const nameCell = document.createElement("td");
    nameCell.textContent = name;

    const emailCell = document.createElement("td");
    emailCell.textContent = email;

    /* Active shown as a Bootstrap badge (green/grey). */
    const activeCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = active ? "badge text-bg-success" : "badge text-bg-secondary";
    badge.textContent = active ? "yes" : "no";
    activeCell.append(badge);

    const actionCell = document.createElement("td");

    /* --- Normal state: the row's buttons. Called again by cancelEdit and
       after renders, which is exactly why it's a function. --- */
    function showButtons() {
        actionCell.textContent = "";

        /* NEW (Step 6): the pencil. Same icon-button recipe as the bin:
           createElement for the <i>, aria-label for the spoken name,
           aria-hidden on the glyph. */
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

    /* NEW (Step 6) --- UPDATE, move one: swap text for inputs ---
       Each input is pre-filled with the current value, and ALSO carries the
       original in a data- attribute (dataset.originalValue) - parked on the
       element itself, right where Cancel will look for it. */
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

        /* The buttons change roles too: Edit/Delete out, Save/Cancel in.
           Arrow functions pass the two inputs along to the handlers. */
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
            showToast(`Saved changes to ${newName}.`);
        } catch (error) {
            console.log("PUT failed:", error.message);
            setTableStatus("Could not save. Is json-server running on port 3000?", true);
        }
    }

    /* --- DELETE, half one: ASK NOW (the confirm() replacement) ---
       Day 4's blocking one-liner, for the record:

           if (!confirm(`Delete ${member.name}? This cannot be undone.`)) return;
           // ...then the DELETE fetch ran right here.

       Now: remember the member, personalise the question, show the modal,
       stop. The acting half is at the bottom of the file. */
    function askDelete() {
        memberPendingDelete = member;
        deleteMessage.textContent = `Delete ${member.name}? This cannot be undone.`;
        deleteModal.show();
    }

    showButtons();
    row.append(idCell, nameCell, emailCell, activeCell, actionCell);
    return row;
}

/* ==== DELETE, half two: ACT LATER ==========================================
   The modal's "Yes, delete" button, wired ONCE for the whole app. Acts on
   whichever member askDelete() remembered, then forgets it. */
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
