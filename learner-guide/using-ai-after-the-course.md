# Using AI after the course

You'll remember that on Day 1 we asked you to switch off VS Code's AI features
(Copilot and friends), and the Setup Guide walked you through it. Now that the course
is done, here's the honest note we promised — on why we did that, and how to use AI
assistants *well* from here on.

## Why AI was off for the week

Not because AI is bad — because it would have robbed you of the point. An AI
autocomplete will happily write whole blocks of code the moment you open a file,
including techniques we hadn't reached yet. You'd have ended the week with working
pages and no idea why they worked. You came here to train **your** neural network,
not to rent one. The struggle to recall, the broken code you fixed, the error message
you learned to read — *that* was the learning. You can't outsource it and also get it.

## Why AI is genuinely useful now

The picture changes completely now that you have the fundamentals. You can read code,
so you can judge what an assistant hands you. Used well, it's a brilliant tutor that
never gets tired:

- **"Explain this error."** Paste a red console message and ask what it means and
  where to look. Faster than despair, and you'll learn the pattern.
- **"Review my code."** Paste something *you* wrote and ask what could be clearer,
  safer or simpler. You'll often learn a nicer way to do a thing you already did.
- **"Explain this line."** When you meet unfamiliar code (in the wild, in the docs),
  ask it to walk through the code line by line.
- **"Give me a practice exercise on X."** A tireless generator of drills — "make me
  three small exercises on array `filter`", then try them before you peek.

## The real risks (worth taking seriously)

- **Plausible-but-wrong code.** AI produces confident code that is sometimes subtly
  incorrect, out of date, or insecure. It doesn't *know* it's right — it predicts what
  looks right. Because you now understand the fundamentals, **you** are the check on it.
  Never paste code into a real project that you can't read and explain.
- **Skill atrophy.** If you let it write everything and paste without reading, the
  fluency you built this week quietly drains away. The muscle that isn't used weakens.
  Convenience today can cost you capability tomorrow.

## A habit for the first few months

Make this your default while your fundamentals are still setting:

> **Ask it to *explain*, not to *write*.**

Reach for "explain this", "review this", "why is this wrong", "quiz me on this" far
more than "write this for me". Keep *your* hands on the keyboard for the actual code
for a while yet. Type things out. When you do accept AI-written code, read every line
and make sure you could have written it — if you couldn't, that's your next thing to
learn, not a shortcut to take.

Later, once the basics are second nature, you'll lean on AI more for the boring parts
and it'll be a genuine multiplier. But earn that the way you earned Bootstrap this
week: by knowing what's underneath first.

## Turning it back on

Whenever you're ready, re-enabling VS Code's AI is simply reversing what you did in
**`setup-guide.md` §3b**: untick *Chat: Disable AI Features* in Settings, re-enable
any AI extensions you disabled, and remove those lines from your user `settings.json`.

Use it as a tutor, not a ghost-writer, and it'll make you better rather than
dependent. You've done the hard part — now you get the good tools *and* the judgement
to use them well.
