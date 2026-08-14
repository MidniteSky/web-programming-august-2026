/*
    LIVE BUILD - STEP 1 of 5: READ
    ==============================
    [READ] -> search -> create -> delete -> update

    CATCHING UP? Copy this ENTIRE file over members.js and you are at the
    end of Step 1. Every checkpoint works this way.

    WHAT THIS STEP BUILDS (everything - it's the first step):
      - ONE constant holding the server address, so it lives in one place
      - grabbing the page elements we need, once, at the top
      - a tiny helper for the status line above the table
      - loadMembers(): ask the server for every member with a GET request,
        using the standard shape - fetch + async/await, check response.ok,
        try/catch around the lot
      - renderTable() + buildRow(): draw one <tr> per member, built safely
        with createElement and textContent (never innerHTML - Day 3's rule)

    WHAT YOU SHOULD SEE when it works:
      - the table fills with the six club members
      - Active reads "yes" in green or "no" in grey (the Day 2 classes)
      - the status line says "Loaded 6 members."
      - now stop the server (Ctrl+C) and refresh: the friendly red error
        appears instead of a broken page. Restart the server. That error
        path is not decoration - it's half the point.

    NOT WORKING YET (deliberately):
      - the Search box does nothing                          -> Step 2
      - the add form RELOADS THE PAGE when you press the button - watch
        the address bar: your name and email appear IN THE URL. That's the
        browser's built-in form submit from Day 1, and Step 3's first line
        of code is the fix.
      - the Actions column is empty                          -> Steps 4-5

    >>> START THE SERVER FIRST (in this folder, which has db.json):
    >>>     npx json-server@0.17.4 --watch db.json --port 3000
*/

/* ---- One place for the server address --------------------------------------
   Every request in this file starts from this one constant. If the server
   ever moves (a different port, or one day a hosted API), we change ONE
   line, not ten. */
const API = "http://localhost:3000/members";

/* ---- Page elements, grabbed once -------------------------------------------
   querySelector finds each element by its CSS selector ("#id" here). We do
   this once, at the top, and keep the results in constants - not inside
   every function that needs them. The ids come from members.html. */
const tableBody = document.querySelector("#memberRows");
const tableStatus = document.querySelector("#tableStatus");

/* ---- Small helper for the table's loading/error/loaded line ----------------
   The line above the table doubles as loading indicator, success note and
   error report. One helper owns it so every message looks the same. The
   classes are ours, from styles.css: plain, or red for errors. */
function setTableStatus(text, isError) {
    tableStatus.textContent = text;
    tableStatus.className = isError ? "table-status error" : "table-status";
}

/* ==== READ: load all members with GET ======================================
   The standard request shape, worth reading slowly because every other
   request we write today follows it exactly:

     1. show a loading state BEFORE the request - the network takes time
     2. await fetch(API)          - a GET request; await pauses THIS function
                                    (not the page!) until the reply arrives
     3. check response.ok         - fetch treats a 404 or 500 as a SUCCESSFUL
                                    delivery ("I asked, I got an answer").
                                    We throw so HTTP errors land in catch
                                    with the genuine network failures
     4. await response.json()     - parse the JSON body into an array for us
     5. catch                     - anything that went wrong above ends up
                                    here, and the user gets told kindly. */
async function loadMembers() {
    setTableStatus("Loading members...", false);
    try {
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error(`Server answered ${response.status}`);
        }
        const members = await response.json();
        renderTable(members);
        setTableStatus(`Loaded ${members.length} members.`, false);
    } catch (error) {
        console.log("Load failed:", error.message);
        setTableStatus(
            "Could not load members. Is json-server running on port 3000?", true);
    }
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

    /* Actions stays empty for now - Delete arrives in Step 4, Edit in
       Step 5. The column is already in the HTML, so the table lines up. */
    const actionCell = document.createElement("td");

    row.append(idCell, nameCell, emailCell, activeCell, actionCell);
    return row;
}

/* ==== First load ===========================================================
   Ask the server for the members as soon as the page opens. This line LIVES
   AT THE VERY END of the file, and stays there through every step - by the
   time it runs, everything above is defined. */
loadMembers();
