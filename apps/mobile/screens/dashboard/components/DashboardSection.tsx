import { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

type DashboardSectionProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
};

export default function DashboardSection({
  title,
  children,
  action,
}: DashboardSectionProps) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text variant="h3">{title}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}
