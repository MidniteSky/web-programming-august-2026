# Day 3 — JavaScript Fundamentals & the DOM

Welcome to the big one. For two days our pages have been *documents* — things to look at.
Today they become *programs* — things that **do**. That dead "Add member" button from Day 1
finally springs to life.

## A word before we start (please read this one)

Today is the **steepest day of the week**, and everyone finds it a step up — that is completely
normal and completely expected. We are learning to think like a programmer, in small, gentle
steps, assuming you have never written a line of code before. Two promises:

- **Nothing here is beyond you.** We go one idea at a time, and every single one is something
  you can see happen in the browser or the Console.
- **Red error messages are not failure — they are information.** You *will* see them today.
  We treat them as clues, read them together, and fix them. By home time, an error message
  will feel like a helpful colleague, not a telling-off.

Slow is smooth, and smooth is fast. Ask questions the moment something feels fuzzy.

## Before we start (setup checklist)

1. Same tools as Days 1–2: a modern browser, **VS Code**, and the **Live Server** extension.
2. Open this `day3` folder in VS Code: *File → Open Folder…*
3. To view any `.html` file: right-click it → **"Open with Live Server"**.
4. **New today — keep the Console open.** Press **F12**, click the **Console** tab. This is
   where your program talks to you all day. Get it open now and leave it open.

**Fell behind yesterday?** No problem. The `starter/` folder is a clean, finished Day 2
Member Manager — copy it into your `my-work` folder and you're at today's starting line.

## What's in this folder

| Folder / file | What it is |
|---|---|
| `demos/` | The "investigation" files we build together, numbered in teaching order — one concept per file. Open any of them, then open the Console and experiment. |
| `exercises/DAY3-EXERCISES.md` | Your hands-on tasks for each block of the day. |
| `solutions/` | Worked solutions, including the Day 3 Member Manager — try the exercise **before** peeking! |
| `starter/` | A clean Day 2 Member Manager to start today from if you need it. |
| `CHEATSHEET.md` | One-page reference for everything taught today — keep it open in a tab. |

Something not working? Check `learner-guide/troubleshooting.md` — the classic "it's broken"
moments and their fixes.

## What you'll be able to do by the end of today

- Write JavaScript in a `<script>` and in an external `.js` file, and print to the **Console**
  with `console.log`
- Use **variables** (`let`/`const` — never `var`), the everyday **types** (string, number,
  boolean), **operators**, and **template literals**
- Make decisions with **`if`/`else`**, repeat work with **loops**, and package code into
  **functions** (both the `function` form and **arrow functions**)
- Store data in **arrays** and **objects**, and work through a list of records with
  **`forEach`**, **`map`**, **`filter`** and **`sort`**
- Reach into the page with the **DOM** (`querySelector`), change **text, styles and classes**,
  **create elements**, and respond to the user with **`addEventListener`**
- Read what a user typed into a form and give **simple validation feedback** — taking control
  of the submit with **`preventDefault`**

**End-of-day milestone:** the *Member Manager* members table is now **built by JavaScript**
from an array of member objects. A **search box filters it live** as you type, and the **"Add
a member" form actually adds a member** — appending to the list and re-rendering, with no page
reload and no `?name=...` in the URL (the Day 1 mystery, solved).

## A note on today's rules

Everything today runs **in your browser, on data we've typed into the code by hand**. The list
of members lives in a JavaScript array — so anything you add is *in memory only*, and a refresh
clears it. That is on purpose: **saving** data means talking to a real server, and that is
**tomorrow** (Day 4). No `fetch`, no `var`, no libraries, no Bootstrap — just you and plain
JavaScript, learning how it all actually works underneath.
