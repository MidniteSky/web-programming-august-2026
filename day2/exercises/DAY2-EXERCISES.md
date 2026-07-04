# Day 2 — Exercises

Work in a new folder called `my-work` inside `day2`. Ask questions early and often —
if you're stuck for more than a couple of minutes, say so in the chat.

Solutions are in the `solutions/` folder — but give each exercise a real try first.
Fell behind yesterday? Copy `starter/` (a clean Day 1 Member Manager) into `my-work`
and pick up from there.

> **The golden rule for today:** if it's a layout, it's **Flexbox or Grid** —
> never `float`. Floats appear in exactly one demo (`13_legacy_float_investigation.html`),
> clearly marked *read-only*, so you know them when you see them in old code. Don't
> write them.

---

## Exercise 1 — Box model & units *(Block 1, ~25 min)*

Create `boxes.html` with a full skeleton (type `!` then Tab in VS Code — the Emmet
shortcut gives you the whole skeleton, viewport tag included).

1. Add a `<style>` block in the head (just for this exercise — project CSS stays external).
2. Put `* { box-sizing: border-box; }` at the very top. You'll thank yourself.
3. Create three `<div class="card">` boxes with a sentence of text each.
4. Style `.card` with: a `border`, `padding` (feel the difference it makes), a
   `margin-bottom` to separate them, and a `background-color`.
5. Set the card `width` to `300px`. Add padding — confirm in DevTools it's still 300px
   wide (that's `border-box` working). Temporarily switch to `content-box` to watch it
   bulge past 300px, then switch back.
6. Size at least one thing in **rem** and one in **%**. Set `html { font-size: 20px; }`
   and watch your rem values grow.

✅ *Done when:* your three cards have clear spacing, stay exactly 300px wide with padding,
and you've seen a rem value respond to the root font size.

---

## Exercise 2 — Selectors, pseudo-classes & variables *(Block 2, ~25 min)*

Create `selectors.html` with a `header` (containing an `h1`), a `nav` with three links,
and a `ul` list of five member names.

1. In `:root`, define at least two CSS variables (e.g. `--primary` and `--space`) and use
   them with `var(...)` in several rules.
2. Style the nav links using a **descendant selector** (`nav a`) — **no class on the links**.
3. Style the header's heading using `header h1` — again, no class.
4. Add a `:hover` effect on the nav links (change the colour, say).
5. Zebra-stripe your list with `li:nth-child(even)`, and make `li:first-child` bold.
6. Add one rule that loses a **specificity** contest on purpose (e.g. an `li` element rule
   overridden by a `.highlight` class), then find it struck through in DevTools' Styles pane.

⚠️ Tempted to give every link a class like `.nav-link`? That's exactly the Day 1 habit we're
retiring today. Let the structure (`nav a`) do the reaching.

✅ *Done when:* nothing in your nav or header carries a styling class, your list is striped,
and you can point to a struck-through rule in DevTools and say why it lost.

---

## Exercise 3 — Flexbox & Grid *(Block 3, ~30 min)*

Create `layout.html`.

**Part A — a Flexbox navbar.** Build a `nav` with four links. Use `display: flex`,
`justify-content` and `gap` to lay them in a centred, evenly spaced row. Try
`space-between` and see the difference.

**Part B — a Grid of cards.** Below the nav, make a `<div class="grid">` containing six
`<div class="card">` boxes. Use `display: grid` with
`grid-template-columns: repeat(3, 1fr)` and a `gap`. Then swap the columns for
`repeat(auto-fit, minmax(180px, 1fr))` and resize the window — watch the column count
change on its own.

**Part C — centre something.** Make a box 200px tall and use Flexbox
(`justify-content: center; align-items: center;`) to centre a line of text dead-centre,
both ways.

⚠️ No `float` anywhere. If you feel the urge, that's the old way — reach for Flexbox or Grid.

✅ *Done when:* your nav is a clean Flexbox row, your card grid reflows as you resize, and
you've centred something both horizontally and vertically without a single magic number.

---

## Exercise 4 — Responsive & transitions *(Block 4, ~25 min)*

Start from your `layout.html` (or copy it to `responsive.html`).

1. Confirm the **viewport meta tag** is in your `<head>`. Without it, none of this works
   on a real phone.
2. Make your card grid **mobile-first**: default to a **single column**, then add
   `@media (min-width: 600px) { ... }` for two columns and
   `@media (min-width: 900px) { ... }` for three.
3. Open DevTools **responsive device mode** (the phone/tablet icon) and drag the width
   across your breakpoints to watch the layout change. Try an "iPhone" preset.
4. Add a **`transition`** to your cards or nav links so a hover colour change eases in
   smoothly instead of snapping.
5. Make sure any image you use has `max-width: 100%` so it never overflows a small screen.

⚠️ Everything here is pure CSS. No `<script>`, no `onclick`, nothing. If you think you need
JavaScript to make a layout respond, you don't — that's what media queries are for.

✅ *Done when:* your page shows one / two / three columns as it grows, you've watched it in
device mode, and at least one hover eases rather than snaps.

---

## Exercise 5 — CAPSTONE: Member Manager v2 *(~40 min)*

Take your Day 1 Member Manager and make it a **styled, responsive** site. Work in your
`membermanager` folder (or copy `starter/` if you need a clean Day 1 baseline).

Requirements:

1. **Reset + variables:** open `styles.css` with `* { box-sizing: border-box; margin: 0; }`
   and move the palette (`#1d5c8f`, `#163f61`, `#f5f2ea`, `#333`) into `:root` variables.
2. **Refactor the classes away:** delete `class="site-title"` and `class="nav-link"` from
   all three HTML pages, and style those elements with **descendant selectors**
   (`header h1`, `nav a`) instead. (This is the tidy-up we promised yesterday.)
3. **Flexbox navbar:** lay the nav links in a centred row that wraps on a narrow screen.
4. **Style the table properly:** `border-collapse`, cell borders, padding, a coloured
   header row, and zebra striping with `tbody tr:nth-child(even)`. Keep your
   `.active-yes` / `.active-no` colours.
5. **Grid content area:** make `main` a CSS Grid. On the members page, put the table and
   the form **side by side** on wide screens (e.g. `2fr 1fr`) and **stacked** on a phone.
6. **Add the viewport meta tag** to all three pages and make the whole site **mobile-first**:
   single column by default, more columns added with `min-width` media queries.
7. **A little polish:** a hover `transition` on the nav links or the button.

⚠️ Boundaries for today: **no `float`** for layout, **no Bootstrap or any framework**, and
**no JavaScript at all** — the form stays static markup (it comes alive on Day 3). Keep the
table's `<tbody>` tidy (just the rows) — Day 3's JavaScript will take it over.

✅ *Done when:* all three pages share one responsive stylesheet, the navbar is a Flexbox row,
the members table is properly styled, the content uses Grid, and the site reshapes cleanly
from phone to desktop in DevTools device mode.

**Finished early?** Try any of these (all still pure CSS):
- Give the whole site a fresh skin by changing **one** `--primary` variable — watch it ripple.
- Add a `::before` icon (an arrow or a dot) to your nav links with generated content.
- Add a subtle `box-shadow` lift on the section cards when you hover them.
- Explore the demos and deliberately break a Flexbox or Grid property to see what it does.
