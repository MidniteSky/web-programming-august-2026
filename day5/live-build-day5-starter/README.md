# Live Build — Member Manager CRUD (the Day 5 starting point)

In this folder we build the Member Manager's JavaScript **together, live**.
The pages and stylesheet are the hand-crafted versions you know — Day 2's
CSS, Day 3's table — and `members.js` is, see for yourself, empty. By the
end of the build it's a complete CRUD app over a real REST API: Create,
Read, Update, Delete, plus live search. Added members **survive a
refresh**, because they live on a server, not in the page.

(The Bootstrap dress-up — modals, toasts, badges — comes *after* this, in
the `live-build/` folder. Same engine, nicer clothes.)

## Set up (two minutes)

1. Copy this whole folder somewhere as your working copy.
2. Open a terminal **in that folder** (the one with `db.json`) and run
   exactly:

   ```
   npx json-server@0.17.4 --watch db.json --port 3000
   ```

   Leave it running. Stop it with `Ctrl+C`. Reset the data any time by
   stopping the server, copying `db.backup.json` over `db.json`, and
   restarting.
3. Open `members.html` in the browser. The status line sits on "Loading
   members..." forever — that text is just what the HTML says, and nothing
   is coming to change it. Yet.

## The five steps

| Step | We build | You'll see |
|---|---|---|
| 1 | **READ** — fetch the members (GET) and render the table | the table fills |
| 2 | **SEARCH** — filter what we fetched, live | typing filters instantly |
| 3 | **CREATE** — the add form saves (POST) | added members survive refresh |
| 4 | **DELETE** — per-row button, with a confirm | rows removed, on the server |
| 5 | **UPDATE** — Edit/Save/Cancel in the row (PUT) | the finished CRUD app |

## Fallen behind? Use a checkpoint

The `checkpoints/` folder holds the finished code for each step, and each
file includes everything from the steps before it. To catch up:

1. Open the checkpoint for the last **completed** step
   (e.g. `checkpoints/step3-create.js`).
2. Copy its **entire contents** over your `members.js`. Save, refresh.

You're caught up. No shame in it — that's what they're for. The checkpoint
files are also heavily commented, so they double as revision notes for
tonight-you and next-month-you.

A few honest warnings along the way:

- Until Step 3, pressing **Add member reloads the page** — and your name
  and email appear in the URL. That's the browser's built-in form submit
  from Day 1; Step 3's first line of code is the fix.
- Step 4's `confirm()` box is a flagged stop-gap — ugly, unstyleable, and
  it freezes the page. Its proper replacement (a Bootstrap modal) is the
  headline of the next build.
- Nothing loading at all? The server probably isn't running — check the
  terminal, and check it was started **in this folder**.
