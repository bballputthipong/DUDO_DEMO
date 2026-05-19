import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "../lib/cn";

export function BottomNavigation({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <nav className={cn("wui-root wui-bottom-nav", className)} {...props} />;
}

interface BottomNavigationItemBase {
  active?: boolean;
  icon: ReactNode;
  label: string;
}

export type BottomNavigationItemProps =
  | (BottomNavigationItemBase & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  | (BottomNavigationItemBase & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined });

export function BottomNavigationItem(props: BottomNavigationItemProps) {
  const { active = false, className, icon, label } = props;

  if ("href" in props && props.href !== undefined) {
    const { active: _active, className: _className, icon: _icon, label: _label, ...anchorProps } = props;
    return (
      <a className={cn("wui-bottom-nav-item", className)} data-active={active ? "true" : undefined} {...anchorProps}>
        {icon}
        <span>{label}</span>
      </a>
    );
  }

  const { active: _active, className: _className, icon: _icon, label: _label, type = "button", ...buttonProps } = props;

  return (
    <button className={cn("wui-bottom-nav-item", className)} data-active={active ? "true" : undefined} type={type} {...buttonProps}>
      {icon}
      <span>{label}</span>
    </button>
  );
}
