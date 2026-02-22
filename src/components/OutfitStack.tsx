import { useState } from "react";
import { Trash2, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { OutfitLayer } from "@/lib/wardrobe-types";
import type { Language } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface OutfitStackProps {
  outfitHistory: OutfitLayer[];
  onRemoveLastGarment: () => void;
  onAddGarment: () => void;
  lang: Language;
}

const formatTaka = (amount: number) => "৳" + amount.toLocaleString("en-BD");

const getDiscountedPrice = (price: number, discount?: number) =>
  discount ? Math.round(price * (1 - discount / 100)) : price;

export default function OutfitStack({
  outfitHistory,
  onRemoveLastGarment,
  onAddGarment,
  lang,
}: OutfitStackProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sponsoredLayers = outfitHistory.filter(
    (l) => l.garment && l.garment.isSponsored
  );

  const handleBuyNow = (url: string, id: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-heading font-semibold text-foreground border-b border-border/50 pb-2 mb-3">
        {t(lang, "studio.outfitStack")}
      </h3>

      {/* Layers */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        {outfitHistory.map((layer, index) => (
          <div
            key={layer.garment?.id || "base"}
            className="flex items-center gap-3 glass-card p-2 rounded-lg animate-fade-in"
          >
            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 text-xs font-bold text-muted-foreground bg-muted/50 rounded-full">
              {index + 1}
            </span>
            {layer.garment && (
              <img
                src={layer.garment.url}
                alt={layer.garment.name}
                className="flex-shrink-0 w-10 h-10 object-cover rounded-md"
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-foreground truncate block">
                {layer.garment ? layer.garment.name : "Base Model"}
              </span>
              {layer.garment?.brand && (
                <Badge variant="secondary" className="text-[10px] mt-0.5">
                  {layer.garment.brand}
                </Badge>
              )}
            </div>
            {index > 0 && index === outfitHistory.length - 1 && (
              <button
                onClick={onRemoveLastGarment}
                className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10"
                aria-label={`Remove ${layer.garment?.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}

        {outfitHistory.length <= 1 && (
          <p className="text-center text-xs text-muted-foreground pt-4">
            Your stacked items will appear here.
          </p>
        )}
      </div>

      {/* Purchase cards */}
      {sponsoredLayers.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-accent-foreground uppercase tracking-widest">
              🛍 {t(lang, "studio.eidCollection")}
            </span>
            <span className="flex-1 h-px bg-border/50" />
          </div>

          {sponsoredLayers.map((layer) => {
            if (!layer.garment) return null;
            const g = layer.garment;
            const originalPrice = g.price!;
            const finalPrice = getDiscountedPrice(originalPrice, g.discount);
            const hasDeal = g.discount && g.discount > 0;

            return (
              <div
                key={g.id + "-buy"}
                className="bg-primary/5 border border-primary/20 rounded-xl p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {g.brandLogo && (
                      <img
                        src={g.brandLogo}
                        alt={g.brand}
                        className="h-4 w-auto object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <span className="text-[10px] font-bold text-foreground">{g.brand}</span>
                  </div>
                  {hasDeal && (
                    <Badge className="bg-destructive text-destructive-foreground text-[10px]">
                      {g.discount}% OFF
                    </Badge>
                  )}
                </div>

                <p className="text-xs font-semibold text-foreground truncate mb-1">{g.name}</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm font-bold text-primary">{formatTaka(finalPrice)}</span>
                  {hasDeal && (
                    <span className="text-[10px] text-muted-foreground line-through">
                      {formatTaka(originalPrice)}
                    </span>
                  )}
                </div>

                {g.buyUrl ? (
                  <Button
                    size="sm"
                    className="w-full bg-primary text-primary-foreground gap-2"
                    onClick={() => handleBuyNow(g.buyUrl!, g.id)}
                  >
                    {copiedId === g.id ? (
                      "✓ Opening..."
                    ) : (
                      <>
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {t(lang, "studio.buyNow")} — {formatTaka(finalPrice)}
                      </>
                    )}
                  </Button>
                ) : (
                  <p className="text-center text-[10px] text-muted-foreground py-1">
                    Online store coming soon
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add garment */}
      <Button onClick={onAddGarment} className="mt-4 w-full gap-2">
        <Plus className="h-4 w-4" />
        {t(lang, "studio.addGarment")}
      </Button>
    </div>
  );
}
