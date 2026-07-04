# Day 4 — Exercises

Work in a new folder called `my-work` inside `day4`. **Copy `db.json` into `my-work`** (and keep
a `db.backup.json` copy beside it for resetting) so you can run your own server there.

Solutions are in `solutions/` — but give each exercise a real go first. Fell behind yesterday?
Copy `starter/` (a clean Day 3 Member Manager) into `my-work` and pick up from there.

> **The golden habit for today:** keep the **Network tab** open (F12 → Network). When a `fetch`
> "does nothing", the answer is almost always there — a red row, a 404, or (most often) the
> server terminal has stopped. Check the Network tab before you change any code.

> ⚠️ **The server must be running** for every exercise except this sheet's reading. Start it in
> the folder containing `db.json`:
> ```
> npx json-server@0.17.4 --watch db.json --port 3000
> ```
> Leave it running in its own terminal; open a **second** terminal if you need one for anything
> else. Stop it with Ctrl+C.

---

## Exercise 0 — Warm up the server *(setup, ~5 min — do this before any code)*

No code yet. Prove the API works from the browser first, exactly as demo 04 showed.

1. Copy `db.json` into your `my-work` folder, and copy it again as `db.backup.json` (your reset
   safety net).
2. In a terminal **in `my-work`**, start the server with the pinned command above. Confirm you
   see `Resources: http://localhost:3000/members`.
3. In the browser, visit each of these and note what comes back:
   - <http://localhost:3000/members> — all six
   - <http://localhost:3000/members/2> — just Alice
   - <http://localhost:3000/members/99> — a **404**
   - <http://localhost:3000/members?active=true> — only the active ones
4. Open **F12 → Network**, reload `/members`, click the `members` row, and find the **method**
   (GET), the **status** (200), and the **response** (the JSON).

✅ *Done when:* you've seen the JSON in the browser, triggered a 404 on purpose, and found the
request in the Network tab. The server is now running for the rest of the day.

---

## Exercise 1 — JSON & the verbs *(Block 1, ~20 min)*

Get comfortable with JSON and the CRUD-to-verb map. Create `json.html` (skeleton + a `<script>`
at the end of the body); keep the **Console** open.

1. Make a member **object** in JS: `{ id: 7, name: "Frank", email: "frank@example.com",
   active: true }`. Log it.
2. `JSON.stringify` it into a string and log that. Notice the double quotes on every key.
3. `JSON.parse` your string back into an object and log `object.name` to prove it's a real
   object again.
4. **On paper or in a comment**, write the verb + URL for each: (a) fetch all members, (b) fetch
   member 4, (c) add a member, (d) delete member 5, (e) replace member 2.
5. Uncomment a deliberately broken parse — `JSON.parse("{ name: 'Frank' }")` — run it, and read
   the red error. Why is it invalid JSON? (Two reasons.)

⚠️ JSON is fussy: **double quotes only**, on both keys and string values, and **no trailing
comma** after the last item. Single quotes or unquoted keys throw.

✅ *Done when:* your Console shows the object, its JSON string, and the parsed-back name; and you
can state the verb+URL for all five actions in step 4.

---

## Exercise 2 — Your first fetch *(Block 2, ~30 min)*

Create `fetch-practice.html`. Write a GET the way we'll use all week: **async/await + try/catch +
`response.ok`**. (Look at demo 08 for the shape, but type it yourself — muscle memory.)

1. Put the base URL in one constant: `const API = "http://localhost:3000/members";`.
2. Write an `async function loadMembers()` that: `await fetch(API)`, throws if `!response.ok`,
   `await response.json()`, then logs how many members came back and each member's name.
3. Add a `try`/`catch`. In `catch`, log a friendly `"Could not load — is the server running?"`.
   **Test it:** stop the server (Ctrl+C) and reload — you should hit your `catch`. Start the
   server again.
4. Use **destructuring** inside your render/log: `const { name, email } = member;`.
5. **Show the three states on the page** (not just the Console): a `<p id="status">` that starts
   as `"Loading..."`, becomes `"Loaded N members."` on success, and an error message on failure.

⚠️ A 404 does **not** land in `catch` on its own — `fetch` counts "the server said no" as a
successful delivery. That's why step 2 checks `response.ok` and throws. Remove that check and a
bad status will slip straight past you.

✅ *Done when:* on load the page shows "Loaded 6 members.", the names appear, and stopping the
server makes your friendly error message show instead.

---

## Exercise 3 — GET + render + POST *(Block 3, ~35 min)*

Create `crud-create.html`: a table that loads from the server and a form that adds to it. This is
the capstone's Create half, in a scratch file.

1. A `<table>` with an empty `<tbody id="rows">`, and a status line. Write `renderTable(members)`
   that clears the tbody and builds one row per member with `createElement` + `textContent`
   (four cells: id, name, email, active as yes/no with the `.active-yes`/`.active-no` classes —
   add those two rules in a `<style>` block).
