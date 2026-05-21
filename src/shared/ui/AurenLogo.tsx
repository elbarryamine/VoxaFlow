"use client";

import { BRAND_LOGO } from "@/src/shared/constants/BRAND";
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

const logoImgClassName =
  "h-full w-full max-h-full max-w-full object-contain object-left";

export const AurenLogo = ({
  size = "md",
  className,
  priority = false,
}: AurenLogoProps) => {
  const { width, height } = LOGO_DIMENSIONS[size];
  const fetchPriority = priority ? "high" : "auto";

  return (
    <div
      className={cn("relative inline-block shrink-0 overflow-hidden", className)}
      style={{ width, height, maxWidth: width, maxHeight: height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BRAND_LOGO.forLightTheme}
        alt="Auren"
        width={width}
        height={height}
        decoding="async"
        fetchPriority={fetchPriority}
        draggable={false}
        className={cn("block dark:hidden", logoImgClassName)}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BRAND_LOGO.forDarkTheme}
        alt=""
        aria-hidden
        width={width}
        height={height}
        decoding="async"
        fetchPriority={fetchPriority}
        draggable={false}
        className={cn("hidden dark:block", logoImgClassName)}
      />
    </div>
  );
};
