import { db } from "@/db/client";
import { weightEntries } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function getLatestWeightEntry({
  userId,
}: {
  userId: string;
}) {
  const [entry] = await db
    .select({
      id: weightEntries.id,
      weightInKg: weightEntries.weightKg,
      recordedAt: weightEntries.recordedAt,
    })
    .from(weightEntries)
    .where(eq(weightEntries.userId, userId))
    .orderBy(desc(weightEntries.createdAt))
    .limit(1);

  return entry ?? null;
}
