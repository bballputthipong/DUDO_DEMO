import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react";

import { cn } from "../lib/cn";

export function PillSelectGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("wui-root wui-pill-group", className)} role="group" {...props} />;
}

export interface PillSelectProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  selectedTone?: "navy" | "accent";
}

export const PillSelect = forwardRef<HTMLButtonElement, PillSelectProps>(
  ({ className, selected = false, selectedTone = "navy", type = "button", ...props }, ref) => {
    const selectedValue = selected ? (selectedTone === "accent" ? "accent" : "true") : undefined;

    return <button ref={ref} className={cn("wui-root wui-pill", className)} data-selected={selectedValue} type={type} {...props} />;
  },
);

PillSelect.displayName = "PillSelect";
