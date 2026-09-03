# Mosaik — PRD & Cline Build Prompt (v3)

## 1. What's new in this version

Based on reference screenshots you shared:

- **Screen 1** ("What are you building?") should match the reference screenshot
  closely — it's already close to what's in App.jsx, with a handful of
  concrete tune-ups (nav labels, feel-input pattern, link color).
- **Screen 2** keeps its current warm/sage/clay visual language (the
  pink/teal "brutalist" reference screenshot was just an example of
  *generated content* for a different brief — not a new fixed skin).
- Two new features get added to Screen 2: **per-swatch lock + recolour**,
  and a **live "UI Language" component preview** driven by the generated
  direction. Both need a small, additive schema change (palette gets fixed
  roles instead of free-form names; a new `uiLanguage` object is added).
- "Preset library" appears in the nav as a placeholder only — no real page,
  just matches the reference visually. No mobile-specific view needed.

Everything from PRD v2 (Express backend, Azure OpenAI GPT-5 mini instead of
Gemini, Pexels instead of Unsplash, keys moved server-side, Settings modal
removed) still applies and is included below.

---

## 2. Environment variables (server-side only)
```
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_DEPLOYMENT=gpt-5-mini
AZURE_OPENAI_API_VERSION=2024-xx-xx
PEXELS_API_KEY=
PORT=8787
```

## 3. Updated result schema
```json
{
  "projectName": "",
  "title": "",
  "rationale": "",
  "imageryLabel": "",
  "imageryQueries": ["", "", "", "", "", ""],
  "palette": [
    { "role": "Background", "hex": "#RRGGBB" },
    { "role": "Surface", "hex": "#RRGGBB" },
    { "role": "Accent", "hex": "#RRGGBB" },
    { "role": "Text", "hex": "#RRGGBB" }
  ],
  "principles": [{ "title": "", "copy": "" }],
  "headingFont": "",
  "bodyFont": "",
  "headingSpecimen": "",
  "bodySpecimen": "",
  "uiLanguage": {
    "layout": "",
    "componentStyle": "",
    "shapeLanguage": "",
    "spacing": ""
  }
}
```
`palette` must always be exactly these 4 roles in this order — this is what
lets the lock/recolour controls and the UI-language preview target the right
swatch reliably.

## 4. Acceptance criteria
- [ ] Screen 1 nav/copy/feel-input matches the reference screenshot.
- [ ] No API key in the browser or bundle; Settings modal removed.
- [ ] Generate/Refine/Reshuffle work via the new backend (Azure + Pexels).
- [ ] Each palette swatch has an independent Lock toggle and Recolour button;
      recolouring one swatch doesn't change locked swatches.
- [ ] Heading font and body font each have independent Lock toggles.
- [ ] A "UI Language" section renders live-styled sample components (buttons,
      input, controls, badges, segmented control, progress, list row, metric
      tile, notification, content card) using the generated palette/fonts.
- [ ] "Preset library" nav link shows a lightweight placeholder (e.g. a
      toast: "Preset library — coming soon") and does nothing else.
- [ ] A non-Luma brief produces a materially different result than Luma.

---

