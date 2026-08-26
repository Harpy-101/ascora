import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { localUsers } from "./localUsers";

export const GOAL_TYPES = ["weight"] as const;

export type GoalType = (typeof GOAL_TYPES)[number];

export const GOAL_STATUS = ["active", "completed", "cancelled"] as const;

export type GoalStatus = (typeof GOAL_STATUS)[number];

export const goals = sqliteTable("goals", {
  id: text("id").primaryKey().notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => localUsers.id, {
      onDelete: "cascade",
    }),

  type: text("type", { enum: GOAL_TYPES }).notNull(),

  startValue: real("start_value").notNull(),
  targetValue: real("target_value").notNull(),

  startDate: text("start_date").notNull(),
  dueDate: text("due_date").notNull(),

  status: text("status", { enum: GOAL_STATUS }).notNull().default("active"),

  completedAt: text("completed_at"),

  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
