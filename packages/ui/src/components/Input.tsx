import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "../lib/cn";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, disabled, error, hint, id, label, leftIcon, rightIcon, ...props }, ref) => {
    const message = error ?? hint;
    const messageId = message && id ? `${id}-message` : undefined;

    return (
      <label className={cn("wui-root wui-field", className)} htmlFor={id}>
        {label ? <span className="wui-field-label">{label}</span> : null}
        <span className="wui-input-wrap" data-disabled={disabled ? "true" : undefined} data-error={error ? "true" : undefined}>
          {leftIcon}
          <input
            ref={ref}
            aria-describedby={messageId}
            aria-invalid={error ? true : undefined}
            className="wui-input"
            disabled={disabled}
            id={id}
            {...props}
          />
          {rightIcon}
        </span>
        {message ? (
          <span className={cn("wui-input-hint", error && "wui-input-error")} id={messageId}>
            {message}
          </span>
        ) : null}
      </label>
    );
  },
);

Input.displayName = "Input";
