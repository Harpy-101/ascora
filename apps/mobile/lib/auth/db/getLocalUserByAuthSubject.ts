import { db } from "@/db/client";
import { localUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

export type localUser = typeof localUsers.$inferSelect;

export default async function getLocalUserByAuthSubject(
  authSubject: string,
): Promise<localUser | null> {
  const [user] = await db
    .select()
    .from(localUsers)
    .where(eq(localUsers.authSubject, authSubject))
    .limit(1);

  return user ?? null;
}
