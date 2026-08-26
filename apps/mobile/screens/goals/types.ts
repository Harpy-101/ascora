import { GoalStatus, GoalType } from "@/db/schema";
import { GoalTypeOption } from "./components/GoalTypeSelector";

export const GoalOptions: GoalTypeOption<GoalType>[] = [
  {
    label: "Body weight",
    description: "Reach a target body weight",
    value: "weight",
  },
];

export type GoalEntry = {
  id: string;
  userId: string;
  type: GoalType;
  startValue: number;
  targetValue: number;
  startDate: string;
  dueDate: string;
  status: GoalStatus;
  completedAt: string | null;
};
