/*
    Member Manager v4 - members.js  (THE LIVE BUILD)
    ================================================
    This file is empty on purpose. We write it together, live, step by
    step - and by the end the Member Manager is a complete CRUD app:
    Create, Read, Update, Delete, over a real REST API. Members you add
    will SURVIVE A REFRESH, because they live on a server, not in the page.

    Everything AROUND this file is already finished: the pages are styled
    (your Day 2 handiwork), the table and the add form are sitting in
    members.html waiting. Open the page now: the status line says
    "Loading members..." and nothing loads. That text is just what the
    HTML says - nothing is coming to change it. Yet. That's the job.

    The build runs in five steps:

      Step 1  READ    - fetch the members (GET) and render the table
      Step 2  SEARCH  - the live search box filters what we fetched
      Step 3  CREATE  - the add form saves a new member (POST)
      Step 4  DELETE  - a Delete button per row, with a confirm
      Step 5  UPDATE  - Edit / Save / Cancel, in place in the row (PUT)

    Fallen behind, or something's broken and the class has moved on?
    No drama: the checkpoints/ folder has the finished code for every step.
    Copy the ENTIRE contents of the latest checkpoint over this file and
    you're caught up. (Each checkpoint contains all the steps before it.)

    >>> START THE SERVER FIRST. In a terminal in this folder (the one with
    >>> db.json), run EXACTLY:
    >>>
    >>>     npx json-server@0.17.4 --watch db.json --port 3000
    >>>
    >>> Leave it running. Stop it with Ctrl+C. Reset the data any time by
    >>> stopping the server, copying db.backup.json over db.json, and
    >>> restarting.
*/
