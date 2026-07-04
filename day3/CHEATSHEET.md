# Day 3 Cheat Sheet — JavaScript & the DOM

Everything on this page was taught today. Plain browser JavaScript only — data is hard-coded
in arrays (talking to a server is Day 4). Keep the **Console** open: **F12 → Console**.

## Where JavaScript goes

```html
<!-- inline: a script at the END of the body, so the page exists first -->
<script>
    console.log("hello");   /* prints to the Console, not the page */
</script>

<!-- external (the habit): behaviour in its own .js file -->
<script src="members.js"></script>
```

`console.log(...)` is how your program talks to you. It's your main tool all day.

## Variables & types

```js
const name = "Alice";   // const: value won't change (prefer this)
let count = 0;          // let: value WILL change
count = count + 1;      // never `var` — banned all week

typeof name;   // "string"   typeof 42 // "number"   typeof true // "boolean"
```

JavaScript is **case-sensitive**: `name`, `Name` and `NAME` are three different things.

## Operators

```js
+  -  *  /  %          // arithmetic (% is the remainder)
"Ada" + " " + "Love"   // + also joins strings

===   !==   >  <  >=  <=   // comparison — each gives true or false
&&    ||    !              // AND, OR, NOT
```

**The trap:** `=` **sets** a value; `===` **asks** if two values are equal. Inside an `if`,
it's always `===`.

## Template literals

```js
const name = "Bob", age = 42;
`Hello ${name}, you are ${age}.`   // backticks + ${ } — tidier than +
`Next year: ${age + 1}`            // ${ } can hold a calculation
```

## Decisions: if / else

```js
if (score >= 70) {
    result = "distinction";
} else if (score >= 50) {
    result = "pass";
} else {
    result = "try again";
}

if (member.active) { ... }   // a boolean tests directly — no "=== true" needed
```

## Loops

```js
for (let i = 0; i < 5; i = i + 1) {   // start; keep-going test; step
    console.log(i);                    // 0 1 2 3 4  (counting starts at 0)
}

while (n > 0) { n = n - 1; }   // repeat AS LONG AS the test holds
```

## Functions

```js
// declaration
function greet(name) {
    return `Hi ${name}`;   // return hands a value back
}
greet("Alice");            // call it — "Alice" is the argument

// arrow function — same job, shorter
const greet = (name) => `Hi ${name}`;   // one expression → return is implied
const add = (a, b) => a + b;
```

A function does nothing until you **call** it. Variables declared inside `{ }` live only
inside those braces (**scope**).

## Arrays — a list, found by position

```js
const names = ["Aidan", "Alice", "Bob"];
names[0];            // "Aidan"  — first item is index 0
names.length;        // 3
names[names.length - 1];   // last item
names.push("Carol"); // add to the end
```

## Objects — a record, found by name

```js
const member = { id: 1, name: "Aidan", email: "aidan@example.com", active: true };
member.name;     // "Aidan"
member.active = false;   // change a property
```

`{ id, name, email, active }` is the week's data shape — one member.

## Array of objects + the four workhorse methods

```js
const members = [ {id:1, name:"Aidan", active:true}, {id:2, name:"Bob", active:false} ];

members.forEach((m) => console.log(m.name));      // DO something per item
members.map((m) => m.name);                       // MAKE a new list
members.filter((m) => m.active);                  // KEEP items that pass a test
members.slice().sort((a, b) => a.id - b.id);      // put in order (copy first)
```

Case-insensitive text search: `m.name.toLowerCase().includes(term)`.

## The DOM — reach and change the page

```js
document.querySelector("h1");        // first match (CSS selectors, like Day 2)
document.querySelector("#total");    // by id
document.querySelectorAll("li");     // ALL matches, loop with forEach

const h = document.querySelector("h1");
h.textContent = "New text";          // read or overwrite the text
```

## Change styles & classes

```js
box.style.backgroundColor = "seagreen";   // camelCase, no hyphen
box.classList.add("active-yes");          // prefer classes: styling stays in CSS
box.classList.remove("active-no");
box.classList.toggle("highlight");
```

## Build elements from data

```js
const row = document.createElement("tr");   // 1. make
const cell = document.createElement("td");
cell.textContent = member.name;             // 2. fill  (textContent, not innerHTML)
row.append(cell);                           // 3. attach
tbody.append(row);
```

Use **`textContent`**, not `innerHTML`, for anything a user typed — it treats input as plain
text, so nobody can sneak HTML into your page.

## Respond to the user: events

```js
button.addEventListener("click", () => { ... });   // a click / tap
searchBox.addEventListener("input", () => { ... }); // every keystroke
form.addEventListener("submit", (event) => {
    event.preventDefault();          // STOP the reload + ?name=... in the URL
    const name = nameInput.value.trim();   // read a text box
    const active = chk.checked;            // read a checkbox (true/false)
    if (name === "") { /* show a message, then */ return; }
});
```

## Console & error messages (today's DevTools skill)

| Do | How |
|---|---|
| Open the Console | **F12** → **Console** tab |
| See your output | `console.log("label:", value)` |
| Read an error | Red text = a clue. Note the **message** and the **line number**, then look there |
| `... is not defined` | A misspelt or out-of-scope name |
| `Cannot read ... of null` | `querySelector` found nothing — check the selector, and that the `<script>` is at the end of the body |
| Try code live | Type straight at the Console `>` prompt and press Enter |

## Today's boundaries (so you know what's coming)

- Data is **hard-coded in a JS array** — added members vanish on refresh. **Saving is Day 4.**
- No `var`, no `fetch`, no libraries, no Bootstrap — plain JavaScript, learned from the ground up.
