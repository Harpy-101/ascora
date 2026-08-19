import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { localUsers } from "./localUsers";

export const insights = sqliteTable("insights", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => localUsers.id, {
      onDelete: "cascade",
    }),
  sourceAggregateId: text("source_aggregate_id"),
  sourceAggregateType: text("source_aggregate_type"),
  insightType: text("insight_type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: text("data", { mode: "json" }),
  serverVersion: integer("server_version").notNull(),
  createdAt: text("created_at").notNull(),
});
