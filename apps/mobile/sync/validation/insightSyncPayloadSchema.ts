import { z } from "zod";

export const insightSyncPayloadSchema = z.object({
  sourceAggregateId: z.string().nullable(),
  sourceAggregateType: z.string().nullable(),

  insightType: z.string(),

  title: z.string(),
  message: z.string(),

  data: z.unknown().nullable(),

  createdAt: z.string(),
});

export type InsightSyncPayload = z.infer<typeof insightSyncPayloadSchema>;
