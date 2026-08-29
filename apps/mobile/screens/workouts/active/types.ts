export type WorkoutSaveValues = {
  name: string;
  notes?: string;

  exercises: {
    id: string;
    exerciseId: string;
    name: string;

    sets: {
      id: string;
      setNumber: number;
      weightKg: number | null;
      reps: number | null;
      completed: boolean;
    }[];
  }[];
};
