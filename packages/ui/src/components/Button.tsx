import { Check } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "frosted";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconOnly?: boolean;
  loading?: boolean;
  success?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      fullWidth = false,
      iconOnly = false,
      leftIcon,
      loading = false,
      rightIcon,
      size = "md",
      success = false,
      type = "button",
      variant = "primary",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          "wui-root wui-btn",
          `wui-btn-${variant}`,
          `wui-btn-${size}`,
          fullWidth && "wui-btn-full",
          iconOnly && "wui-btn-icon-only",
          success && "wui-btn-success",
          className,
        )}
        data-loading={loading ? "true" : undefined}
        disabled={isDisabled}
        type={type}
        {...props}
      >
        {loading ? <span aria-hidden="true" className="wui-spinner" /> : null}
        {success && !loading ? <Check aria-hidden="true" size={18} /> : null}
        {!loading && !success ? leftIcon : null}
        {children}
        {!loading && !success ? rightIcon : null}
      </button>
    );
  },
);

Button.displayName = "Button";
