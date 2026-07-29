import { Text } from "@/components/ui/text";
import { ReactNode } from "react";
import { View } from "react-native";

type FormFieldProps = {
  label: string;
  description?: string;
  error?: string;
  children: ReactNode;
};

export default function FormField({
  label,
  description,
  error,
  children,
}: FormFieldProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      {children}
      {error ? (
        <Text className="text-sm text-destructive">{error}</Text>
      ) : description ? (
        <Text className="text-xs text-muted-foreground">{description}</Text>
      ) : null}
    </View>
  );
}
