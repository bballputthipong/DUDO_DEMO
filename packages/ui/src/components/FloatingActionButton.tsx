import { Plus } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../lib/cn";

export interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fixed?: boolean;
  icon?: ReactNode;
}

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ children, className, fixed = false, icon, type = "button", ...props }, ref) => {
    return (
      <button ref={ref} className={cn("wui-root wui-fab", fixed && "wui-fab-fixed", className)} type={type} {...props}>
        {icon ?? <Plus aria-hidden="true" size={24} />}
        {children}
      </button>
    );
  },
);

FloatingActionButton.displayName = "FloatingActionButton";
