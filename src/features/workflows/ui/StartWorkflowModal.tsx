"use client";

import { X, FilePlus, Copy } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface StartWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartWorkflowModal = ({ isOpen, onClose }: StartWorkflowModalProps) => {
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setShouldRender(true);
    }
  }

  useEffect(() => {
    if (isOpen) {
      const timer = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(timer);
    } else {
      const animTimer = requestAnimationFrame(() => setIsVisible(false));
      const closeTimer = setTimeout(() => setShouldRender(false), 300);
      return () => {
        cancelAnimationFrame(animTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${
        isVisible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-[500px] overflow-hidden rounded-2xl bg-background p-6 shadow-2xl border border-border transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground">Create New Workflow</h3>
            <p className="text-sm text-muted-foreground mt-1">
              How would you like to start?
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/workflows/new"
            className="group flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-secondary/50 transition-all"
          >
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <FilePlus className="h-6 w-6 text-primary" weight="bold" />
            </div>
            <span className="font-bold text-foreground">Start Fresh</span>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Build a custom workflow from scratch on a blank canvas.
            </p>
          </Link>

          <Link
            href="/dashboard/workflows/templates"
            className="group flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-secondary/50 transition-all"
          >
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <Copy className="h-6 w-6 text-blue-500" weight="bold" />
            </div>
            <span className="font-bold text-foreground">Use Template</span>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Start with a pre-built template to save time and effort.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
