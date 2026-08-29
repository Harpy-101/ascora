import { Text } from "@/components/ui/text";
import { ReactNode } from "react";
import { View } from "react-native";

type SettingsSctionProps = {
  title?: string;
  children: ReactNode;
};

export default function SettingsSection({
  title,
  children,
}: SettingsSctionProps) {
  return (
    <View className="gap-2">
      {title && (
        <Text className="px-1 text-xs font-medium uppercase text-muted-foreground">
          {title}
        </Text>
      )}

      <View className="overflow-hidden rounded-xl border border-border bg-card">
        {children}
      </View>
    </View>
  );
}
