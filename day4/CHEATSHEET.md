# Day 4 Cheat Sheet — JSON, fetch & CRUD

Everything on this page was taught today. Plain `fetch` and vanilla JavaScript against the
**json-server** practice API. Keep the **Network** tab open (F12 → Network) to watch requests.

## Start (and reset) the server

```
# run in the folder that contains db.json; stop with Ctrl+C
npx json-server@0.17.4 --watch db.json --port 3000

# teaching option: make every reply take 2s so you can SEE the wait
npx json-server@0.17.4 --watch db.json --port 3000 --delay 2000
```

**Reset the data:** stop the server (Ctrl+C) → copy `db.backup.json` over `db.json` → restart.

## JSON — the text data travels in

```js
// double-quoted keys, double-quoted strings, no trailing commas, no comments
{ "id": 1, "name": "Aidan", "email": "aidan@example.com", "active": true }

JSON.stringify(obj);   // object/array  ->  JSON string   (to SEND)
JSON.parse(text);      // JSON string   ->  object/array  (once it ARRIVES)
```

`stringify` on the way out, `parse` on the way in — exact opposites.

## REST verbs → CRUD

| CRUD | Verb | Request | Meaning |
|---|---|---|---|
| **C**reate | `POST` | `POST /members` | add a new member (server assigns the id) |
| **R**ead | `GET` | `GET /members` | the whole list |
| **R**ead | `GET` | `GET /members/3` | just member #3 |
| **U**pdate | `PUT` | `PUT /members/3` | replace member #3 (send the whole object) |
| **D**elete | `DELETE` | `DELETE /members/3` | remove member #3 |

The verb is the action; the URL is the thing. `GET` only ever reads.

## fetch — GET, two styles

```js
const API = "http://localhost:3000/members";   // base URL in ONE constant

// .then style — you'll SEE this everywhere
fetch(API)
    .then((response) => {
        if (!response.ok) throw new Error(`Status ${response.status}`);
        return response.json();          // unwrap the JSON body (a promise)
    })
    .then((members) => { /* use the array */ })
    .catch((error) => { /* server off, etc. */ });

// async/await style — OUR STANDARD for the rest of the week
async function loadMembers() {
    try {
        const response = await fetch(API);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const members = await response.json();
        // ...use members...
    } catch (error) {
        // one place for BOTH failure kinds (see below)
    }
}
loadMembers();   // defining doesn't run it — call it
```

`await` = "wait for this promise, then hand me the result." A function with `await` must be
`async`.

## The two kinds of failure (why we check `response.ok`)

- **Network error** — request never arrives (server off, bad host). `fetch` rejects → `.catch`
  / `catch` runs.
- **HTTP error** — request arrives, answer is "no" (404, 400, 500…). `fetch` treats this as
  **success**, so *we* check `response.ok` (true for 200–299) and `throw` if it's false — that
  sends it to the same handler.

```js
if (!response.ok) throw new Error(`Server answered ${response.status}`);
```

## fetch — POST, PUT, DELETE (writing)

```js
// CREATE: POST — send a body, no id (the server assigns it)
await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },   // "I'm sending JSON"
    body: JSON.stringify({ name, email, active: true })
});

// UPDATE: PUT — id in the URL, send the WHOLE object (PUT replaces)
await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...member, name: newName })   // spread: all fields, one changed
});

// DELETE: id in the URL, no body, no headers
await fetch(`${API}/${id}`, { method: "DELETE" });
```

After any successful write, update the screen — **re-fetch the list** (simplest, always right)
or append/patch what's on screen. `Content-Type` is the only header we touch all week.

## Three states for a loaded list

```
LOADING  -> show "Loading members..." the moment you start
ERROR    -> friendly message in catch ("Is json-server running?")
LOADED   -> render the data
```

Even on a fast local server, get in the habit — real networks are slow. (`--delay 2000` makes
the loading state visible.)

## Destructuring & spread

```js
// destructuring: unpack an object into named variables
const { name, email } = member;              // by NAME (must match properties)
const [first, second] = ["Aidan", "Alice"];  // arrays: by POSITION

// spread: copy, optionally overriding fields
const copy = { ...member };
const updated = { ...member, active: false };   // all fields, active changed (later wins)
const more = [...members, newMember];           // all items, plus one
```

## Attaching data to elements (`data-` attributes)

```js
button.dataset.id = member.id;      // stash which member a button is for
// ...later, in the handler...
const id = event.target.dataset.id; // read it back
input.dataset.originalValue = text; // remember a starting value (for edit/cancel)
```

## Today's DevTools skill: the Network tab

| Do | How |
|---|---|
| Watch requests | **F12 → Network**, then reload / click / submit |
| See a request's details | Click its row: **method**, **status** (200 / 404 / …), **response** body |
| "My fetch does nothing" | Is the row red? Is the server terminal still running? Check the URL |

## The one-sentence CORS note

A browser blocks a page from calling a server on a different origin unless that server permits
it — **json-server permits it by default**, so it never bites us this week.

## Today's boundaries

- Delete uses the built-in **`confirm()`** box **for today only** — a proper styled dialog is
  **Day 5**.
- **`XMLHttpRequest`** appears once, read-only, so you recognise the old way — we write `fetch`.
- No libraries, no frameworks, no auth/tokens, only the `Content-Type` header. The app keeps its
  Day 2 CSS.
