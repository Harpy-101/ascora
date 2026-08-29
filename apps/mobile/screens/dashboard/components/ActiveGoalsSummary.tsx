import ScreenEmptyState from "@/components/screen-states/ScreenEmptyState";
import { usePreferences } from "@/contexts/user-prefrences-context";
import { GoalProgressCard } from "@/screens/goals/components/GoalProgressCard";
import calculateExpectedProgres from "@/screens/goals/functions/calculateExpectedProgress";
import calculateGoalProgress from "@/screens/goals/functions/calculateGoalProgress";
import { GoalData } from "@/screens/goals/hooks/use-goals";
import convertToDate from "@/screens/goals/validation/helpers/convertToDate";
import { useRouter } from "expo-router";
import { Goal, Plus } from "lucide-react-native";
import { Pressable, View } from "react-native";

type ActiveGoalsSummaryProps = {
  goals: GoalData;
};

export default function ActiveGoalsSummary({ goals }: ActiveGoalsSummaryProps) {
  const router = useRouter();
  const { formatWeight } = usePreferences();

  if (!goals) {
    return null;
  }

  if (goals.length === 0) {
    return (
      <ScreenEmptyState
        mainText="Set your first goal"
        mainIcon={Goal}
        description="A goal can only be achieved if it's set and tracked"
        actionText="Create Goal"
        actionIcon={Plus}
        actionFunction={() => router.push("/goals/new")}
      />
    );
  }

  return (
    <View className="gap-4">
      {goals.map((item) => {
        const startDate = convertToDate(item.startDate);
        const dueDate = convertToDate(item.dueDate);

        if (!startDate || !dueDate) {
          throw new Error("Start date or due date are undefined");
        }

        const expectedProgress = calculateExpectedProgres(startDate, dueDate);

        let progress = 0;

        switch (item.type) {
          case "weight":
            if (item.latestValue !== null) {
              progress = calculateGoalProgress(
                item.startValue,
                item.targetValue,
                item.latestValue,
              );
            }

            break;
        }

        return (
          <Pressable
            key={item.id}
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
              title={`Reach ${formatWeight(item.targetValue, undefined, true)} `}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
