

# Integrate Brand Partnership Wardrobe into BDai.studio

## What This Adds
The uploaded files introduce a **Brand Partnership system** — a curated wardrobe of sponsored garments (Aarong Eid 2026 collection) with pricing, discount badges, and "Buy Now" CTAs. This transforms the Try-On mode from a simple file upload into a shoppable experience.

## New Features
- **Wardrobe catalog** with Eid Collection and regular items, category filters, and brand banners
- **Outfit Stack** panel showing layered garments with brand badges and purchase cards for sponsored items
- **Buy Now flow** with BDT pricing, discount percentages, and affiliate tracking links
- **Custom upload** tab alongside the curated wardrobe

## Files to Create

### 1. `src/lib/wardrobe-types.ts`
- Adapted from the uploaded `types.ts`
- Contains `WardrobeItem`, `OutfitLayer`, and `SavedOutfit` interfaces
- Adds brand partnership fields (brand, brandLogo, price, buyUrl, category, isSponsored, discount, eidCollection)

### 2. `src/lib/wardrobe-data.ts`
- Adapted from the uploaded `wardrobe.ts`
- Contains `defaultWardrobe` array with Aarong Eid 2026 placeholder items and generic items
- Utility functions: `getBrandWardrobe()`, `getEidCollection()`, `getByBrand()`

### 3. `src/components/WardrobeSheet.tsx`
- Adapted from `WardrobeSheet.tsx` — restyled to match BDai.studio dark theme using Tailwind + shadcn
- Uses `Dialog` from shadcn instead of `framer-motion` (no new dependency needed)
- Three tabs: Eid Collection (with category filter chips), All Items, Upload
- Garment cards show discount badges, brand labels, BDT prices
- Clicking a garment fetches the image URL, converts to base64, and triggers the AI try-on via existing `generateImage()` flow

### 4. `src/components/OutfitStack.tsx`
- Adapted from `OutfitStack.tsx` — restyled for dark theme
- Shows numbered outfit layers with thumbnails and brand badges
- Sponsored item purchase cards with brand logo, discounted price, and "Buy Now" button
- "Add Garment" button opens the WardrobeSheet

## Files to Modify

### 5. `src/pages/StudioPage.tsx`
- Replace the simple file upload in Try-On mode with the new WardrobeSheet + OutfitStack
- Add state for `outfitLayers` (array of `OutfitLayer`) and `wardrobeOpen` flag
- When a garment is selected from the wardrobe, call `generateImage({ mode: "tryon", ... })` and push result to outfit stack
- Side panel shows OutfitStack (with layers + buy cards) instead of the plain upload label
- "Add Garment" button in OutfitStack opens WardrobeSheet dialog

### 6. `src/lib/i18n.ts`
- Add new translation keys for wardrobe UI: `studio.wardrobe`, `studio.outfitStack`, `studio.addGarment`, `studio.buyNow`, `studio.eidCollection`

## Technical Notes
- No new npm dependencies needed — uses existing shadcn Dialog, Tabs, and Badge components plus Lucide icons
- The `framer-motion` dependency from the original WardrobeSheet is replaced with CSS animations and shadcn Dialog for the modal
- All styling converted from light/white theme classes to the app's dark glass-card theme
- Garment images are fetched from URL, converted to base64 via FileReader, then sent through the existing `generateImage()` edge function
- The wardrobe data is static/client-side for now (can be moved to database later for brand dashboard management)

