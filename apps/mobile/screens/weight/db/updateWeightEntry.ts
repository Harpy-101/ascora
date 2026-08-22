import { db } from "@/db/client";
import { weightEntries } from "@/db/schema";
import { WeightEntryValues } from "../validation/weightEntrySchema";
import { and, eq } from "drizzle-orm";

export default async function updateWeightEntry(
  userId: string,
  weightEntryId: string,
  values: WeightEntryValues,
) {
  return db
    .update(weightEntries)
    .set({
      recordedAt: values.recordedAt,
      weightKg: values.weightInKg,
    })
    .where(
      and(
        eq(weightEntries.userId, userId),
        eq(weightEntries.id, weightEntryId),
      ),
    );
}
