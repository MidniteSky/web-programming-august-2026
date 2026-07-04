# Day 3 — Exercises

Work in a new folder called `my-work` inside `day3`. Ask questions early and often —
if you're stuck for more than a couple of minutes, say so in the chat. Today especially:
a red error in the Console is **normal** and **useful**, not a disaster. We read it together.

Solutions are in the `solutions/` folder — but give each exercise a real try first.
Fell behind yesterday? Copy `starter/` (a clean Day 2 Member Manager) into `my-work`
and pick up from there.

> **The golden rule for today:** keep the **Console open** (F12 → Console). It is how your
> program talks back to you — both your `console.log` messages and the browser's error
> messages. Everything today is checked by looking at the Console or the page, never by
> guessing.

---

## Exercise 1 — Console playground: variables, types, operators *(Block 1, ~25 min)*

Create `playground.html` with a full skeleton (type `!` then Tab in VS Code). Put a
`<script>` at the **end of the body**. Open the page with Live Server and keep the
**Console** open.

1. Declare three `const` variables about yourself: a **string** (your name), a **number**
   (a lucky number), and a **boolean** (e.g. `likesTea`). `console.log` each one.
2. Use `typeof` to log the type of each — confirm you see `string`, `number`, `boolean`.
3. Declare a `let` called `count`, set it to `0`, log it, then reassign it to `count + 1`
   and log it again. (Why `let` and not `const` here?)
4. Do some sums with `console.log`: an addition, a division, and one `%` (remainder).
5. Join your name and lucky number into one sentence **twice**: once with `+`, once with a
   **template literal** using backticks and `${ }`. Confirm they read the same.
6. Log the answer to `3 === 3`, then `"3" === 3` — and predict each before you press save.

⚠️ Reaching for `var` out of habit (or from an old tutorial)? Don't — we use `const` by
default and `let` when a value changes. `var` is banned all week.

✅ *Done when:* your Console shows your three typed values, at least one template-literal
sentence, and you can explain why `"3" === 3` is `false`.

---

## Exercise 2 — Decisions, loops & functions *(Block 2, ~30 min)*

Create `logic.html` (skeleton + a `<script>` at the end of the body).

1. Write a function `grade(score)` that **returns** `"distinction"` for 70+, `"pass"` for
   50–69, and `"try again"` below 50 (use `if` / `else if` / `else`). Call it with a few
   scores and log the results.
2. Write an **arrow function** `double = (n) => n * 2` and log `double(9)`.
3. Use a **`for` loop** to log the 3-times table from 1 to 10 (`1 × 3 = 3`, …) — a template
   literal makes the line readable.
4. Use a loop to add every number from 1 to 100 into a `let total`, then log the total.
   (It should be 5050.)
5. Write a function `activeLabel(isActive)` that returns `"yes"` or `"no"`. Call it with
   `true` and with `false`.

⚠️ `=` versus `===`: inside an `if ( )` you are asking a **question**, so it's always `===`.
A single `=` there is the classic bug — if an `if` seems "always true", check this first.

✅ *Done when:* `grade()` returns the right word for 40, 55 and 90; your times table prints
ten lines; and `total` is 5050.

---

## Exercise 3 — Arrays & objects: the members data *(Block 3, ~30 min)*

Create `data.html` (skeleton + `<script>`). This is the data behind the capstone, so it's
worth getting comfortable here.

1. Make an **array of member objects** — copy the six canonical members
   (`{ id, name, email, active }`; Aidan, Alice, Bob, Carol, Dave, Eve; Bob and Dave are
   `active: false`). Log the whole array, and log `members.length`.
