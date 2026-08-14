/*
    LIVE BUILD - STEP 1 of 6: RENDER (from a hard-coded array)
    ==========================================================
    [RENDER] -> search+add -> the switch -> create -> delete -> update

    CATCHING UP? Copy this ENTIRE file over members.js and you are at the
    end of Step 1. Every checkpoint works this way.

    NO SERVER NEEDED for this step (or the next) - the data lives right
    here in the file, and the browser is the only tool required. Remember
    that fact: it becomes the whole plot in Step 3.

    WHAT THIS STEP BUILDS (everything - it's the first step):
      - the data: an ARRAY of member objects, the week's shape
        { id, name, email, active }, hard-coded at the top
      - grabbing the page elements we need, once, at the top
      - a tiny helper for the status line above the table
      - renderTable() + buildRow(): draw one <tr> per member, built safely
        with createElement and textContent (never innerHTML - Day 3's rule)

    WHAT YOU SHOULD SEE when it works:
      - the table fills with the six club members, INSTANTLY - no loading,
        no network, nothing in the Network tab (F12). Look: it's empty.
        The data never travelled anywhere; it was in the file all along.
      - Active reads "yes" in green or "no" in grey (the Day 2 classes)
      - the status line says "Showing 6 members (from an array in this file)."

    NOT WORKING YET (deliberately):
      - the Search box does nothing                          -> Step 2
      - the add form RELOADS THE PAGE when you press the button - watch
        the address bar: your name and email appear IN THE URL. That's the
        browser's built-in form submit from Day 1; Step 2 takes over.
      - the Actions column is empty                          -> Steps 5-6
*/

/* ---- The data: our six canonical members -----------------------------------
   Bob and Dave are inactive; everyone else is active. Same shape as the
   Day 1 table and every day since: { id, name, email, active }.

   Sit with this for a second, because Step 3 changes it: the ENTIRE
   database of this app is, right now, six lines of JavaScript. Close the
   tab and reopen it - same six. Nothing you do on the page can outlive
   the page. */
const members = [
    { id: 1, name: "Aidan", email: "aidan@example.com", active: true },
    { id: 2, name: "Alice", email: "alice@example.com", active: true },
    { id: 3, name: "Bob",   email: "bob@example.com",   active: false },
    { id: 4, name: "Carol", email: "carol@example.com", active: true },
    { id: 5, name: "Dave",  email: "dave@example.com",  active: false },
    { id: 6, name: "Eve",   email: "eve@example.com",   active: true }
];

/* ---- Page elements, grabbed once -------------------------------------------
   querySelector finds each element by its CSS selector ("#id" here). We do
   this once, at the top, and keep the results in constants - not inside
   every function that needs them. The ids come from members.html. */
const tableBody = document.querySelector("#memberRows");
const tableStatus = document.querySelector("#tableStatus");

/* ---- Small helper for the line above the table -----------------------------
   The HTML ships saying "Loading members..." - which is a fib at the
   moment, since nothing loads. This helper lets us put honest text there.
   (The isError flag paints it red via our styles.css classes; it earns
   its keep properly once a server is involved.) */
function setTableStatus(text, isError) {
    tableStatus.textContent = text;
    tableStatus.className = isError ? "table-status error" : "table-status";
}

/* ---- Draw a list of members into the table ---------------------------------
   Wipe the tbody, then append one row per member. textContent = "" is the
   safe way to empty an element (no innerHTML, ever, for data). */
function renderTable(list) {
    tableBody.textContent = "";

    /* An empty list gets a friendly single row, not a blank void. */
    if (list.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.textContent = "No members to show.";
        cell.colSpan = 5;
        row.append(cell);
        tableBody.append(row);
        return;
    }

    list.forEach((member) => tableBody.append(buildRow(member)));
}

/* ---- Build one row for one member ------------------------------------------
   Everything is built with createElement + textContent. Slower to type than
   innerHTML, and worth it: whatever is in the data lands on the page as
   TEXT, never as markup. That habit is non-negotiable. */
function buildRow(member) {
    /* Destructure the fields we display - four tidy constants instead of
       member.name, member.email everywhere. */
    const { id, name, email, active } = member;

    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = id;

    const nameCell = document.createElement("td");
    nameCell.textContent = name;

    const emailCell = document.createElement("td");
    emailCell.textContent = email;

    /* Active reuses the Day 2 colour classes: green "yes", grey "no". */
    const activeCell = document.createElement("td");
    activeCell.textContent = active ? "yes" : "no";
    activeCell.className = active ? "active-yes" : "active-no";

    /* Actions stays empty for now - Delete arrives in Step 5, Edit in
       Step 6. The column is already in the HTML, so the table lines up. */
    const actionCell = document.createElement("td");

    row.append(idCell, nameCell, emailCell, activeCell, actionCell);
    return row;
}

/* ==== First paint ==========================================================
   Show every member as soon as the page loads, and tell the truth about
   where they came from. This lives AT THE VERY END of the file, and stays
   there through every step - by the time it runs, everything above is
   defined. */
renderTable(members);
setTableStatus(`Showing ${members.length} members (from an array in this file).`, false);
