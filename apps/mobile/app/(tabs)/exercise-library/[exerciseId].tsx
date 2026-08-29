import ExerciseDetailsScreen from "@/screens/exercise-details/ExerciseDetailsScreen";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExerciseLibraryExerciseDetails() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();

  return (
    <SafeAreaView edges={["left", "right", "top"]}>
      <ScrollView>
        <View className="p-2">
          <ExerciseDetailsScreen
            exerciseId={exerciseId}
            isAppendable={false}
            appendExercise={() => null}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
