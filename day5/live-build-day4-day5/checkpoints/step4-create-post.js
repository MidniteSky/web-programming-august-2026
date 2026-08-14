/*
    LIVE BUILD - STEP 4 of 6: CREATE (the push becomes a POST)
    ==========================================================
    render -> search+add -> the switch [CREATE] -> delete -> update

    CATCHING UP? Copy this ENTIRE file over members.js and you are at the
    end of Step 4. Everything marked  NEW (Step 4)  is what this step adds
    (and removes); the rest is Steps 1-3, unchanged.

    WHAT THIS STEP DOES - the refresh finally stops winning:
      - the in-memory push is REPLACED by a POST request: same address as
        the GET, plus three extras - method: "POST", a Content-Type
        header, and a JSON.stringify'd body
      - nextId is DELETED. We send the new member WITHOUT an id, and the
        server assigns one. Minting ids in the page only ever worked
        because the page was the whole world; now the server owns the
        list, the server owns the ids
      - after a successful save we RE-FETCH the whole list, so the screen
        shows the server's version of the truth - including the real id

    WHAT YOU SHOULD SEE when it works:
      - add a member: they appear with a server-assigned id, and the green
        message finally has no small print: "It's saved on the server now."
      - REFRESH. Still there. Refresh again. STILL THERE. Yesterday's
        cliffhanger, resolved: the data outlives the page now.
      - peek at db.json in the editor: your member is IN THE FILE
      - try a blank name: a red message, and the Network tab shows nothing
        was sent - bad input never leaves the browser

    NOT WORKING YET (deliberately):
      - the Actions column is still empty                    -> Steps 5-6
*/

/* ---- One place for the server address -------------------------------------- */
const API = "http://localhost:3000/members";

/* The members we last loaded. Live search filters THIS (no request per key). */
let allMembers = [];

/* NEW (Step 4): nextId is GONE. It used to live right here - we minted
   ids in the page because the page was the whole world. The server
   assigns ids now, and it does not take suggestions. */

/* ---- Page elements, grabbed once ------------------------------------------- */
const tableBody = document.querySelector("#memberRows");
const tableStatus = document.querySelector("#tableStatus");
const searchBox = document.querySelector("#searchBox");
const addForm = document.querySelector("#addForm");
const nameInput = document.querySelector("#txtName");
const emailInput = document.querySelector("#txtEmail");
const activeInput = document.querySelector("#chkActive");
const feedback = document.querySelector("#formFeedback");

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

    /* Actions stays empty until Steps 5-6. */
    const actionCell = document.createElement("td");

    row.append(idCell, nameCell, emailCell, activeCell, actionCell);
    return row;
}

/* ==== Live search ========================================================== */
searchBox.addEventListener("input", renderFiltered);

/* NEW (Step 4) ==== CREATE: add a member with POST ===========================
   The handler is now `async` because it awaits the POST and then the
   reload of the list. Read it as a story: stop the browser, check the
   input, TELL THE SERVER, then re-fetch the truth. */
addForm.addEventListener("submit", async (event) => {
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

    /* Build the new member WITHOUT an id - compare with Step 3, where we
       minted one ourselves. The server assigns it now. */
    const newMember = { name, email, active: activeInput.checked };

    try {
        feedback.textContent = "Saving...";
        feedback.className = "form-feedback";

        /* The POST, replacing allMembers.push(...): same address as the
           GET, but now we say the method, declare what we're sending
           (JSON), and put the member - as a JSON STRING - in the body.
           JSON.stringify turns the object into that string. */
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

        /* NEW (Step 4): no small print. It's real now. */
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
