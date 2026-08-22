import EditWeightEtryScreen from "@/screens/weight/edit-weight-entry/EditWeightEntryScreen";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserEditWeight() {
  const { weightEntryId } = useLocalSearchParams<{ weightEntryId: string }>();
  console.log("Weight entry id", weightEntryId);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1 }}>
      <EditWeightEtryScreen weightEntryId={weightEntryId} />
    </SafeAreaView>
  );
}
