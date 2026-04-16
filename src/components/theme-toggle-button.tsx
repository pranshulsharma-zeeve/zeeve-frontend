"use client";

import { useCallback, useEffect, useState } from "react";
import { IconButton, tx } from "@zeeve-platform/ui";
import { IconCloud, IconMoon, IconSun1, IconSunFog } from "@zeeve-platform/icons/weather/outline";

type ThemeMode = "light" | "dark-blue" | "black" | "gray";

const THEME_STORAGE_KEY = "theme";
const THEME_ORDER: ThemeMode[] = ["light", "dark-blue", "black", "gray"];
const THEME_LABELS: Record<ThemeMode, string> = {
  light: "light",
  "dark-blue": "dark blue",
  black: "black",
  gray: "gray",
};
const getNextTheme = (current: ThemeMode) => {
  const index = THEME_ORDER.indexOf(current);
  const safeIndex = index === -1 ? 0 : index;
  return THEME_ORDER[(safeIndex + 1) % THEME_ORDER.length];
};

const getStoredTheme = (): ThemeMode | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark") {
    return "dark-blue";
  }
  if (stored === "light" || stored === "dark-blue" || stored === "black" || stored === "gray") {
    return stored;
  }
  return null;
};

const getSystemTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }
  // return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark-blue" : "light";
  return "light"; // Always default to light theme
};

const applyTheme = (theme: ThemeMode) => {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  const isDark = theme === "dark-blue" || theme === "black";
  const isBlack = theme === "black";
  const isGray = theme === "gray";
  root.classList.toggle("dark", isDark);
  root.classList.toggle("theme-black", isBlack);
  root.classList.toggle("theme-gray", isGray);
  root.style.colorScheme = isDark ? "dark" : "light";
};

interface ThemeToggleButtonProps {
  className?: string;
}

const ThemeToggleButton = ({ className }: ThemeToggleButtonProps) => {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const initialTheme = getStoredTheme() ?? getSystemTheme();
    applyTheme(initialTheme);
    setTheme(initialTheme);
  }, []);

  const handleToggle = useCallback(() => {
    const nextTheme = getNextTheme(theme);
    setTheme(nextTheme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    }
    applyTheme(nextTheme);
  }, [theme]);

  const nextTheme = getNextTheme(theme);
  const label = `Switch to ${THEME_LABELS[nextTheme]} mode`;
  const nextThemeIcon =
    nextTheme === "dark-blue" ? (
      <IconMoon className="text-lg" />
    ) : nextTheme === "black" ? (
      <IconCloud className="text-lg" />
    ) : nextTheme === "gray" ? (
      <IconSunFog className="text-lg" />
    ) : (
      <IconSun1 className="text-lg" />
    );

  return (
    <IconButton
      aria-label={label}
      title={label}
      onClick={handleToggle}
      variant="text"
      colorScheme="gray"
      size="small"
      className={tx(
        "h-9 w-9 rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-[#0B112B]/70 dark:text-slate-200 dark:hover:bg-[#0B112B]",
        className,
      )}
    >
      {nextThemeIcon}
    </IconButton>
  );
};

export default ThemeToggleButton;
