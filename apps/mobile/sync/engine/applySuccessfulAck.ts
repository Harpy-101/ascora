import { syncOutbox, workouts } from "@/db/schema";
import { DbTransaction, MutationAcknowledgement, SentMutation } from "../types";
import { and, eq } from "drizzle-orm";

export default async function applySuccessfulAck(
  tx: DbTransaction,
  sent: SentMutation,
  ack: MutationAcknowledgement,
) {
  if (ack.serverVersion === null) {
    throw new Error("Applied mutation did not return a server version");
  }

  switch (sent.aggregateType) {
    case "workout":
      if (sent.operation === "upsert") {
        await tx
          .update(workouts)
          .set({
            serverVersion: ack.serverVersion,
          })
          .where(eq(workouts.id, sent.aggregateId));
      }
      break;

    case "workout_plan":
      //! Not implemented
      break;
  }

  const [current] = await tx
    .select({
      id: syncOutbox.id,
      mutationId: syncOutbox.mutationId,
      localRevision: syncOutbox.localRevision,
    })
    .from(syncOutbox)
    .where(eq(syncOutbox.id, sent.outboxId))
    .limit(1);

  if (!current) {
    return;
  }

  const isExactMutation =
    current.mutationId === sent.mutationId &&
    current.localRevision === sent.localRevision;

  if (isExactMutation) {
    await tx.delete(syncOutbox).where(
      and(
        eq(syncOutbox.id, sent.outboxId),

        eq(syncOutbox.mutationId, sent.mutationId),

        eq(syncOutbox.localRevision, sent.localRevision),
      ),
    );

    return;
  }

  await tx
    .update(syncOutbox)
    .set({
      baseServerVersion: ack.serverVersion,
    })
    .where(eq(syncOutbox.id, sent.outboxId));
}
