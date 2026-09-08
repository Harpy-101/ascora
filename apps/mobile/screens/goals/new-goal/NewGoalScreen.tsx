import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import GoalForm from "../components/GoalForm";
import useCreateGoal from "../hooks/use-create-goal";
import { GoalSchemaValues } from "../validation/goalSchema";
import ScreenHeader from "@/components/ui/screen-header";
import useGetLastWeight from "@/screens/weight/hooks/use-get-last-weight";
import ScreenErrorState from "@/components/screen-states/ScreenErrorState";
import ScreenLoadingState from "@/components/screen-states/ScreenLoadingStates";
import { usePreferences } from "@/contexts/user-prefrences-context";

export default function NewGoalScreen() {
  const { weightToKg } = usePreferences();
  const createGoal = useCreateGoal();
  const {
    data: latestWeightEntry,
    error,
    isLoading,
    isFetchedAfterMount,
    refetch,
  } = useGetLastWeight();

  function onSubmit(values: GoalSchemaValues) {
    const startValueInKg = weightToKg(Number(values.startValue));
    const targetValueInKg = weightToKg(Number(values.targetValue));
    createGoal.mutate({
      ...values,
      startValue: startValueInKg.toString(),
      targetValue: targetValueInKg.toString(),
    });
  }

  if (error) {
    return <ScreenErrorState error={error} onRetry={refetch} />;
  }

  if (isLoading || !isFetchedAfterMount) {
    return <ScreenLoadingState />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View className="flex-1 p-4">
          <ScreenHeader title="Create goal" showBack />
          <GoalForm onSubmit={onSubmit} latestValue={latestWeightEntry} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
