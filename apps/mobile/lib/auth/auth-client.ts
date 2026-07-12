import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import { jwtClient } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_AUTH_URL,
  plugins: [
    expoClient({
      scheme: "ascora",
      storagePrefix: "ascora",
      storage: SecureStore,
    }),
    jwtClient(),
  ],
});
