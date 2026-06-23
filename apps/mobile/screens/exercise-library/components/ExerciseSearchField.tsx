import { Input } from "@/components/ui/input";
import { View } from "react-native";

type EexerciseSearchFieldsProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function ExerciseSearchField({
  value,
  onChangeText,
}: EexerciseSearchFieldsProps) {
  return (
    <View>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder="Search an exercise"
      />
    </View>
  );
}
