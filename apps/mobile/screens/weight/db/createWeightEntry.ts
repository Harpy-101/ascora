import { db } from "@/db/client";
import { createId } from "@/db/create-id";
import { weightEntries } from "@/db/schema";
import { WeightEntryValues } from "../validation/weightEntrySchema";

type CreateWeightEntryValues = {
  userId: string;
  values: WeightEntryValues;
};

export default async function createWeightEntry({
  userId,
  values,
}: CreateWeightEntryValues) {
  const nowIso = new Date().toISOString();

  await db.insert(weightEntries).values({
    id: createId(),
    userId: userId,
    recordedAt: values.recordedAt ?? nowIso,
    weightKg: values.weightInKg,
    createdAt: nowIso,
  });
}
