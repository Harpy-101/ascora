import { authClient } from "@/lib/auth/auth-client";
import { SignupFormValues } from "../validation/singupSchema";

export default async function createUser(values: SignupFormValues) {
  const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`;

  const { data, error } = await authClient.signUp.email({
    name: fullName,
    email: values.email,
    password: values.password,
  });

  if (error) {
    throw new Error(
      `Error while trying to create an account; ${error.message}`,
    );
  }

  if (!data.user) {
    throw new Error("The auth server didn't return a user");
  }

  return data;
}
