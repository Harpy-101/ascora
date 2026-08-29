import ScreenHeader from "@/components/ui/screen-header";
import ExerciseLibraryScreen from "@/screens/exercise-library/ExerciseLibraryScreen";
import { Href } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EcerciseLibrary() {
  function getExerciseDetailsHref(exerciseId: string): Href {
    return {
      pathname: "/exercise-library/[exerciseId]",
      params: {
        exerciseId,
      },
    };
  }

  return (
    <SafeAreaView edges={["left", "right", "top"]} style={{ flex: 1 }}>
      <ScrollView>
        <View className="p-4">
          <ScreenHeader title="Exercise Library" />
          <ExerciseLibraryScreen
            appendExercise={() => null}
            isAppendable={false}
            getExerciseDetailsHref={getExerciseDetailsHref}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