2. `loadMembers()` (async/await, as Exercise 2) calls `renderTable` and updates the status line.
3. A form (`name`, `email`, `active` checkbox, submit). On submit: `event.preventDefault()`,
   validate name and email aren't blank, then **POST**:
   ```js
   await fetch(API, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ name, email, active })
   });
   ```
   Do **not** send an id — the server assigns it.
4. After a successful POST, **re-fetch the list** (`await loadMembers()`) so the new member
   appears, and show a friendly "Added …" message. Reset the form.
5. **Watch `db.json`** in VS Code as you submit — see it change by itself.

⚠️ Forget `headers: { "Content-Type": "application/json" }` and the server may store your member
as a jumble. Forget `JSON.stringify` and you'll send `[object Object]`. Both parts are needed on
every POST/PUT.

✅ *Done when:* the table loads from the server, submitting the form adds a member that appears in
the table **and** in `db.json`, and it's still there after a refresh.

---

## Exercise 4 — DELETE + PUT (edit in place) *(Block 4, ~35 min)*

Extend `crud-create.html` (or copy it to `crud-full.html`). Add the Update and Delete halves.
Demos 12 and 13 are your references.

1. **Delete:** give each row a **Delete** button. Stash the member's id on it
   (`button.dataset.id = member.id`). On click: `confirm("Delete …?")`, and if confirmed,
   `await fetch(`${API}/${id}`, { method: "DELETE" })`, then re-fetch the list.
2. **Edit in place:** give each row an **Edit** button. On click, turn the name and email cells
   into text inputs pre-filled with the current values, and swap Edit for **Save** and
   **Cancel**.
3. **Cancel:** restore the original text. Use the pattern from demo 13 — when you make each
   input, remember its starting value with `input.dataset.originalValue = currentText;`, and
   Cancel reads it back.
4. **Save:** read the inputs, build the **whole** updated member with spread
   (`{ ...member, name: newName, email: newEmail }`), **PUT** it to `${API}/${id}` with the JSON
   body and `Content-Type` header, then re-fetch the list.

⚠️ **PUT replaces the whole record** — send the complete member object, not just the changed
field, or you'll wipe the fields you left out. Building it with `{ ...member, name: newName }`
keeps everything and changes only what you edited.

> ⚠️ The `confirm()` box is **temporary** — we use it today only so delete works end-to-end. It's
> ugly and unstyleable; a proper dialog is a **Day 5** job. Don't polish it.

✅ *Done when:* Delete removes a member (after confirming) and it's gone from `db.json`; Edit lets
you change a name/email in the row; Save persists it (survives a refresh); Cancel puts the
original values back with no server call.

---

## Exercise 5 — CAPSTONE: Member Manager v4 (full CRUD) *(~45 min)*

Bring it all together: make the real Member Manager talk to the server. Work in your
`membermanager` folder (or copy `starter/` — the clean Day 3 site — for a fresh baseline).
**Run the server in that folder** (copy `db.json` in first).

You'll evolve **`members.js`** from a hard-coded array into a CRUD client. Keep the filenames the
same. Leave the Day 2 `styles.css` alone except for one small, clearly-commented additive block
(loading/error message styling — colour and weight only). Don't touch `index.html` or
`about.html` beyond a version comment.

Requirements:

1. **Load with GET.** Replace the hard-coded `members` array with an `async function
   loadMembers()` that GETs `http://localhost:3000/members` (async/await, `response.ok`,
   try/catch) and renders the table. Show a **loading** line while it runs and a friendly
   **error** line if it fails. Call it once on startup.
2. **Live search still works** — but now against the **fetched** members. Keep the members you
   loaded in a variable, and filter *that* on each keystroke (no new request per key).
3. **Add with POST.** On the form's submit: `preventDefault`, validate, POST the new member
   (no id; `Content-Type` header; `JSON.stringify` body), then **re-fetch** so it appears — and
   it now **survives a refresh** (the whole point of today).
4. **Delete with confirmation.** A Delete button per row, id stashed on it, `confirm()` first
   (leave the loud "temporary until Day 5" comment in), then DELETE, then re-fetch.
5. **Edit in place with PUT.** Edit / Save / Cancel per row; Cancel restores via
   `data-original-value`; Save PUTs the complete member (spread) and re-fetches.

⚠️ **Boundaries for today:** plain `fetch` only — no libraries, no frameworks. Keep your Day 2
CSS (one tiny additive block, fenced with a comment, is fine). `confirm()` is the temporary
delete guard. Build rows with `createElement` + `textContent`, never `innerHTML` for member data.

✅ *Done when:* the table loads from the server; search filters the loaded data live; adding a
member saves it (still there after refresh); delete asks first, then removes it; edit-in-place
saves changes that persist; and every request shows a loading state and fails with a friendly
message when the server is off.

**Finished early?** Try any of these (all within today's toolkit):
- A **member count** line (`Showing 6 members`) updated on every render.
- Disable the Add button and show "Saving…" **while** a POST is in flight, re-enabling after.
- Sort the table by name (`_sort=name` on the GET **or** `sort` in JS before rendering).
- A single **"Reset demo data"** note in your README reminding you of the `db.backup.json` recipe.
- Make the "No members match your search." row from Day 3 still appear when a filter finds nothing.
