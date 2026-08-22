import { Text } from "@/components/ui/text";
import { Pressable, View } from "react-native";

export type SelectorOption<T> = {
  label: string;
  value: T;
};

type RangeSelectorProps<T> = {
  value: T;
  onChange: (value: T) => void;
  options: SelectorOption<T>[];
};

export default function RangeSelector<T>({
  value,
  onChange,
  options,
}: RangeSelectorProps<T>) {
  return (
    <View className="flex-row rounded-full bg-muted p-1">
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <Pressable
            key={String(option.value)}
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
