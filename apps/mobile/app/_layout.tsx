import "../global.css";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeProvider } from "@react-navigation/native";
import { NAV_THEME } from "@/lib/theme";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  console.log("color schema", colorScheme);
  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack />
      <PortalHost />
    </ThemeProvider>
  );
}
