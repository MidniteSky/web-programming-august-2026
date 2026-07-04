# Deploying your site to GitHub Pages

Today your Member Manager goes **live on the internet** — a real URL you can send
to anyone. We'll use **GitHub Pages**, which hosts web pages for free. This is the
"host it so family can see it" promise from Day 1, finally paid off.

> **You need a free GitHub account** (from the Day 5 prep). If you haven't got one,
> make one now at <https://github.com/signup> — your personal email is fine.

There's **no command line and no Git to learn** here — we'll do the whole thing in
the browser, uploading files through GitHub's website. (The tutor uses Git properly
for the course repo; you don't need to today.)

---

## Part 1 — Put your site on GitHub (about 10 minutes)

### Step 1 — Create a repository

1. Sign in to <https://github.com>.
2. Top-right **+** → **New repository**.
3. **Repository name:** `member-manager` (lower-case, no spaces).
4. Set it to **Public** (GitHub Pages needs Public on the free plan).
5. Tick **Add a README file** (so the repo isn't empty).
6. Click **Create repository**.

### Step 2 — Upload your project files

1. On the repository page, click **Add file** → **Upload files**.
2. From your finished `membermanager` folder, drag in **`index.html`**,
   **`about.html`**, **`members.html`**, **`styles.css`** and **`members.js`**.
   - ⚠️ **Do not** upload `db.json` / `db.backup.json` — those belong to the local
     practice server, not the website.
   - The `images/` folder (with the logo) can go up too, keeping its folder name.
3. Scroll down, click **Commit changes**.

> **`index.html` matters:** GitHub Pages shows `index.html` as the front page of
> your site automatically. That's why the home page is named exactly that.

### Step 3 — Turn on GitHub Pages

1. In the repository, click **Settings** (top menu).
2. Left sidebar → **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. **Branch:** pick **`main`**, folder **`/ (root)`**, then **Save**.
5. Wait a minute or two, then refresh. A banner appears:
   **"Your site is live at `https://<your-username>.github.io/member-manager/`"**.

Click it. Your **home** and **about** pages work perfectly — they're just HTML and
CSS. 🎉 Send that link to someone.

---

## Part 2 — The members page and the honest catch

Open your live **members** page. It will show **"Could not load members. Is
json-server running on port 3000?"** — and it's right to. Here's the plain truth,
because it's an important lesson, not a bug:

> **GitHub Pages serves static files only — HTML, CSS, JavaScript. It cannot run
> your json-server.** Your `members.js` asks for data from
> `http://localhost:3000/members`. On your own machine, `localhost` is *your*
> computer, where the practice server runs. On a visitor's machine (or your phone),
> `localhost` is *their* computer, which has no such server. So the fetch has
> nowhere to go.**

This is the real shape of web development: the **front end** (what you built and
just deployed) and the **back end / API** (the server with the data) are two
separate things. You deployed the front end. The API story needs one more decision.

You have two honest options.

### Option A — Point the live site at a hosted API (fully working data)

If the tutor has set up the shared **MockAPI** fallback (the same one used on Day 4
for anyone who couldn't run Node), your deployed members page can use *that* instead
of `localhost`. It's a **one-line change** in `members.js`:

```js
// BEFORE — your local practice server (only reachable on your own machine):
const API = "http://localhost:3000/members";

// AFTER — the tutor's hosted API, reachable from anywhere:
const API = "https://6a498e8da033dcb98d656b06.mockapi.io/members";
```

That's the class's shared members API (if the tutor announces a different URL,
swap that one in instead — the change is identical). Save the file, upload it again
(**Add file → Upload files → Commit**, replacing the old `members.js`), wait a
minute, and reload your live members page. It now loads, adds, edits and deletes
for real, from anywhere.

> **Two caveats, said out loud:** MockAPI's free tier is *shared* among the class,
> so you may see members other people added — only touch ones you created. And it's
> a public practice API with no logins, so don't put anything private in it.

### Option B — Leave it as a local-only feature (honest and fine)

If there's no hosted API, that's completely acceptable for a course project. Your
**deployed site is still a genuine, live website** — the home and about pages work
for everyone. The members page's live data simply runs **on your machine**, against
your own json-server, which is exactly how you've used it all week.

A tidy touch: add one line to your live members page explaining it, so a visitor
isn't met with a raw error. For example, a small note above the table:

```html
<p class="text-muted">
    Live member data runs against a local practice server during the course.
</p>
```

Either option is a legitimate finish. What matters is that you understand *why* —
static hosting can't reach a server that only exists on your laptop.

---

## Troubleshooting

| Symptom | Cause → fix |
|---|---|
| 404 at the Pages URL | Give it 1–2 minutes after enabling; check the branch is `main`, folder `/ (root)`. |
| Home page loads but CSS is missing | Check the file is named exactly `styles.css` and the `<link href>` matches (case-sensitive on GitHub). |
| Members page shows the error box | Expected — read Part 2. Use Option A to make it work live, or Option B to explain it. |
| Changes don't show | You must **re-upload** the changed file and **Commit**; then hard-refresh (Ctrl+F5). |
| Logo image broken | Make sure the `images/` folder was uploaded and the `src` path matches. |

---

## What you've just done

You took files off your laptop and put a **working website on the public internet**,
and you learned the single most important deployment fact there is: **the front end
and the back end are separate, and static hosting only carries the front end.** Every
professional deployment is a more elaborate version of this exact realisation.

Where to take it next — including how real back ends get hosted — is in
`learner-guide/where-next.md`.
