/*
    LIVE BUILD - STEP 4 of 6: TOAST
    ===============================
    read -> search -> create [TOAST] -> delete -> update

    CATCHING UP? Copy this ENTIRE file over members.js and you are at the
    end of Step 4. Everything marked  NEW (Step 4)  is what this step adds;
    the rest is Steps 1-3, unchanged.

    WHAT THIS STEP ADDS - deliberately small, and a pattern worth noticing:
      - a toast controller, made exactly like the modal controller was:
        new bootstrap.Toast(element), once, at the top. Bootstrap's
        interactive components all work this way - learn one, you've
        learnt the lot.
      - showToast(message): set the text, pop the toast. FOUR lines, written
        as a helper precisely BECAUSE Step 5 wants it too ("Deleted Bob.").
        Write things once; reuse them shamelessly.
      - the add-member success now announces itself bottom-right and tidies
        itself away, instead of whispering into the status line.

    There is only ONE toast element in the HTML, reused for every message -
    like one notice-board we pin different notices to, rather than building
    a new notice-board per notice.

    WHAT YOU SHOULD SEE when it works:
      - add a member: the modal closes AND a toast slides in bottom-right -
        "Added Grace. It's saved on the server now." - then fades away on
        its own a few seconds later
      - the status line goes back to plain "Loaded 7 members." - the
        temporary success message from Step 3 has moved out.

    NOT WORKING YET (deliberately):
      - the Actions column is still empty                     -> Steps 5-6

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

/* ---- Bootstrap component controllers (need the JS bundle, loaded first) ----
   Same recipe as the modal: wrap the element once, keep the controller. */
const addModal = new bootstrap.Modal(document.querySelector("#addModal"));

/* NEW (Step 4): the toast controller, and the element inside it that holds
   the message text. */
const appToast = new bootstrap.Toast(document.querySelector("#appToast"));
const toastBody = document.querySelector("#toastBody");

/* The members we last loaded. Live search filters THIS (no request per key). */
let allMembers = [];

/* ---- Small helpers --------------------------------------------------------- */

/* The table's loading/loaded/error line, in Bootstrap text colours. */
function setTableStatus(text, isError) {
    tableStatus.textContent = text;
    tableStatus.className = isError ? "fw-bold text-danger" : "fw-bold text-secondary";
}

/* NEW (Step 4): set the toast's message and pop it. A helper, not a
   one-off, because save AND delete (Step 5) both want it. The toast hides
   itself after a few seconds - Bootstrap's doing, not ours. */
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

/* ---- Build one row for one member ------------------------------------------ */
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

    /* Actions stays empty until Steps 5-6. */
    const actionCell = document.createElement("td");

    row.append(idCell, nameCell, emailCell, activeCell, actionCell);
    return row;
}

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

        /* Close the modal, tidy the form, refresh the table... */
        addModal.hide();
        addForm.reset();
        searchBox.value = "";
        await loadMembers();

        /* NEW (Step 4): ...and toast the result. This replaces Step 3's
           temporary status-line message. */
        showToast(`Added ${saved.name}. It's saved on the server now.`);
    } catch (error) {
        console.log("POST failed:", error.message);
        feedback.textContent = "Could not save. Is json-server running on port 3000?";
    }
});

/* ==== First load =========================================================== */
loadMembers();
