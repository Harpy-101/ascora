import { useMutation } from "@tanstack/react-query";
import { SignupFormValues } from "../validation/singupSchema";
import createUser from "../api/createUser";
import bootstrapAppUser from "../api/bootstrapAppUser";
import ensureLocalUser from "../db/ensureLocalUser";

export default function useCreateUser() {
  return useMutation({
    mutationFn: async (values: SignupFormValues) => {
      const authServerResult = await createUser(values);

      const appUser = await bootstrapAppUser();

      await ensureLocalUser({ user: appUser });

      return {
        authUser: authServerResult.user,
        appUser,
      };
    },
    onError: (error) => {
      console.error("Account setup failed:", error);
    },
    onSuccess: ({ appUser }) => {
      console.log("Account setup completed:", {
        userId: appUser.id,
      });
    },
  });
}
