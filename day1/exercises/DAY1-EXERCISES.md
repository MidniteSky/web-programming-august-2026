# Day 1 — Exercises

Work in a new folder called `my-work` inside `day1`. Ask questions early and often —
if you're stuck for more than a couple of minutes, say so in the chat.

Solutions are in the `solutions/` folder — but give each exercise a real try first.

---

## Exercise 1 — Your first page *(Block 1, ~20 min)*

1. Create a file `firstpage.html` about a hobby or interest of yours.
2. Type the full page skeleton **by hand** (no copy-paste — your fingers are learning too):
   doctype, `html`, `head` with `meta charset` and a `title`, and a `body`.
3. In the body: one `h1` and at least two paragraphs.
4. Open it with Live Server. Change some text, save, watch it refresh.
5. **DevTools:** press F12 and find your `h1` in the Elements panel.
6. **Break it on purpose:** delete the closing `</h1>` tag and save. What does the
   browser do? Put the tag back.

✅ *Done when:* your page displays with a title in the browser tab, and you've seen
what a missing closing tag does.

---

## Exercise 2 — "About Me" page *(Block 2, ~25 min)*

Create `aboutme.html` (full skeleton first!). Include:

1. An `h1` with your name, and at least one `h2` section heading.
2. A paragraph introducing yourself, using `strong` and `em` at least once each —
   for *meaning*, not decoration.
3. An **unordered list** of 3+ favourite things, and an **ordered list** of your
   top 3 films/books/albums (in order!).
4. A **link** to a website you like — make it open in a new tab.
5. A link to your `firstpage.html` from Exercise 1 (relative link).
6. An **image**: use `../demos/images/sample-logo.svg` (note the path: up one folder,
   then down into demos/images) — with proper `alt` text and a `width`.
7. An HTML comment somewhere, just for practice.

✅ *Done when:* every item above is in the page and it renders sensibly.

---

## Exercise 3 — Structure and data *(Block 3, ~25 min)*

**Part A — make it semantic.** Restructure `aboutme.html` so it has:
`header` (containing your h1) → `nav` (links to your other pages) → `main`
(your sections, each in a `section` element) → `footer` (a copyright line).
Check in DevTools that the structure reads cleanly.

**Part B — a data table.** Create `members.html` (skeleton + semantic structure again).
In the `main`, add a table of **5 people** (invent them, or use colleagues — kindly)
with a `caption` and columns:

| Id | Name | Email | Active |
|----|------|-------|--------|

Use `thead`/`tbody`, `th` for the header row, `td` for data. Yes, it will look plain —
tomorrow we fix that.

**Part C — a form.** Below the table, add an **"Add a member"** form with:
a text input for name, an email input, a checkbox for active — **every input properly
labelled** with `label for`/`id` — and a submit button.
Fill it in, press submit, and watch the URL. What appeared, and why?

✅ *Done when:* the page has semantic structure, a 5-row table, and a fully-labelled form.

---

## Exercise 4 — Style it *(Block 4, ~25 min)*

1. Create `styles.css` in your `my-work` folder.
2. Link it from **both** `aboutme.html` and `members.html` (one stylesheet, two pages —
   that's the point of external CSS).
3. In the stylesheet:
   - Set a `font-family` stack and a gentle `background-color` on `body`
   - Give headings a different font family (grouping selector: `h1, h2`)
   - Centre the `h1` with `text-align`
   - Style link colours (`a` selector)
   - Create a class `.active-yes` (e.g. green text) and `.active-no` (e.g. grey,
     italic) and apply them to the Active cells in your members table
   - Add `line-height: 1.6` to paragraphs
4. **DevTools:** select an element and toggle your own rules on/off in the Styles pane.

⚠️ You will be tempted to add spacing, borders and layout. **Resist** — that's
tomorrow morning, and it will make sense of everything.

✅ *Done when:* both pages share one stylesheet and the table's Active column is
colour-coded by class.

---

## Exercise 5 — CAPSTONE: Member Manager v1 *(~40 min)*

Assemble this week's project. Create a folder `membermanager` inside `my-work` with:

| File | Contents |
|---|---|
| `index.html` | Welcome page: semantic skeleton, site title in `header`, a welcome `section`, `footer` |
| `about.html` | About the club: a couple of sections of text, a list, an image |
| `members.html` | Your members **table** + the **"Add a member" form** from Exercise 3 |
| `styles.css` | ONE shared stylesheet used by all three pages |

Requirements:

1. Every page: full skeleton, semantic structure, same `header`/`nav`/`footer`.
2. The `nav` on **every** page links to all three pages (relative links).
3. The stylesheet covers: body font + background, heading styles, nav link colours,
   table header styling (`th` with a `background-color` and `color`), and your
   `.active-yes` / `.active-no` classes.
4. Table columns exactly: **Id, Name, Email, Active** — this data shape is the
   backbone of the whole week.
5. Form inputs all labelled; submit button present (it does nothing useful yet —
   by Thursday it will talk to a real server).

✅ *Done when:* you can click between all three pages, they share one consistent
style, and the members table is colour-coded.

**Finished early?** Add a fourth page of your own invention to the nav. Or invent
more members. Or explore the demos folder and change things to see what breaks.
