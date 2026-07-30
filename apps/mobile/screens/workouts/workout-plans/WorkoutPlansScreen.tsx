import { useRouter } from "expo-router";
import useGetAllWorkoutPlans from "./hooks/use-get-all-workout-plans";
import { FlatList, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import ThemedIcon from "@/components/ui/themed-icon";
import { Plus } from "lucide-react-native";
import WorkoutPlansLoadingState from "./components/states/WorkoutPlansLoadingState";
import WorkoutPlansErrorState from "./components/states/WorkoutPlansErrorState";
import WorkoutPlansEmptyState from "./components/states/WorkoutPlansEmptyState";
import WorkoutPlanCard from "./components/WorkoutPlanCard";

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
    // Eventually:
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
            paddingBottom: 40,
            flexGrow: plans.length === 0 ? 1 : undefined,
          }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          ListHeaderComponent={
            <>
              <View className="flex-row items-start gap-4 border-b border-border  pb-4 pt-3">
                <View className="flex-1 gap-1">
                  <Text variant="h1" className="text-start">
                    Workout plans
                  </Text>

                  <Text>
                    Save reusable workouts and start training without adding
                    every exercise again.
                  </Text>
                </View>

                <Button size="sm" onPress={openNewPlan}>
                  <ThemedIcon
                    icon={Plus}
                    size={17}
                    colorToken="primaryForeground"
                  />
                  <Text>New</Text>
                </Button>
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
