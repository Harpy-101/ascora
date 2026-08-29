import { db } from "@/db/client";
import { insights } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function getInsights(userId: string) {
  return db
    .select({
      id: insights.id,
      insightType: insights.insightType,
      title: insights.title,
      message: insights.message,
      createdAt: insights.createdAt,
      sourceAggregateType: insights.sourceAggregateType,
      sourceAggregateId: insights.sourceAggregateId,
      data: insights.data,
    })
    .from(insights)
    .where(eq(insights.userId, userId))
    .orderBy(desc(insights.createdAt));
}
