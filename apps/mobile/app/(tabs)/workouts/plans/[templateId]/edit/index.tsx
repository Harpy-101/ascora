import WorkoutPlanViewer from "@/screens/workouts/workout-plans/components/WorkoutPlanViewer";
import { useLocalSearchParams } from "expo-router";

export default function EditWorkoutPlan() {
  const params = useLocalSearchParams<{ templateId: string }>();

  // return <EditWorkoutPlanScreen templateId={params.templateId} />;

  // const templateId = Array.isArray(params.templateId)
  //   ? params.templateId[0]
  //   : params.templateId;

  return <WorkoutPlanViewer mode="edit" templateId={params.templateId} />;
}
