#!/bin/bash
# ============================================
# BDai.studio — Brand Deployment Script
# Usage: ./deploy.sh <brand-id> [platform]
# Platforms: cloudflare (default), vercel
# ============================================

set -e

BRAND_ID="${1:-demo}"
PLATFORM="${2:-cloudflare}"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "============================================"
echo "  BDai.studio — Deploying Brand: $BRAND_ID"
echo "  Platform: $PLATFORM"
echo "============================================"

CONFIG_PATH="$PROJECT_DIR/src/brands/$BRAND_ID/config.json"
if [ ! -f "$CONFIG_PATH" ]; then
  echo "❌ Error: Brand config not found at $CONFIG_PATH"
  echo ""
  echo "To create a new brand:"
  echo "  1. mkdir -p src/brands/$BRAND_ID"
  echo "  2. cp src/brands/demo/config.json src/brands/$BRAND_ID/config.json"
  echo "  3. Edit the config with brand details"
  echo "  4. Run this script again"
  exit 1
fi

if ! python3 -c "import json; json.load(open('$CONFIG_PATH'))" 2>/dev/null; then
  if ! node -e "require('$CONFIG_PATH')" 2>/dev/null; then
    echo "❌ Error: Invalid JSON in config.json"
    exit 1
  fi
fi

echo "✅ Brand config validated"

if [ ! -d "$PROJECT_DIR/node_modules" ]; then
  echo "📦 Installing dependencies..."
  cd "$PROJECT_DIR"
  npm install
fi

echo "🔨 Building app for $BRAND_ID..."
cd "$PROJECT_DIR"
VITE_BRAND_ID="$BRAND_ID" \
VITE_PROXY_URL="${PROXY_URL:-https://api.bdai.studio}" \
VITE_IMAGE_BASE_URL="${IMAGE_BASE_URL:-https://images.bdai.studio}" \
npm run build

echo "✅ Build complete"

case "$PLATFORM" in
  "vercel")
    echo "🚀 Deploying to Vercel..."
    if ! command -v vercel &>/dev/null; then npm install -g vercel; fi
    vercel deploy --prod --yes \
      --name "bdai-$BRAND_ID" \
      --build-env VITE_BRAND_ID="$BRAND_ID"
    echo ""
    echo "✅ Deployed to Vercel!"
    echo "🔗 URL: https://bdai-$BRAND_ID.vercel.app"
    ;;
  "cloudflare")
    echo "🚀 Deploying to Cloudflare Pages..."
    if ! command -v wrangler &>/dev/null; then npm install -g wrangler; fi
    wrangler pages deploy dist \
      --project-name="bdai-$BRAND_ID" \
      --branch="main"
    echo ""
    echo "✅ Deployed to Cloudflare Pages!"
    echo "🔗 URL: https://bdai-$BRAND_ID.pages.dev"
    ;;
  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Supported: vercel, cloudflare"
    exit 1
    ;;
esac

echo ""
echo "============================================"
echo "  ✨ Brand $BRAND_ID deployed successfully!"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. Test at the URL above"
echo "  2. Custom domain (Growth/Pro):"
echo "     Brand adds CNAME: tryon.brand.com → bdai-$BRAND_ID.pages.dev"
echo "  3. Upload product images to R2:"
echo "     wrangler r2 object put bdai-products/$BRAND_ID/products/item.png --file=./img.png"
echo ""
