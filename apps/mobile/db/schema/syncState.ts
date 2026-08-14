import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { localUsers } from "./localUsers";

export const syncState = sqliteTable("sync_state", {
  userId: text("user_id")
    .primaryKey()
    .references(() => localUsers.id, { onDelete: "cascade" }),
  serverCursor: text("server_cursor"),
  lastSyncedAt: text("last_synced_at"),
  lastAttemptAt: text("last_attempt_at"),
  lastError: text("last_error"),
});
