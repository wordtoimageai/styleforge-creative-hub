import { useState, useRef, useCallback } from "react";
import { Sparkles } from "lucide-react";

const BEFORE_IMG = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
const AFTER_IMG = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80";

const BeforeAfterDemo = ({ label }: { label: string }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onPointerDown = () => { dragging.current = true; };
  const onPointerUp = () => { dragging.current = false; };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) updatePos(e.clientX);
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      <div
        ref={containerRef}
        className="relative aspect-[3/4] max-w-[280px] md:max-w-[320px] mx-auto rounded-xl overflow-hidden cursor-col-resize select-none touch-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerMove={onPointerMove}
        onClick={(e) => updatePos(e.clientX)}
      >
        {/* After (full background) */}
        <img
          src={AFTER_IMG}
          alt="After AI styling"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Before (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={BEFORE_IMG}
            alt="Before AI styling"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: "none" }}
            draggable={false}
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)]"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        >
          {/* Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>

        {/* Labels */}
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-background/70 backdrop-blur-sm text-foreground px-2 py-1 rounded-full">
          Before
        </span>
        <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-primary/80 backdrop-blur-sm text-primary-foreground px-2 py-1 rounded-full">
          After
        </span>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">{label}</p>
      <p className="text-center text-xs text-muted-foreground/60 mt-1">
        ← Drag to compare →
      </p>
    </div>
  );
};

export default BeforeAfterDemo;
