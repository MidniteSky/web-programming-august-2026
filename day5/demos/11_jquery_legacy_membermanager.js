/*
    11 - jQuery legacy Member Manager - behaviour (READ-ONLY)
    =========================================================
    Adapted (and trimmed) from the tutor's real July 2024 jQuery delivery. This
    is the "before" to your whole week's "after". Read it top to bottom: you will
    find you can follow every line, because you know what it's DOING - even though
    the syntax is jQuery's, not vanilla JavaScript's.

    The dollar sign $ IS jQuery. $("#id") is jQuery's version of
    document.querySelector("#id"), and it returns a jQuery "wrapper" with extra
    methods bolted on: .html(), .val(), .on(), .append(), and so on.

    >>> YOUR EXERCISE (Exercise 3): translate the FIVE lines marked with a
    >>>     ===== TRANSLATE #n =====
    >>> comment into the vanilla JavaScript you learned on Days 3-4. Don't edit this file;
    >>> write your answers in your my-work folder. Model answers are in
    >>>     solutions/jquery_translation_answers.md
    >>>
    >>> Reminder of the map you'll need:
    >>>   $("#id")                 -> document.querySelector("#id")
    >>>   .on("click", fn)         -> .addEventListener("click", fn)
    >>>   .val()                   -> .value
    >>>   .html(str) / .text(str)  -> .innerHTML / .textContent
    >>>   $.getJSON(url, cb)       -> fetch(url) then response.json()  (async/await)
    >>>   $(document).ready(fn)    -> document.addEventListener("DOMContentLoaded", fn)
*/

/* The one place the server address lives (same idea as your Day 4 API constant). */
const url = "http://localhost:3000/members";

/* Add one member as a row of the table. In 2024 this was done by building an
   HTML string and appending it - convenient, but note it drops raw values
   straight into the page (the very habit Day 3 warned you off with textContent). */
function addMemberToTable(member) {
    const html = `<tr>
                    <td>${member.id}</td>
                    <td>${member.name}</td>
                    <td>${member.email}</td>
                    <td>${member.active ? "Active" : "Inactive"}</td>
                  </tr>`;

    /* ===== TRANSLATE #5 =====
       Append the row string to the table body.
       jQuery: select "#tblMembers tbody" and .append(html). */
    $("#tblMembers tbody").append(html);
}

/* $(document).ready(fn) runs fn once the page's HTML is parsed - jQuery's classic
   "wait until the page is ready" wrapper. */
/* ===== TRANSLATE #1 =====
   Run the setup function once the page is ready.
   jQuery: $(document).ready( ... ). */
$(document).ready(() => {

    /* $.getJSON does a GET and hands you the parsed JSON - fetch's ancestor. */
    /* ===== TRANSLATE #2 =====
       GET the members from `url` and render each one.
       jQuery: $.getJSON(url, callback). Hint: fetch + await response.json(),
       inside an async function, then members.forEach(...). */
    $.getJSON(url, (members) => {
        members.forEach((member) => addMemberToTable(member));
    });

    /* Open the hand-rolled "Add" dialog by setting its CSS display to block. */
    /* ===== TRANSLATE #3 =====
       When #btnAdd is clicked, show the dialog.
       jQuery: $("#btnAdd").on("click", ...). */
    $("#btnAdd").on("click", () => {
        $("#txtName").val("");
        $("#txtEmail").val("");
        $("#chkActive").prop("checked", false);
        $("#dlgAdd").css("display", "block");
    });

    /* Save: read the fields, POST the new member, add it to the table, close. */
    $("#btnSave").on("click", () => {

        /* .val() reads a form field's value. */
        /* ===== TRANSLATE #4 =====
           Read the Name field's value into `name`.
           jQuery: $("#txtName").val(). */
        const name = $("#txtName").val();
        const email = $("#txtEmail").val();
        const active = $("#chkActive").prop("checked");

        const member = { name, email, active };

        /* $.ajax is jQuery's fetch. Shown here for recognition - you'd write this
           as fetch(url, { method: "POST", headers, body: JSON.stringify(member) })
           exactly as you did on Day 4. (Not one of the five to translate.) */
        $.ajax({
            url: url,
            method: "POST",
            data: JSON.stringify(member),
            contentType: "application/json",
            success: (addedMember) => {
                addMemberToTable(addedMember);
            },
            error: () => {
                alert("Could not save the member.");
            }
        });

        $("#dlgAdd").css("display", "none");
    });

    /* Cancel just hides the dialog again. */
    $("#btnCancel").on("click", () => {
        $("#dlgAdd").css("display", "none");
    });
});
