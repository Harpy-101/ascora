import { FlatList, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import ThemedIcon from "@/components/ui/themed-icon";

import { useRouter } from "expo-router";
import { CirclePlus, Plus, Weight } from "lucide-react-native";
import WeightChart from "./components/WeightChart";
import ScreenErrorState from "@/components/screen-states/ScreenErrorState";
import ScreenLoadingState from "@/components/screen-states/ScreenLoadingStates";
import ScreenEmptyState from "@/components/screen-states/ScreenEmptyState";
import WeightHistoryRow from "./components/WeightHistoryRow";
import useWeightHistory from "./hooks/use-weight-history";
import ScreenHeader from "@/components/ui/screen-header";

export default function UserWeightScreen() {
  const {
    data: history,
    error,
    isLoading,
    refetch,
    isError,
  } = useWeightHistory();
  const router = useRouter();

  return (
    <View className="flex-1">
      {isLoading ? (
        <ScreenLoadingState />
      ) : isError ? (
        <ScreenErrorState onRetry={refetch} error={error} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(entry) => entry.id}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 40,
            flexGrow: history?.length === 0 ? 1 : undefined,
          }}
          ItemSeparatorComponent={() => <View className="h-px bg-border" />}
          ListHeaderComponent={
            <View className="gap-4">
              <ScreenHeader
                title="Weight"
                subtitle="Track your progress over time"
                rightAction={
                  <Button
                    size="icon"
                    variant="ghost"
                    onPress={() => router.push("/weight/new")}
                    hitSlop={10}
                  >
                    <ThemedIcon
                      icon={CirclePlus}
                      size={24}
                      colorToken="primary"
                    />
                  </Button>
                }
              />
              <View className="mb-2">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text variant="h3">Proggression</Text>
                </View>

                <View className="rounded-2xl border border-border bg-card p-4">
                  <WeightChart weightHistory={history ?? []} />
                </View>
              </View>

              <View>
                <Text variant="h3">History</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <ScreenEmptyState
              mainText="Start tracking your weight"
              mainIcon={Weight}
              description="Track your weight on a daily baisis in orxder to keep track of your proggression."
              actionText="Add an entry"
              actionIcon={Plus}
              actionFunction={() => router.push("/weight/new")}
            />
          }
          renderItem={({ item, index }) => (
            <WeightHistoryRow
              entry={item}
              onPress={() =>
                router.push({
                  pathname: "/weight/edit/[weightEntryId]",
                  params: {
                    weightEntryId: item.id,
                  },
                })
              }
              previousEntry={history![index + 1]}
            />
          )}
        />
      )}
    </View>
  );
}
