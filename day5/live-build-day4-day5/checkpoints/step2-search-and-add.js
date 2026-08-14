/*
    LIVE BUILD - STEP 2 of 6: SEARCH + ADD (in memory)
    ==================================================
    render [SEARCH+ADD] -> the switch -> create -> delete -> update

    CATCHING UP? Copy this ENTIRE file over members.js and you are at the
    end of Step 2. Everything marked  NEW (Step 2)  is what this step adds;
    the rest is Step 1, unchanged.

    STILL NO SERVER NEEDED. This step completes the Day 3 version of the
    app - and ends on a cliffhanger.

    WHAT THIS STEP ADDS:
      - live search: renderFiltered() sits between "we have members" and
        "draw the table", filtering the array on every keystroke. EVERY
        path to the table now goes through it, so the screen always
        respects the search box.
      - the add form finally works: a "submit" handler whose FIRST line is
        event.preventDefault() - the fix for the reload (and the URL
        query string) you've been seeing. Since Day 1, submitting a form
        has meant "browser, please navigate". We take over from here.
      - the new member is pushed INTO THE ARRAY, with an id we mint
        ourselves (nextId). Keep one suspicious eye on that - who should
        REALLY be handing out ids?

    WHAT YOU SHOULD SEE when it works:
      - type "al" in Search: only Alice remains, instantly; "example"
        brings everyone back (it's in every email); "zz" shows the
        friendly no-matches row
      - add a member: no reload, they appear in the table with id 7, and
        the amber truth appears under the form: "in memory only"

    NOW DO THE CLIFFHANGER (this is the whole point of the step):
      - add someone. See them in the table. Now REFRESH THE PAGE.
      - ...gone. Of course they're gone. The "database" is six hard-coded
        lines in this file, and the browser just re-read the file. Nothing
        the user does can outlive the page.
      - THAT is the problem the rest of today solves. The data needs to
        live somewhere that ISN'T the page. Next step: a server.

    NOT WORKING YET (deliberately):
      - added members don't survive a refresh                -> Steps 3-4
      - the Actions column is empty                          -> Steps 5-6
*/

/* ---- The data: our six canonical members -----------------------------------
   The entire "database", hard-coded. Enjoy it while it lasts - Step 3
   deletes it. */
const members = [
    { id: 1, name: "Aidan", email: "aidan@example.com", active: true },
    { id: 2, name: "Alice", email: "alice@example.com", active: true },
    { id: 3, name: "Bob",   email: "bob@example.com",   active: false },
    { id: 4, name: "Carol", email: "carol@example.com", active: true },
    { id: 5, name: "Dave",  email: "dave@example.com",  active: false },
    { id: 6, name: "Eve",   email: "eve@example.com",   active: true }
];

/* NEW (Step 2): the id to give the next new member. Our six start at 1-6,
   so the next is 7; it climbs by one each time we add someone. Minting ids
   ourselves works... as long as this file is the only place members come
   from. Remember this variable - it doesn't survive the week. */
let nextId = 7;

/* ---- Page elements, grabbed once ------------------------------------------- */
const tableBody = document.querySelector("#memberRows");
const tableStatus = document.querySelector("#tableStatus");

/* NEW (Step 2): the search box and the add form's pieces, same habit -
   grab them once, at the top. */
const searchBox = document.querySelector("#searchBox");
const addForm = document.querySelector("#addForm");
const nameInput = document.querySelector("#txtName");
const emailInput = document.querySelector("#txtEmail");
const activeInput = document.querySelector("#chkActive");
const feedback = document.querySelector("#formFeedback");

/* ---- Small helper for the line above the table ----------------------------- */
function setTableStatus(text, isError) {
    tableStatus.textContent = text;
    tableStatus.className = isError ? "table-status error" : "table-status";
}

/* NEW (Step 2) ---- Render whatever matches the current search ---------------
   The new middle layer: read the box, filter the array, hand the
   survivors to renderTable. Called on every keystroke AND after an add,
   so the screen always respects the search box. */
function renderFiltered() {
    /* trim() forgives stray spaces; toLowerCase() makes the match
       case-insensitive (we lowercase both sides). */
    const term = searchBox.value.trim().toLowerCase();

    /* Empty box -> show everyone. Otherwise keep a member when the term
       appears in their name OR their email. filter() builds a new array
       of just the members the test returns true for. */
    const matches = term === ""
        ? members
        : members.filter((member) => {
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
        /* NEW (Step 2): an empty table now almost always means "your search
           matched nobody", so the message says so. */
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

    /* Actions stays empty until Steps 5-6. */
    const actionCell = document.createElement("td");

    row.append(idCell, nameCell, emailCell, activeCell, actionCell);
    return row;
}

/* NEW (Step 2) ==== Live search ==============================================
   "input" fires on every change to the box - typing, deleting, pasting -
   and each one just re-runs the filter over the array. One line of
   wiring; the function above does the thinking. */
searchBox.addEventListener("input", renderFiltered);

/* NEW (Step 2) ==== Add a member (IN MEMORY - the honest version) ============
   Take control of the form's submit, validate, push into the array,
   re-render. It looks like it works. It half does. */
addForm.addEventListener("submit", (event) => {
    /* THE line: stop the browser reloading and putting ?name=... in the
       URL. The Day 1 query-string thread, finally paid off. */
    event.preventDefault();

    /* Validate first - .trim() turns "   " into "" so blanks are caught. */
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

    /* Build the new member in our data shape, mint the id ourselves, and
       push it into the array. `{ name, email }` is shorthand for
       `{ name: name, email: email }`. */
    const newMember = { id: nextId, name, email, active: activeInput.checked };
    members.push(newMember);
    nextId = nextId + 1;

    /* Confirm - with the honest small print - then tidy up and re-render.
       Clearing the search first means the newcomer can't be filtered out
       of sight. */
    addForm.reset();
    activeInput.checked = false;
    searchBox.value = "";
    renderFiltered();
    setTableStatus(`Showing ${members.length} members (from an array in this file).`, false);

    feedback.textContent = `Added ${name}. (In memory only - a refresh clears it.)`;
    feedback.className = "form-feedback ok";
});

/* ==== First paint ========================================================== */
renderFiltered();
setTableStatus(`Showing ${members.length} members (from an array in this file).`, false);
