import { type HTMLAttributes } from "react";

import { cn } from "../lib/cn";

export type FrostedOverlayVariant = "white" | "dark" | "pill";

export interface FrostedOverlayProps extends HTMLAttributes<HTMLDivElement> {
  variant?: FrostedOverlayVariant;
}

export function FrostedOverlay({ className, variant = "white", ...props }: FrostedOverlayProps) {
  return (
    <div
      className={cn(
        "wui-root wui-frosted",
        variant === "dark" && "wui-frosted-dark",
        variant === "pill" && "wui-frosted-pill",
        className,
      )}
      {...props}
    />
  );
}
