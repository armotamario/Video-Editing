# Video-Editing

Remotion project for Godly Raiment (GR), MFBA, and related brand video content.
See README.md for the standard Remotion commands.

## Working conventions

- Raw b-roll/photo uploads get stashed as-is into `public/images/photos/raw/`
  (named by their upload UUID), committed with a plain "Stash the Nth batch
  of photos" message. No cropping/categorizing at stash time — that happens
  when a photo is actually used in a composition.
- Uploaded source clips for the edit pass are staged under `public/edit/`
  (gitignored — large intermediates, not source).
- After finishing an edited video, always include a TikTok-ready post caption
  (short hook line + relevant hashtags) in the same reply, without being
  asked for one each time. The caption must be about the video's actual
  topic, not a generic faith caption — confirm the specific subject (from
  the transcript, or by asking if it isn't available) before writing it.
- Before using any photo from `public/images/photos/raw/` in a composition,
  actually open it (Read tool) to confirm what's in it — don't rely on a
  batch's stash-commit description from memory. Those descriptions have been
  wrong before and caused the wrong photo to end up in the wrong video.
- Mario's own training/nutrition protocol for MFBA content lives in
  `src/mfba/plan.ts` (typed constants: workout, everyday minimums, diet
  macros/recipes, supplements, lifestyle rules). Pull numbers from there
  for any new MFBA script rather than re-asking him.
- Default MFBA style is the typographic "Protocol" card look
  (`src/mfba/ProtocolFilm.tsx`): dark graphite gradient background, orange
  accent, headline-font stat cards, no b-roll photos. He called this
  cleaner than the b-roll reels (`src/mfba/BrollReels.tsx`). Reach for that
  style — title card, one stat/list per card, MFBA sign-off — by default;
  only use b-roll photos when specifically asked for, or when they'd
  genuinely add something a text card can't.
