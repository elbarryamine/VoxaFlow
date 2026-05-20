"use client";

import { useReactFlow } from "@xyflow/react";
import {
  Plus,
  Minus,
  Aperture,
  MapTrifold,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/src/shared/utils/cn";

interface CanvasControlsProps {
  showMiniMap: boolean;
  setShowMiniMap: (show: boolean) => void;
}

const controlButtonClass =
  "flex h-8 w-8 items-center justify-center text-on-surface-variant transition-colors duration-300 hover:bg-surface-variant hover:text-on-surface";

export const CanvasControls = ({
  showMiniMap,
  setShowMiniMap,
}: CanvasControlsProps) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-50 flex items-end justify-between gap-3">
      <div
        className="pointer-events-auto flex items-center overflow-hidden rounded-xl border border-border/50 bg-surface-container-low/95 shadow-sm backdrop-blur-sm"
        role="toolbar"
        aria-label="Canvas view controls"
      >
        <div className="flex items-center px-1">
          <button
            type="button"
            onClick={() => zoomOut()}
            className={controlButtonClass}
            title="Zoom out"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => zoomIn()}
            className={controlButtonClass}
            title="Zoom in"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" weight="bold" />
          </button>
        </div>

        <div className="h-6 w-px bg-outline-variant/50" aria-hidden />

        <button
          type="button"
          onClick={() => fitView({ duration: 400 })}
          className={cn(controlButtonClass, "px-1")}
          title="Fit view"
          aria-label="Fit view"
        >
          <Aperture className="h-4 w-4" weight="bold" />
        </button>

        <div className="h-6 w-px bg-outline-variant/50" aria-hidden />

        <button
          type="button"
          onClick={() => setShowMiniMap(!showMiniMap)}
          className={cn(
            controlButtonClass,
            "px-1",
            showMiniMap &&
              "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
          )}
          title="Toggle minimap"
          aria-label="Toggle minimap"
        >
          <MapTrifold className="h-4 w-4" weight="bold" />
        </button>
      </div>

      <p className="pointer-events-none hidden font-manrope text-[11px] font-bold uppercase tracking-wide text-on-surface-variant/60 sm:block">
        Scroll to pan · Drag to connect
      </p>
    </div>
  );
};
