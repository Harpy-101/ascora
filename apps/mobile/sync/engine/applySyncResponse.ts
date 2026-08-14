import { db } from "@/db/client";
import { PreparedSyncBatch, SyncResponse } from "../types";
import applySuccessfulAck from "./applySuccessfulAck";
import applyWorkoutServerChange from "./applyWorkoutServerChange";
import { syncState } from "@/db/schema";

export default async function applySyncResponse(
  userId: string,
  prepared: PreparedSyncBatch,
  response: SyncResponse,
) {
  const sentByMutationId = new Map(
    prepared.sentMutations.map((mutation) => [mutation.mutationId, mutation]),
  );

  return db.transaction(async (tx) => {
    for (const ack of response.acknowledgements) {
      const sent = sentByMutationId.get(ack.mutationId);

      if (!sent) {
        throw new Error(
          `Server acknowledged unknown mutation ${ack.mutationId}`,
        );
      }
      switch (ack.status) {
        case "applied":
          await applySuccessfulAck(tx, sent, ack);
          break;

        case "conflict":
          // Later
          break;

        case "rejected":
          // Later
          break;
      }
    }

    let safeCursor = prepared.request.cursor;

    let blockedByConflict = false;

    for (const change of response.changes) {
      let result: "consumed" | "conflict";

      switch (change.aggregateType) {
        case "workout":
          result = await applyWorkoutServerChange(tx, change, userId);
          break;

        case "workout_plan":
          throw new Error("Workout plan inbound sync is not implemented");
      }

      if (result === "conflict") {
        blockedByConflict = true;
        break;
      }

      safeCursor = change.cursor;
    }

    if (!blockedByConflict) {
      safeCursor = response.nextCursor;
    }

    const nowIso = new Date().toISOString();

    await tx
      .insert(syncState)
      .values({
        userId: userId,
        serverCursor: safeCursor,
        lastAttemptAt: nowIso,
        lastSyncedAt: nowIso,
        lastError: null,
      })
      .onConflictDoUpdate({
        target: syncState.userId,
        set: {
          serverCursor: safeCursor,
          lastAttemptAt: nowIso,
          lastError: null,
          lastSyncedAt: nowIso,
        },
      });

    return { blockedByConflict };
  });
}
