import { syncOutbox } from "@/db/schema";
import { AggregateType, DbTransaction } from "../types";
import { and, eq } from "drizzle-orm";

export default async function findOutboxEnrty(
  tx: DbTransaction,
  userId: string,
  aggreegateType: AggregateType,
  aggregateId: string,
) {
  return tx
    .select({
      id: syncOutbox.id,
      mutationId: syncOutbox.mutationId,
      localRevision: syncOutbox.localRevision,
      baseServerVersion: syncOutbox.baseServerVersion,
      operation: syncOutbox.operation,
    })
    .from(syncOutbox)
    .where(
      and(
        eq(syncOutbox.aggregateId, aggregateId),
        eq(syncOutbox.userId, userId),
        eq(syncOutbox.aggregateType, aggreegateType),
      ),
    )
    .limit(1)
    .then((res) => res[0]);
}
