"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Icon } from "@/components/app-shell";

/**
 * ThemeToggleButton
 *
 * Renders a button that toggles between light and dark themes.
 *
 * HYDRATION SAFETY: next-themes reads the theme from localStorage / the DOM
 * class on the client, which the server can't see. This means `useTheme()`
 * returns `undefined` during SSR but may return a different value on the
 * client's first render — causing a hydration mismatch.
 *
 * Fix: we gate theme-dependent rendering behind a `mounted` flag. Before
 * mount (SSR + first client render), we always render the dark-mode button
 * (matching the server's default). After mount, we switch to the real theme.
 * This guarantees server and client produce identical HTML for the first
 * render, and React only diverges after a user-visible state update.
 */
export function ThemeToggleButton({
  className = "",
  variant = "nav",
}: {
  className?: string;
  variant?: "nav" | "pill";
}) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Before mounted, always assume dark (the SSR default) so server and
  // client first-render produce the same HTML.
  const currentTheme = mounted
    ? resolvedTheme || theme || "dark"
    : "dark";
  const isDark = currentTheme === "dark";

  const baseClasses =
    variant === "pill"
      ? "inline-flex items-center gap-2 rounded-full border border-fe-border-white-faint bg-fe-input-hollow-bg px-4 py-2 text-[12px] font-semibold text-fe-on-surface-variant transition-all hover:bg-fe-surface-container-highest hover:text-fe-on-surface"
      : "inline-flex items-center gap-2 rounded-full border border-fe-border-white-faint bg-fe-input-hollow-bg px-4 py-2 text-[12px] font-semibold text-fe-on-surface-variant transition-all hover:bg-fe-surface-container-highest hover:text-fe-on-surface";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`${baseClasses} ${className}`.trim()}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      suppressHydrationWarning
    >
      <Icon name={isDark ? "light_mode" : "dark_mode"} className="text-[18px]" />
      <span className="hidden sm:inline" suppressHydrationWarning>
        {isDark ? "Light Mode" : "Dark Mode"}
      </span>
    </button>
  );
}
