export const THEME_COLORS = {
  light: {
    foreground: "hsl(240, 10%, 3.9%)",
    mutedForeground: "hsl(240, 3.8%, 46.1%)",
    destructive: "hsl(21° 83% 46%)",
    primary: "hsl(240, 5.9%, 10%)",
    primaryForeground: "hsl(0 0% 98%)",
  },
  dark: {
    foreground: "hsl(0, 0%, 98%)",
    mutedForeground: "hsl(240, 5%, 64.9%)",
    destructive: "hsl(359, 100%, 70%)",
    primary: "hsl(0, 0%, 98%)",
    primaryForeground: "hsl(240 5.9% 10%)",
  },
} as const;

export type ThemeColorToken = keyof typeof THEME_COLORS.light;
