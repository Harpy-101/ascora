import { z } from "zod";

export const appUserProjectionSchema = z.object({
  id: z.string(),
  authSubject: z.string(),
  fullName: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().nullable(),
  email: z.email(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AppUserProjection = z.infer<typeof appUserProjectionSchema>;
