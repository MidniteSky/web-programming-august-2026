# Day 1 Cheat Sheet — HTML & First CSS

## Every page starts like this

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Shows in the browser tab</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- everything visible goes here -->
</body>
</html>
```

## Text

| Element | Meaning |
|---|---|
| `<h1>…</h1>` … `<h6>` | Headings — h1 once per page, then h2, h3 for sub-levels |
| `<p>…</p>` | Paragraph |
| `<strong>…</strong>` | Strong importance (reads as bold) |
| `<em>…</em>` | Stress/emphasis (reads as italic) |
| `<hr>` | Thematic break line |
| `<br>` | Line break (rarely the right answer) |
| `<!-- note -->` | Comment — put it ABOVE the thing it describes |

## Lists, links, images

```html
<ul> <li>bullet item</li> </ul>
<ol> <li>numbered item</li> </ol>

<a href="https://example.com">absolute link</a>
<a href="other-page.html">relative link (same folder)</a>
<a href="mailto:me@example.com">email link</a>
<a href="https://example.com" target="_blank">opens in new tab</a>

<img src="images/logo.svg" alt="describe the image" width="150">
```

## Page structure (semantic — never a div where one of these fits)

```html
<header>  site/page title area          </header>
<nav>     the main navigation links     </nav>
<main>    THE content — one per page
    <section>  a titled chunk of content   </section>
    <article>  self-contained piece         </article>
</main>
<footer>  copyright, contact, small print </footer>
```

`<div>` = generic block box, `<span>` = generic inline bit — last resorts.

## Tables (for data, never layout)

```html
<table>
    <caption>Title of the table</caption>
    <thead>
        <tr> <th>Id</th> <th>Name</th> </tr>
    </thead>
    <tbody>
        <tr> <td>1</td> <td>Aidan</td> </tr>
    </tbody>
</table>
```

## Forms (markup only — behaviour comes Day 3/4)

```html
<form>
    <label for="txtName">Name</label>
    <input type="text" id="txtName" name="name">

    <input type="checkbox" id="chkActive" name="active">
    <label for="chkActive">Active</label>

    <button type="submit">Send</button>
</form>
```

Every input gets a `<label>` linked by `for` ↔ `id`. Radio buttons that share a
`name` form one choose-one group. Other input types: `email`, `date`, `radio`.
`<select><option>` = dropdown, `<textarea>` = multi-line text.

## CSS

**Always in an external `.css` file**, connected with `<link>` (see skeleton above).

```css
selector {
    property: value;      /* colon between, semicolon after — every time */
}
```

| Selector | Matches |
|---|---|
| `p` | every `<p>` element |
| `.warning` | every element with `class="warning"` |
| `#page-title` | the one element with `id="page-title"` |
| `h1, h2` | grouping — both |

An element can carry several classes: `class="highlight warning"`.

### Today's properties

```css
color: #1d5c8f;                     /* text colour: names, #hex, rgb() */
background-color: lemonchiffon;
font-family: Arial, Helvetica, sans-serif;   /* stack, generic last */
font-size: 24px;
font-weight: bold;
font-style: italic;
text-align: center;                 /* left | center | right */
text-decoration: none;              /* mostly: removing link underlines */
text-transform: uppercase;
line-height: 1.6;                   /* readable paragraphs */
```

## Tools

| Do | How |
|---|---|
| Run a page | Right-click the file → **Open with Live Server** |
| Inspect anything | **F12** → Elements panel; Styles pane shows the CSS hitting it |
| See a site's source | **Ctrl+U** |
| Editor too small | **Ctrl + =** |
