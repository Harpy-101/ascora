import { db } from "@/db/client";
import { weightEntries } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function getWeightHistory({ userId }: { userId: string }) {
  return db
    .select({
      id: weightEntries.id,
      weightInKg: weightEntries.weightKg,
      recordedAt: weightEntries.recordedAt,
    })
    .from(weightEntries)
    .where(eq(weightEntries.userId, userId))
    .orderBy(desc(weightEntries.recordedAt))
    .limit(80);
}
