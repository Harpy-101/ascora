import ThemedIcon from "@/components/ui/themed-icon";
import { Dumbbell } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function AboutHero({ version }: { version: string }) {
  return (
    <View className="items-center gap-2 py-4">
      <View className="mb-2 size-20 items-center justify-center rounded-2xl bg-primary">
        <ThemedIcon icon={Dumbbell} size={38} colorToken="primaryForeground" />
      </View>

      <Text className="text-2xl font-bold">Ascora</Text>

      <Text className="text-sm text-muted-foreground">
        Train. Track. Progress.
      </Text>

      <Text className="mt-1 text-xs text-muted-foreground">
        Version {version}
      </Text>
    </View>
  );
}
