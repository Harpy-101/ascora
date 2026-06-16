export type Exercise = {
  id: string;
  name: string;
  lastPerformance?: string;
  pr?: string;
  sets: {
    id: string;
    setNumber: number;
    weight: string;
    reps: string;
    completed: boolean;
  }[];
};