2. Log the **first** member's name (`members[0].name`) and the **last** member's email.
3. Use **`forEach`** to log one line per member, like `#3 Bob (bob@example.com) active: false`.
4. Use **`filter`** to build a list of only the **active** members, and log how many there are.
5. Use **`map`** to build an array of just the names, and log it.
6. Use `filter` with `.toLowerCase().includes(...)` to find every member whose name contains
   the letter **"a"** — log their names. (This is exactly the search you'll build next block.)

⚠️ Array indexes start at **0**: the first member is `members[0]`, and the last is
`members[members.length - 1]`. Off-by-one is the classic array wobble — go slowly.

✅ *Done when:* your Console shows all six members via `forEach`, the count of active members,
an array of names, and the names containing "a".

---

## Exercise 4 — The DOM: build and respond *(Block 4, ~30 min)*

Create `dom.html`. This time we put things **on the page**, not just the Console. Give the
body this markup to work with, then add a `<script>` at the end:

```html
<h1 id="title">Members</h1>
<button id="addBtn">Add a name</button>
<ul id="nameList"></ul>

<p>
    <label for="nameBox">Name</label>
    <input type="text" id="nameBox">
</p>
<p id="message"></p>
```

1. In the script, grab the `<h1>` with `querySelector` and change its `textContent`.
2. Make an array of a few names. Loop it with `forEach`, and for each name **create** an
   `<li>` (`createElement`), set its `textContent`, and `append` it to the `#nameList`.
3. Add a **click** listener to the button that appends **one more** `<li>` (any name) to the
   list each time it's clicked.
4. Add an **`input`** listener to the text box that copies what you type into `#message`
   live (read `nameBox.value`).
5. **Bonus validation:** when the box is empty, put `"Type a name"` in `#message` and give
   the message the class `"error"` (add a tiny `.error { color: #b00020; }` in a `<style>`
   block); otherwise clear the class.

⚠️ Use **`textContent`**, not `innerHTML`, especially for anything a user typed — it's the
safe habit we're building. And put your `<script>` at the **end of the body**, or
`querySelector` will look for elements that don't exist yet and hand you `null`.

✅ *Done when:* the heading changes on load, the list fills from your array, the button adds
a row on each click, and the paragraph echoes what you type.

---

## Exercise 5 — CAPSTONE: Member Manager v3 *(~45 min)*

Bring the day together: make the members table **come alive**. Work in your `membermanager`
folder (or copy `starter/` — a clean, finished Day 2 site — if you need a clean baseline).

You'll add **one new file, `members.js`**, and make small edits to `members.html`. Leave the
Day 2 `styles.css` as it is (one tiny optional addition is noted below). **Do not** touch
`index.html` or `about.html` beyond their comment, if at all.

Requirements:

1. **Empty the table body.** In `members.html`, delete the six hard-coded `<tr>` rows so the
   `<tbody>` is empty, and give it an id: `<tbody id="memberRows"></tbody>`. JavaScript fills
   it from now on. (This pays off the Day 1 "hard-coded rows" thread.)
2. **Create `members.js`** and link it at the **end of the body**:
   `<script src="members.js"></script>`.
3. **The data:** in `members.js`, make the array of the six canonical member objects
   (`{ id, name, email, active }`).
4. **Render function:** write `renderTable(list)` that empties the tbody
   (`tableBody.textContent = ""`) then, for each member, **creates** a `<tr>` with four
   `<td>` cells (`createElement` + `textContent`) and appends it. Give the Active cell the
   `active-yes` / `active-no` class and the text `yes` / `no`. Call `renderTable(members)`
   once at the end so the table shows on load.
5. **Live search:** add a search text box to `members.html` (`id="searchBox"`). Listen for
   its `"input"` event; on each keystroke, `filter` the members whose name or email
   `includes` the typed text (lower-cased), and `renderTable` the matches.
6. **Add a member:** give the form `id="addForm"`. Listen for its `"submit"` event and, first
   thing, call **`event.preventDefault()`** (this is the Day 1 promise about the URL, paid
   off). Read the name, email and checkbox values, do a **simple check** (name and email not
   blank — friendly message if they are), then `push` a new member object onto the array and
   `renderTable` again.

⚠️ **Boundaries for today:** the data is **hard-coded in `members.js`** and lives **only in
memory** — a page refresh wipes any members you add. That's expected: *saving* means talking
to a server, which is **Day 4**. No `fetch`, no `var`, no `innerHTML` for the rows, no
libraries. Build rows with `createElement` + `textContent`.

✅ *Done when:* the table renders from the array (no hard-coded rows left in the HTML), typing
in the search box filters it live, and submitting the form adds a row **without** the page
reloading or the URL growing a `?name=...` — with the new member appearing in the table.

**Finished early?** Try any of these (all within today's toolkit):
- Show a **member count** somewhere (`Showing 6 members`) and update it on every render.
- Make the search match **case-insensitively on the id** too, or trim stray spaces.
- Add a friendly **"No members match your search."** row when the filter finds nothing.
- Sort the table by name with `sort((a, b) => a.name.localeCompare(b.name))` before rendering.
- Give the new member the **next id automatically** (one higher than the current highest).
