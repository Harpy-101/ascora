import "../global.css";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeProvider } from "@react-navigation/native";
import { NAV_THEME } from "@/lib/theme";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DbGate } from "@/db/db-gate";
import { DrizzleStudioDevtools } from "@/db/drizzle-studio-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client/queryClient";

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";
  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      {__DEV__ ? <DrizzleStudioDevtools /> : null}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <DbGate>
          <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
            </Stack>
          </QueryClientProvider>
        </DbGate>
        <PortalHost />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
