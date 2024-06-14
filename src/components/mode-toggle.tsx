"use client";

import { useTheme } from "next-themes";

export const ModeToggle = () => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="theme-switch">
      <input
        type="checkbox"
        id="theme-toggle"
        checked={theme === 'light'}
        onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <label
        htmlFor="theme-toggle"
        className="theme-title"
      ></label>
    </div>
  );
}