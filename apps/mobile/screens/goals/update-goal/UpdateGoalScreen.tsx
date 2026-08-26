import ScreenLoadingState from "@/components/screen-states/ScreenLoadingStates";
import useGetGoalById from "../hooks/use-get-goal-by-id";
import ScreenErrorState from "@/components/screen-states/ScreenErrorState";
import GoalForm from "../components/GoalForm";
import { GoalSchemaValues } from "../validation/goalSchema";
import useUpdateGoal from "../hooks/use-update-goal";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import ScreenHeader from "@/components/ui/screen-header";
import useDeleteGoal from "../hooks/use-delete-goal";
import { Trash2 } from "lucide-react-native";
import DeletionWarningPopOver from "@/components/ui/deletetion-warning-pop-over";

export default function UpdateGoalScreen({ goalId }: { goalId: string }) {
  console.log("goalId", goalId);
  const { data, isLoading, error, isFetchedAfterMount, refetch } =
    useGetGoalById(goalId);

  const updateGoal = useUpdateGoal({ goalId });
  const deleteGoal = useDeleteGoal(goalId);

  if (isLoading || !isFetchedAfterMount) {
    return <ScreenLoadingState />;
  }

  if (error || !data) {
    return <ScreenErrorState error={error} onRetry={refetch} />;
  }

  function onSubmit(values: GoalSchemaValues) {
    updateGoal.mutate(values);
  }

  console.log("goal data", data);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View className="flex-1 p-4">
          <ScreenHeader
            title="Edit Goal"
            showBack
            rightAction={
              <DeletionWarningPopOver
                targetName="this goal"
                description="This action cannot be undone. Deleting this goal will remove it forever, along with all of its tracked progress and history."
                onRemove={() => deleteGoal.mutate()}
                triggerIcon={Trash2}
                triggerIconSize={20}
              />
            }
          />
          <GoalForm entry={data} onSubmit={onSubmit} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
