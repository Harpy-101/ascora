import { queryOptions } from "@tanstack/react-query";
import { resolveCurrentAppUser } from "../functions/resolveCurrentAppUser";
import { appUserProjectionSchema } from "../validation/appUserProjectionSchema";

export const currentUserKeys = {
  byAuthSubject: (authSubject: string) =>
    ["current-app-user", authSubject] as const,
};

export function currentUserQueryOptions(authSubject: string | undefined) {
  return queryOptions({
    queryKey: currentUserKeys.byAuthSubject(authSubject ?? "anonymous"),

    queryFn: async () => {
      if (!authSubject) {
        throw new Error("No authenticated user");
      }

      const res = await resolveCurrentAppUser(authSubject);

      return appUserProjectionSchema.parse(res);
    },

    enabled: Boolean(authSubject),
    staleTime: Infinity,
    retry: 2,
  });
}
