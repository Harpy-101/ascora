import ScreenEmptyState from "@/components/screen-states/ScreenEmptyState";
import ScreenErrorState from "@/components/screen-states/ScreenErrorState";
import ScreenLoadingState from "@/components/screen-states/ScreenLoadingStates";
import ScreenHeader from "@/components/ui/screen-header";
import { Sparkles } from "lucide-react-native";
import { FlatList, View } from "react-native";
import InsightCard from "./components/InsightCard";
import useInsights from "./hooks/use-insights";
import { Text } from "@/components/ui/text";

export default function InsightsScreen() {
  const { data: insights = [], isLoading, error, refetch } = useInsights();

  if (isLoading) {
    return <ScreenLoadingState />;
  }

  if (error) {
    return <ScreenErrorState error={error} onRetry={refetch} />;
  }

  return (
    <FlatList
      data={insights}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 40,
        flexGrow: insights.length === 0 ? 1 : undefined,
      }}
      ItemSeparatorComponent={() => <View className="h-3" />}
      ListHeaderComponent={
        <View className="gap-2 pb-5">
          <ScreenHeader title="Insights" showBack />

          <Text className="text-sm text-muted-foreground">
            Training summaries and progress updates based on your workouts.
          </Text>
        </View>
      }
      ListEmptyComponent={
        <ScreenEmptyState
          mainText="No insights yet"
          mainIcon={Sparkles}
          description="Complete workouts and your training insights will appear here."
        />
      }
      renderItem={({ item }) => <InsightCard insight={item} />}
    />
  );
}
