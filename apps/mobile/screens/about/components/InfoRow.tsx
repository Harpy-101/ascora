import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center justify-between px-4 py-4">
      <Text>{label}</Text>

      <Text className="text-sm text-muted-foreground">{value}</Text>
    </View>
  );
}
