import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Pressable, View } from "react-native";

export type PreferenceOption<T extends string> = {
  label: string;
  value: T;
};

type CompactPreferencePickerProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: PreferenceOption<T>[];
};

export default function CompactPreferencePicker<T extends string>({
  value,
  onChange,
  options,
}: CompactPreferencePickerProps<T>) {
  return (
    <View className="flex-row rounded-lg bg-muted p-1">
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={cn(
              "min-w-14 items-center rounded-md px-3 py-2",
              selected && "bg-background",
            )}
          >
            <Text
              className={cn(
                "text-sm text-muted-foreground",
                selected && "font-medium text-foreground",
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
