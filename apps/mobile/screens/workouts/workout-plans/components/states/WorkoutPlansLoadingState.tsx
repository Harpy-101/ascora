import { View } from "react-native";

export default function WorkoutPlansLoadingState() {
  return (
    <View className="gap-4 p-4">
      {[1, 2, 3].map((item) => (
        <View key={item} className="h-44 animate-pulse rounded-2xl bg-muted" />
      ))}
    </View>
  );
}
