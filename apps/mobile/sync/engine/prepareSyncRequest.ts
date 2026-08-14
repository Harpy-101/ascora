import { db } from "@/db/client";
import { syncOutbox, syncState } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import readWorkoutForSync from "../aggregates/readWorkoutForSync";
import { PreparedSyncBatch, SentMutation, SyncMutationRequest } from "../types";

export default async function prepareSyncRequest(
  userId: string,
): Promise<PreparedSyncBatch> {
  return db.transaction(async (tx) => {
    const pending = await tx
      .select({
        id: syncOutbox.id,
        mutationId: syncOutbox.mutationId,
        aggregateType: syncOutbox.aggregateType,
        aggregateId: syncOutbox.aggregateId,
        localRevision: syncOutbox.localRevision,
        baseServerVersion: syncOutbox.baseServerVersion,
        operation: syncOutbox.operation,
      })
      .from(syncOutbox)
      .where(eq(syncOutbox.userId, userId))
      .orderBy(asc(syncOutbox.updatedAt))
      .limit(50);

    const [state] = await tx
      .select({
        cursor: syncState.serverCursor,
      })
      .from(syncState)
      .where(eq(syncState.userId, userId))
      .limit(1);

    const mutations: SyncMutationRequest[] = [];

    const sentMutations: SentMutation[] = [];

    for (const row of pending) {
      let data: unknown | null = null;

      if (row.operation === "upsert") {
        switch (row.aggregateType) {
          case "workout":
            data = await readWorkoutForSync(tx, row.aggregateId);
            break;

          case "workout_plan":
            data = await readWorkoutForSync(tx, row.aggregateId);
            break;
        }
      }

      mutations.push({
        mutationId: row.mutationId,
        aggregateType: row.aggregateType,
        aggregateId: row.aggregateId,
        localRevision: row.localRevision,
        baseServerVersion: row.baseServerVersion,
        operation: row.operation,
        data,
      });

      sentMutations.push({
        outboxId: row.id,
        mutationId: row.mutationId,
        aggregateType: row.aggregateType,
        aggregateId: row.aggregateId,
        localRevision: row.localRevision,
        operation: row.operation,
      });
    }

    return {
      request: {
        deviceId: "test-device-id",
        cursor: state?.cursor ?? null,
        mutations,
      },

      sentMutations,
    };
  });
}
