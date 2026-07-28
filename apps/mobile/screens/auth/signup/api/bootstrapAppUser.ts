import authenticatedApiFetch from "@/lib/auth/functions/authenticatedApiFetch";
import { AppUserProjection } from "../types";

export default async function bootstrapAppUser(): Promise<AppUserProjection> {
  return await authenticatedApiFetch<AppUserProjection>("/api/me/bootstrap", {
    method: "POST",
  });
}
