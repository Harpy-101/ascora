import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import {
  HISTORY_RANGE_OPTIONS,
  HistoryRange,
} from "@/screens/exercise-details/types";

type HistoryRangeSelectorProps = {
  value: HistoryRange;
  onChange: (value: HistoryRange) => void;
};

export default function HistoryRangeSelector({
  value,
  onChange,
}: HistoryRangeSelectorProps) {
  return (
    <View className="flex-row rounded-full bg-muted p-1">
      {HISTORY_RANGE_OPTIONS.map((option) => {
        const isActive = value === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={
              isActive
                ? "flex-1 rounded-full bg-background px-3 py-1.5"
                : "flex-1 rounded-full px-3 py-1.5"
            }
          >
            <Text
              className={
                isActive
                  ? "text-center text-xs font-semibold text-foreground"
                  : "text-center text-xs font-medium text-muted-foreground"
              }
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
