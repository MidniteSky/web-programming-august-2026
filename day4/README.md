# Day 4 — Talking to Servers: JSON, fetch & the CRUD App

The big payoff day. Yesterday the Member Manager came alive — but every member you added
vanished on refresh, because the data lived in a JavaScript array in memory. Today we fix that
for good: the page starts **talking to a real server**, and by home time the form actually
**saves**. That Day 1 promise — "the form talks to a real server by Thursday" — comes due today.

## A quick word on what we're doing

For three days our pages have been self-contained. Today they learn to **ask another program
for data and send data back** — over the same HTTP your browser has used all along. The program
they talk to is called an **API**, and this week ours is **json-server**: a tiny practice tool
that turns a plain file (`db.json`) into a real web API on your own machine, so you can learn
`fetch` and CRUD against "a real server" without any of the backend that normally involves.

## Before we start (setup checklist)

1. Same tools as all week: a modern browser, **VS Code**, and the **Live Server** extension.
2. **New and essential today: verify Node.js works.** Open a terminal in VS Code
   (*Terminal → New Terminal*) and run:
   ```
   node --version
   ```
   You should see a version number (e.g. `v20.11.1`). If instead you see
   `'node' is not recognized`, flag it **now**, at the 09:30 check-in — Node runs today's
   server, and we sort it before Block 1 rather than mid-exercise. (Installing Node was on the
   Wednesday-evening list in `learner-guide/setup-guide.md`.)
3. Open this `day4` folder in VS Code: *File → Open Folder…*
4. To view any `.html` demo: right-click it → **"Open with Live Server"**.

**Fell behind yesterday?** No problem. The `starter/` folder is a clean, finished **Day 3**
Member Manager — copy it into your `my-work` folder and you're at today's starting line.

## Starting the practice server

Most demos and every capstone step need the server running. In a terminal **in the folder that
contains `db.json`**, run exactly this (the pinned version keeps everyone identical):

```
npx json-server@0.17.4 --watch db.json --port 3000
```

The first run downloads the tool (needs internet, once); after that it's cached. You'll see
`Resources: http://localhost:3000/members`. Leave it running in that terminal; stop it with
**Ctrl+C**. On the very first run Windows may show a **firewall prompt** — that's normal, allow
access on private networks.

Quick check it's working: open <http://localhost:3000/members> in your browser — you should see
the six members as JSON.

## What's in this folder

| Folder / file | What it is |
|---|---|
| `demos/` | The numbered "investigation" files we build together — one concept per file. Demos that need the server say so, and name the command, right at the top. |
| `exercises/DAY4-EXERCISES.md` | Your hands-on tasks for each block, plus the capstone. **Exercise 0 is a two-minute server warm-up — do it first.** |
| `solutions/` | Worked solutions, including the finished Day 4 Member Manager — try each exercise **before** peeking. |
| `starter/` | A clean Day 3 Member Manager to start today from if you need it. |
| `db.json` | The data the server serves. Copy it into your work folder to run your own server. |
| `CHEATSHEET.md` | One-page reference for everything taught today — keep it open in a tab. |

Something not working? Check `learner-guide/troubleshooting.md`, and the quick table at the
bottom of the `CHEATSHEET`.

## What you'll be able to do by the end of today

- Explain what an **API** is, and read and write **JSON** — including `JSON.parse` and
  `JSON.stringify`
- Map the four **CRUD** actions to the four HTTP verbs: **GET, POST, PUT, DELETE**
- Run the **json-server** practice API and browse it in the address bar and the **Network tab**
- Make requests with **`fetch`** — first with `.then`, then the way we'll use all week:
  **`async`/`await` + `try`/`catch`**, checking **`response.ok`** and failing gracefully
- Tidy your data handling with **destructuring** and **spread**
- Build a full **CRUD app**: **GET** and render a list, **POST** from a form, **DELETE** with a
  confirmation, and **PUT** by editing a row in place (edit / save / cancel)

**End-of-day milestone:** the *Member Manager* becomes a **complete CRUD application over a real
REST API** — it loads members from the server, adds them from the form (and they **stick**
through a refresh), deletes them with a confirmation, and edits them in place — all still wearing
your own Day 2 styling.

## Resetting the data

By the end of the exercises your `db.json` will be full of test members. To put the original six
back: **stop the server (Ctrl+C), copy `db.backup.json` over `db.json`, and restart it.** (Your
work folder should keep a `db.backup.json` beside `db.json` — the finished capstone in
`solutions/membermanager/` ships with one you can copy.)

## A note on today's rules

Everything today is **plain `fetch` and vanilla JavaScript** — no libraries, no frameworks. The
app keeps the **hand-rolled Day 2 CSS** it already has (Day 5 shows what a UI framework adds on
top). Delete uses the browser's built-in `confirm()` box **just for today**, clearly flagged —
a proper styled dialog is a Day 5 upgrade. And you'll see `XMLHttpRequest` exactly **once**, in a
read-only history demo, so you recognise the old way in old code — we never write it.
