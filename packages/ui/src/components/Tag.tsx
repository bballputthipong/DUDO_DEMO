import { Star } from "lucide-react";
import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "../lib/cn";

export type TagVariant = "navy" | "accent" | "neutral" | "outline-navy" | "outline-accent";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
  dot?: boolean;
}

export function Tag({ className, dot = false, variant = "neutral", ...props }: TagProps) {
  return <span className={cn("wui-root wui-tag", `wui-tag-${variant}`, dot && "wui-tag-dot", className)} {...props} />;
}

export interface NotificationBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  value?: ReactNode;
  dot?: boolean;
}

export function NotificationBadge({ className, dot = false, value, ...props }: NotificationBadgeProps) {
  if (dot) {
    return <span aria-hidden="true" className={cn("wui-root wui-notif-dot", className)} {...props} />;
  }

  return (
    <span className={cn("wui-root wui-notif-badge", className)} {...props}>
      {value}
    </span>
  );
}

export interface RatingBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  value: ReactNode;
  icon?: ReactNode;
}

export function RatingBadge({ className, icon, value, ...props }: RatingBadgeProps) {
  return (
    <span className={cn("wui-root wui-rating-badge", className)} {...props}>
      {icon ?? <Star aria-hidden="true" fill="currentColor" size={12} />}
      {value}
    </span>
  );
}
