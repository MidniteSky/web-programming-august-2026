# Day 5 Cheat Sheet — Bootstrap, components & deploy

Everything on this page was taught today. Bootstrap 5.3, its interactive
components, accessibility basics, and putting a site live.

## Include Bootstrap (CDN + the local swap)

In the `<head>` — CSS, with the offline fallback commented beside it:

```html
<!-- LOCAL SWAP: comment the CDN line out, use this if CDNs are blocked:
<link rel="stylesheet" href="lib/bootstrap.min.css"> -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
      crossorigin="anonymous">
```

Just before `</body>` — the JS bundle (needed for navbar/modal/toast/tooltip):

```html
<!-- LOCAL SWAP:
<script src="lib/bootstrap.bundle.min.js"></script> -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
        crossorigin="anonymous"></script>
```

Icons are a **separate** stylesheet: `bootstrap-icons.min.css` (CDN or `lib/`),
then `<i class="bi bi-trash"></i>`. Mind the path to `lib/` from your file.

## The grid (responsive layout, done for you)

```html
<div class="container">          <!-- centred, padded wrapper -->
    <div class="row">            <!-- a row of columns; 12 units wide -->
        <div class="col-6">half</div>
        <div class="col-6">half</div>
    </div>
    <div class="row">
        <div class="col-md-4">third on desktop, full width on phone</div>
        <div class="col-md-4">...</div>
        <div class="col-md-4">...</div>
    </div>
</div>
```

Columns in a row **add up to 12**. Plain `col-*` = always that width;
`col-md-*` = that width from medium screens up, **full width below** (mobile-first,
no media query written by you).

## Core components (copy from the docs, change the words)

```html
<!-- NAVBAR (collapses on mobile; needs the JS bundle) -->
<nav class="navbar navbar-expand-md navbar-dark bg-primary">
  <div class="container">
    <a class="navbar-brand" href="#">Brand</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#nav" aria-controls="nav"
            aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="nav">
      <ul class="navbar-nav">
        <li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Home</a></li>
      </ul>
    </div>
  </div>
</nav>

<!-- CARD -->
<div class="card"><div class="card-body">
  <h2 class="card-title h5">Title</h2>
  <p class="card-text">Body.</p>
</div></div>

<!-- TABLE -->
<table class="table table-striped table-hover">...</table>

<!-- BUTTONS -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-danger btn-sm">Small danger</button>

<!-- FORM CONTROLS -->
<label for="n" class="form-label">Name</label>
<input id="n" class="form-control">
<div class="form-check">
  <input class="form-check-input" type="checkbox" id="a">
  <label class="form-check-label" for="a">Active</label>
</div>
```

Handy utility classes: spacing `m-*`/`p-*` (e.g. `mb-3`, `py-4`), text `text-muted`
/ `text-danger` / `fw-bold`, `d-flex` / `justify-content-between`, badges
`badge text-bg-success`.

## Modal (the `confirm()` replacement)

```html
<button data-bs-toggle="modal" data-bs-target="#m">Open</button>

<div class="modal fade" id="m" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title h5">Title</h2>
      <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">...</div>
    <div class="modal-footer">
      <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
      <button class="btn btn-danger" id="ok">Yes, delete</button>
    </div>
  </div></div>
</div>
```

```js
// open/close from code (for a per-row confirmation)
const modal = new bootstrap.Modal(document.querySelector("#m"));
deleteBtn.addEventListener("click", () => modal.show());   // ask now
document.querySelector("#ok").addEventListener("click", () => {
    // ...do the DELETE fetch...   act later
    modal.hide();
});
```

The old way, for contrast: `if (confirm("Delete?")) { /* delete */ }`.

## Toast (the "saved!" pop-up)

```html
<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="t" class="toast" role="alert" aria-live="polite" aria-atomic="true">
    <div class="toast-header"><strong class="me-auto">App</strong>
      <button class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div>
    <div class="toast-body" id="tb">Message</div>
  </div>
</div>
```

```js
const toast = new bootstrap.Toast(document.querySelector("#t"));
function showToast(msg) { document.querySelector("#tb").textContent = msg; toast.show(); }
```

## Tooltips (opt-in; one line to switch on)

```html
<button data-bs-toggle="tooltip" data-bs-title="Delete this member">...</button>
```
```js
document.querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach((el) => new bootstrap.Tooltip(el));
```

## Reading jQuery → vanilla (legacy literacy)

| jQuery | Vanilla JavaScript |
|---|---|
| `$("#id")` | `document.querySelector("#id")` |
| `.on("click", fn)` | `.addEventListener("click", fn)` |
| `.val()` | `.value` |
| `.html(s)` / `.text(s)` | `.innerHTML` / `.textContent` |
| `.css("display","block")` | `.style.display = "block"` |
| `$.getJSON(url, cb)` | `fetch(url)` → `await response.json()` |
| `$(document).ready(fn)` | `document.addEventListener("DOMContentLoaded", fn)` |

We **read and translate** jQuery; we never write new jQuery.

## Accessibility essentials (mostly just good HTML)

- Real semantic landmarks: `<header> <nav> <main> <footer>`; real `<button>`s.
- Every input has a `<label for="id">`. Icon-only buttons need an `aria-label`
  (and `aria-hidden="true"` on the icon).
- Every meaningful image has `alt="..."`.
- Enough colour contrast (aim ≥ 4.5:1 for normal text).
- Keyboard: everything reachable with **Tab**, operable with **Enter/Space**, with
  a **visible focus ring** (never `outline:none` with no replacement).
- **Today's DevTools tool — Lighthouse:** F12 → Lighthouse → tick Accessibility →
  Analyze. A guide, not gospel — read your fixes with human eyes too.

## Deploy to GitHub Pages (summary — full guide in `demos/GITHUB-PAGES-DEPLOY.md`)

1. New **public** repo on GitHub (with a README).
2. **Add file → Upload files** → drag in your `.html`, `.css`, `.js` and `images/`
   (not `db.json`) → **Commit**.
3. **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save.**
4. Wait ~1 min; your site is live at `https://<user>.github.io/<repo>/`.
5. **The catch:** GitHub Pages is **static** — it can't run your `localhost`
   json-server. Home/About work everywhere; the **members page** needs either the
   `API` constant swapped to a hosted URL (one-line change) or a note that live
   data runs locally. Front end and back end are separate things.

## Quick "it's broken" table

| Symptom | Cause → fix |
|---|---|
| Page looks unstyled | CDN blocked → comment the CDN `<link>`, un-comment the `lib/` local swap. Check the `lib/` path. |
| Modal/toast/navbar toggle does nothing | Missing the JS **bundle** `<script>`, or it loads after your code → put it before your script. |
| Icons show as boxes | Icons CSS not loaded, or the `lib/fonts/` folder isn't beside `bootstrap-icons.min.css`. |
| Live members page shows an error | Expected — GitHub Pages can't reach `localhost`. See the deploy guide, Part 2. |
| Bootstrap colours aren't the house blue | Your `styles.css` must load **after** `bootstrap.min.css` to win. |
