

# BDai.studio — Full Ecosystem Build Plan

## Overview
A production-ready AI fashion platform for Bangladesh, featuring Virtual Try-On and AI Style Generation. Mobile-first design with Bengali/English support, powered by Lovable Cloud and Lovable AI.

---

## Page 1: Home / Landing Page
- **Hero section** with animated gradient background, BDai.studio branding
- Bengali/English language toggle in the navbar
- Two primary CTAs: "Upload Photo" and mode selectors (Try On / AI Style)
- Feature highlights: Gemini AI, 30-second results, Made in BD, Privacy-first
- Ecosystem footer linking to startbd.com, bdai.ai, bdai.dev
- Responsive: stacks vertically on mobile, expands on desktop

## Page 2: Upload Screen
- Drag-and-drop or tap-to-upload photo area (3:4 aspect ratio guide)
- Mode indicator badge (Try On vs Style mode)
- Back navigation to home
- File validation and error display
- Privacy notice ("Photos are never stored")

## Page 3: Processing Screen
- Circular user photo preview with animated spinner overlay
- Pulsing loading message in selected language
- "This may take up to 30 seconds" notice
- AI model generation happens here via Lovable Cloud edge function

## Page 4: Studio Screen (Main Workspace)
- **Canvas area**: Displays generated model/result image with fade-in animation
- **Loading overlay** with spinner during AI processing
- **Mode toggle**: Switch between Try On and Style modes
- **Try On mode sidebar**: Upload garment image, view try-on history grid
- **Style mode sidebar**: 6 preset style buttons (Eid Special, Casual, Formal, Wedding, Summer, Winter) with icons, history grid
- **Action bar**: Download with BDai.studio watermark, share to Facebook/WhatsApp
- **Mobile layout**: Bottom sheet panel instead of side panel

## Page 5: StyleVu Landing Page
- Marketing page for the B2B platform side
- Hero with BD pricing and Ramadan offer section
- Features showcase, pricing tiers, brand testimonials
- CTA to brand onboarding

## Page 6: Brand Onboarding Form
- Multi-section form for brands to configure their white-label setup
- Brand info, color scheme, product catalog inputs
- Generates config preview
- Bengali language support

## Page 7: Ecosystem Architecture
- Visual brand architecture map showing startbd.com → bdai.ai / bdai.dev / bdai.studio
- Tech stack overview, domain strategy, brand guide (colors, typography)
- Revenue model and deployment roadmap

---

## Backend (Lovable Cloud)

### Edge Function: AI Image Generation
- Proxies requests to Lovable AI Gateway using Gemini image generation model
- Three prompt endpoints: Model Generation, Virtual Try-On (2 images), Style Generation
- Handles base64 image input/output
- Rate limit (429) and payment (402) error handling with user-friendly messages

---

## Design System
- **Dark theme**: Background #0A0A0F, surfaces with subtle transparency
- **Brand colors**: Green #00DC82, Blue #0096FF, Orange #FF9500
- **Typography**: Syne (headings), Outfit (body) — loaded via Google Fonts
- **Bengali support**: Noto Sans Bengali for বাংলা text
- **Animations**: Slide-up entrances, floating background gradients, glow effects
- **Mobile-first**: All screens optimized for phone, responsive up to desktop

