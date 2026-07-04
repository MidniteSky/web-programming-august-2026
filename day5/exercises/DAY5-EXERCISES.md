# Day 5 — Exercises

Work in a new folder called `my-work` inside `day5`. Today's exercises build up to
the grand finale: giving your Member Manager a professional Bootstrap UI and
**putting it live on the internet**.

Solutions are in `solutions/` — but give each a real go first. The whole week has
been leading here; enjoy it.

> **Including Bootstrap:** every demo and solution links Bootstrap from the CDN
> (needs internet) with a **commented local-swap line** right beside it, pointing
> at the offline copies in `day5/lib/`. If your machine blocks CDNs, comment the
> CDN line out and un-comment the local one. Copy the `day5/lib/` folder into your
> `my-work` if you go local, and mind the path (`../lib/...` from a demo folder).

> ⚠️ **The server is only needed for the capstone** (Exercise 5) and the stretch
> demos — the Bootstrap exercises are pure front-end. When you do need it, it's the
> same pinned command as Thursday, in the folder with `db.json`:
> ```
> npx json-server@0.17.4 --watch db.json --port 3000
> ```

---

## Exercise 1 — Bootstrap-ify a page *(Block 1, ~30 min)*

Get a feel for Bootstrap by rebuilding a plain page with it. Create
`noticeboard.html`.

1. Add the Bootstrap `<link>` in the `<head>` (copy it from any demo — CDN line
   plus its commented local-swap line). Add the JS bundle `<script>` just before
   `</body>` (you'll need it for the navbar toggle).
2. Add a **navbar** (`navbar navbar-expand-md`) with a brand and three links.
   Copy the structure from demo 03 and change the words.
3. In a `container`, add a **row of three cards** (`col-md-4` each) — a club
   notice in each. They should sit side by side on a laptop and **stack on a
   phone** (check with the DevTools device toolbar).
4. Add a **table** with the `table table-striped` classes.
5. Add a small **form** using `form-label` and `form-control` on the fields.

⚠️ You should write **no CSS of your own** in this exercise — that's the point.
If you're reaching for a `<style>` block, find the Bootstrap class instead
(getbootstrap.com → Docs).

✅ *Done when:* the page has a working responsive navbar (the links collapse
behind the hamburger on a narrow screen), three cards that stack on mobile, a
striped table, and a Bootstrap-styled form — and not a line of your own CSS.

---

## Exercise 2 — A modal and a toast *(Block 2, ~30 min)*

Rehearse the two components the capstone needs. Create `notes.html`.

1. A button that opens a **modal** (`data-bs-toggle="modal"`,
   `data-bs-target="#..."`). Inside the modal, a small form with one text input.
2. Wire it up in a `<script>`: on the form's submit, `preventDefault`, read the
   input, and add the note to a list on the page (`createElement` + `textContent`).
3. Make a **toast** (bottom-right container). After a note is saved, set its body
   text and `.show()` it.
4. Close the modal from your code after saving (`new bootstrap.Modal(el)`, then
   `.hide()`), and clear the form.

⚠️ Modals and toasts **need the Bootstrap JS bundle**. If nothing happens when you
click, check the `<script>` is present and loads *before* your own script.

✅ *Done when:* the button opens the modal, saving adds the note to the list,
closes the modal, and pops a toast — all without a page reload.

---

## Exercise 3 — Read and translate jQuery *(Block 3, ~30 min)*

No new jQuery — this is a **reading** exercise. Open
`demos/11_jquery_legacy_membermanager.js` (the real July 2024 jQuery Member
Manager, trimmed).

1. Read the whole file top to bottom. You'll find you can follow every line.
2. Find the **five lines** marked `/* ===== TRANSLATE #n ===== */`. In a scratch
   file in `my-work`, write the **vanilla JavaScript** each one becomes. Use the
   map in the file's header comment (`$("#id")` → `document.querySelector("#id")`,
   `.val()` → `.value`, `$.getJSON` → `fetch` + `await response.json()`, and so on).
3. Check yourself against `solutions/jquery_translation_answers.md`.

⚠️ **Don't edit the demo file, and don't add jQuery to anything you build.** The
skill here is recognising and translating jQuery in old code — we never write new
jQuery. (`$(...)` should appear nowhere in your own work.)

✅ *Done when:* you've written a plain-JavaScript equivalent for all five marked
lines and checked them against the answers — and you could explain what `$` is to
the person next to you.

---

## Exercise 4 — Fix an inaccessible page *(Block 4, ~25 min)*

Practise the accessibility essentials. Open `exercises/broken-a11y.html` (below —
copy it into `my-work` as `fix-me.html`).

1. Run **Lighthouse** on it first: F12 → **Lighthouse** tab → tick
   **Accessibility** → **Analyze page load**. Note the score and the list of issues.
