# Day 5 Live Build — Member Manager v5

Today we build the capstone's JavaScript **together, live**. This folder is
your starting point: the three pages and the stylesheet are already wearing
their Bootstrap best (everything from Blocks 1–2 applied), and `members.js`
is — see for yourself — empty. By the end of the day it won't be, and the
whole site goes on the internet.

## Set up (two minutes)

1. Copy this whole `live-build` folder somewhere as your working copy.
2. Open a terminal **in that folder** (the one with `db.json`) and run
   exactly:

   ```
   npx json-server@0.17.4 --watch db.json --port 3000
   ```

   Leave it running. Stop it with `Ctrl+C`. Reset the data any time by
   stopping the server, copying `db.backup.json` over `db.json`, and
   restarting.
3. Open `members.html` in the browser. Admire the styling; note the total
   absence of behaviour. The status line will sit on "Loading members..."
   forever — that text is just what the HTML says, and nothing is coming
   to change it. Yet.

## The six steps

| Step | We build | You'll see |
|---|---|---|
| 1 | **READ** — fetch the members (GET) and render the table | the table fills |
| 2 | **SEARCH** — filter what we fetched, live | typing filters instantly |
| 3 | **CREATE** — the Add-member modal saves (POST) | added members survive refresh |
| 4 | **TOAST** — one small "saved!" helper | a pop-up, bottom right |
| 5 | **DELETE** — per-row button, confirmed in a modal | `confirm()`'s dignified replacement |
| 6 | **UPDATE** — Edit/Save/Cancel in the row (PUT) | the finished app |

## Fallen behind? Use a checkpoint

The `checkpoints/` folder holds the finished code for each step, and each
file includes everything from the steps before it. To catch up:

1. Open the checkpoint for the last **completed** step
   (e.g. `checkpoints/step3-add-modal.js`).
2. Copy its **entire contents** over your `members.js`. Save, refresh.

You're caught up. No shame in it — that's what they're for. The checkpoint
files are also heavily commented, so they double as revision notes for
tonight-you and next-month-you.

A few honest warnings along the way:

- Until Step 3, the Add-member modal's **Add button reloads the page**.
  That's the browser's built-in form submit from Day 1 — Step 3's first
  line of code is the fix.
- If the page looks unstyled, the CDN is probably blocked: in the HTML,
  comment out the CDN line and un-comment the `../lib/` local-swap line
  beside it. (If you copied this folder elsewhere, bring the `lib/` folder
  along or keep the CDN lines.)
- If a modal or toast does nothing at all, check the Bootstrap **JS
  bundle** `<script>` at the foot of the page loaded — it must come
  **before** `members.js`.
