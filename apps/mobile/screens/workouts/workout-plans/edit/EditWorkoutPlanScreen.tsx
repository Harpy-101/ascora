import useGetWorkoutPlanById from "./hooks/use-get-workout-plan-by-id";
import WorkoutPlanViewer from "../components/WorkoutPlanViewer";
import { WorkoutPlanFormProvider } from "@/contexts/workout-plan-form-context";

type EditWorkoutPlanProps = {
  templateId: string;
};

export default function EditWorkoutPlanScreen({
  templateId,
}: EditWorkoutPlanProps) {
  console.log("the templateId:", templateId);
  const { data, isPending, error } = useGetWorkoutPlanById(templateId);

  if (error || isPending || !data) return null;

  const formData = {
    name: data.name,
    description: data.description,
    exercises: data.exercises.map((exer, idx) => {
      const firstSet = exer.sets[0];
      return {
        id: exer.id,
        exerciseId: exer.exerciseId,
        name: exer.name,

        setNumber: idx + 1,
        setCount: exer.sets.length,

        targetReps: firstSet?.targetReps ?? null,
        targetWeight: firstSet?.targetWeight ?? null,
      };
    }),
  };

  return (
    <WorkoutPlanFormProvider formValues={formData}>
      <WorkoutPlanViewer mode={"edit"} />
    </WorkoutPlanFormProvider>
  );
}
