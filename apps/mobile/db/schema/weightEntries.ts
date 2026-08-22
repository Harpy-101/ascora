import { index, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { localUsers } from "./localUsers";

export const weightEntries = sqliteTable(
  "weight_entries",
  {
    id: text("id").primaryKey().notNull(),

    userId: text("user_id")
      .notNull()
      .references(() => localUsers.id, {
        onDelete: "cascade",
      }),

    weightKg: real("weight_kg").notNull(),

    recordedAt: text("recorded_at").notNull(),

    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    userRecordedAtIdx: index("weight_entries_user_recorded_at_idx").on(
      table.userId,
      table.recordedAt,
    ),
  }),
);
