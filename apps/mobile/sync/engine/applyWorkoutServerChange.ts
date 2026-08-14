import { workouts } from "@/db/schema";
import findOutboxEnrty from "../helpers/findOutboxEntry";
import findWorkout from "../helpers/findWorkout";
import insertServerWorkout from "../helpers/insertServerWorkout";
import replaceWithServerSnapshot from "../helpers/replaceWithServerSnapshot";
import { DbTransaction, SyncChanges } from "../types";
import { workoutSyncPayloadSchema } from "../validation/workoutPayloadSchema";
import { and, eq } from "drizzle-orm";

type ServerChangeResult = "consumed" | "conflict";

export default async function applyWorkoutServerChange(
  tx: DbTransaction,
  change: SyncChanges,
  userId: string,
): Promise<ServerChangeResult> {
  const localWorkout = await findWorkout(tx, change.aggregateId, userId);

  const pending = await findOutboxEnrty(
    tx,
    userId,
    change.aggregateType,
    change.aggregateId,
  );

  if (change.operation === "delete") {
    if (!localWorkout && !pending) {
      return "consumed";
    }

    if (pending) {
      return "conflict";
    }

    await tx
      .delete(workouts)
      .where(
        and(eq(workouts.id, change.aggregateId), eq(workouts.userId, userId)),
      );

    return "consumed";
  }

  const parsed = workoutSyncPayloadSchema.safeParse(change.data);

  if (!parsed.success) {
    throw new Error(`Invalid workout sync payload: ${parsed.error.message}`);
  }

  if (!localWorkout) {
    if (pending) {
      return "conflict";
    }

    await insertServerWorkout(tx, parsed.data, change.serverVersion, userId);

    return "consumed";
  }

  if (localWorkout.serverVersion === null && !pending) {
    throw new Error("Unsynced local workout exists without an outbox entry");
  }

  if (
    localWorkout.serverVersion !== null &&
    localWorkout.serverVersion >= change.serverVersion
  ) {
    return "consumed";
  }

  if (pending) {
    return "conflict";
  }

  await replaceWithServerSnapshot(
    tx,
    change.aggregateType,
    change.aggregateId,
    change.serverVersion,
    parsed.data,
    userId,
  );

  return "consumed";
}
