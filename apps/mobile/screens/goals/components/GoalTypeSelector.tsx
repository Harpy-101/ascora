import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ThemedIcon from "@/components/ui/themed-icon";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";

export type GoalTypeOption<T extends string> = {
  value: T;
  label: string;
  description: string;
  icon?: LucideIcon;
  disabled?: boolean;
};

type GoalTypeSelectorProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: GoalTypeOption<T>[];
};

export default function GoalTypeSelector<T extends string>({
  value,
  onChange,
  options,
}: GoalTypeSelectorProps<T>) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(nextValue) => onChange(nextValue as T)}
      className="gap-3"
    >
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <Pressable
            key={option.value}
            disabled={option.disabled}
            onPress={() => onChange(option.value)}
            className={cn(
              "flex-row items-center gap-4 rounded-xl border p-4",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border bg-card",
              option.disabled && "opacity-50",
            )}
          >
            {option.icon && (
              <View className="size-10 items-center justify-center rounded-full bg-muted">
                <ThemedIcon
                  icon={option.icon}
                  size={20}
                  colorToken={isSelected ? "primary" : "mutedForeground"}
                />
              </View>
            )}

            <View className="flex-1 gap-1">
              <Text className="font-semibold">{option.label}</Text>

              <Text className="text-sm text-muted-foreground">
                {option.description}
              </Text>
            </View>

            <RadioGroupItem value={option.value} disabled={option.disabled} />
          </Pressable>
        );
      })}
    </RadioGroup>
  );
}
