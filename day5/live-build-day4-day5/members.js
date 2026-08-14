/*
    Member Manager - members.js  (THE LIVE BUILD: from array to API)
    ================================================================
    This file is empty on purpose. We write it together, live, step by
    step - and along the way it makes the single most important move in
    the whole week: the data starts as AN ARRAY INSIDE THIS FILE (Day 3's
    world, where a refresh wipes your changes), and then MOVES TO A REAL
    SERVER (Day 4's world, where they stick). Same table, same page - a
    completely different place for the truth to live.

    The build runs in six steps:

      Step 1  RENDER      - draw the table from a hard-coded array
      Step 2  SEARCH+ADD  - live search, and adding IN MEMORY
                            (works beautifully... until you refresh)
      Step 3  THE SWITCH  - the array goes; the data now comes from a
                            server with a GET request
      Step 4  CREATE      - the add form saves for real (POST)
      Step 5  DELETE      - a Delete button per row, with a confirm
      Step 6  UPDATE      - Edit / Save / Cancel, in place (PUT)

    Steps 1-2 need NOTHING but the browser - no server, no terminal.
    From Step 3 onward you need json-server running. In a terminal in
    this folder (the one with db.json), run EXACTLY:

        npx json-server@0.17.4 --watch db.json --port 3000

    Leave it running. Stop it with Ctrl+C. Reset the data any time by
    stopping the server, copying db.backup.json over db.json, and
    restarting.

    Fallen behind, or something's broken and the class has moved on?
    No drama: the checkpoints/ folder has the finished code for every
    step. Copy the ENTIRE contents of the latest checkpoint over this
    file and you're caught up. (Each checkpoint contains all the steps
    before it.)
*/
