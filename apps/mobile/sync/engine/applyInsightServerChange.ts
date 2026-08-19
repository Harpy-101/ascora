import { insights } from "@/db/schema";
import { DbTransaction, SyncChanges } from "../types";
import { and, eq } from "drizzle-orm";
import { insightSyncPayloadSchema } from "../validation/insightSyncPayloadSchema";

export default async function applyInsightServerChange(
  tx: DbTransaction,
  change: SyncChanges,
  userId: string,
): Promise<"consumed"> {
  console.log("incoming insight", change);
  if (change.operation === "delete") {
    await tx
      .delete(insights)
      .where(
        and(eq(insights.id, change.aggregateId), eq(insights.userId, userId)),
      );

    return "consumed";
  }

  const parsed = insightSyncPayloadSchema.safeParse(change.data);

  if (!parsed.success) {
    throw new Error(`Invalid insight sync payload: ${parsed.error.message}`);
  }

  const payload = parsed.data;

  await tx
    .insert(insights)
    .values({
      id: change.aggregateId,
      userId,
      sourceAggregateId: payload.sourceAggregateId,
      sourceAggregateType: payload.sourceAggregateType,
      insightType: payload.insightType,
      title: payload.title,
      message: payload.message,
      data: payload.data,
      serverVersion: change.serverVersion,
      createdAt: payload.createdAt,
    })
    .onConflictDoUpdate({
      target: insights.id,
      set: {
        sourceAggregateId: payload.sourceAggregateId,
        sourceAggregateType: payload.sourceAggregateType,
        insightType: payload.insightType,
        title: payload.title,
        message: payload.message,
        data: payload.data,
        serverVersion: change.serverVersion,
        createdAt: payload.createdAt,
      },
    });

  return "consumed";
}
