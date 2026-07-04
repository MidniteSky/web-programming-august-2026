# Setup Guide — do this before Day 1

Everything here is free. Allow ~20 minutes. If anything fails (especially on a
work-managed machine), email the tutor **before** the course starts — don't lose
Day 1 morning to an install problem.

---

## 1. A modern browser

Any of **Chrome**, **Edge** or **Firefox** — whatever you have is fine, as long as
it's up to date. The tutor will demo in Chrome, and we use the browser's built-in
**DevTools** (F12) every day.

---

## 2. Windows: show file extensions (2 minutes, important)

By default Windows hides file extensions, so `index.html` displays as just "index" —
and worse, a file you thought was `page.html` can secretly be `page.html.txt`.
This is the #1 cause of "my page won't open" on Day 1.

**File Explorer → View menu → tick "File name extensions"**
*(Windows 11: View → Show → File name extensions)*

While you're there, create a folder for the week, e.g. `Documents\webcourse`.
Avoid OneDrive-synced locations if your organisation locks them down.

---

## 3. Visual Studio Code (our editor)

1. Download from <https://code.visualstudio.com> and install with the default options.
2. Open it → *File → Open Folder…* → choose your `webcourse` folder → "Yes, I trust
   the authors" if asked.

> **Do not** use Notepad, Word or Wordpad for the course — word processors quietly
> add invisible formatting that breaks web pages.

### 3a. Required extension: Live Server

Live Server turns VS Code into a mini web server: your page opens in the browser and
**refreshes automatically every time you save**.

1. In VS Code press **Ctrl+Shift+X** (Extensions)
2. Search **"Live Server"** — the one by *Ritwick Dey*
3. Click **Install**

You'll use it by right-clicking an HTML file → **"Open with Live Server"**.

### 3b. Turn OFF AI assistance (required for the course)

VS Code ships with AI features (GitHub Copilot) built in, and work machines sometimes
have other AI assistants pre-installed. **For this week they must be off.**

Why? An AI autocomplete will happily write whole blocks of code the moment you open a
file — including techniques we haven't covered yet. You'd end up with working pages
and no idea why they work, which is the opposite of what you're paying a week of your
time for. You're here to train *your* neural network, not rent one.

**Step 1 — the master switch.** Open Settings (**Ctrl+,**), search for
**"disable AI"**, and tick **`Chat: Disable AI Features`**. In recent VS Code versions
this single setting hides Copilot and all built-in AI features.
*(If your VS Code doesn't have that setting, update it: Help → Check for Updates —
then do steps 2–3 anyway.)*

**Step 2 — disable AI extensions.** Press **Ctrl+Shift+X**, type **`@installed`**
in the search box, and look through the list for any of: *GitHub Copilot*,
*GitHub Copilot Chat*, *Codeium/Windsurf*, *Tabnine*, *Amazon Q / CodeWhisperer*,
*Cody*. For each one: click the gear icon → **Disable**. (You can re-enable them
after Friday.)

**Step 3 — belt and braces.** Open the Command Palette (**Ctrl+Shift+P**), run
**"Preferences: Open User Settings (JSON)"**, and add these lines inside the
outermost `{ }` (add a comma after the previous line if needed):

```json
"chat.disableAIFeatures": true,
"chat.commandCenter.enabled": false,
"github.copilot.enable": { "*": false },
"editor.inlineSuggest.enabled": false
```

**What stays ON:** VS Code's ordinary IntelliSense (the dropdown that completes
`backgr...` into `background-color`) is *not* AI — it's a dictionary lookup, every
developer uses it, and it's positively encouraged. Same for Emmet, a built-in
shorthand tool we'll meet on Day 2.

### 3c. Optional niceties (fine to skip)

- **Prettier – Code formatter** — auto-tidies your code's indentation. If you install
  it, leave "Format On Save" **off** for Day 1 (indenting by hand for one day teaches
  you what good layout *is*), then turn it on from Day 2 if you like.
- Font too small when following along? **Ctrl + =** zooms the whole editor.

---

## 4. Before Day 4: Node.js

On Thursday we make our project talk to a real server — which we'll each run on our
own machine using a tool that needs **Node.js**. Install it **by Wednesday evening**:

1. Download the **LTS** version from <https://nodejs.org> and install with default options.
2. Verify: open a terminal (in VS Code: *Terminal → New Terminal*) and run:

   ```
   node --version
   npx --version
   ```

   Two version numbers = you're ready. An error, or a corporate-policy block = email
   the tutor; there's a no-install fallback and you'll be set up with it before Thursday.

---

## 5. Before Day 5: a GitHub account

Friday afternoon we put your project **live on the internet** (free, via GitHub Pages).
Create a free account at <https://github.com/signup> — your personal email is fine.

---

## Setup checklist

- [ ] Browser up to date
- [ ] Windows shows file extensions
- [ ] `webcourse` folder created
- [ ] VS Code installed and opens your folder
- [ ] Live Server extension installed
- [ ] AI features disabled (master switch + `@installed` sweep + settings JSON)
- [ ] *(by Wed evening)* Node.js LTS — `node --version` works
- [ ] *(by Fri)* GitHub account
