# Tummy — quick check revert, home + recordings rework, production sweep

## 1. Quick check (step 4) — revert, and improve the background survey instead

Put the quiz back to its earlier simple form: all three questions on one scrollable
page, plain A/B/C option rows, an inline "why" line once an answer is picked, one
Continue button. Remove the multi-step rail, per-question card chrome and the
Next question stepper.

Move the effort to the Background survey (step 5), which is currently one long
undifferentiated scroll of nine fields:

- Split into 4 labelled sections with a progress rail at the top: About you /
  Your gut / Eating / Sleep. One section per screen-height, Continue moves on,
  Back returns — no 1000px scroll.
- Keep the anonymity banner on section 1 only, then a slim "Anonymous" pill on later
  sections so it doesn't eat the fold each time.
- Symptom frequency: keep the 1-5 scale rows, keep the layman labels, keep the
  info button, but make the scale header sticky inside that section so 1 = never /
  5 = very frequently stays visible while scrolling the eight rows.
- Disable Continue until the required fields in that section are answered, with a
  soft "2 left" counter rather than an error state.

## 2. Home — what it should actually be

Home is the "what do I do right now" screen and nothing else. Rework it so the
first screenful answers three questions: what's next, how far through the day am I,
what can I log right now.

- **Next up hero** stays but becomes time-aware rather than list-aware. It picks
  from the real schedule (fasting window, meal anchor missing, +30/+90/+210 window
  open, evening questions after 5pm) and shows one of three states: due now
  (solid teal, big Start button), coming up (countdown, muted button, "Snooze"
  secondary), or nothing due ("You're clear until 12:05 pm" with the mascot).
- **Day rail** replaces the loose dots row: a compact horizontal timeline of the
  four sessions plus the meal anchor, with filled/unfilled dots and times underneath,
  tappable to jump to that session.
- **Log row** shrinks from a 2x2 grid of big cards to a single row of four compact
  round tiles (meal, drink, toilet, symptom) plus "More" -> Log hub. Each tile shows
  a small count badge when logged today, so the page doubles as a glance-check.
- **Before bed** block only renders after 5pm (currently it renders greyed out and
  wastes the fold); before then that space shows today's last three log entries.
- The Ask Tummy hint moves into the floating button only, removing the duplicate
  call to action at the bottom of the page.

## 3. Today's recordings — what it should actually be

This page is the session runner, not a dashboard. It needs to fit one screen with
no scroll and make the anchor meal relationship obvious.

- Header: "Today's recordings", day chip, 3/4 progress ring instead of the bar+text.
- **Anchor meal card first** — the three post-meal timers are meaningless without it.
  If no meal is logged it is the primary action ("Log the meal these timers run from");
  once logged it collapses to a one-line summary with the meal time and edit affordance.
- **Timeline, not a list** — the four sessions render as a vertical rail with a
  connector line: done (filled, time recorded), now (raised card, Start button inline),
  upcoming (dimmed, countdown to its window). Only the active row is a large target;
  the rest are 56px rows. This removes the duplicate hero + list structure.
- Late/missed window gets an amber "window closed, log it as missed" affordance
  rather than staying startable forever.
- Footer keeps the one-line setup reminder (case off, quiet room, sit still).

## 4. Production sweep

- **Type scale**: replace ad-hoc `text-[13px]`/`[21px]`/`[26px]` with a fixed set
  (13 eyebrow, 15 caption, 16 body, 17 body-strong, 20/24/30 headings). Nothing
  under 15px except uppercase eyebrows; body stays 16px+.
- **Overlaps and truncation**: audit every header row for the grid + `min-w-0` +
  `shrink-0` + `truncate` pattern; fix the day chip, session titles, chat header and
  log rows that can wrap at 320px.
- **Spacing**: standardise screen padding (20px), card radius (24/28), gap rhythm
  (12/16/20). Remove the mixed `mt-3/mt-4/mt-5` drift.
- **Touch targets**: every interactive element to a 56px minimum, 60px for primary.
- **States**: add pressed, disabled and empty states everywhere they're missing
  (empty log timeline, no sessions left, chat with no messages).
- **Colour discipline**: coral only on true stops, amber only on caution; sweep for
  stray uses.
- Verify at 320px and 400px widths in the phone shell, then typecheck and lint.

## Technical notes

Files touched: `src/components/tummy/onboarding.tsx` (quiz revert, survey sections),
`src/components/tummy/main.tsx` (home), `src/components/tummy/recording.tsx`
(session hub), `src/components/tummy/ui.tsx` (shared type/spacing primitives,
new `SectionRail` and `TimelineRow` helpers). Schedule logic for the time-aware
hero goes into `src/components/tummy/store.ts` as a derived `nextTask` value so
Home, the session hub and the chat assistant all agree on what's next.
