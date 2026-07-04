# jQuery → vanilla JavaScript — translation answers

Model answers for **Exercise 3**: the five marked lines in
`demos/11_jquery_legacy_membermanager.js`, translated into the vanilla JavaScript
you learned on Days 3–4. Try them yourself first — the point is to prove to
yourself that you can read jQuery and know exactly what it becomes.

> Reminder of the map:
>
> | jQuery | Vanilla JavaScript |
> |---|---|
> | `$("#id")` | `document.querySelector("#id")` |
> | `.on("click", fn)` | `.addEventListener("click", fn)` |
> | `.val()` | `.value` |
> | `.html(str)` | `.innerHTML` *(prefer `textContent`/`createElement` for data)* |
> | `.css("display", "block")` | `.style.display = "block"` |
> | `$.getJSON(url, cb)` | `fetch(url)` → `await response.json()` |
> | `$(document).ready(fn)` | `document.addEventListener("DOMContentLoaded", fn)` |

---

## #1 — `$(document).ready(...)`

**jQuery**
```js
$(document).ready(() => {
    // ...setup...
});
```

**Vanilla**
```js
document.addEventListener("DOMContentLoaded", () => {
    // ...setup...
});
```

Both mean "run this once the page's HTML has been parsed". *(In fact, because our
`<script>` sits at the end of the body, the elements already exist and you could
drop the wrapper entirely — but `DOMContentLoaded` is the faithful translation.)*

---

## #2 — `$.getJSON(url, callback)`

**jQuery**
```js
$.getJSON(url, (members) => {
    members.forEach((member) => addMemberToTable(member));
});
```

**Vanilla** (your Day 4 shape: `async`/`await` + `response.ok` + `try`/`catch`)
```js
async function loadMembers() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Server answered ${response.status}`);
        const members = await response.json();
        members.forEach((member) => addMemberToTable(member));
    } catch (error) {
        console.log("Load failed:", error.message);
    }
}
loadMembers();
```

Note what jQuery hid from you: the error handling. `$.getJSON` quietly did nothing
on failure. The vanilla version makes the two failure kinds visible — which is a
feature, not a chore.

---

## #3 — `$("#btnAdd").on("click", ...)`

**jQuery**
```js
$("#btnAdd").on("click", () => {
    // ...open the dialog...
});
```

**Vanilla**
```js
document.querySelector("#btnAdd").addEventListener("click", () => {
    // ...open the dialog...
});
```

---

## #4 — `$("#txtName").val()`

**jQuery**
```js
const name = $("#txtName").val();
```

**Vanilla**
```js
const name = document.querySelector("#txtName").value;
```

`.val()` reads (and writes) a form field's value; the plain DOM property is
`.value`.

---

## #5 — `$("#tblMembers tbody").append(html)`

**jQuery** (builds an HTML string and appends it)
```js
$("#tblMembers tbody").append(html);
```

**Vanilla — the quick, like-for-like version**
```js
document.querySelector("#tblMembers tbody").insertAdjacentHTML("beforeend", html);
```

**Vanilla — the safe version we actually prefer** (Day 3 habit: build the row with
`createElement` + `textContent`, so member data can never inject HTML)
```js
const tbody = document.querySelector("#tblMembers tbody");
const row = document.createElement("tr");

const idCell = document.createElement("td");
idCell.textContent = member.id;

const nameCell = document.createElement("td");
nameCell.textContent = member.name;

const emailCell = document.createElement("td");
emailCell.textContent = member.email;

const activeCell = document.createElement("td");
activeCell.textContent = member.active ? "Active" : "Inactive";

row.append(idCell, nameCell, emailCell, activeCell);
tbody.append(row);
```

The second version is longer, but it's the one you built into your capstone — and
it's exactly why we drummed `createElement`/`textContent` into you from Day 3. The
jQuery original drops raw values straight into the page; on data from a server,
that's the habit worth breaking.

---

## The takeaway

Every jQuery line had a plain-JavaScript equivalent you already knew. jQuery was a
convenience layer for a time when browsers were inconsistent and the native DOM was
clunkier. Browsers caught up; the native APIs got good; the layer became optional.
You can now **read** it in old code and **translate** it — which is exactly the
skill this segment set out to give you. We never needed to write a new line of it.
