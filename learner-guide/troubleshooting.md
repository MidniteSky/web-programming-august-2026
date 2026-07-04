# Troubleshooting — "It's broken!"

Everyone hits these. Being able to un-stick yourself is a real skill this course is
quietly teaching you. Work down the golden rules first, then find your symptom below.

## The golden rules (fixes ~80% of everything)

1. **Save the file.** A dot ● instead of an × on the VS Code tab = unsaved changes.
2. **Check you're editing the file you're viewing.** Same name, different folder is
   the classic. The browser tab's title and address bar tell you what's really open.
3. **Read the message.** Errors are information, not insults. Find the *first* error,
   the line number, and the file name it mentions.
4. **Undo works.** It broke after your last change? **Ctrl+Z** until it works again,
   then re-make the change slowly to find the culprit.
5. **From Day 3 onward: press F12 and look at the Console first.** Red text there
   explains almost every "nothing happens" mystery.

## Symptoms and fixes

| Symptom | Likely cause → fix |
|---|---|
| Browser shows my raw code as text | The file isn't really `.html` — it's probably `something.html.txt`. Turn on file extensions (Setup Guide §2) and rename it. |
| I edit and save but the page never changes | You opened the file directly (address bar starts `file:///`) instead of via Live Server → right-click the file → "Open with Live Server". Or you're editing a different copy of the file — check the address bar path. |
| My CSS does nothing at all | The `<link>` line is wrong. Check: it's inside `<head>`; spelling of `rel="stylesheet"`; the `href` filename and path exactly match (case matters). Quick test: View Source (Ctrl+U) and click the stylesheet link — 404 means the path is wrong. |
| *Some* CSS works, the rest is ignored | A missing `}` or `;` earlier in the file kills everything after it. Find the last rule that works; the bug is just after it. |
| One CSS rule doesn't apply | Selector typo: forgot the `.` before a class name, or the class in the HTML doesn't exactly match the CSS (case, hyphens). Check in DevTools: select the element — is your rule listed in the Styles pane? |
| Image shows a broken icon / alt text | Path is wrong (folder, spelling, capitalisation) or the extension doesn't match the actual file. Look at the file in VS Code's explorer and copy its exact name. |
| A link goes somewhere weird / 404 | Relative path problem — `page.html` means "in the same folder as *this* file". Going up a folder is `../page.html`. |
| Characters display as Ã© or â€™ | Missing `<meta charset="UTF-8">` in the `<head>`. |
| Live Server says the port is in use | Another Live Server is running — check the bottom-right of other VS Code windows ("Port: 5500") and click it to stop, or restart VS Code. |
| Everything in the page is suddenly huge/bold/a link | An unclosed tag (like `<h1>` or `<a>`) swallowed the rest of the page. The browser shows where it went wrong: DevTools → Elements — everything nested inside the greedy element. |
| *(Day 4)* fetch fails / data won't load | Is the json-server terminal still running? (It stops when the terminal closes or after Ctrl+C.) Is the URL in your code exactly `http://localhost:3000/...`? Check DevTools → Network tab for the red failed request. |
| It worked yesterday, today it's broken | You're probably in the wrong folder or the wrong copy. Compare with the day's `starter/` folder — or start from `starter/` and move on. |

**Still stuck after 3–4 minutes? Say so in the course chat.** That's not giving up —
knowing when to ask is the other real skill.
