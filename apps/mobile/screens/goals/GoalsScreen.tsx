import { FlatList, Pressable, View } from "react-native";

import useGoals from "./hooks/use-goals";
import ScreenLoadingState from "@/components/screen-states/ScreenLoadingStates";
import ScreenErrorState from "@/components/screen-states/ScreenErrorState";
import ScreenHeader from "@/components/ui/screen-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import ThemedIcon from "@/components/ui/themed-icon";
import { Goal, Plus } from "lucide-react-native";
import ScreenEmptyState from "@/components/screen-states/ScreenEmptyState";
import { GoalProgressCard } from "./components/GoalProgressCard";
import convertToDate from "./validation/helpers/convertToDate";
import calculateExpectedProgres from "./functions/calculateExpectedProgress";
import calculateGoalProgress from "./functions/calculateGoalProgress";

export default function GoalsScreen() {
  const { data, error, isLoading, refetch } = useGoals();
  const router = useRouter();

  if (isLoading) {
    return <ScreenLoadingState />;
  }

  if (error) {
    return <ScreenErrorState error={error} onRetry={refetch} />;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(entry) => entry.id}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 40,
        flexGrow: data?.length === 0 ? 1 : undefined,
      }}
      ItemSeparatorComponent={() => <View className="my-4" />}
      ListHeaderComponent={
        <ScreenHeader
          title="Goals"
          rightAction={
            <Button size="icon" onPress={() => router.push("/goals/new")}>
              <ThemedIcon
                icon={Plus}
                colorToken="primaryForeground"
                size={18}
              />
            </Button>
          }
        />
      }
      ListEmptyComponent={
        <ScreenEmptyState
          mainText="Set your first goal"
          mainIcon={Goal}
          description="A goal can only be achieved if it's set and tracked"
          actionText="Create Goal"
          actionIcon={Plus}
          actionFunction={() => router.push("/goals/new")}
        />
      }
      renderItem={({ item, index }) => {
        const startDate = convertToDate(item.startDate);
        const dueDate = convertToDate(item.dueDate);

        if (!startDate || !dueDate) {
          throw new Error("Start date or due date are undefined");
        }

        const expectedProgress = calculateExpectedProgres(startDate, dueDate);

        let progress = 0;

        switch (item.type) {
          case "weight":
            if (item.latestValue === null) {
              progress = 0;
              break;
            }

            progress = calculateGoalProgress(
              item.startValue,
              item.targetValue,
              item.latestValue,
            );

            break;
        }
        console.log("item id", item.id);

        return (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/goals/edit/[goalId]",
                params: {
                  goalId: item.id,
                },
              })
            }
          >
            <GoalProgressCard
              expectedProgress={expectedProgress}
              progress={progress}
              title={`Reach ${item.targetValue} kg`}
            />
          </Pressable>
        );
      }}
    />
  );
}
