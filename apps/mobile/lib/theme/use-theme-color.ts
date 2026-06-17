import { useColorScheme } from "react-native";
import { THEME_COLORS, ThemeColorToken } from "./colors";

export default function useThemeColor(token: ThemeColorToken) {
  const colorScheme = useColorScheme() ?? "light";

  return THEME_COLORS[colorScheme][token];
}
