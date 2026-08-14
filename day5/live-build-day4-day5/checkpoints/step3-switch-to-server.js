/*
    LIVE BUILD - STEP 3 of 6: THE SWITCH (array out, server in)
    ===========================================================
    render -> search+add [THE SWITCH] -> create -> delete -> update

    CATCHING UP? Copy this ENTIRE file over members.js and you are at the
    end of Step 3. Everything marked  NEW (Step 3)  is what this step adds
    (and one big thing it REMOVES); the rest is Steps 1-2, unchanged.

    >>> THE SERVER IS NEEDED FROM NOW ON. In a terminal in this folder
    >>> (the one with db.json), run EXACTLY:
    >>>     npx json-server@0.17.4 --watch db.json --port 3000

    WHAT THIS STEP DOES - the biggest single move of the week:
      - the hard-coded array IS DELETED. Six lines, gone. In its place:
        an EMPTY array (allMembers) and a promise to fill it from a server
      - loadMembers(): ask the server for every member with a GET request,
        using the standard shape - fetch + async/await, check response.ok,
        try/catch around the lot
      - and here is the beautiful part: renderTable, buildRow and the
        search DID NOT CHANGE. Not a line. They never cared where the
        array came from - they just draw and filter whatever they're
        given. That's what good structure buys you: we swapped the
        foundation and the house didn't notice.

    WHAT YOU SHOULD SEE when it works:
      - ...the same six members. IDENTICAL table. So what changed?
        Open the Network tab (F12) and refresh: there's the request to
        localhost:3000/members - the data now TRAVELS to the page.
        Yesterday the file was the database; now db.json is.
      - stop the server (Ctrl+C) and refresh: the friendly red error.
        Start it again. The page now DEPENDS on something outside itself.
      - open db.json in the editor, change a name, save, refresh the
        page: the change appears. You just edited the database by hand.

    AN HONEST WART, on purpose: the add form still pushes into the
    FETCHED COPY of the list. It shows up in the table... and a refresh
    wipes it, SAME AS BEFORE - because the server was never told. GET
    only READS. Telling the server about new members is a different verb,
    and it's the very next step. (nextId survives for now, minting ids
    the server knows nothing about. It's living on borrowed time.)

    NOT WORKING YET (deliberately):
      - added members still don't survive a refresh          -> Step 4
      - the Actions column is empty                          -> Steps 5-6
*/

/* NEW (Step 3) ---- One place for the server address -------------------------
   The six hard-coded members USED TO BE HERE. They now live in db.json,
   and this constant says where to ask for them. Every request in this
   file starts from this one line - if the server ever moves, we change
   ONE line, not ten. */
const API = "http://localhost:3000/members";

/* NEW (Step 3): the members we last loaded from the server. This REPLACES
   the hard-coded array. It's `let`, not `const`, because loadMembers
   REPLACES it after every fetch - and it starts EMPTY: until the server
   answers, we genuinely have no members. */
let allMembers = [];

/* Still minting ids ourselves - for one more step. (The server has its
   own opinion about ids, as Step 4 will show.) */
let nextId = 7;

/* ---- Page elements, grabbed once ------------------------------------------- */
const tableBody = document.querySelector("#memberRows");
const tableStatus = document.querySelector("#tableStatus");
const searchBox = document.querySelector("#searchBox");
const addForm = document.querySelector("#addForm");
const nameInput = document.querySelector("#txtName");
const emailInput = document.querySelector("#txtEmail");
const activeInput = document.querySelector("#chkActive");
const feedback = document.querySelector("#formFeedback");

/* ---- Small helper for the line above the table -----------------------------
   Now doing the job it was born for: loading, loaded, and error states. */
function setTableStatus(text, isError) {
    tableStatus.textContent = text;
    tableStatus.className = isError ? "table-status error" : "table-status";
}

/* NEW (Step 3) ==== READ: load all members with GET ==========================
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
        /* KEEP the fetched list, then render through the filter, so a
           reload respects whatever is in the search box. */
        allMembers = await response.json();
        renderFiltered();
        setTableStatus(`Loaded ${allMembers.length} members.`, false);
    } catch (error) {
        console.log("Load failed:", error.message);
        setTableStatus(
            "Could not load members. Is json-server running on port 3000?", true);
    }
}

/* ---- Render whatever matches the current search ----------------------------
   UNCHANGED except for one word: it filters allMembers (the fetched list)
   instead of members (the deleted array). It never cared where the array
   came from. */
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

/* ---- Draw a list of members into the table ---------------------------------
   UNCHANGED from Step 1. Data in, rows out. */
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

/* ---- Build one row for one member ------------------------------------------
   UNCHANGED from Step 1. It draws whatever member it's handed. */
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

/* ==== Live search ========================================================== */
searchBox.addEventListener("input", renderFiltered);

/* ==== Add a member (STILL in memory - deliberately unfinished) ==============
   Almost unchanged from Step 2: it pushes into allMembers now, which is
   only OUR COPY of the server's list. The table shows the newcomer; the
   server has no idea they exist; a refresh re-fetches the truth and
   they're gone. The fix - actually TELLING the server - is Step 4. */
addForm.addEventListener("submit", (event) => {
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

    const newMember = { id: nextId, name, email, active: activeInput.checked };
    allMembers.push(newMember);
    nextId = nextId + 1;

    addForm.reset();
    activeInput.checked = false;
    searchBox.value = "";
    renderFiltered();

    /* NEW (Step 3): the small print got smaller print. */
    feedback.textContent =
        `Added ${name}. (In memory only - the server has NOT been told. A refresh clears it.)`;
    feedback.className = "form-feedback ok";
});

/* ==== First load ===========================================================
   NEW (Step 3): was renderTable(members) - draw what we have. Now it's
   loadMembers() - go and GET what the server has. */
loadMembers();
