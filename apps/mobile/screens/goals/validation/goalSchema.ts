import { GOAL_TYPES } from "@/db/schema/goals";
import { z } from "zod";
import convertToDate from "./helpers/convertToDate";

export const goalSchema = z
  .object({
    type: z.enum(GOAL_TYPES),
    startValue: z.string(),
    targetValue: z.string().refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num > 1;
      },
      {
        message: "Must be a positive number",
      },
    ),
    startDate: z.string().min(1, "Must pick a start date"),
    dueDate: z.string().min(1, "Must pick a due date"),
  })
  .superRefine((val, ctx) => {
    const parsedStartDate = convertToDate(val.startDate);
    const parsedDueDate = convertToDate(val.dueDate);

    if (parsedDueDate === undefined || parsedStartDate === undefined) {
      if (parsedDueDate === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "A start date must be defined",
          path: ["parsedDueDate"],
        });
      }
      if (parsedStartDate === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Start date must be defined",
          path: ["startDate"],
        });
      }
      return;
    }

    const diff = parsedDueDate.getTime() - parsedStartDate.getTime();

    if (diff < 0) {
      ctx.addIssue({
        code: "custom",
        message: "Due date must be after the start date",
        path: ["dueDate"],
      });
    }
  });

export type GoalSchemaValues = z.infer<typeof goalSchema>;
