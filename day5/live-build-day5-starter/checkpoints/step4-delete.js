/*
    LIVE BUILD - STEP 4 of 5: DELETE
    ================================
    read -> search -> create [DELETE] -> update

    CATCHING UP? Copy this ENTIRE file over members.js and you are at the
    end of Step 4. Everything marked  NEW (Step 4)  is what this step adds;
    the rest is Steps 1-3, unchanged.

    WHAT THIS STEP ADDS - the first per-row button, and a big idea with it:
      - every row grows a red Delete button. The interesting part is HOW
        each button knows which member it belongs to: the handler is made
        INSIDE buildRow, so it can simply see that call's `member`. Each
        row's functions remember THEIR member - that's the closure idea
        from Day 3, finally earning its keep.
      - the DELETE request itself is the smallest of the four verbs: the
        member's own URL (/members/3), the method, and nothing else. The
        URL says it all.
      - a confirm() first, because delete is forever.

    WHAT YOU SHOULD SEE when it works:
      - click Delete on a row: the browser asks "Delete Bob? This cannot
        be undone." Cancel does nothing; OK removes the row
      - refresh: still gone. Deleted on the server, not just hidden.

    AN HONEST WART, flagged on purpose: confirm() is ugly, it can't be
    styled, and it FREEZES the whole page until you answer. It's a
    stop-gap. This afternoon, Bootstrap gives us a proper modal dialog and
    this exact line gets replaced - watch for it.

    NOT WORKING YET (deliberately):
      - no Edit button                                       -> Step 5

    >>> START THE SERVER FIRST (in this folder, which has db.json):
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

/* ---- Build one row, now with a per-row Delete ------------------------------
   NEW-ish (Step 4): buildRow now contains little inner functions. They can
   all see `member` - each row's functions remember THEIR member, because
   the functions were made inside the call that received it. */
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

    /* NEW (Step 4) --- the row's buttons, in a function of their own ---
       Why a function and not just "append the button"? Because Step 5's
       Edit will REPLACE these buttons with Save/Cancel while editing, and
       will need a way to put them BACK afterwards. Building for the very
       near future, honestly labelled. */
    function showButtons() {
        actionCell.textContent = "";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "row-btn delete-btn";
        deleteBtn.addEventListener("click", onDelete);

        actionCell.append(deleteBtn);
    }

    /* NEW (Step 4) --- DELETE: confirm, then remove, then reload --- */
    async function onDelete() {
        /* !!! TEMPORARY: the browser's built-in confirm() is a stop-gap.
           It's ugly, it freezes the page, and it can't be styled. This
           afternoon's Bootstrap modal replaces it. !!! */
        if (!confirm(`Delete ${member.name}? This cannot be undone.`)) {
            return;   // user clicked Cancel
        }

        try {
            /* The DELETE request: the member's own URL and the verb.
               No body needed - the URL says which one. */
            const response = await fetch(`${API}/${member.id}`, { method: "DELETE" });
            if (!response.ok) throw new Error(`Server answered ${response.status}`);

            /* Re-fetch so the row vanishes and the screen matches the
               server exactly. */
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
