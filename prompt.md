You are finishing an existing Vite/React app called "Mosaik," a moodboard
generator. src/App.jsx already contains a working prototype: two screens
(input + result), a Settings modal for API keys, and functions callGemini()
and searchUnsplash() that call Gemini and Unsplash directly from the browser.

Keep the overall visual language (warm off-white background, sage/clay
accents, DM Serif Display headings, Inter body text, soft borders/shadows)
on BOTH screens. Do not adopt any dark or high-contrast "brutalist" theme —
that was only an example of generated content shown to the product owner,
not a design direction for the app's own shell.

PART A — Screen 1 tune-up (match reference screenshot exactly)

1. Top nav: right side should show "My moodboards" and "Preset library" as
   plain text links — remove "How it works" and remove the gear/settings
   icon (Settings modal is being removed entirely in Part B). Clicking
   "Preset library" shows a toast ("Preset library — coming soon") and does
   nothing else — do not build a real page for it.
2. Keep the eyebrow "AI VISUAL DIRECTION TOOL" and heading "What are you
   building?" as-is.
3. Under "Anything it should feel like?": remove the row of pre-set
   suggestion chips (Calm/Premium/Playful/Bold/Minimal/Handcrafted/Precise/
   Grounded) that users currently click to toggle. Keep only the freeform
   text input + "Add" button pattern (already implemented as keywordInput /
   addCustomChip) as the single mechanism for adding feeling tags — this
   matches the reference screenshot, which shows only typed chips (e.g.
   "curiosity", "optimistic", "tactile") with no preset row.
