import { db } from "@/db/client";

export type AggregateType = "workout" | "workout_plan" | "insight";

export type SyncOperation = "upsert" | "delete";

export type MutationStatus = "applied" | "conflict" | "rejected";

type PreparedMutation = {
  mutationId: string;
  aggregateType: AggregateType;
  aggregateId: string;

  localRevision: number;
  baseServerVersion: number | null;

  operation: SyncOperation;

  data: unknown | null;
};

export type PreparedSyncRequest = {
  deviceId: string;
  cursor: string | null;
  mutations: PreparedMutation[];
};

type MutationProblem = {
  code: string;
  message: string;
  currentServerVersion: number | null;
};

export type MutationAcknowledgement = {
  mutationId: string;
  aggregateType: AggregateType;
  aggregateId: string;
  localRevision: number;
  status: MutationStatus;
  serverVersion: number | null;
  problem: MutationProblem | null;
};

export type SyncChanges = {
  cursor: string;
  aggregateType: AggregateType;
  aggregateId: string;
  operation: SyncOperation;
  serverVersion: number;
  data: unknown | null;
};

export type SyncResponse = {
  acknowledgements: MutationAcknowledgement[];
  changes: SyncChanges[];
  nextCursor: string;
  hasMore: boolean;
};

export type SentMutation = {
  outboxId: string;

  mutationId: string;

  aggregateType: AggregateType;
  aggregateId: string;

  localRevision: number;

  operation: SyncOperation;
};

export type SyncMutationRequest = {
  mutationId: string;

  aggregateType: AggregateType;
  aggregateId: string;

  localRevision: number;
  baseServerVersion: number | null;

  operation: SyncOperation;

  data: unknown | null;
};

export type SyncRequest = {
  deviceId: string;
  cursor: string | null;

  mutations: SyncMutationRequest[];
};

export type PreparedSyncBatch = {
  request: SyncRequest;

  sentMutations: SentMutation[];
};

type WorkoutSetSyncPayload = {
  id: string;
  setNumber: number | null;
  weightInKg: number | null;
  reps: number | null;
  completed: boolean;
};

type WorkoutExercisesSyncPayload = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  position: number;
  sets: WorkoutSetSyncPayload[];
};

export type WorkoutSyncPayload = {
  id: string;
  name: string;
  status: "draft" | "active" | "completed" | "abandoned";
  startedAt: string;
  completedAt: string | null;
  exercises: WorkoutExercisesSyncPayload[];
};

export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
