import { Button } from "@/components/ui/button";
import ScreenHeader from "@/components/ui/screen-header";
import ThemedIcon from "@/components/ui/themed-icon";
import { Bell } from "lucide-react-native";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import useGetCurrentActiveWorkout from "../workouts/start-workout/hooks/use-get-current-active-workout";
import useGoals from "../goals/hooks/use-goals";
import DashboardSection from "./components/DashboardSection";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import ActiveGoalsSummary from "./components/ActiveGoalsSummary";
import CurrentWorkoutCard from "../workouts/start-workout/components/CurrentWorkoutCard";
import DashboardWeightCard from "./components/DashboardWeightCard";
import useWeightHistory from "../weight/hooks/use-weight-history";
import QuickActionsDropDownMenu from "./components/QuickActionsDropDownMenu";
import ScreenErrorState from "@/components/screen-states/ScreenErrorState";
import ScreenLoadingState from "@/components/screen-states/ScreenLoadingStates";

export default function DashboardScreen() {
  const router = useRouter();
  const {
    data: activeWorkout,
    isLoading: isActiveWorkoutLoading,
    error: activeWorkoutError,
    refetch: refetchActiveWorkout,
  } = useGetCurrentActiveWorkout();

  const {
    data: goals,
    isLoading: isGoalsLoading,
    error: goalsError,
    refetch: refetchGoals,
  } = useGoals();

  const {
    data: weight,
    error: weightError,
    isLoading: isLoadingWeight,
    refetch: refetchWeight,
  } = useWeightHistory();

  function openActiveWorkout(workoutId: string) {
    router.push(
      {
        pathname: "/workouts/active/[workoutId]",
        params: {
          workoutId,
        },
      },
      {
        withAnchor: true,
      },
    );
  }

  if (activeWorkoutError || goalsError || weightError) {
    if (activeWorkoutError) {
      return (
        <ScreenErrorState
          error={activeWorkoutError}
          onRetry={refetchActiveWorkout}
        />
      );
    }

    if (goalsError) {
      return <ScreenErrorState error={goalsError} onRetry={refetchGoals} />;
    }

    if (weightError) {
      return <ScreenErrorState error={weightError} onRetry={refetchWeight} />;
    }
  }

  if (isActiveWorkoutLoading || isGoalsLoading || isLoadingWeight) {
    return <ScreenLoadingState />;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 w-full"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View className="p-4">
          <ScreenHeader
            title="Dashboard"
            rightAction={
              <View className="flex-row gap-4">
                <QuickActionsDropDownMenu />
                <Button
                  size="icon"
                  variant="ghost"
                  hitSlop={10}
                  onPress={() => router.push("/insights")}
                >
                  <ThemedIcon icon={Bell} colorToken="primary" size={24} />
                </Button>
              </View>
            }
          />
          <View className="gap-4">
            {activeWorkout ? (
              <DashboardSection title="Active Workout">
                <CurrentWorkoutCard
                  workout={activeWorkout}
                  onContinue={() => openActiveWorkout(activeWorkout.id)}
                />
              </DashboardSection>
            ) : null}

            {weight && weight?.length > 1 ? (
              <DashboardSection
                title="Weight"
                action={
                  <Pressable onPress={() => router.push("/weight")}>
                    <Text className="text-sm text-primary">View all</Text>
                  </Pressable>
                }
              >
                <DashboardWeightCard entries={weight} />
              </DashboardSection>
            ) : null}

            <DashboardSection
              title="Goals"
              action={
                <Pressable onPress={() => router.push("/goals")}>
                  <Text className="text-sm text-primary">View all</Text>
                </Pressable>
              }
            >
              <ActiveGoalsSummary goals={goals} />
            </DashboardSection>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
