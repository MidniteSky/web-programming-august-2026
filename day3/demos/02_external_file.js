/*
    02 - AN EXTERNAL JAVASCRIPT FILE
    ===============================
    This is a separate .js file - no HTML, no <script> tags, just JavaScript.
    The page 02_external_file_investigation.html loads it with:

        <script src="02_external_file.js"></script>

    Same idea as our external stylesheet: keep the behaviour in its own file,
    away from the markup. One file, easy to find, could power many pages.
    From here on, real project code lives in .js files like this one.
*/

/* This message proves the external file ran. Check the Console. */
console.log("Hello from an EXTERNAL file - 02_external_file.js is running.");

/* A tiny sum, just to show ordinary code works exactly the same out here. */
console.log("Ten times ten is", 10 * 10);