2. Fix each issue:
   - swap any clickable `<div>`/`<span>` for a real `<button>` or `<a>`
   - give every `<input>` a `<label for="...">`
   - add `alt` text to the image
   - fix the low-contrast text to a readable colour
   - give the icon-only button an `aria-label` (and `aria-hidden` on the icon)
   - use real landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`)
3. Re-run Lighthouse and watch the score climb.

⚠️ A high Lighthouse score is a helpful signal, **not** a guarantee — it can't
catch everything (e.g. whether your alt text is actually *meaningful*). Read your
fixes with a human eye too.

✅ *Done when:* the Accessibility score is 100 (or as near as you can get), and you
can name what each fix was for. Compare with `solutions/ex4_accessibility_solution.html`.

### `broken-a11y.html` — copy this into `my-work` as `fix-me.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact us</title>
</head>
<body>
    <div class="topbar" style="background:#1d5c8f;color:#fff;padding:1rem;">
        Get in touch
    </div>
    <div style="padding:1rem;">
        <span onclick="alert('hi')" style="color:#1d5c8f;text-decoration:underline;">Home</span>

        <img src="../demos/images/sample-logo.svg" width="120">

        <p style="color:#cccccc;">We usually reply within two working days.</p>

        <form>
            <input type="text"><br>
            <input type="email"><br>
            <textarea></textarea><br>
            <div onclick="this.closest('form').submit()"
                 style="background:#1d5c8f;color:#fff;padding:.5rem;display:inline-block;">
                Send
            </div>
        </form>

        <button>&times;</button>
    </div>
</body>
</html>
```

---

## Exercise 5 — CAPSTONE: Bootstrap UI + deploy live *(~60 min + deploy)*

The finale. Give the Member Manager a professional Bootstrap UI, then put it on the
internet. Work in your `membermanager` folder (or copy `starter/` — the finished
**Day 4** CRUD app — for a clean baseline). **Run the server in that folder** (copy
`db.json` in first) while you build.

You're upgrading the **look and feel**; the CRUD engine from Day 4 stays. Reference
solution: `solutions/membermanager/`.

**Part A — Bootstrap the UI**

1. **Include Bootstrap** in all three pages: the CSS `<link>` (with its local-swap
   comment) in the `<head>`, the JS bundle `<script>` before `</body>`. Add the
   Bootstrap **Icons** link too (for the Edit/Delete glyphs) on the members page.
   Keep a small `styles.css` for your **house colours** only — load it *after*
   Bootstrap.
2. **Navbar:** replace the hand-rolled nav on every page with a Bootstrap
   `navbar navbar-expand-md`. It should collapse behind a hamburger on a phone.
3. **Table & form:** give the members table the `table` classes; style the search
   box and add-member fields with `form-control` / `form-label` / `form-check`.
4. **Cards:** wrap the home/about content in `card` components inside a grid row.

**Part B — Interactive components**

5. **Add-member MODAL:** move the add form into a Bootstrap modal, opened by an
   "Add member" button. On submit: `preventDefault`, validate, **POST**, then
   `addModal.hide()`, reset the form, and re-fetch. (Same POST as Day 4.)
6. **Delete-confirm MODAL:** replace Day 4's `confirm()` with a modal. On a row's
   Delete click, remember which member and `.show()` the modal; only DELETE when
   its "Yes, delete" button is clicked. **Leave the old `confirm()` line commented
   in** as a teaching contrast, like the reference solution does.
7. **Toasts:** after a successful save or delete, pop a toast ("Member saved",
   "Deleted …").

**Part C — Deploy**

8. Follow **`demos/GITHUB-PAGES-DEPLOY.md`** step by step: create a public GitHub
   repo, upload your files, enable GitHub Pages, and open your live URL. 🎉
9. **The members-page API caveat** (Part 2 of that guide): GitHub Pages can't reach
   your `localhost` server. Either swap the `API` constant to the tutor's hosted
   URL (a one-line change — the guide shows it), or add a short note that live data
   runs locally. Home and about pages work live regardless.

⚠️ **Boundaries for today:** no new jQuery anywhere; no React/Vue code; the CRUD
logic is Day 4's, untouched. Build rows with `createElement`/`textContent`, never
`innerHTML` for member data (icons you can build as elements too). Every CDN link
keeps its commented local-swap line.

✅ *Done when:* all three pages wear a responsive Bootstrap navbar; adding a member
happens in a modal and pops a toast; deleting asks in a modal (not `confirm()`) and
pops a toast; editing in place still works; all CRUD still persists to the server;
**and your site is live at a `github.io` URL** with the API caveat handled honestly.

**Finished early?** (Only taught techniques — all optional.)
- Add **tooltips** to the icon-only Edit/Delete buttons (demo 09).
- Run **Lighthouse** on your live members page and fix what it flags.
- Try a **stretch demo**: the Highcharts dashboard (demo 13) or the
  IntersectionObserver infinite scroll (demo 14) — both read from your members API.
- Tidy the empty-state and loading messages so a first-time visitor always sees
  something friendly.
