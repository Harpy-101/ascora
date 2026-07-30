export type WorkoutPlanListItem = {
  id: string;
  name: string;
  description: string;
  exerciseCount: number;
  totalSets: number;
  exerciseNames: string[];
  updatedAt: string;
  // lastUsedAt: string | null;
};
