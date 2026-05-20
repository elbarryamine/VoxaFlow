"use client";

import { X, CaretRight, MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { WORKFLOW_TEMPLATES as TEMPLATES } from "../constants/WORKFLOW_TEMPLATES";

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

export const TemplatesModal = ({
  isOpen,
  onClose,
  onSelect,
}: TemplatesModalProps) => {
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setShouldRender(true);
      setSearchQuery(""); // Reset search on open
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

  const filteredTemplates = TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        className={`relative w-full max-w-[600px] overflow-hidden rounded-2xl bg-background p-6 shadow-2xl border border-border transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">Choose a Template</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Start with a pre-built workflow to save time.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative mb-6">
          <MagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelect(template.id);
                  onClose();
                }}
                className="group flex items-center gap-3 p-3 text-left rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
              >
                <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded border border-border bg-background transition-colors group-hover:border-primary/30">
                  <template.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" weight="bold" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-foreground truncate">{template.title}</h4>
                  <p className="text-[11px] text-muted-foreground truncate">{template.description}</p>
                </div>
                <CaretRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </button>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 text-center py-8 text-sm text-muted-foreground">
              No templates found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
