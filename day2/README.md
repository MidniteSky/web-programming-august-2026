# Day 2 — CSS in Depth: Box Model to Responsive Layout

Welcome back! Yesterday we built three plain pages. Today we make them look like a real
website — spaced, laid out, and working on a phone.

## Before we start (setup checklist)

1. Same tools as Day 1: a modern browser, **VS Code**, and the **Live Server** extension.
2. Open this `day2` folder in VS Code: *File → Open Folder…*
3. To view any `.html` file: right-click it → **"Open with Live Server"**.

**Fell behind yesterday?** No problem. The `starter/` folder is a clean, finished Day 1
Member Manager — copy it into your `my-work` folder and you're at today's starting line.

## What's in this folder

| Folder / file | What it is |
|---|---|
| `demos/` | The "investigation" files we build together, numbered in teaching order — one concept per file. Open any of them and experiment. |
| `exercises/DAY2-EXERCISES.md` | Your hands-on tasks for each block of the day. |
| `solutions/` | Worked solutions, including the Day 2 Member Manager — try the exercise **before** peeking! |
| `starter/` | A clean Day 1 Member Manager to start today from if you need it. |
| `CHEATSHEET.md` | One-page reference for everything taught today — keep it open in a tab. |

Something not working? Check `learner-guide/troubleshooting.md` — the ten classic
"it's broken" moments and their fixes.

## What you'll be able to do by the end of today

- Explain and control the **box model** — margin, border, padding, content — and pick
  sensible **units** (`px`, `rem`, `%`, `vh`)
- Reach elements precisely with **combinators**, **pseudo-classes** and **pseudo-elements**,
  and predict which rule wins using **specificity and the cascade**
- Tidy a stylesheet with **CSS variables** (custom properties)
- Lay pages out with **Flexbox** (rows, nav bars, centring) and **CSS Grid** (page layouts)
- Recognise — but never write — a legacy **float** layout
- Make a site **responsive and mobile-first** with the **viewport tag** and **media queries**,
  and add gentle **transitions** for polish

**End-of-day milestone:** the *Member Manager* becomes a fully styled, responsive site —
a Flexbox navbar, a Grid content area, a properly styled table, and breakpoints that carry
it from phone to desktop.

## A note on today's rules

Everything today is **pure CSS**. No JavaScript, no Bootstrap, no frameworks — and no
`float` for layout (you'll meet float once, in a read-only demo, purely so you recognise it
in old code). We're feeling the raw power of CSS first; the shortcuts come later in the week.
