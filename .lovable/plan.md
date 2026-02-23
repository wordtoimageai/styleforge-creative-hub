

# BDai.studio Homepage Overhaul + UX Fixes (Audit-Driven)

Based on the external audit and the reference `index.tsx` knowledge, this plan addresses the critical and high-impact gaps in the current homepage and navigation. The goal is to transform the thin Hero + Features homepage into a high-converting landing page, fix navigation hierarchy, and add trust signals.

---

## What Changes

### 1. Homepage Overhaul (`src/pages/HomePage.tsx`)

The current homepage has only a hero section and a 4-card feature row. The updated version will follow a proven high-converting structure:

- **Hero Section** (enhanced) -- Keep existing CTAs but add a visual demo teaser below (animated before/after mockup showing try-on concept, not a real API call)
- **"How It Works" Section** (NEW) -- 3-step visual flow: Upload Photo, Choose Style, Generate. Uses Lucide icons with numbered steps
- **Social Proof / Stats Section** (NEW) -- Metrics strip: "10,000+ Try-Ons", "30-Second Results", "50+ Brands". Even as aspirational placeholders, these build trust
- **Features Grid** (enhanced) -- Expand from 4 cards to 6 with better descriptions (Gemini AI, 30-Second Results, Made in BD, Privacy First, Bilingual, White-Label Ready)
- **FAQ Section** (NEW) -- 4-5 common questions using shadcn Accordion: "Is my photo stored?", "How does it work?", "What garments are supported?", etc.
- **Final CTA Banner** (NEW) -- Full-width gradient banner with "Start Designing Free" button

### 2. Navigation Restructure (`src/components/Navbar.tsx`)

Per the audit, "Ecosystem" should not be a top-level nav item. Changes:
- Replace nav items with: **Home**, **For Brands** (links to `/stylevu`), **How It Works** (scrolls to `#how-it-works` on homepage)
- Remove "Ecosystem" from main nav (keep it in Footer)
- Add a mobile hamburger menu using shadcn Sheet for small screens

### 3. Footer Enhancement (`src/components/Footer.tsx`)

- Add "Architecture" link (replaces top nav Ecosystem link -- already exists)
- Add "Privacy Policy" placeholder link (trust signal flagged in audit)
- Add WhatsApp contact button/link for B2B leads

### 4. StyleVu Enhancements (`src/pages/StyleVuPage.tsx`)

- Add countdown timer to the Ramadan banner (even a static "Ends March 31" date adds urgency)
- Add "Made in Bangladesh" trust badge near pricing cards
- Add a "How Brands Use StyleVu" mini case study section (placeholder/mockup)

### 5. i18n Updates (`src/lib/i18n.ts`)

Add new translation keys for:
- How It Works steps (upload, choose, generate)
- FAQ questions and answers
- Stats section labels
- Updated nav labels ("For Brands" instead of "StyleVu")
- Privacy Policy, WhatsApp CTA text
- Both `en` and `bn` entries

### 6. CSS Additions (`src/index.css`)

- Add a subtle grid/dot pattern background utility class for the demo teaser area
- Add a counter/stats animation keyframe for the social proof numbers

---

## What This Does NOT Change

- Studio page, Upload page, Processing page -- untouched
- Wardrobe system -- untouched
- Edge function / AI logic -- untouched
- App routing structure in `App.tsx` -- only minor nav label updates

## Files Modified

| File | Change |
|---|---|
| `src/pages/HomePage.tsx` | Major rewrite: add How It Works, Stats, FAQ, CTA sections |
| `src/components/Navbar.tsx` | Restructure nav items, add mobile hamburger menu |
| `src/components/Footer.tsx` | Add Privacy Policy link, WhatsApp link |
| `src/pages/StyleVuPage.tsx` | Add countdown date, trust badge, case study placeholder |
| `src/lib/i18n.ts` | Add ~40 new translation keys (en + bn) |
| `src/index.css` | Add stats counter animation, grid pattern utility |

## Technical Notes

- No new npm dependencies -- mobile menu uses existing shadcn Sheet component
- FAQ uses existing shadcn Accordion component
- All new sections follow the existing `glass-card`, `gradient-text`, and `animate-slide-up` patterns
- Bilingual support maintained for all new content via i18n

