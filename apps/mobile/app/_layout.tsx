import "../global.css";
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

import { CurrentUserProvider } from "@/lib/auth/context/current-user-context";
import RootNavigator from "@/lib/RootNavigator";

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";

  // if (isPending) {
  //   return (
  //     <View className="flex-1 items-center justify-center bg-background">
  //       <Text>Loding ascora...</Text>
  //     </View>
  //   );
  // }

  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      {__DEV__ ? <DrizzleStudioDevtools /> : null}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <DbGate>
          <QueryClientProvider client={queryClient}>
            <CurrentUserProvider>
              <RootNavigator />
              {/* <Stack screenOptions={{ headerShown: false }}>
                <Stack.Protected guard={!isAuthenticated}>
                  <Stack.Screen name="(auth)" />
                </Stack.Protected>

                <Stack.Protected guard={isAuthenticated}>
                  <Stack.Screen name="(tabs)" />
                </Stack.Protected>
              </Stack> */}
            </CurrentUserProvider>
          </QueryClientProvider>
        </DbGate>
        <PortalHost />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
