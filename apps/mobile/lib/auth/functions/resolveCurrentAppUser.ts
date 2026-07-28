import bootstrapAppUser from "@/screens/auth/signup/api/bootstrapAppUser";
import getLocalUserByAuthSubject from "../db/getLocalUserByAuthSubject";
import ensureLocalUser from "@/screens/auth/signup/db/ensureLocalUser";

export async function resolveCurrentAppUser(authSubject: string) {
  const localUser = await getLocalUserByAuthSubject(authSubject);

  console.log("local user", localUser);
  if (localUser) {
    console.log("found local user");
    return localUser;
  }

  const appUser = await bootstrapAppUser();

  if (appUser.authSubject !== authSubject) {
    throw new Error(
      "The application user does not match the authenticated session.",
    );
  }

  await ensureLocalUser({ user: appUser });

  const initializedUser = await getLocalUserByAuthSubject(authSubject);

  if (!initializedUser) {
    throw new Error("The current user could not be initialized locally.");
  }

  return initializedUser;
}
