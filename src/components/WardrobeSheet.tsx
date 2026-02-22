import { useState } from "react";
import { Upload, Check, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { defaultWardrobe } from "@/lib/wardrobe-data";
import type { WardrobeItem } from "@/lib/wardrobe-types";
import type { Language } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface WardrobeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGarmentSelect: (garmentBase64: string, item: WardrobeItem) => void;
  activeGarmentIds: string[];
  isLoading: boolean;
  lang: Language;
}

type Category = "all" | "panjabi" | "sherwani" | "fatua" | "kurta" | "tshirt" | "shirt";

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All",
  panjabi: "Panjabi",
  sherwani: "Sherwani",
  fatua: "Fatua",
  kurta: "Kurta",
  tshirt: "T-Shirt",
  shirt: "Shirt",
};

const formatTaka = (n: number) => "৳" + n.toLocaleString("en-BD");

async function urlToBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function GarmentCard({
  item,
  isActive,
  isLoading,
  onClick,
}: {
  item: WardrobeItem;
  isActive: boolean;
  isLoading: boolean;
  onClick: () => void;
}) {
  const discountedPrice =
    item.price && item.discount
      ? Math.round(item.price * (1 - item.discount / 100))
      : item.price;

  return (
    <button
      onClick={onClick}
      disabled={isLoading || isActive}
      className={`relative overflow-hidden rounded-xl border transition-all text-left group disabled:opacity-60 disabled:cursor-not-allowed ${
        item.isSponsored
          ? "border-primary/30 bg-card hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10"
          : "border-border/50 bg-card hover:border-border"
      }`}
    >
      {item.discount && (
        <Badge className="absolute top-1.5 left-1.5 z-10 bg-destructive text-destructive-foreground text-[10px] px-1.5">
          -{item.discount}%
        </Badge>
      )}
      {item.eidCollection && !item.discount && (
        <Badge className="absolute top-1.5 left-1.5 z-10 bg-primary text-primary-foreground text-[10px] px-1.5">
          EID
        </Badge>
      )}

      <div className="aspect-square relative overflow-hidden bg-muted/30">
        <img
          src={item.url}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isActive && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <Check className="h-8 w-8 text-primary" />
          </div>
        )}
      </div>

      <div className="p-2">
        {item.brand && (
          <p className="text-[10px] text-primary font-semibold mb-0.5">{item.brand}</p>
        )}
        <p className="text-xs font-semibold text-foreground leading-tight truncate">{item.name}</p>
        {item.price && (
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-sm font-bold text-primary">{formatTaka(discountedPrice!)}</span>
            {item.discount && (
              <span className="text-[10px] text-muted-foreground line-through">
                {formatTaka(item.price)}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}

export default function WardrobeSheet({
  open,
  onOpenChange,
  onGarmentSelect,
  activeGarmentIds,
  isLoading,
  lang,
}: WardrobeSheetProps) {
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const eidItems = defaultWardrobe.filter((i) => i.eidCollection);
  const regularItems = defaultWardrobe.filter((i) => !i.eidCollection);

  const filteredEidItems =
    activeCategory === "all"
      ? eidItems
      : eidItems.filter((i) => i.category === activeCategory);

  const eidCategories = Array.from(
    new Set(eidItems.map((i) => i.category).filter(Boolean))
  ) as Category[];

  const handleGarmentClick = async (item: WardrobeItem) => {
    if (isLoading || activeGarmentIds.includes(item.id)) return;
    setError(null);
    try {
      const base64 = await urlToBase64(item.url);
      onGarmentSelect(base64, item);
      onOpenChange(false);
    } catch {
      setError("Could not load item. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const customItem: WardrobeItem = {
        id: `custom-${Date.now()}`,
        name: file.name.replace(/\.[^.]+$/, ""),
        url: URL.createObjectURL(file),
        category: "custom",
      };
      onGarmentSelect(reader.result as string, customItem);
      onOpenChange(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {t(lang, "studio.addGarment")}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="eid" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full justify-start bg-muted/30">
            <TabsTrigger value="eid" className="gap-1">
              🌙 {t(lang, "studio.eidCollection")}
              <Badge variant="secondary" className="text-[10px] ml-1">{eidItems.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-1">
              {t(lang, "studio.wardrobe")}
              <Badge variant="secondary" className="text-[10px] ml-1">{regularItems.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="upload">📤 {t(lang, "studio.uploadGarment")}</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="eid" className="mt-0">
              {eidCategories.length > 1 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {(["all", ...eidCategories] as Category[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/30 text-muted-foreground border-border/50 hover:border-primary/50"
                      }`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              )}

              {eidItems[0]?.brand && (
                <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-4">
                  <div className="w-1.5 h-8 bg-primary rounded-full" />
                  <div>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                      Brand Partner
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {eidItems[0].brand} — Eid 2026
                    </p>
                  </div>
                  <span className="ml-auto text-2xl">🌙</span>
                </div>
              )}

              {filteredEidItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-4xl mb-2">🌙</p>
                  <p className="font-medium">No items in this category yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredEidItems.map((item) => (
                    <GarmentCard
                      key={item.id}
                      item={item}
                      isActive={activeGarmentIds.includes(item.id)}
                      isLoading={isLoading}
                      onClick={() => handleGarmentClick(item)}
                    />
                  ))}
                </div>
              )}

              <p className="text-center text-[10px] text-muted-foreground mt-4">
                Virtual try-on powered by AI · Prices shown are indicative
              </p>
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {regularItems.map((item) => (
                  <GarmentCard
                    key={item.id}
                    item={item}
                    isActive={activeGarmentIds.includes(item.id)}
                    isLoading={isLoading}
                    onClick={() => handleGarmentClick(item)}
                  />
                ))}
                {regularItems.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No other items available
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12">
                <label className="w-48 h-48 border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:border-primary/50 hover:text-primary transition-colors">
                  <Upload className="h-10 w-10 mb-2" />
                  <span className="text-sm font-semibold">{t(lang, "studio.uploadGarment")}</span>
                  <span className="text-[10px] mt-1 text-center px-4">
                    PNG or JPEG · Transparent bg preferred
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </label>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {error && <p className="text-destructive text-sm mt-2">{error}</p>}
      </DialogContent>
    </Dialog>
  );
}
