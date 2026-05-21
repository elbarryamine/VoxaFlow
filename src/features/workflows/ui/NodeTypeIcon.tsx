"use client";

import Image from "next/image";
import { cn } from "@/src/shared/utils/cn";
import { getNodeTypeIconSrc } from "../constants/NODE_TYPE_ICONS";
import type { WorkflowNodeType } from "../types/Workflow.types";

interface NodeTypeIconProps {
  type: WorkflowNodeType;
  size?: number;
  className?: string;
}

/** Always a light chip so brand SVGs read clearly on dark node cards. */
const ICON_CHIP_CLASS =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm ring-1 ring-black/8 dark:ring-white/20";

export const NodeTypeIcon = ({
  type,
  size = 20,
  className,
}: NodeTypeIconProps) => {
  const src = getNodeTypeIconSrc(type);

  return (
    <div className={ICON_CHIP_CLASS}>
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        unoptimized
        className={cn("object-contain", className)}
        aria-hidden
        draggable={false}
      />
    </div>
  );
};
