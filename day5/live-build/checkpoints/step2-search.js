/*
    LIVE BUILD - STEP 2 of 6: SEARCH
    ================================
    read [SEARCH] -> create -> toast -> delete -> update

    CATCHING UP? Copy this ENTIRE file over members.js and you are at the
    end of Step 2. Everything marked  NEW (Step 2)  is what this step adds;
    the rest is Step 1, unchanged.

    WHAT THIS STEP ADDS - the live search, and one big idea:
      KEEP WHAT YOU FETCHED. We store the last-loaded members in a variable
      (allMembers) and let the search filter THAT. No request per keystroke -
      we already have the data; asking the server again would be wasteful
      and slow. One new function (renderFiltered) sits between "we have
      members" and "draw the table", and everything flows through it.

    WHAT YOU SHOULD SEE when it works:
      - type "al" in Search: only Alice remains, INSTANTLY - and because we
        check emails too, "example" brings everyone back (it's in every email)
      - clear the box: everyone returns
      - type "zz": the friendly "No members match your search." row
      - the Network tab (F12) shows NO new requests while you type. That's
        the proof of the big idea.

    NOT WORKING YET (deliberately):
      - the Add-member modal still reloads the page on submit  -> Step 3
      - the Actions column is still empty                      -> Steps 5-6

    >>> START THE SERVER FIRST (in this folder, which has db.json):
    >>>     npx json-server@0.17.4 --watch db.json --port 3000
*/

/* ---- One place for the server address -------------------------------------- */
const API = "http://localhost:3000/members";

/* ---- Page elements, grabbed once ------------------------------------------- */
const tableBody = document.querySelector("#memberRows");
const tableStatus = document.querySelector("#tableStatus");

/* NEW (Step 2): the search box, same habit - grab it once, at the top. */
const searchBox = document.querySelector("#searchBox");

/* NEW (Step 2): the members we last loaded from the server. The search
   filters THIS array instead of pestering the server on every keystroke.
   It's `let`, not `const`, because loadMembers REPLACES it after every
   fetch - and it starts as an empty array so filtering before the first
   load simply matches nothing, rather than exploding. */
let allMembers = [];

/* ---- Small helpers --------------------------------------------------------- */

/* The table's loading/loaded/error line, in Bootstrap text colours. */
function setTableStatus(text, isError) {
    tableStatus.textContent = text;
    tableStatus.className = isError ? "fw-bold text-danger" : "fw-bold text-secondary";
}

/* ==== READ: load all members with GET ======================================
   Same standard shape as Step 1: loading state, fetch, response.ok check,
   parse, catch. Two lines changed - marked below. */
async function loadMembers() {
    setTableStatus("Loading members...", false);
    try {
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error(`Server answered ${response.status}`);
        }
        /* NEW (Step 2): KEEP the fetched list (it used to be a local
           constant), then render through the filter, so a reload respects
           whatever is in the search box. */
        allMembers = await response.json();
        renderFiltered();
        setTableStatus(`Loaded ${allMembers.length} members.`, false);
    } catch (error) {
        console.log("Load failed:", error.message);
        setTableStatus(
            "Could not load members. Is json-server running on port 3000?", true);
    }
}

/* NEW (Step 2) ---- Render whatever matches the current search ---------------
   The new middle layer: read the box, filter allMembers, hand the survivors
   to renderTable. EVERY path to the table now goes through here, so the
   screen always respects the search box. */
function renderFiltered() {
    /* trim() forgives stray spaces; toLowerCase() makes the match
       case-insensitive (we lowercase both sides). */
    const term = searchBox.value.trim().toLowerCase();

    /* Empty box -> show everyone. Otherwise keep a member when the term
       appears in their name OR their email. filter() (Day 3) builds a new
       array of just the members the test returns true for. */
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

/* NEW (Step 2) ==== Live search ==============================================
   "input" fires on every change to the box - typing, deleting, pasting -
   and each one just re-runs the filter over the array we already hold.
   One line of wiring; the function above does the thinking. */
searchBox.addEventListener("input", renderFiltered);

/* ==== First load =========================================================== */
loadMembers();
