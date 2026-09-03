# Mosaik — Presentation Walkthrough

## 1. What Mosaik does

Mosaik is an AI visual-direction tool. A user describes a product or brand, optionally attaches source files, chooses a few tonal keywords, and receives a generated moodboard containing imagery, a color palette, typography, visual principles, UI language, and a product UI preview.

The frontend is a Vite/React app. The backend runs as Vercel Serverless Functions under `/api`, with Azure OpenAI generating the direction and Pexels supplying stock imagery.

## 2. Presentation flow

### Step 1 — Start on the project input screen

Introduce the product as a focused workspace rather than a generic form. The navigation contains the Mosaik wordmark, **My moodboards**, and **Preset library**.

### Step 2 — Add project context

In **Describe your project**, enter a product brief, research summary, brand idea, or early concept. The generated result is specific to this context.

### Step 3 — Add source material (optional)

Click **Add sources** to open the file picker. PDF, PNG, and JPG files are displayed as removable chips. Uploaded images are sent as low-detail context to the AI; filenames provide context for other source types.

### Step 4 — Set the emotional direction

Choose one or more preset feeling chips such as Calm, Premium, Minimal, or Bold. Add a custom keyword through the text field and **Add**, or press Enter in the field. Selected chips can be removed by clicking their close icon.

### Step 5 — Generate the moodboard

Click **Generate moodboard**. Mosaik shows progress states while it reads the context, distills the direction, sources imagery, and builds the moodboard.

For a quick demonstration, click **Try creating a sample moodboard**. This fills the form with the Luma sample brief and representative source files; it does not bypass the generation flow.

## 3. Result screen walkthrough

The result screen begins with the project name, selected inputs, generated title, and rationale. The following controls are available.

### Navigation controls

- **Back to project input** — Returns to the input screen while allowing a new brief to be entered.
- **New moodboard** — Clears the current result and starts a fresh moodboard flow.

### Imagery direction

- **Imagery lock icon** — Locks or unlocks imagery for future refine operations.
- **Reshuffle imagery** — Requests fresh Pexels queries and texture prompts while preserving the overall direction. It is disabled while a request is running or while imagery is locked.
- **Image cards** — Show Pexels and generated texture imagery. Images use loading skeletons, attribution/source labels where available, and a subtle hover zoom.

### Colour palette

Each generated swatch has four controls/behaviors:

- **Swatch body / hex value** — Copies the hex value to the clipboard and displays a confirmation toast.
- **Lock icon** — Independently locks or unlocks Background, Surface, Accent, or Text.
- **Recolour** — Requests a new accessible color for that role through `/api/recolorSwatch` and updates only that swatch. It is disabled while locked or while that swatch is being recoloured.
- **Recolouring state** — Replaces the button label briefly while the request is in progress.

Locked palette roles are preserved when the user uses the refine flow.

### Typography

- **Heading font lock icon** — Preserves the generated heading font during refinement.
- **Body font lock icon** — Preserves the generated body font during refinement.
- **Font specimen cards** — Click the specimen/card to copy the generated font name to the clipboard.

### Visual principles

The generated principles explain the visual choices behind the direction. Their numbered cards are presentational and do not trigger new requests.

### UI Language

The UI Language panel previews palette- and typography-driven components:

- Buttons
- Input field
- Controls
- Badges and tags
- Segmented control
- Progress and slider
- List row
- Metric tile
- Notification
- Content card

These controls are intentionally presentational and are not wired to application actions.

### Floating action bar

- **Copy moodboard data** — Copies a Markdown summary containing the project, colors, typography, principles, imagery queries, prompts, and image URLs.
- **Refine moodboard** — Opens the refinement modal.
- **Preview product UI** — Opens the generated product preview screen.
- **Share** — Opens a share modal containing a generated share-style URL placeholder.

## 4. Refinement walkthrough

1. Click **Refine moodboard**.
2. Choose a refinement chip: More energetic, More minimal, More premium, Less organic, or More playful.
3. Click **Regenerate moodboard**.
4. Mosaik sends the current result and all lock states to `/api/refineMoodboard`.
5. Locked palette roles, locked typography, and locked imagery are preserved while unlocked direction fields are regenerated.
6. Click the close icon or outside the modal to cancel before regeneration begins.

## 5. Product preview walkthrough

The product preview demonstrates how the generated direction could translate into a product interface.

- **Desktop** — Shows a dashboard layout with navigation, metrics, activity, and a primary CTA.
- **Mobile** — Shows a mobile layout with a compact metric, activity rows, and CTA.
- **Back to moodboard** — Returns to the generated result.

The preview CTA buttons are visual samples only and intentionally do not perform product actions.

## 6. Sharing and placeholder features

- **Copy link** in the share modal copies the link state and changes to **Copied** briefly.
- **My moodboards** displays a placeholder message: “will save moodboards in one click to come back later.”
- **Preset library** displays a placeholder message: “waiting for your best moodboards to add to my library 😉.”

These two navigation features are intentionally placeholders for a future persistence/library release.

## 7. Technical notes for the presentation

- API calls use relative paths: `/api/generateMoodboard`, `/api/refineMoodboard`, and `/api/recolorSwatch`.
- Secrets are supplied through Vercel Environment Variables and are not committed in `.env`.
- Dynamic palette generation and generated hex values are not hardcoded by the UI.
- Drag-and-drop is not part of the current interaction model.
- Image loading includes a skeleton state and graceful fallbacks when an image is unavailable.

## 8. Suggested five-minute demo script

1. Enter a short, non-sample brief for a product.
2. Select Premium and Grounded.
3. Add a custom keyword such as “editorial”.
4. Generate the moodboard and explain the title/rationale.
5. Point out the imagery grid and click **Reshuffle imagery**.
6. Lock the Accent swatch, then click **Recolour** on another unlocked swatch.
7. Lock the heading font and imagery.
8. Open **Refine moodboard**, select **More premium**, and regenerate.
9. Explain that locked fields remain stable while unlocked content evolves.
10. Copy a swatch, copy the full moodboard data, open **Preview product UI**, switch between Desktop and Mobile, then open **Share**.
11. Finish by showing the placeholder messages for **My moodboards** and **Preset library**.