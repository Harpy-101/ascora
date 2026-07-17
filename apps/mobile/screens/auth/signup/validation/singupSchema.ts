import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(1, "Must include name"),
  lastName: z.string().min(1, "Must include last name"),
  email: z.email(),
  password: z.string().min(8, "Password must be longer than 8 chars"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
