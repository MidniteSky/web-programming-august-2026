# Day 2 Cheat Sheet — CSS in Depth

Everything on this page was taught today. Pure CSS only — no JavaScript, no frameworks,
no `float` for layout.

## The box model

Every element is a box: **content → padding → border → margin** (inside out).

```css
.card {
    padding: 20px;              /* space INSIDE the border (takes the background) */
    border: 1px solid #1d5c8f; /* width style colour */
    margin: 30px;              /* transparent space OUTSIDE, pushes neighbours away */
}

padding: 10px 40px;            /* top+bottom  left+right */
padding: 10px 20px 30px 40px;  /* top right bottom left (clockwise) */
```

**The one-line habit — put it at the top of every stylesheet:**

```css
* { box-sizing: border-box; }  /* now width = the FINAL width, padding+border grow inward */
```

## Units

| Unit | Means | Use for |
|---|---|---|
| `px` | one absolute dot | hairline borders |
| `rem` | multiple of the root font size (16px default) | font sizes, spacing |
| `%` | fraction of the **parent** | flexible widths |
| `vh` / `vw` | 1% of viewport height / width | full-height sections |

## Display

```css
display: block;         /* new line, full width, sizeable (div, p, h1, section) */
display: inline;        /* flows in a line, ignores width/height (a, span, strong) */
display: inline-block;  /* in a line BUT sizeable */
```

## Selectors — combinators

```css
nav a       { }   /* DESCENDANT: any <a> inside <nav> (any depth) */
.menu > li  { }   /* CHILD: only direct children */
h2 + p      { }   /* ADJACENT SIBLING: the p right after an h2 */
h2 ~ p      { }   /* GENERAL SIBLING: every p after an h2 */
```

Descendant selectors replace fiddly classes: `nav a` instead of `.nav-link`.

## Selectors — pseudo-classes & pseudo-elements

```css
a:hover        { }   /* pointer over it */
input:focus    { }   /* selected (keep a visible focus ring!) */
li:nth-child(even) { }  /* every second one — also odd, 3n... */
li:first-child { }   /* :last-child too */

p::first-letter { }  /* a part of an element (TWO colons) */
.link::before  { content: "→ "; }  /* generated content — needs `content` */
```

## Specificity & the cascade

- **Cascade:** equal-strength rules → the **later** one wins.
- **Specificity (strength):** `#id` (1,0,0) beats `.class` (0,1,0) beats `element` (0,0,1).
  More classes beat fewer. Strength beats order.
- Avoid `!important` — it's a sign the cascade got away from you.
- DevTools Styles pane lists winners on top, losers struck through.

## Custom properties (CSS variables)

```css
:root {
    --primary: #1d5c8f;   /* define once, at the root */
    --space: 1rem;
}
h1 { color: var(--primary); }        /* use with var() */
main { padding: var(--space); }
```

Change one value → the whole site updates. (SASS/LESS also do variables — you don't need
them; plain CSS variables are built in.)

## Flexbox — a row (or column) of things

```css
.container {
    display: flex;
    justify-content: center;      /* along the axis: center | space-between | ... */
    align-items: center;          /* across the axis: vertical centring in a row */
    gap: 1rem;                    /* even spacing — no margins needed */
    flex-wrap: wrap;             /* let items drop to a new line */
}
.item { flex: 1; }               /* grow to share the space equally */
```

## CSS Grid — two dimensions

```css
.container {
    display: grid;
    grid-template-columns: 200px 1fr;              /* fixed sidebar + flexible main */
    grid-template-columns: repeat(3, 1fr);          /* three equal columns */
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));  /* responsive, no query */
    gap: 1rem;
}
```

**Flexbox** for a row of things; **Grid** for page layouts / real grids.

## Legacy note

`float` was the pre-2018 way to lay out columns (needed a "clearfix" hack). **You'll see it
in old code — recognise it, then replace it with Flexbox or Grid. Never write it yourself.**

## Responsive & mobile-first

```html
<!-- essential — put in every page's <head> -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

```css
/* MOBILE-FIRST: plain rules = the phone layout */
.grid { grid-template-columns: 1fr; }

/* then ADD columns as the screen grows */
@media (min-width: 600px) { .grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 900px) { .grid { grid-template-columns: repeat(3, 1fr); } }

img { max-width: 100%; height: auto; }   /* fluid images never overflow */
```

## Transitions & animation (polish)

```css
.button {
    transition: background-color 0.25s ease;  /* on the NORMAL state */
}
.button:hover { background-color: #163f61; }  /* eases, doesn't snap */

@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
.badge { animation: pulse 2s ease-in-out infinite; }
```

Use motion sparingly — it should help the user, not show off.

## Tools & tips

| Do | How |
|---|---|
| Full HTML skeleton fast | Type `!` then **Tab** in VS Code (Emmet) — includes the viewport tag |
| Inspect the box model | **F12** → Styles pane → box diagram at the bottom |
| Test responsive layouts | DevTools **device mode** (phone/tablet icon, top-left of the panel) |
| Force a `:hover` state | Styles pane → `:hov` → tick `:hover` |
| A nicer font (optional) | Google Fonts `<link>` — **but** keep a web-safe fallback in the stack (`"Roboto", Arial, sans-serif`); office machines may block it, so never rely on it |