4. Change "Try creating a sample moodboard" link color from sage-green to
   the clay/amber accent color already defined in the palette (COLORS.clay,
   #C98568) to match the reference screenshot's amber link color.
5. Leave the attachment chip UI, textarea, and Generate button behavior
   unchanged structurally.

PART B — Backend (Azure OpenAI + Pexels instead of client-side Gemini/Unsplash)

1. Add a minimal Express server under /server, proxied from Vite at /api/*.
   Use dotenv. Create .env.example with placeholders for:
   AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT
   (default "gpt-5-mini"), AZURE_OPENAI_API_VERSION, PEXELS_API_KEY, PORT.
   Add a root script so `npm run dev` starts both Vite and the Express
   server together (use `concurrently`).

2. Move the prompt-building logic from directionPrompt() (currently in
   App.jsx) to the server. Update it to request the schema in section 3
   above — specifically: palette entries now use a fixed "role" field
   (Background, Surface, Accent, Text, always in that order, exactly 4)
   instead of free-form "name"; add a new "uiLanguage" object with layout,
   componentStyle, shapeLanguage, spacing (each a short phrase, e.g.
   layout: "Asymmetric, high-contrast grid", componentStyle: "Soft rounded
   surfaces, gentle shadows", shapeLanguage: "Rounded rectangles, 12–16px
   radius", spacing: "Generous, breathing room"). Keep every other existing
   field (projectName, title, rationale, imageryLabel, imageryQueries,
   principles, headingFont, bodyFont, headingSpecimen, bodySpecimen)
   unchanged.

3. Build POST /api/generateMoodboard:
   - Accepts { description, feelings: string[], filenames: string[] }.
   - Calls Azure OpenAI chat completions with the updated prompt, JSON-only
     output, same parse/strip-fences/retry-once behavior as the current
     callGemini() has.
   - Uses the returned imageryQueries to call the Pexels Search API
     (https://api.pexels.com/v1/search, Authorization header with
     PEXELS_API_KEY) once per query, picks one distinct photo per query,
     returns { url: photo.src.large2x, alt, credit: photo.photographer,
     creditUrl: photo.photographer_url || photo.url, query } per image —
     same shape fetchImagesForQueries() currently builds, just from Pexels
     fields instead of Unsplash's.
   - Missing/failed images should still return { url: null, alt, query } so
     the frontend's existing TextureFallback keeps working unchanged.
   - On total generation failure (invalid JSON after retry), return a clear
     error for the frontend's existing errorMsg display — never fall back
     to a fixed mock silently.

4. Build POST /api/refineMoodboard, extending the existing regenerate()
   logic. New input shape:
   { description, feelings, filenames, refinementText,
     locks: {
       paletteLocks: { Background: bool, Surface: bool, Accent: bool, Text: bool },
       headingFontLocked: bool,
       bodyFontLocked: bool,
       imageryLocked: bool,
       uiLanguageLocked: bool
     },
     currentResult: <the full current result object>
   }
   Prompt the model with the original brief, the refinement text, the
   current result, and explicit instructions to return the locked fields
   byte-identical to currentResult and regenerate only the unlocked ones.
   If imagery is unlocked and new imageryQueries come back, re-run Pexels;
   if locked, reuse currentResult.images unchanged.

5. Build POST /api/recolorSwatch:
   - Accepts { currentResult, role } where role is one of Background,
     Surface, Accent, Text.
   - Prompts the model with the current full result and an instruction to
     return ONLY a new hex value for that single role, chosen to stay
     harmonious with the other three (unchanged) palette colors and the
     overall brief/mood — respond with strict JSON: { "hex": "#RRGGBB" }.
   - Returns { hex } to the frontend; validate it's a proper hex string
     before returning, retry once on invalid output.

PART C — Frontend wiring + new result-screen features

1. Delete callGemini() and searchUnsplash() from App.jsx. Update
   handleGenerate() to POST /api/generateMoodboard, regenerate() to POST
   /api/refineMoodboard (now including the locks object — see below),
   and add a new recolorSwatch(role) function that POSTs
   /api/recolorSwatch and merges the returned hex into result.palette for
   that role only.

2. Remove geminiKey, unsplashKey, keyDraft state, keysReady checks, the
   gear button, and the SettingsModal component entirely. Remove the "Add
   your Gemini & Unsplash keys" nudge on Screen 1.

3. Update the result screen's disclosure line to reference Azure OpenAI +
   Pexels instead of Gemini/Unsplash, same position/style.

4. Add lock state for the current result: 
   { paletteLocks: {Background:false,Surface:false,Accent:false,Text:false},
     headingFontLocked:false, bodyFontLocked:false,
     imageryLocked:false, uiLanguageLocked:false }
   Reset this to all-false whenever a fresh generateMoodboard result comes
   in. Pass it into the refineMoodboard request when the user clicks
   "Regenerate moodboard" in the existing Refine modal.

5. Palette section: give each swatch card a small lock icon toggle (top
   corner, similar position to the reference screenshot) and a "Recolour"
   button. Locked swatches show a filled/active lock icon and their
   Recolour button is disabled. Clicking Recolour (only enabled when
   unlocked) calls recolorSwatch(role), shows a brief loading state on that
   swatch only, and updates just that swatch's hex on success — use the
   existing copySwatch/toast pattern for a success toast ("Accent
   recoloured.").

6. Typography section: add an independent Lock toggle next to each of the
   heading-font card and body-font card (small button/icon, consistent
   style with the palette locks). No recolour equivalent for fonts in this
   pass — lock only.

7. Add a lock toggle for the Imagery section header (next to the existing
   "Reshuffle imagery" button) and for the new UI Language section header
   (see below). All locks feed into the same locks object used by refine.

8. Add a new "UI Language" section, positioned after "Visual principles"
   and before "How this could translate to product UI" (or replacing/
   extending that existing UI-glimpse section — reuse it as the seed).
   Layout, in the app's existing warm/sage card style:
   - A small header row showing four label/value pairs from
     result.uiLanguage: Layout, Components, Shape, Spacing (short mono or
     uppercase-label style, similar to the reference screenshot's
     LAYOUT/COMPONENTS/SHAPE/SPACING row).
   - A responsive grid of live-styled sample components, each using
     result.palette (by role) and result.headingFont/bodyFont:
     - Buttons: primary (Accent bg), secondary (Surface bg, Text border),
       ghost/text button
     - Input field: label + text input styled with Surface bg, Text border
     - Controls: toggle switch, checkbox, radio — accent-colored when
       active
     - Badges/Tags: two small pill labels using Accent and a neutral tone
     - Segmented control: 2-3 option toggle group
     - Progress/slider: track in Surface tone, fill in Accent
     - List row: small avatar circle + two lines of text
     - Metric tile: a label + large number + small trend indicator
     - Notification: icon + title + one line of body text, Surface bg
     - Content card: title + one line description + a small "Open" button
     All of these are presentational only (no real interactivity needed
     beyond visual state), purely to preview the generated UI language —
     do not wire them to app functionality.

9. Everything else (chip logic beyond section 3's removal, file attach UI,
   Refine/Share modals other than the locks addition, animations, overall
   layout grid) stays as currently implemented.

When done: run the app, generate with a brief that is NOT the Luma sample,
confirm Pexels images with attribution and a palette/type pairing distinct
from Luma's, confirm lock+recolour and the UI-language preview render
correctly and stay within the warm/sage/clay visual language, then re-test
the Luma sample and Refine flow with a couple of sections locked. Fix all
build/console errors. In your final summary, list exactly which files
changed and flag anything you had to guess about (exact Azure OpenAI
request/response shape for your API version, or any Pexels field mapping
that differed from documented fields).