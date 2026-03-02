# BDai.studio Engine v2.0 🚀

**White-label AI Virtual Try-On Platform for Bangladesh Fashion Brands**

One codebase → deploy branded try-on apps for unlimited fashion brands. Each brand gets their own colors, logo, products, language, and custom domain.

🌐 **bdai.studio** | 🏠 **startbd.com** | 📸 **Powered by Gemini 2.0 Flash**

---

## Architecture

```
bdai-studio-engine/
├── src/
│   ├── App.tsx                    # Main app orchestrator
│   ├── BrandContext.tsx            # React context for brand config
│   ├── brandConfig.ts             # Config loader + theme applicator
│   ├── i18n.ts                    # Bengali/English translations
│   ├── types.ts                   # TypeScript types (enhanced)
│   ├── main.tsx                   # Entry point
│   ├── styles.css                 # Premium fashion UI (CSS vars)
│   ├── vite-env.d.ts              # Vite env types
│   ├── components/
│   │   ├── Header.tsx             # Brand logo + name + language toggle
│   │   ├── Footer.tsx             # Powered by badge + WhatsApp support
│   │   ├── StartScreen.tsx        # Welcome + photo upload/capture
│   │   ├── CameraView.tsx         # Camera capture (front/back switch)
│   │   ├── WardrobePanel.tsx      # Product catalog + gender/category tabs
│   │   ├── ResultScreen.tsx       # Try-on result display
│   │   ├── ProcessingOverlay.tsx  # Animated AI generation loading
│   │   ├── SharePanel.tsx         # FB/WhatsApp/Instagram/Messenger sharing
│   │   └── BuyButton.tsx          # Configurable purchase flow
│   ├── services/
│   │   └── geminiService.ts       # AI proxy calls + category-specific prompts
│   ├── hooks/
│   │   └── useAppState.ts         # Central state management
│   ├── utils/
│   │   └── watermark.ts           # Brand watermark overlay
│   └── brands/
│       └── demo/config.json       # Demo brand config (10 products)
├── proxy/
│   ├── worker.js                  # Cloudflare Worker AI proxy v2
│   └── wrangler.toml              # Worker deployment config
├── deploy.sh                      # One-command brand deployment
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html                     # PWA-ready with Bengali + serif fonts
```

## What's New in v2.0

| Feature | v1.0 (StyleVu) | v2.0 (BDai.studio) |
|---------|----------------|-------------------|
| Brand Name | StyleVu | BDai.studio |
| Products | 6 fake products | 30 real Aarong products template |
| Bengali | সালোয়ার (wrong) | শালওয়ার (correct) |
| Categories | 4 basic | 8 with gender tabs |
| UI Design | Basic mobile | Premium fashion aesthetic |
| Plans | 3 tiers | 4 tiers (starter/growth/pro/enterprise) |
| Prompts | 1 generic | 12 category-specific (Panjabi, Saree, etc.) |
| License | None | Built-in license verification |
| Analytics | Basic tracking | Event tracking + conversion |
| Sharing | 3 platforms | 5 platforms (+ Messenger) |
| Domain URLs | stylevu.com/* | bdai.studio/* |

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Run Dev Server

```bash
# Default (demo brand)
npm run dev

# Specific brand
VITE_BRAND_ID=aarong npm run dev
```

### 3. Deploy AI Proxy (One-time)

```bash
cd proxy
wrangler login
wrangler kv namespace create "BRAND_USAGE"
wrangler kv namespace create "BRAND_CONFIG"
# → Copy IDs into wrangler.toml
wrangler secret put GEMINI_API_KEY
wrangler deploy
# → Live at: https://bdai-studio-proxy.YOUR.workers.dev
```

### 4. Deploy a Brand App

```bash
./deploy.sh aarong cloudflare
# → Live at: https://bdai-aarong.pages.dev
```

## Onboarding a New Brand

```bash
# 1. Create brand folder
mkdir -p src/brands/aarong
cp src/brands/demo/config.json src/brands/aarong/config.json

# 2. Edit config (see config schema below)

# 3. Upload product images to R2
wrangler r2 object put bdai-products/aarong/products/panjabi-01.png --file=./img.png

# 4. Deploy
./deploy.sh aarong cloudflare
```

## Plan Limits

| Plan | Price | Monthly Try-Ons | Badge | Custom Domain |
|------|-------|----------------|-------|---------------|
| Starter | ৳1,499/mo | 300 | Yes | No |
| Growth | ৳4,999/mo | 1,500 | Yes | Yes |
| Pro | ৳14,999/mo | 5,000 | No | Yes |
| Enterprise | ৳39,999/mo | 20,000 | No | Yes + White-label |

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **AI Engine**: Gemini 2.0 Flash (image generation)
- **AI Proxy**: Cloudflare Workers (rate limiting, usage tracking)
- **Hosting**: Cloudflare Pages / Vercel
- **CDN + Images**: Cloudflare R2
- **Rate Limiting**: Cloudflare KV
- **Languages**: Bengali (বাংলা) + English with full i18n
- **Fonts**: Noto Sans Bengali + Playfair Display

## Key Features

- 🎨 Full brand customization (colors, logo, language, products)
- 📱 Mobile-first PWA with premium fashion UI
- 🤖 Category-specific AI prompts (Panjabi, Saree, Shalwar Kameez, etc.)
- 👫 Gender tabs with smart category filtering
- 🔍 Product search in Bengali + English
- 📤 Social sharing (Facebook, WhatsApp, Instagram, Messenger, Download)
- 🛒 Flexible buy flow (Website, WhatsApp, Facebook, Messenger)
- 🌐 Bengali + English with correct spellings (শালওয়ার not সালোয়ার)
- ⚡ One-command deploy: `./deploy.sh brandname`
- 📊 Per-brand usage tracking + event analytics
- 💰 Watermarking (auto brand watermark on shared images)
- 🔐 License verification system
- 🏷️ Product badges (Eid, Featured, New, Low Stock, Discount)

---

Built with ❤️ by [StartBD](https://startbd.com) | [BDai.studio](https://bdai.studio)
