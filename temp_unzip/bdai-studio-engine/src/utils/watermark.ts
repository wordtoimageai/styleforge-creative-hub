// ============================================
// BDai.studio — Watermark Utility
// Adds brand logo + platform badge to try-on images
// ============================================

import type { WatermarkConfig } from '../types';

export async function addWatermark(
  imageBase64: string,
  brandName: string,
  logoUrl: string,
  watermarkConfig: WatermarkConfig
): Promise<string> {
  if (!watermarkConfig.enabled) return imageBase64;

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) { resolve(imageBase64); return; }

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const padding = 16;
      const badgeHeight = 28;
      const badgeWidth = Math.min(220, canvas.width * 0.45);

      // Position
      let x = padding;
      let y = canvas.height - badgeHeight - padding;

      switch (watermarkConfig.position) {
        case 'top-left': x = padding; y = padding; break;
        case 'top-right': x = canvas.width - badgeWidth - padding; y = padding; break;
        case 'bottom-left': x = padding; y = canvas.height - badgeHeight - padding; break;
        case 'bottom-right': x = canvas.width - badgeWidth - padding; y = canvas.height - badgeHeight - padding; break;
        case 'center': x = (canvas.width - badgeWidth) / 2; y = canvas.height - badgeHeight - padding; break;
      }

      const opacity = watermarkConfig.opacity || 0.25;

      // Draw badge background
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(x, y, badgeWidth, badgeHeight, 6);
      ctx.fill();

      // Draw text
      ctx.globalAlpha = Math.min(1, opacity + 0.4);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px -apple-system, sans-serif';
      ctx.textBaseline = 'middle';
      
      const text = watermarkConfig.text || `${brandName} × BDai.studio`;
      ctx.fillText(text, x + 10, y + badgeHeight / 2);

      ctx.globalAlpha = 1;

      // Return as base64
      resolve(canvas.toDataURL('image/jpeg', 0.92).split(',')[1]);
    };

    img.onerror = () => resolve(imageBase64);
    img.src = `data:image/jpeg;base64,${imageBase64}`;
  });
}
