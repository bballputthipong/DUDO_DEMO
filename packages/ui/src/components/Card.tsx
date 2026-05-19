import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "../lib/cn";

export type CardVariant = "1x1" | "4x3" | "16x9" | "vertical";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  dark?: boolean;
}

export function Card({ children, className, dark = false, variant = "4x3", ...props }: CardProps) {
  return (
    <article
      className={cn("wui-root wui-card", variant === "vertical" ? "wui-card-v" : `wui-card-${variant}`, dark && "wui-card-navy", className)}
      {...props}
    >
      {children}
    </article>
  );
}

export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  children?: ReactNode;
}

export function CardMedia({ alt = "", children, className, src, ...props }: CardMediaProps) {
  return (
    <div className={cn("wui-card-media", className)} {...props}>
      {src ? <img alt={alt} src={src} /> : children}
    </div>
  );
}

export function CardOverlay({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("wui-card-overlay", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("wui-card-footer", className)} {...props} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("wui-card-body", className)} {...props} />;
}

export function CardLabel({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("wui-card-label", className)} {...props} />;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  large?: boolean;
}

export function CardTitle({ className, large = false, ...props }: CardTitleProps) {
  return <h3 className={cn("wui-card-title", large && "wui-card-title-large", className)} {...props} />;
}

export function CardSubtitle({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("wui-card-subtitle", className)} {...props} />;
}

export function CardMeta({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("wui-card-meta", className)} {...props} />;
}

export function CardDivider({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("wui-card-divider", className)} {...props} />;
}

export function CardBottom({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("wui-card-bottom", className)} {...props} />;
}
