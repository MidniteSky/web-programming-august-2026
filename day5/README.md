# Day 5 — Bootstrap, the Real World & Best Practices

The final day. Your project goes **live on the internet** today. We take the
complete CRUD app you built on Thursday and give it a professional coat of paint
with **Bootstrap** — proper pop-up dialogs, little "saved!" notifications, a
responsive navbar — then we **deploy it to GitHub Pages** so you can send the link
to anyone. Along the way: a look at the wider landscape (frameworks, and the jQuery
you'll meet in old code), and the best-practices that separate a page that works
from one that's genuinely good.

## What today is really about

For four days you've hand-built everything, on purpose — so that when a framework
does it *for* you today, you understand exactly what it's doing. That's the theme:
**you earned Bootstrap.** You'll feel how much it saves precisely because you know
what it replaces.

## Before we start (setup checklist)

1. Same tools as all week: a modern browser, **VS Code**, **Live Server**.
2. **New and essential today: a free GitHub account.** We put your site live this
   afternoon via GitHub Pages, which needs one. If you haven't got an account,
   make one now at <https://github.com/signup> (your personal email is fine) — flag
   it at the 09:30 check-in if you're stuck, so it's sorted before the deploy.
3. Open this `day5` folder in VS Code: *File → Open Folder…*
4. To view any `.html` demo: right-click it → **"Open with Live Server"**.

**Fell behind on Thursday?** No problem. The `starter/` folder is a clean, finished
**Day 4** Member Manager (full CRUD) — copy it into your `my-work` folder and
you're at today's starting line.

## About Bootstrap and the internet (important)

Every demo links Bootstrap from a **CDN** (an internet address), because that's the
normal way and it needs no files. But some work machines block CDNs — so this
folder also ships **offline copies** in `lib/`, and **every CDN link has a
commented one-line "local swap"** right beside it. If a demo looks unstyled, your
network is probably blocking the CDN: open the file, comment out the CDN line, and
un-comment the local one. That's the whole fix.

## Starting the practice server (capstone only)

The Bootstrap exercises are pure front-end — no server needed. The **capstone**
(and the stretch demos) still talk to Thursday's API, so run it in the folder with
`db.json`, same pinned command as Day 4:

```
npx json-server@0.17.4 --watch db.json --port 3000
```

## What's in this folder

| Folder / file | What it is |
|---|---|
| `demos/` | The numbered "investigation" files we build together — Bootstrap basics, interactive components, the framework landscape, the jQuery legacy exercise, accessibility, and two optional **stretch** demos. Plus **`GITHUB-PAGES-DEPLOY.md`**, the step-by-step deploy guide. |
| `lib/` | Offline copies of Bootstrap's CSS and JS, and Bootstrap Icons — for machines that block CDNs. |
| `exercises/DAY5-EXERCISES.md` | Your hands-on tasks for each block, plus the capstone (Bootstrap upgrade + deploy). |
| `solutions/` | Worked solutions, the jQuery-translation answers, and the finished Day 5 Member Manager — try each exercise **before** peeking. |
| `starter/` | A clean Day 4 Member Manager (full CRUD) to start today from if you need it. |
| `CHEATSHEET.md` | One-page reference for everything taught today — keep it open in a tab. |

Something not working? Check `learner-guide/troubleshooting.md`, and the quick table
at the bottom of the `CHEATSHEET`.

## What you'll be able to do by the end of today

- Include **Bootstrap** (CDN, or the offline `lib/` copies) and lay a page out with
  its **12-column grid**
- Use the core **components**: navbar, cards, tables, buttons, form controls
- Add **interactive components**: a **modal** dialog (goodbye, `confirm()`),
  **toasts** for feedback, **icons** and **tooltips**
- **Read jQuery** in old code and translate it to the vanilla JavaScript you know
- Talk sensibly about the **framework landscape** (React/Vue/Svelte) and when you'd
  actually reach for one
- Apply **accessibility essentials** and audit a page with **Lighthouse**
- **Deploy** a static site to **GitHub Pages** — and explain why the members page
  needs a hosted API once it's off your laptop

**End-of-day milestone:** the *Member Manager* with a **professional Bootstrap UI**
— responsive navbar, modal add/delete dialogs, toasts — **deployed live** to
GitHub Pages. The week's project, finished and on the internet.

## A note on today's rules

We use **Bootstrap**, and that's the one framework we lean on. We **read** jQuery
but never write new jQuery. We **look at** React/Vue/Svelte but don't code them —
they need build tools well beyond this course. And the final session is a
consolidation and a send-off, not a pile of new material: today ends by tying a bow
on the week, and pointing you at where to go next (see
`learner-guide/where-next.md` and `learner-guide/using-ai-after-the-course.md`).
