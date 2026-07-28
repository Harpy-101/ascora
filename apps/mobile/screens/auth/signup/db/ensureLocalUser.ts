import { db } from "@/db/client";
import { AppUserProjection } from "../types";
import { localUsers } from "@/db/schema";

type EnsureLocalUserValues = {
  user: AppUserProjection;
};

export default async function ensureLocalUser({
  user,
}: EnsureLocalUserValues): Promise<AppUserProjection> {
  const nowIso = new Date().toTimeString();

  await db
    .insert(localUsers)
    .values({
      id: user.id,
      authSubject: user.authSubject,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      email: user.email,
      displayName: user.displayName,
      createdAt: nowIso,
      updatedAt: nowIso,
    })
    .onConflictDoUpdate({
      target: localUsers.id,
      set: {
        authSubject: user.authSubject,
        fullName: user.fullName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        updatedAt: nowIso,
      },
    });

  return user;
}
