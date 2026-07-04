/*
    Member Manager v3 - members.js  (Day 3 capstone)
    ================================================
    This is the day the Member Manager stops being three documents and becomes
    a small program. Everything here uses only what we learned today:
      - an array of member objects (the week's data shape)
      - functions, a loop, filter
      - the DOM: querySelector, createElement, textContent, append
      - events: addEventListener, "input" and "submit", and preventDefault

    What it does:
      1. Renders the members table from the array below (the <tbody> in
         members.html starts empty - JavaScript fills it).
      2. A search box filters the table live as you type.
      3. The "Add a member" form appends to the array and re-renders, all in
         memory - no page reload, no query string in the URL. That last part
         pays off the Day 1 promise about the form button.

    Boundary reminder (Day 3): the data lives here, hard-coded. Nothing is
    saved - refresh the page and added members are gone. Making it stick means
    talking to a server, which is tomorrow's whole story (Day 4).
*/

/* ---- The data: our six canonical members ---------------------------------
   Bob and Dave are inactive; everyone else is active. Same shape as the Day 1
   table and every day since: { id, name, email, active }. */
const members = [
    { id: 1, name: "Aidan", email: "aidan@example.com", active: true },
    { id: 2, name: "Alice", email: "alice@example.com", active: true },
    { id: 3, name: "Bob",   email: "bob@example.com",   active: false },
    { id: 4, name: "Carol", email: "carol@example.com", active: true },
    { id: 5, name: "Dave",  email: "dave@example.com",  active: false },
    { id: 6, name: "Eve",   email: "eve@example.com",   active: true }
];

/* The id to give the next new member. Our six start at 1-6, so the next is 7;
   it climbs by one each time we add someone. */
let nextId = 7;

/* ---- Grab the page elements we need, once ---------------------------------
   These sit in members.html. We look them up a single time and reuse them. */
const tableBody = document.querySelector("#memberRows");
const searchBox = document.querySelector("#searchBox");
const addForm = document.querySelector("#addForm");
const nameInput = document.querySelector("#txtName");
const emailInput = document.querySelector("#txtEmail");
const activeInput = document.querySelector("#chkActive");
const feedback = document.querySelector("#formFeedback");

/* ---- Build one table row from one member object --------------------------
   Returns a <tr> with four <td> cells, matching the table's columns. We use
   createElement + textContent (never innerHTML) so a member's name is always
   treated as plain text - the safe habit from demo 17. */
function buildRow(member) {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = member.id;

    const nameCell = document.createElement("td");
    nameCell.textContent = member.name;

    const emailCell = document.createElement("td");
    emailCell.textContent = member.email;

    /* The Active cell shows yes/no and reuses the Day 2 colour classes. */
    const activeCell = document.createElement("td");
    if (member.active) {
        activeCell.textContent = "yes";
        activeCell.className = "active-yes";
    } else {
        activeCell.textContent = "no";
        activeCell.className = "active-no";
    }

    row.append(idCell);
    row.append(nameCell);
    row.append(emailCell);
    row.append(activeCell);
    return row;
}

/* ---- Render a list of members into the table -----------------------------
   Empties the tbody first (textContent = "" clears it), then appends a row per
   member. Called on load, after every search keystroke, and after an add. */
function renderTable(list) {
    /* Clear whatever is there now. */
    tableBody.textContent = "";

    /* If nothing matches, show a single friendly row instead of a blank table. */
    if (list.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.textContent = "No members match your search.";
        /* Span the message across all four columns. */
        cell.colSpan = 4;
        row.append(cell);
        tableBody.append(row);
        return;
    }

    /* One row per member. */
    list.forEach((member) => {
        const row = buildRow(member);
        tableBody.append(row);
    });
}

/* ---- Live search ----------------------------------------------------------
   On every keystroke, keep only the members whose name or email contains what
   was typed (case-insensitive), and re-render. */
searchBox.addEventListener("input", () => {
    const term = searchBox.value.trim().toLowerCase();

    const matches = members.filter((member) => {
        const inName = member.name.toLowerCase().includes(term);
        const inEmail = member.email.toLowerCase().includes(term);
        return inName || inEmail;
    });

    renderTable(matches);
});

/* ---- Add a member ---------------------------------------------------------
   Take control of the form's submit, validate, add to the array, re-render. */
addForm.addEventListener("submit", (event) => {
    /* Stop the browser reloading and adding ?name=... to the URL. This is the
       Day 1 query-string thread, finally paid off. */
    event.preventDefault();

    /* Read the typed values. .trim() turns "   " into "" so blanks are caught. */
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const active = activeInput.checked;

    /* ---- Simple validation, with friendly feedback ---- */
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

    /* Build the new member object in our data shape, then add it to the array. */
    const newMember = {
        id: nextId,
        name: name,
        email: email,
        active: active
    };
    members.push(newMember);
    nextId = nextId + 1;

    /* Confirm, tidy up, and show the full, updated table. */
    feedback.textContent = `Added ${name}. (This is in memory only - a refresh clears it.)`;
    feedback.className = "form-feedback ok";
    addForm.reset();
    searchBox.value = "";
    renderTable(members);
});

/* ---- First paint ----------------------------------------------------------
   Show every member as soon as the page loads. */
renderTable(members);
