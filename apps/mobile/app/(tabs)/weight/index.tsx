import UserWeightScreen from "@/screens/weight/UserWeightScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserWeight() {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1 }}>
      <UserWeightScreen />
    </SafeAreaView>
  );
}
