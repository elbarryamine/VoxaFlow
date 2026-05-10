"use client";

import { useReactFlow } from "@xyflow/react";
import { Plus, Minus, Aperture, MapTrifold } from "@phosphor-icons/react";

interface CanvasControlsProps {
  showMiniMap: boolean;
  setShowMiniMap: (show: boolean) => void;
}

export const CanvasControls = ({ showMiniMap, setShowMiniMap }: CanvasControlsProps) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="absolute bottom-4 left-4 z-50 flex flex-col gap-1.5">
      <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-background/80 shadow-sm backdrop-blur-md">
        <button
          onClick={() => zoomIn()}
          className="flex h-9 w-9 items-center justify-center text-foreground hover:bg-secondary transition-colors"
          title="Zoom In"
        >
          <Plus weight="bold" className="h-4 w-4" />
        </button>
        <div className="h-[1px] w-full bg-border" />
        <button
          onClick={() => zoomOut()}
          className="flex h-9 w-9 items-center justify-center text-foreground hover:bg-secondary transition-colors"
          title="Zoom Out"
        >
          <Minus weight="bold" className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={() => fitView({ duration: 400 })}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/80 text-foreground shadow-sm backdrop-blur-md hover:bg-secondary transition-colors"
        title="Fit View"
      >
        <Aperture weight="bold" className="h-4 w-4" />
      </button>

      <button
        onClick={() => setShowMiniMap(!showMiniMap)}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border shadow-sm backdrop-blur-md transition-colors ${
          showMiniMap 
            ? "border-primary bg-primary/10 text-primary" 
            : "border-border bg-background/80 text-foreground hover:bg-secondary"
        }`}
        title="Toggle Mini Map"
      >
        <MapTrifold weight="bold" className="h-4 w-4" />
      </button>
    </div>
  );
};
