/*
    LIVE BUILD - STEP 5 of 6: DELETE (the confirm-in-a-modal pattern)
    =================================================================
    read -> search -> create -> toast [DELETE] -> update

    CATCHING UP? Copy this ENTIRE file over members.js and you are at the
    end of Step 5. Everything marked  NEW (Step 5)  is what this step adds;
    the rest is Steps 1-4, unchanged.

    WHAT THIS STEP ADDS - the promise from Day 4, kept:
      - every row grows a red Delete button (icon-only, with an aria-label
        so a screen reader still announces "Delete Bob")
      - Day 4 would have used the browser's confirm() here - ugly, frozen,
        unstyleable. We flagged it then as a stop-gap. Its replacement needs
        a genuinely new PATTERN, because confirm() BLOCKS (the whole page
        stands still until you answer) and a modal DOESN'T. One line
        becomes two halves:

          ASK NOW:   clicking Delete just REMEMBERS which member
                     (memberPendingDelete) and shows the modal. Then the
                     function ENDS. Nothing is deleted.
          ACT LATER: the modal's own "Yes, delete" button - wired up ONCE,
                     at the bottom of the file, not once per row - reads
                     the remembered member and sends the DELETE request.
          (Cancel and the X need no code at all: data-bs-dismiss in the
          HTML closes the modal, the remembered member just never gets
          acted on.)

      - the old confirm() line is kept below AS A COMMENT, so you can see
        exactly what became of it.

    WHAT YOU SHOULD SEE when it works:
      - click a row's bin icon: a modal asks "Delete Bob? This cannot be
        undone." - the page behind it dims but is NOT frozen
      - Cancel: nothing happens, nobody is harmed
      - Yes, delete: modal closes, row disappears, toast confirms
      - refresh: still gone. It was deleted on the server, not just hidden.

    NOT WORKING YET (deliberately):
      - no Edit button                                        -> Step 6

    >>> START THE SERVER FIRST (in this folder, which has db.json):
    >>>     npx json-server@0.17.4 --watch db.json --port 3000
*/

/* ---- One place for the server address -------------------------------------- */
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

/* NEW (Step 5): the delete-confirm modal's pieces - the <p> we write the
   "Delete Bob?" question into, and its "Yes, delete" button. */
const deleteMessage = document.querySelector("#deleteMessage");
const confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");

/* ---- Bootstrap component controllers (need the JS bundle, loaded first) ---- */
const addModal = new bootstrap.Modal(document.querySelector("#addModal"));

/* NEW (Step 5): a controller for the delete modal, same recipe as ever. */
const deleteModal = new bootstrap.Modal(document.querySelector("#deleteModal"));

const appToast = new bootstrap.Toast(document.querySelector("#appToast"));
const toastBody = document.querySelector("#toastBody");

/* The members we last loaded. Live search filters THIS (no request per key). */
let allMembers = [];

/* NEW (Step 5): which member the delete modal is currently about. This is
   the bridge between the two halves of the pattern: SET when a row's
   Delete is clicked (ask now), READ when "Yes, delete" is clicked (act
   later). null means "no delete pending". */
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

/* ---- Build one row, now with a per-row Delete ------------------------------
   NEW-ish (Step 5): buildRow now contains little inner functions. They can
   all see `member` - each row's functions remember THEIR member, because
   the functions were made inside the call that received it. That's the
   closure idea from Day 3, and it's what makes per-row buttons this tidy. */
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

    /* NEW (Step 5) --- the row's buttons, in a function of their own ---
       Why a function and not just "append the button"? Because Step 6's
       Edit will REPLACE these buttons with Save/Cancel while editing, and
       will need a way to put them BACK afterwards. Building for the very
       near future, honestly labelled. */
    function showButtons() {
        actionCell.textContent = "";

        /* An icon-only button: the <i> is built with createElement like
           everything else (no innerHTML, even for our own markup - one
           habit, no exceptions). Two accessibility touches from Block 2:
           aria-label gives the button its spoken name, aria-hidden stops
           screen readers trying to pronounce the icon glyph. */
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-sm btn-danger";
        deleteBtn.setAttribute("aria-label", `Delete ${member.name}`);
        const deleteIcon = document.createElement("i");
        deleteIcon.className = "bi bi-trash";
        deleteIcon.setAttribute("aria-hidden", "true");
        deleteBtn.append(deleteIcon);
        deleteBtn.addEventListener("click", askDelete);

        actionCell.append(deleteBtn);
    }

    /* NEW (Step 5) --- DELETE, half one: ASK NOW ---
       Day 4 did the whole thing right here, in one blocking line:

           if (!confirm(`Delete ${member.name}? This cannot be undone.`)) return;
           // ...then the DELETE fetch ran right here.

       Now: remember which member this is about, personalise the question,
       show the modal - and STOP. No request. The other half (ACT LATER)
       lives at the bottom of the file, on the modal's own button. */
    function askDelete() {
        memberPendingDelete = member;
        deleteMessage.textContent = `Delete ${member.name}? This cannot be undone.`;
        deleteModal.show();
    }

    showButtons();
    row.append(idCell, nameCell, emailCell, activeCell, actionCell);
    return row;
}

/* NEW (Step 5) ==== DELETE, half two: ACT LATER =============================
   The modal's "Yes, delete" button, wired up ONCE for the whole app - NOT
   once per row. There's only one such button in the HTML; a listener per
   row would stack up and fire several deletes at once. It acts on
   whichever member askDelete() remembered, then forgets it. */
confirmDeleteBtn.addEventListener("click", async () => {
    /* Belt and braces: no remembered member, nothing to do. */
    if (memberPendingDelete === null) {
        return;
    }
    const member = memberPendingDelete;

    try {
        /* The DELETE request: the member's own URL (/members/3), the verb,
           and nothing else - no body needed. The URL says it all. */
        const response = await fetch(`${API}/${member.id}`, { method: "DELETE" });
        if (!response.ok) throw new Error(`Server answered ${response.status}`);

        /* Tidy up: close the modal, forget the pending member, re-fetch so
           the row vanishes, and toast the deed (Step 4's helper, reused
           exactly as promised). */
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
