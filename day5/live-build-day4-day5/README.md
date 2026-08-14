# Live Build — Member Manager: from an array to an API

In this folder we build the Member Manager's JavaScript **together, live** —
and along the way it makes the single most important move of the week. The
data starts as **an array inside `members.js`** (where a refresh wipes your
changes), and then **moves to a real server** (where they stick). Same
table, same page — a completely different place for the truth to live. By
the end it's a complete CRUD app: Create, Read, Update, Delete, plus live
search.

(The Bootstrap dress-up — modals, toasts, badges — comes *after* this, in
the `live-build/` folder. Same engine, nicer clothes.)

## Set up

1. Copy this whole folder somewhere as your working copy.
2. Open `members.html` in the browser. The status line sits on "Loading
   members..." — that text is just what the HTML says, and nothing is
   coming to change it. Yet.
3. **That's it for now.** Steps 1–2 need nothing but the browser — the
   data will live in the file. The server enters the story at Step 3:
   open a terminal **in this folder** (the one with `db.json`) and run
   exactly:

   ```
   npx json-server@0.17.4 --watch db.json --port 3000
   ```

   Leave it running. Stop it with `Ctrl+C`. Reset the data any time by
   stopping the server, copying `db.backup.json` over `db.json`, and
   restarting.

## The six steps

| Step | We build | You'll see |
|---|---|---|
| 1 | **RENDER** — the table, from a hard-coded array | the table fills — no server, no network |
| 2 | **SEARCH + ADD** — live search; adding, in memory | it works… until you refresh. Cliffhanger. |
| 3 | **THE SWITCH** — the array goes; a GET fetches from json-server | the *same* table — but watch the Network tab |
| 4 | **CREATE** — the push becomes a POST | added members finally survive refresh |
| 5 | **DELETE** — per-row button, with a confirm | rows removed, on the server |
| 6 | **UPDATE** — Edit/Save/Cancel in the row (PUT) | the finished CRUD app |

The heart of it is Step 3: the render and search code **doesn't change at
all** — only where the data comes from. And Step 3 ends with its own honest
wart (adding still only fools your copy of the list; the server was never
told), which is exactly the problem Step 4's POST solves.

## Fallen behind? Use a checkpoint

The `checkpoints/` folder holds the finished code for each step, and each
file includes everything from the steps before it. To catch up:

1. Open the checkpoint for the last **completed** step
   (e.g. `checkpoints/step3-switch-to-server.js`).
2. Copy its **entire contents** over your `members.js`. Save, refresh.

You're caught up. No shame in it — that's what they're for. The checkpoint
files are also heavily commented, so they double as revision notes for
tonight-you and next-month-you.

A few honest warnings along the way:

- Until Step 2, pressing **Add member reloads the page** — and your name
  and email appear in the URL. That's the browser's built-in form submit
  from Day 1; Step 2's first line of code is the fix.
- From Step 3 onward, "Could not load members" almost always means the
  server isn't running — check the terminal, and check it was started
  **in this folder**.
- Step 5's `confirm()` box is a flagged stop-gap — ugly, unstyleable, and
  it freezes the page. Its proper replacement (a Bootstrap modal) is the
  headline of the next build.
