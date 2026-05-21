"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import type { LandingSectionId } from "@/src/features/landing/utils/scroll-to-landing-section";
import {
  queueLandingSectionScroll,
  scrollToLandingSection,
} from "@/src/features/landing/utils/scroll-to-landing-section";
import { cn } from "@/src/shared/utils/cn";

interface LandingSectionLinkProps {
  sectionId: LandingSectionId;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export const LandingSectionLink = ({
  sectionId,
  children,
  className,
  "aria-label": ariaLabel,
}: LandingSectionLinkProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (pathname === "/") {
      scrollToLandingSection(sectionId);
      return;
    }

    queueLandingSectionScroll(sectionId);
    router.push("/");
  };

  return (
    <a
      href="/"
      onClick={handleClick}
      className={cn(className)}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
};

interface LandingRouteLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export const LandingRouteLink = ({ href, children, className }: LandingRouteLinkProps) => (
  <Link href={href} className={cn(className)}>
    {children}
  </Link>
);
