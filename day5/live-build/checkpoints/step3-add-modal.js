/*
    LIVE BUILD - STEP 3 of 6: CREATE (the Add-member modal)
    =======================================================
    read -> search [CREATE] -> toast -> delete -> update

    CATCHING UP? Copy this ENTIRE file over members.js and you are at the
    end of Step 3. Everything marked  NEW (Step 3)  is what this step adds;
    the rest is Steps 1-2, unchanged.

    WHAT THIS STEP ADDS - the add form finally saves, and the page-reload
    mystery is solved:
      - the modal's form gets a "submit" handler, and its FIRST line is
        event.preventDefault() - the fix for the reload you've been seeing.
        Since Day 1, submitting a form has meant "browser, please navigate".
        Today we say "thank you, we'll take it from here."
      - a Bootstrap MODAL CONTROLLER: the HTML opens the modal by itself
        (data-bs-toggle - no JS needed), but CLOSING it after a successful
        save is our job, from code. new bootstrap.Modal(element) hands us
        an object with .show() and .hide().
      - the POST request: same standard shape as the GET, plus three extras -
        method: "POST", a Content-Type header, and a JSON.stringify'd body.
      - validation first: blank name or email never leaves the browser.

    WHAT YOU SHOULD SEE when it works:
      - Add member -> fill the form -> Add: the modal CLOSES ITSELF, the new
        member appears in the table with a server-assigned id, and the
        status line confirms it
      - refresh the page: the new member is STILL THERE. It's on the server.
      - try to add with a blank name: a red message inside the modal, no
        request sent (watch the Network tab), the modal stays open
      - restart the server and look at db.json: your member is in the file.

    TEMPORARY, HONESTLY: success reports through the grey status line for
    now. It deserves better - Step 4 gives it a proper toast.

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

/* NEW (Step 3): the add-member modal's form and fields. The form now lives
   INSIDE the modal in members.html, but grabbing its pieces looks exactly
   like it did when the form sat on the page - ids don't care where the
   element lives. */
const addForm = document.querySelector("#addForm");
const nameInput = document.querySelector("#txtName");
const emailInput = document.querySelector("#txtEmail");
const activeInput = document.querySelector("#chkActive");
const feedback = document.querySelector("#formFeedback");

/* NEW (Step 3) ---- Bootstrap component controller ---------------------------
   new bootstrap.Modal(element) wraps the modal's HTML in an object with
   .show() and .hide() - our remote control. Two things to notice:
     1. `bootstrap` comes from the JS bundle loaded at the foot of the page,
        BEFORE this file. No bundle, no bootstrap - just an error.
     2. We build the controller ONCE, up here - never inside a handler.
        One modal, one controller; a handler that runs `new` every click
        makes a pile of controllers fighting over the same element. */
const addModal = new bootstrap.Modal(document.querySelector("#addModal"));

/* The members we last loaded. Live search filters THIS (no request per key). */
let allMembers = [];

/* ---- Small helpers --------------------------------------------------------- */

/* The table's loading/loaded/error line, in Bootstrap text colours. */
function setTableStatus(text, isError) {
    tableStatus.textContent = text;
    tableStatus.className = isError ? "fw-bold text-danger" : "fw-bold text-secondary";
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

/* NEW (Step 3) ==== CREATE: add a member with POST (from the modal form) =====
   The handler is `async` because it awaits the POST and then the reload.
   Read it as a story: stop the browser, check the input, send the member,
   then tidy up the stage - close the modal, blank the form, clear the
   search (so the newcomer is definitely visible), re-fetch. */
addForm.addEventListener("submit", async (event) => {
    /* THE line of the step. Without it: page reload, week-one style. */
    event.preventDefault();

    /* Validate BEFORE sending - the red message appears inside the modal,
       right where the user is looking, and nothing touches the network. */
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

    /* Build the new member WITHOUT an id - the server assigns ids, and it
       does not take suggestions. `{ name, email }` is shorthand for
       `{ name: name, email: email }` (Day 4). */
    const newMember = { name, email, active: activeInput.checked };

    try {
        /* The POST: same address, but now we say the method, declare what
           we're sending (JSON), and put the member - as a JSON STRING - in
           the body. JSON.stringify turns the object into that string. */
        const response = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMember)
        });
        if (!response.ok) throw new Error(`Server answered ${response.status}`);

        /* The server replies with the saved member - id included. */
        const saved = await response.json();
        console.log("Server saved:", saved);

        /* Success housekeeping: OUR job to close the modal (the HTML only
           opens it), reset the form for next time, clear the search so the
           new member can't be filtered out of sight, and re-fetch so the
           screen matches the server exactly. */
        addModal.hide();
        addForm.reset();
        searchBox.value = "";
        await loadMembers();

        /* TEMPORARY (replaced in Step 4): report success in the status
           line. It works, but the eye doesn't go there - it deserves a
           proper toast. */
        setTableStatus(`Added ${saved.name}. It's saved on the server now.`, false);
    } catch (error) {
        console.log("POST failed:", error.message);
        /* The modal is still open, so the error belongs inside it. */
        feedback.textContent = "Could not save. Is json-server running on port 3000?";
    }
});

/* ==== First load =========================================================== */
loadMembers();
