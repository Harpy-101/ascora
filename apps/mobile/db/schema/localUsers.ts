import { sqliteTable, uniqueIndex } from "drizzle-orm/sqlite-core";

export const localUsers = sqliteTable(
  "local_users",
  (t) => ({
    id: t.text("id").primaryKey(),
    authSubject: t.text("auth_subject"),

    fullName: t.text("full_name"),
    displayName: t.text("display_name"),
    email: t.text("email"),
    avatarUrl: t.text("avatar_url"),

    createdAt: t.text("created_at"),
    updatedAt: t.text("updated_at"),
  }),
  (t) => [uniqueIndex("local_users_auth_subject_unique").on(t.authSubject)],
);
