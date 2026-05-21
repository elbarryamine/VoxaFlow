"use client";

import { getBrandLogoSrc } from "@/src/shared/constants/BRAND";
import { useTheme } from "@/src/shared/theme/ThemeProvider";
import { cn } from "@/src/shared/utils/cn";

type AurenLogoSize = "sm" | "md" | "lg";

interface AurenLogoProps {
  size?: AurenLogoSize;
  className?: string;
  priority?: boolean;
}

const LOGO_DIMENSIONS: Record<AurenLogoSize, { width: number; height: number }> = {
  sm: { width: 42, height: 32 },
  md: { width: 47, height: 36 },
  lg: { width: 63, height: 48 },
};

export const AurenLogo = ({
  size = "md",
  className,
  priority = false,
}: AurenLogoProps) => {
  const { theme } = useTheme();
  const { width, height } = LOGO_DIMENSIONS[size];
  const src = getBrandLogoSrc(theme);

  return (
    <div
      className={cn("relative inline-block shrink-0 overflow-hidden", className)}
      style={{ width, height, maxWidth: width, maxHeight: height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={src}
        src={src}
        alt="Auren"
        width={width}
        height={height}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        draggable={false}
        className="block h-full w-full max-h-full max-w-full object-contain object-left"
      />
    </div>
  );
};
