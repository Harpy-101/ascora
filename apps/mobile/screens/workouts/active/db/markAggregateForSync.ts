import { db } from "@/db/client";
import { createId } from "@/db/create-id";
import { syncOutbox } from "@/db/schema/syncOutbox";
import { and, eq } from "drizzle-orm";

type MarkAggregateForSyncProps = {
  userId: string;
  aggregateType: "workout" | "workout_plan";
  aggregateId: string;
  operation: "upsert" | "delete";
  baseServerVersion: number | null;
  nowIso: string;
};

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export default async function markAggregateForSync(
  tx: DbTransaction,
  {
    userId,
    aggregateType,
    aggregateId,
    operation,
    baseServerVersion,
    nowIso,
  }: MarkAggregateForSyncProps,
) {
  const [exsisting] = await tx
    .select({
      id: syncOutbox.id,
      localRevision: syncOutbox.localRevision,
    })
    .from(syncOutbox)
    .where(
      and(
        eq(syncOutbox.userId, userId),
        eq(syncOutbox.aggregateId, aggregateId),
        eq(syncOutbox.aggregateType, aggregateType),
      ),
    )
    .limit(1);

  const mutationId = createId();

  if (exsisting) {
    await tx
      .update(syncOutbox)
      .set({
        operation,
        mutationId,
        localRevision: exsisting.localRevision + 1,
        baseServerVersion,
        attemptCount: 0,
        nextAttemptAt: null,
        lastError: null,
        updatedAt: nowIso,
      })
      .where(eq(syncOutbox.id, exsisting.id));

    return;
  }

  await tx.insert(syncOutbox).values({
    id: createId(),
    userId,
    aggregateType,
    aggregateId,
    operation,
    mutationId,
    localRevision: 1,
    baseServerVersion,
    attemptCount: 0,
    nextAttemptAt: null,
    lastError: null,
    createdAt: nowIso,
    updatedAt: nowIso,
  });
}
