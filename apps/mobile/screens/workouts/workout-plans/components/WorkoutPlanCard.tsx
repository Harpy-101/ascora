import { Pressable, View } from "react-native";
import { WorkoutPlanListItem } from "../types";
import ThemedIcon from "@/components/ui/themed-icon";
import { Dumbbell, Pencil, Play } from "lucide-react-native";
import { Text } from "@/components/ui/text";
// import formatRelativeDate from "../utils/formatRelativeDate";
import { Button } from "@/components/ui/button";

type WorkoutPlanCardProps = {
  plan: WorkoutPlanListItem;
  onOpen: () => void;
  onEdit: () => void;
  onStart: () => void;
};

export default function WorkoutPlanCard({
  plan,
  onOpen,
  onEdit,
  onStart,
}: WorkoutPlanCardProps) {
  const visableExercises = plan.exerciseNames.slice(0, 3);
  const remainingExercises =
    plan.exerciseNames.length - visableExercises.length;

  const exercisePreview = [
    visableExercises.join(", "),
    remainingExercises > 0 ? `+${remainingExercises} ` : null,
  ];

  console.log("Plan set count", plan);

  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-card">
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`Open ${plan.name}`}
        className="gap-3 p-4 active:bg-muted/30"
      >
        <View className="flex-row items-start gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <ThemedIcon icon={Dumbbell} size={21} colorToken="primary" />
          </View>

          <View className="flex-1 gap-1 pb-2">
            <Text numberOfLines={1} className="text-lg font-semibold">
              {plan.name}
            </Text>

            <Text className="text-sm text-muted-foreground">
              {plan.exerciseCount}{" "}
              {plan.exerciseCount === 1 ? "exercise" : "exercises"}
              {" · "}
              {plan.totalSets} {plan.totalSets === 1 ? "set" : "sets"}
            </Text>

            {/* <ThemedIcon icon={ChevronDown} size={20} colorToken="foreground" /> */}
          </View>
        </View>

        {plan.description ? (
          <Text
            numberOfLines={2}
            className="text-sm leading-5 text-muted-foreground"
          >
            {plan.description}
          </Text>
        ) : null}

        {exercisePreview ? (
          <View className="rounded-xl bg-muted/50 px-3 py-2.5">
            <Text
              numberOfLines={2}
              className="text-sm leading-5 text-muted-foreground"
            >
              {exercisePreview}
            </Text>
          </View>
        ) : null}

        {/* <Text className="text-xs text-muted-foreground">
          {plan.lastUsedAt
            ? `Last used at ${formatRelativeDate(plan.lastUsedAt)}`
            : `Updated ${formatRelativeDate(plan.updatedAt)}`}
        </Text> */}
      </Pressable>

      <View className="flex-row gap-3 border-t border-border p-3">
        <Button variant="outline" size="sm" onPress={onEdit} className="flex-1">
          <ThemedIcon icon={Pencil} size={16} colorToken="foreground" />
          <Text>Edit</Text>
        </Button>

        <Button size="sm" onPress={onStart} className="flex-[1.5]">
          <ThemedIcon icon={Play} size={16} colorToken="primaryForeground" />
          <Text>Start workout</Text>
        </Button>
      </View>
    </View>
  );
}
