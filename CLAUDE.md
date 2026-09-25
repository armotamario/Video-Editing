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
