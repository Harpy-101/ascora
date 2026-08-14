import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";
import { localUsers } from "./localUsers";

export const syncOutbox = sqliteTable(
  "sync_outbox",
  {
    id: text("id").primaryKey().notNull(),
    userId: text("user_id").references(() => localUsers.id, {
      onDelete: "cascade",
    }),
    aggregateType: text("aggregate_type", {
      enum: ["workout", "workout_plan"],
    }).notNull(),
    aggregateId: text("aggregate_id").notNull(),
    operation: text("operation", { enum: ["upsert", "delete"] }).notNull(),
    mutationId: text("mutation_id").notNull(),
    localRevision: integer("local_revision").notNull().default(1),
    baseServerVersion: integer("base_server_version"),
    attemptCount: integer("attempt_count").default(0).notNull(),
    nextAttemptAt: text("next_attempt_at"),
    lastError: text("last_error"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [
    uniqueIndex("sync_outbox_user_aggregate_unique_idx").on(
      t.userId,
      t.aggregateType,
      t.aggregateId,
    ),
    uniqueIndex("sync_outbox_mutation_id_unique_idx").on(t.mutationId),
    index("sync_outbox_retry_idx").on(t.userId, t.nextAttemptAt),
  ],
);
