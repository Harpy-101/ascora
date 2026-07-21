import { useMutation } from "@tanstack/react-query";
import requestPasswordReset from "../api/requestPasswordReset";

export default function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => requestPasswordReset(email),
  });
}
