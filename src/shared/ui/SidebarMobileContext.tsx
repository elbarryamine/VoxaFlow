"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { List } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/src/shared/utils/cn";

interface SidebarMobileContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SidebarMobileContext = createContext<
  SidebarMobileContextValue | undefined
>(undefined);

export const SidebarMobileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  const value = useMemo(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  );

  return (
    <SidebarMobileContext.Provider value={value}>
      {children}
    </SidebarMobileContext.Provider>
  );
};

export const useSidebarMobile = () => {
  const context = useContext(SidebarMobileContext);
  if (!context) {
    throw new Error(
      "useSidebarMobile must be used within SidebarMobileProvider",
    );
  }
  return context;
};

const menuButtonClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors duration-300 hover:bg-surface-variant hover:text-on-surface";

export const SidebarMobileMenuButton = () => {
  const { toggle } = useSidebarMobile();

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(menuButtonClass, "xl:hidden")}
      aria-label="Open menu"
    >
      <List className="h-5 w-5" weight="regular" />
    </button>
  );
};
