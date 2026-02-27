import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCw, ZoomIn, Check, X } from "lucide-react";

interface ImageCropDialogProps {
  open: boolean;
  imageSrc: string;
  onConfirm: (croppedBase64: string) => void;
  onCancel: () => void;
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => { image.onload = resolve; });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg", 0.92);
}

export default function ImageCropDialog({ open, imageSrc, onConfirm, onCancel }: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return;
    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
    onConfirm(cropped);
  }, [croppedAreaPixels, imageSrc, onConfirm]);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-background border-border">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-foreground">Adjust Photo</DialogTitle>
        </DialogHeader>

        {/* Crop area */}
        <div className="relative w-full aspect-[3/4] bg-muted">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={3 / 4}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="px-4 pb-2 space-y-3">
          {/* Zoom */}
          <div className="flex items-center gap-3">
            <ZoomIn className="h-4 w-4 text-muted-foreground shrink-0" />
            <Slider
              min={1}
              max={3}
              step={0.05}
              value={[zoom]}
              onValueChange={([v]) => setZoom(v)}
              className="flex-1"
            />
          </div>
          {/* Rotation */}
          <div className="flex items-center gap-3">
            <RotateCw className="h-4 w-4 text-muted-foreground shrink-0" />
            <Slider
              min={0}
              max={360}
              step={1}
              value={[rotation]}
              onValueChange={([v]) => setRotation(v)}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10 text-right">{rotation}°</span>
          </div>
        </div>

        <DialogFooter className="p-4 pt-2 gap-2">
          <Button variant="ghost" onClick={onCancel} className="gap-1">
            <X className="h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleConfirm} className="gap-1">
            <Check className="h-4 w-4" /> Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
