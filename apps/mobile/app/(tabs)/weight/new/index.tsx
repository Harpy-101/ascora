import UserWeightEntryScreen from "@/screens/weight/new-weight-enrty/UserWeightEntryScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserWeightEntry() {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1 }}>
      <UserWeightEntryScreen />
    </SafeAreaView>
  );
}
