import { authClient } from "@/lib/auth/auth-client";
import { LoginFormValues } from "../validation/loginSchema";

export default async function userLogin(values: LoginFormValues) {
  const { data, error } = await authClient.signIn.email({
    email: values.email,
    password: values.password,
  });

  if (error) {
    throw new Error(`Error while trying to login: ${error.message}`);
  }

  return data;
}
