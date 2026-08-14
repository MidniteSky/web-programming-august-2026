/*
    LIVE BUILD - STEP 3 of 5: CREATE
    ================================
    read -> search [CREATE] -> delete -> update

    CATCHING UP? Copy this ENTIRE file over members.js and you are at the
    end of Step 3. Everything marked  NEW (Step 3)  is what this step adds;
    the rest is Steps 1-2, unchanged.

    WHAT THIS STEP ADDS - the form finally saves, and the page-reload
    mystery is solved:
      - the add form gets a "submit" handler, and its FIRST line is
        event.preventDefault() - the fix for the reload you've been seeing.
        Since Day 1, submitting a form has meant "browser, please navigate"
        (that's why your typing kept appearing in the URL). Today we say
        "thank you, we'll take it from here."
      - the POST request: same standard shape as the GET, plus three
        extras - method: "POST", a Content-Type header, and a
        JSON.stringify'd body.
      - validation first: a blank name or email never leaves the browser.
      - after a successful save we RE-FETCH the whole list, so the new
        member appears with the id THE SERVER assigned.

    WHAT YOU SHOULD SEE when it works:
      - fill the form, press Add member: no reload, the new member appears
        in the table with a real id, and the green "Added ... It's saved on
        the server now." message shows under the form
      - refresh the page: the new member is STILL THERE. That is the whole
        point of today - the data lives on the server now, not in the page.
      - try a blank name: a red message, and the Network tab shows nothing
        was sent
      - peek at db.json in the editor: your member is in the file.

    NOT WORKING YET (deliberately):
      - the Actions column is still empty                    -> Steps 4-5

    >>> START THE SERVER FIRST (in this folder, which has db.json):
    >>>     npx json-server@0.17.4 --watch db.json --port 3000
*/

/* ---- One place for the server address -------------------------------------- */
const API = "http://localhost:3000/members";

/* ---- Page elements, grabbed once ------------------------------------------- */
const tableBody = document.querySelector("#memberRows");
const tableStatus = document.querySelector("#tableStatus");
const searchBox = document.querySelector("#searchBox");

/* NEW (Step 3): the add form and its fields, same habit as ever. */
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

    /* Active reuses the Day 2 colour classes. */
    const activeCell = document.createElement("td");
    activeCell.textContent = active ? "yes" : "no";
    activeCell.className = active ? "active-yes" : "active-no";

    /* Actions stays empty until Steps 4-5. */
    const actionCell = document.createElement("td");

    row.append(idCell, nameCell, emailCell, activeCell, actionCell);
    return row;
}

/* ==== Live search ========================================================== */
searchBox.addEventListener("input", renderFiltered);

/* NEW (Step 3) ==== CREATE: add a member with POST ===========================
   The handler is `async` because it awaits the POST and then the reload of
   the list. Read it as a story: stop the browser, check the input, send
   the member, then tidy up and re-fetch. */
addForm.addEventListener("submit", async (event) => {
    /* THE line of the step. Without it: page reload, name in the URL,
       week-one style. */
    event.preventDefault();

    /* Validate BEFORE sending - nothing touches the network unless both
       fields have something in them. */
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

    /* Build the new member WITHOUT an id - the server assigns ids, and it
       does not take suggestions. `{ name, email }` is shorthand for
       `{ name: name, email: email }`. */
    const newMember = { name, email, active: activeInput.checked };

    try {
        feedback.textContent = "Saving...";
        feedback.className = "form-feedback";

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

        /* Success housekeeping: blank the form for next time, clear the
           search so the newcomer can't be filtered out of sight, and
           re-fetch so the screen matches the server exactly. */
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
