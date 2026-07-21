import { authClient } from "@/lib/auth/auth-client";
import * as Linking from "expo-linking";

export default async function requestPasswordReset(email: string) {
  const redirectTo = Linking.createURL("reset-password");

  const { data, error } = await authClient.requestPasswordReset({
    email: email,
    redirectTo: redirectTo,
  });

  if (error) {
    throw new Error(
      `Error while trying to request password reset: ${error.message}`,
    );
  }

  return data;
}
