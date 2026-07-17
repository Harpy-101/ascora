import { useMutation } from "@tanstack/react-query";
import { LoginFormValues } from "../validation/loginSchema";
import userLogin from "../api/userLogin";

export default function useUserLogin() {
  return useMutation({
    mutationFn: async (values: LoginFormValues) => userLogin(values),
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      console.log("Logged in succesfullt", data);
    },
  });
}
