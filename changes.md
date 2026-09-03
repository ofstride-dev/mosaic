# Mosaic — Layout Fixes, Section Polish, and New "Product Preview" Screen

Copy everything below into Cline.

```
Five things to do in this pass. Keep the existing warm off-white / sage /
clay visual language throughout, including on the new screen in part E.

PART A — Fix full-bleed layout (white edges / not filling frame)

The app currently shows white edges and doesn't fill the browser frame.
Fix at the root level, not by patching individual components:
- Ensure html, body, and the root mount element (#root or similar) have
  margin: 0, padding: 0, width: 100%, and min-height: 100vh.
- Set the page background color (the existing warm off-white, e.g.
  COLORS.bg) on html/body as well as on the top-level page wrapper, so
  there's no default white showing around/behind any centered content on
  any viewport size.
- Check for any fixed pixel widths or unintended max-width constraints on
  outer wrapper elements that might be causing gaps, and fix so the page
  fills the full viewport with no visible edge/margin mismatch.

PART B — Bigger primary action buttons

Increase size (padding + font-size, not just visual weight) on the main
action buttons: Reshuffle imagery, Refine moodboard, Regenerate moodboard,
Recolour, and the floating action bar buttons (Copy moodboard data, Refine
moodboard, Create another, Share). Keep proportions consistent with the
existing design language (same border-radius style, just larger touch
targets) — roughly 15-20% larger padding and 1-2px larger font-size than
current.

PART C — Clean up overlapping/legacy UI-preview sections

1. Delete the old static "How this could translate to product UI" section
   entirely (the one with the hardcoded phone card, "Begin session"
   button, and progress bar) — it's leftover from before the UI Language
   section existed and is now redundant/confusing alongside it.
2. Add a small caption at the top of the UI Language section, styled
   consistently with other small helper text in the app (similar to the
   existing "Imagery direction: ..." caption style), reading something
   like: "Live preview of buttons, inputs, and components in this
   direction — not interactive." Also ensure none of the UI Language
   preview components respond to click/hover as if they were real controls
   (no cursor: pointer, no active states) so it's visually clear they're
   specimens, not app functionality.

PART D — Make "Visual principles" and "Type with warmth and clarity"
sections more visually distinctive

These currently look plain compared to the rest of the page. Improve
without changing their content/data source:
- Visual principles cards: give each card a numbered label (01/02/03) in
  a small mono/uppercase style, increase card padding, and give one
  principle card (or all three, alternating) a subtle background tint
  using the generated Accent or Surface color at low opacity, so the
  section feels less like plain white cards and more tied to the
  generated palette.
- Typography section: increase the specimen text size for the heading
  font sample, add more breathing room (padding/margin) around the
  section, and consider a subtle background panel (Surface-tinted) behind
  the whole section so it reads as a distinct "moment" on the page rather
  than blending into the surrounding white space. Keep the heading label
  ("Type with warmth and clarity" or similar) but you may increase its
  size/weight to match the more editorial feel of the rest of the page.

PART E — New "Product Preview" screen (desktop/mobile toggle)

1. Extend the generation schema with one additive field (keep everything
   else from the current schema unchanged):

   "productPreview": {
     "appName": "",
     "navItems": ["", "", ""],
     "screenTitle": "",
     "primaryMetric": { "label": "", "value": "" },
     "secondaryMetrics": [{ "label": "", "value": "" }],
     "listItems": [{ "title": "", "subtitle": "" }],
     "primaryCta": ""
   }

   Update the prompt sent to Azure OpenAI to generate this based on the
   actual brief — navItems should be 3-5 short labels genuinely relevant
   to the described product (e.g. a wellness app might have "Today,
   Sessions, Progress, Reflect"; a finance tool might have "Overview,
   Invoices, Clients, Reports"). screenTitle, primaryMetric,
   secondaryMetrics (1-2), listItems (3-4 rows with a short title +
   subtitle each), and primaryCta (a short action button label fitting
   the product, e.g. "Begin session" for wellness, "New invoice" for
   finance) should all be specific to the brief, not generic placeholder
   text. This field is generated as part of the same generateMoodboard
   and refineMoodboard responses — no new endpoint needed.

2. Add a new screen state (alongside the existing "input" and "result"
   states) called "preview". Add a button to the result screen's floating
   action bar labeled "Preview product UI" that navigates to this new
   screen. Add a back link on the new screen ("← Back to moodboard") that
   returns to "result".

3. Build the Product Preview screen using result.palette (by role),
   result.headingFont/bodyFont, result.uiLanguage (shapeLanguage/spacing
   hints), and the new result.productPreview data. Include:
   - A segmented control toggle at the top: "Desktop" / "Mobile" —
     reuse the same segmented-control visual style already built for the
     UI Language preview section for consistency. This toggle switches
     which layout is shown below (not two side-by-side previews).
   - Desktop layout: full-width dashboard mockup with a left sidebar
     listing productPreview.navItems, a header showing
     productPreview.appName and screenTitle, a metrics row showing
     primaryMetric large + secondaryMetrics smaller, a list section
     rendering listItems as rows, and a primaryCta button (Accent-colored)
     in a sensible position (e.g. top-right of the header or above the
     list).
   - Mobile layout: a phone-frame card (similar sizing/approach to the
     old removed phone mockup, but content now comes from
     productPreview) showing appName + screenTitle at top, primaryMetric
     prominently, a condensed list of listItems, and the primaryCta
     button styled full-width at the bottom, matching typical mobile app
     patterns.
   - Both layouts should visually feel like they belong to the same
     generated direction as the rest of the moodboard (same fonts,
     palette roles, shape/spacing language) — this screen is meant to
     prove the direction works as a real interface, so treat it with the
     same visual care as the rest of the app, not as a rough wireframe.

4. This screen does not need its own lock/refine controls in this pass —
   when the user refines the moodboard from the result screen, treat
   productPreview as always regenerated alongside whatever else is
   unlocked (no separate lock toggle for it yet).

When done: generate a fresh non-Luma brief, confirm the page fills the
viewport with no white edges, confirm the bigger buttons and section
polish read correctly, confirm the legacy phone-mockup section is gone
and the UI Language section has its new caption and non-interactive
styling, and confirm the new Product Preview screen shows brief-specific
dashboard content in both Desktop and Mobile toggle states. Fix all
build/console errors and report exactly which files changed.
```