import { db } from "@/db/client";
import { weightEntries } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getWeightEntryById(
  userId: string,
  weightEntryId: string,
) {
  const [entry] = await db
    .select({
      id: weightEntries.id,
      recordedAt: weightEntries.recordedAt,
      weightInKg: weightEntries.weightKg,
    })
    .from(weightEntries)
    .where(
      and(
        eq(weightEntries.userId, userId),
        eq(weightEntries.id, weightEntryId),
      ),
    )
    .limit(1);

  return entry ?? null;
}
