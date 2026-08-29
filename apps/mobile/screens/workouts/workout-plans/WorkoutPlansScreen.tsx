import { useRouter } from "expo-router";
import useGetAllWorkoutPlans from "./hooks/use-get-all-workout-plans";
import { FlatList, View } from "react-native";
import { Text } from "@/components/ui/text";
import WorkoutPlansLoadingState from "./components/states/WorkoutPlansLoadingState";
import WorkoutPlansErrorState from "./components/states/WorkoutPlansErrorState";
import WorkoutPlansEmptyState from "./components/states/WorkoutPlansEmptyState";
import WorkoutPlanCard from "./components/WorkoutPlanCard";
import ScreenHeader from "@/components/ui/screen-header";
import ThemedIcon from "@/components/ui/themed-icon";
import { CirclePlus } from "lucide-react-native";
import { Button } from "@/components/ui/button";

export default function WorkoutPlansScreen() {
  const router = useRouter();

  const {
    data: plans = [],
    isPending,
    isError,
    refetch,
  } = useGetAllWorkoutPlans();

  function openNewPlan() {
    router.push("/workouts/plans/new");
  }

  function openPlan(templateId: string) {
    router.push({
      pathname: "/workouts/plans/[templateId]/edit",
      params: { templateId },
    });
  }

  function editPlan(templateId: string) {
    router.push({
      pathname: "/workouts/plans/[templateId]/edit",
      params: { templateId },
    });
  }

  function startPlan(templateId: string) {
    // startWorkoutFromTemplate.mutate(templateId);

    console.log("Start workout from plan:", templateId);
  }

  return (
    <View className="flex-1">
      {isPending ? (
        <WorkoutPlansLoadingState />
      ) : isError ? (
        <WorkoutPlansErrorState onRetry={refetch} />
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(plan) => plan.id}
          contentContainerStyle={{
            padding: 16,
            // paddingBottom: 10,
            flexGrow: plans.length === 0 ? 1 : undefined,
          }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          ListHeaderComponent={
            <>
              <ScreenHeader
                title="Workout Plans"
                showBack
                rightAction={
                  <Button
                    size="icon"
                    variant="ghost"
                    onPress={() => router.push("/workouts/plans/new")}
                    hitSlop={10}
                  >
                    <ThemedIcon
                      icon={CirclePlus}
                      colorToken="primary"
                      size={24}
                    />
                  </Button>
                }
              />
              <View className="flex-row items-start pb-4">
                <Text className="text-sm text-muted-foreground">
                  Save reusable workouts and start training without adding every
                  exercise again.
                </Text>
              </View>

              {plans.length > 0 ? (
                <View className="flex-row items-center justify-between px-4 pb-4 pt-5">
                  <Text className="font-semibold">
                    {plans.length} {plans.length === 1 ? "plan" : "plans"}
                  </Text>

                  <Text className="text-sm text-muted-foreground">
                    Recently updated
                  </Text>
                </View>
              ) : null}
            </>
          }
          ListEmptyComponent={
            <WorkoutPlansEmptyState onCreatePlan={openNewPlan} />
          }
          renderItem={({ item }) => (
            <WorkoutPlanCard
              plan={item}
              onEdit={() => editPlan(item.id)}
              onOpen={() => openPlan(item.id)}
              onStart={() => startPlan(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}
