import { useMutation } from "@tanstack/react-query";
import resetPassword, { ResetPasswordValues } from "../api/resetPassword";

export default function useResetPassword() {
  return useMutation({
    mutationFn: ({ newPassword, token }: ResetPasswordValues) =>
      resetPassword({ newPassword, token }),
  });
}
