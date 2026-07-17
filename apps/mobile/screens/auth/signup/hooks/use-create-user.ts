import { useMutation } from "@tanstack/react-query";
import { SignupFormValues } from "../validation/singupSchema";
import createUser from "../api/createUser";

export default function useCreateUser() {
  return useMutation({
    mutationFn: async (values: SignupFormValues) => createUser(values),
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      console.log(`Created a user successfully: ${data.user}`);
    },
  });
}
