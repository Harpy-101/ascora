import { authClient } from "@/lib/auth/auth-client";

export type ResetPasswordValues = {
  newPassword: string;
  token: string;
};

export default async function resetPassword({
  newPassword,
  token,
}: ResetPasswordValues) {
  const { data, error } = await authClient.resetPassword({
    newPassword: newPassword,
    token: token,
  });

  if (error) {
    throw new Error(
      error.message ??
        "Unable to reset your password. The link may have expired.",
    );
  }

  return data;
}
