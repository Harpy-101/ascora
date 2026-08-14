import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { localUsers } from "./localUsers";

export const workouts = sqliteTable(
  "workouts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => localUsers.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    startedAt: text("started_at").notNull(),
    endedAt: text("ended_at"),
    localDate: text("local_date").notNull(),
    status: text("status", {
      enum: ["draft", "active", "completed", "abandoned"],
    })
      .notNull()
      .default("active"),
    syncStatus: text("sync_status").notNull().default("pending"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    deletedAt: text("deleted_at"),
    serverVersion: integer("server_version"),
  },
  (table) => [
    index("workouts_user_id_idx").on(table.userId),
    index("workouts_user_started_at_idx").on(table.userId, table.startedAt),
    index("workouts_user_local_date_idx").on(table.userId, table.localDate),
  ],
);
