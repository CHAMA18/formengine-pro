"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState } from "react";
import { LogoutButton } from "@/components/logout-button";
import { useWalkthrough } from "@/lib/walkthrough";

type NavItem = {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
};

const navItems: NavItem[] = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/templates", icon: "description", label: "Form Templates" },
  { href: "/submissions", icon: "inbox", label: "Submissions" },
  { href: "/api-keys", icon: "key", label: "API Keys" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`.trim()} aria-hidden="true">
      {name}
    </span>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  active = false,
  collapsed = false,
}: NavItem & { collapsed?: boolean }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 ease-in-out ${
        active
          ? "border-r-2 border-fe-primary bg-fe-primary/5 text-fe-primary"
          : "text-fe-on-surface-variant hover:bg-white/5 hover:text-fe-on-surface"
      } ${collapsed ? "justify-center px-0" : ""}`}
    >
      <Icon name={icon} className="text-[20px]" />
      <span className={`text-[14px] font-medium ${collapsed ? "hidden" : "block"}`}>{label}</span>
    </Link>
  );
}

export function AppShell({
  activePath,
  brandSubtitle,
  children,
  brandName = "FormEngine Pro",
}: {
  activePath: string;
  brandSubtitle: string;
  brandName?: string;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 88 : 320;

  const nav = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        active: item.href === activePath,
      })),
    [activePath]
  );

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-fe-surface-base text-fe-on-surface"
      style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}
    >
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/10 bg-fe-surface/80 px-4 backdrop-blur-md min-[480px]:hidden sm:px-6">
        <Link href="/dashboard" className="text-[20px] font-bold tracking-tight">
          FormEngine <span className="text-fe-primary-container">Pro</span>
        </Link>
        <div className="flex items-center gap-2">
          <details className="relative">
            <summary className="list-none cursor-pointer rounded-lg p-2 text-fe-on-surface-variant transition-colors hover:text-fe-primary [&::-webkit-details-marker]:hidden">
              <Icon name="menu" />
            </summary>
            <div className="absolute right-0 mt-3 w-[min(88vw,280px)] rounded-2xl border border-white/10 bg-fe-surface-container p-3 shadow-2xl">
              <div className="space-y-1">
                {nav.map((item) => (
                  <SidebarLink key={item.label} {...item} />
                ))}
                <div className="my-2 border-t border-white/10" />
                <LogoutButton variant="sidebar" />
                <SidebarLink href="#" icon="contact_support" label="Support" />
              </div>
            </div>
          </details>
        </div>
      </header>

      <aside
        className="fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-white/10 bg-fe-surface-container py-8 transition-all duration-300 min-[480px]:flex"
        style={{ width: sidebarWidth }}
      >
        <div className={`mb-8 flex items-center gap-4 ${collapsed ? "justify-center px-4" : "px-6"}`}>
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-fe-border-white-faint bg-fe-surface-variant shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            {/* Brand logo — amber gradient with "FE" monogram */}
            <svg
              viewBox="0 0 64 64"
              className="h-full w-full"
              role="img"
              aria-label="FormEngine Pro Logo"
            >
              <defs>
                <linearGradient id="fe-avatar-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              <rect width="64" height="64" fill="url(#fe-avatar-grad)" rx="12" />
              <text
                x="32"
                y="42"
                textAnchor="middle"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontSize="26"
                fontWeight="800"
                fill="#ffffff"
              >
                FE
              </text>
            </svg>
          </div>
          {!collapsed ? (
            <div>
              <h1 className="text-[18px] font-extrabold text-fe-on-surface">
                FormEngine <span className="text-fe-primary-container">Pro</span>
              </h1>
              <p className="text-[12px] text-fe-on-surface-variant">{brandSubtitle}</p>
            </div>
          ) : null}
        </div>

        <div className="flex-1 px-4">
          <div className="space-y-1">
            {nav.map((item) => (
              <SidebarLink key={item.label} {...item} collapsed={collapsed} />
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 px-4 pt-4">
          <div className="mb-3 space-y-2">
            <LogoutButton variant="sidebar" collapsed={collapsed} />
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-fe-on-surface-variant transition-all duration-200 hover:bg-white/5 hover:text-fe-on-surface ${
                collapsed ? "justify-center px-0" : ""
              }`}
              aria-label="Toggle sidebar collapse"
            >
              <Icon
                name={collapsed ? "keyboard_double_arrow_right" : "keyboard_double_arrow_left"}
                className="text-[20px]"
              />
              {!collapsed ? <span className="text-[14px] font-medium">Collapse</span> : null}
            </button>
          </div>

          <SidebarLink
            href="#"
            icon="contact_support"
            label="Support"
            collapsed={collapsed}
          />

          {/* Start Tour button — launches the guided walkthrough */}
          <button
            type="button"
            onClick={() => useWalkthrough.getState().start()}
            data-tour="start-tour"
            className={`flex w-full items-center gap-4 rounded-lg border border-fe-primary/20 bg-fe-primary/5 px-4 py-3 text-left text-fe-primary transition-all duration-200 hover:bg-fe-primary/10 ${
              collapsed ? "justify-center px-0" : ""
            }`}
            aria-label="Start guided tour"
          >
            <Icon name="tour" className="text-[20px]" />
            {!collapsed ? (
              <span className="text-[14px] font-medium">Take the Tour</span>
            ) : null}
          </button>
        </div>
      </aside>

      <main className="min-h-screen w-full transition-[margin-left,width] duration-300 min-[480px]:ml-[var(--sidebar-width)] min-[480px]:w-[calc(100vw-var(--sidebar-width))]">
        {children}
      </main>
    </div>
  );
}
