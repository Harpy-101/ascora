import { ScrollView } from "react-native-gesture-handler";
import useGetAllWorkoutPlans from "../workout-plans/hooks/use-get-all-workout-plans";
import { Alert, View } from "react-native";
import { Text } from "@/components/ui/text";
import QuickStartCard from "./components/QuickStartCard";
import useStartWorkout from "./hooks/use-start-workout";
import { useRouter } from "expo-router";
import { Dumbbell, FolderOpen } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import ThemedIcon from "@/components/ui/themed-icon";
import StartPlanCard from "./components/StartPlanCard";
import useGetCurrentActiveWorkout from "./hooks/use-get-current-active-workout";
import CurrentWorkoutCard from "./components/CurrentWorkoutCard";
import ScreenErrorState from "@/components/screen-states/ScreenErrorState";
import ScreenLoadingState from "@/components/screen-states/ScreenLoadingStates";

export default function StartWorkoutScreen() {
  const router = useRouter();

  const {
    data: activeWorkout,
    isPending: isActiveWorkoutPending,
    error: activeWorkoutError,
    refetch: refetchActiveWorkout,
  } = useGetCurrentActiveWorkout();

  const {
    data: plans = [],
    isLoading: isLoadingPlans,
    error: plansError,
    refetch: refetchPlans,
  } = useGetAllWorkoutPlans();

  const startWorkout = useStartWorkout();

  const recentPlans = plans.slice(0, 3);

  const isPending = isActiveWorkoutPending || isLoadingPlans;

  const queryError = activeWorkoutError ?? plansError;

  function openActiveWorkout(workoutId: string) {
    router.replace({
      pathname: "/workouts/active/[workoutId]",
      params: {
        workoutId,
      },
    });
  }

  function handleExistingWorkout() {
    if (!activeWorkout) {
      return false;
    }

    Alert.alert(
      "Workout already in progress",
      "Continue your current workout before starting another one.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Continue workout",
          onPress: () => {
            openActiveWorkout(activeWorkout.id);
          },
        },
      ],
    );

    return true;
  }

  function startEmptyWorkout() {
    if (handleExistingWorkout()) {
      return;
    }

    startWorkout.mutate(
      {
        templateId: null,
      },
      {
        onSuccess: ({ workoutId }) => {
          openActiveWorkout(workoutId);
        },
      },
    );
  }

  function startFromTemplate(templateId: string) {
    if (handleExistingWorkout()) {
      return;
    }

    startWorkout.mutate(
      {
        templateId,
      },
      {
        onSuccess: ({ workoutId }) => {
          openActiveWorkout(workoutId);
        },
      },
    );
  }

  function openWorkoutPlans() {
    router.push("/workouts/plans");
  }

  function retry() {
    void Promise.all([refetchActiveWorkout(), refetchPlans()]);
  }

  if (isPending) {
    return <ScreenLoadingState message="Preparing your workouts..." />;
  }

  if (queryError) {
    return (
      <ScreenErrorState
        title="Could not load workouts"
        error={queryError}
        onRetry={retry}
      />
    );
  }

  const startingTemplateId = startWorkout.isPending
    ? startWorkout.variables?.templateId
    : null;

  const isStartingEmptyWorkout =
    startWorkout.isPending && startWorkout.variables?.templateId === null;

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-7 px-4 pt-4"
      keyboardShouldPersistTaps="handled"
    >
      <View className="gap-1">
        <Text variant="h1">Start workout</Text>

        <Text className="leading-5 text-muted-foreground">
          Begin with one of your saved plans or build a workout as you go.
        </Text>
      </View>

      {activeWorkout ? (
        <CurrentWorkoutCard
          workout={activeWorkout}
          onContinue={() => openActiveWorkout(activeWorkout.id)}
        />
      ) : null}

      <View className="gap-3">
        <SectionHeader
          title="Quick start"
          description="Start with an empty workout and add exercises while training."
        />

        <QuickStartCard
          isStarting={isStartingEmptyWorkout}
          disabled={startWorkout.isPending}
          onStart={startEmptyWorkout}
        />
      </View>

      <View className="gap-3">
        <SectionHeader
          title="Recent plans"
          description="Start from a reusable workout you already prepared."
        />

        {recentPlans.length === 0 ? (
          <EmptyPlansCard onBrowse={openWorkoutPlans} />
        ) : (
          <View className="gap-3">
            {recentPlans.map((plan) => (
              <StartPlanCard
                key={plan.id}
                plan={plan}
                isStarting={
                  startWorkout.isPending && startingTemplateId === plan.id
                }
                disabled={startWorkout.isPending}
                onStart={() => startFromTemplate(plan.id)}
              />
            ))}
          </View>
        )}

        {plans.length > 0 ? (
          <Button variant="outline" onPress={openWorkoutPlans}>
            <ThemedIcon icon={FolderOpen} size={18} colorToken="foreground" />

            <Text>Browse all workout plans</Text>
          </Button>
        ) : null}
      </View>

      {startWorkout.isError ? (
        <View className="rounded-xl border border-destructive/30 bg-destructive/10 p-3">
          <Text className="text-sm text-destructive">
            {startWorkout.error instanceof Error
              ? startWorkout.error.message
              : "The workout could not be started."}
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

type SectionHeaderProps = {
  title: string;
  description?: string;
};

function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <View className="gap-1">
      <Text className="text-lg font-semibold">{title}</Text>

      {description ? (
        <Text className="text-sm leading-5 text-muted-foreground">
          {description}
        </Text>
      ) : null}
    </View>
  );
}

function EmptyPlansCard({ onBrowse }: { onBrowse: () => void }) {
  return (
    <View className="items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-8">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Dumbbell size={25} className="text-primary" />
      </View>

      <View className="items-center gap-1">
        <Text className="font-semibold">No workout plans yet</Text>

        <Text className="text-center text-sm leading-5 text-muted-foreground">
          Create a reusable plan or begin with an empty workout.
        </Text>
      </View>

      <Button variant="outline" onPress={onBrowse}>
        <Text>Manage workout plans</Text>
      </Button>
    </View>
  );
}
