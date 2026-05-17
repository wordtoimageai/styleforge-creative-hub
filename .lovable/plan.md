## Goal
Add a temporary dev-only way to inject a sample portrait into `userPhoto` state and jump straight from Upload → Processing → Studio, bypassing the file input (which can't be driven by automation).

## Approach
Add a small "Dev seed" button on the `UploadPage` that:
1. Loads a bundled sample portrait (3:4 JPG) as base64.
2. Calls the existing `onUpload(base64)` prop (same path the cropper uses).
3. Navigates to `/processing`.

The button is gated by `import.meta.env.DEV` so it only renders in local/preview dev builds and never ships to production.

## Changes

### 1. Add sample asset
- New file: `src/assets/dev-sample-portrait.jpg` — a 3:4 portrait image (generated via imagegen, ~768×1024).

### 2. `src/pages/UploadPage.tsx`
- Import the sample asset.
- Add a `handleDevSeed` async helper: `fetch(sampleUrl) → blob → FileReader → dataURL → onUpload → navigate("/processing")`. Reuses the existing flow, so Processing/Studio behave identically to a real upload.
- Render a small button below the privacy notice, wrapped in `{import.meta.env.DEV && (...)}`. Styled subtly (outline/ghost, "Dev: seed sample photo" label, `FlaskConical` icon) so it's clearly a debug affordance.

## Out of scope
- No new route, no global state changes, no production-visible UI.
- No changes to Processing/Studio — they already consume `userPhoto` from `useAppState`.

## Notes for non-technical reviewers
The button only appears in the development preview. When you publish the site, it disappears automatically.
