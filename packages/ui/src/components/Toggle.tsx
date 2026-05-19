import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "../lib/cn";

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked = false, className, disabled, onCheckedChange, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-pressed={checked}
        className={cn("wui-root wui-toggle", className)}
        data-state={checked ? "on" : "off"}
        disabled={disabled}
        type={type}
        {...props}
        onClick={(event) => {
          props.onClick?.(event);
          if (!event.defaultPrevented && !disabled) {
            onCheckedChange?.(!checked);
          }
        }}
      >
        <span className="wui-toggle-thumb" />
      </button>
    );
  },
);

Toggle.displayName = "Toggle";
