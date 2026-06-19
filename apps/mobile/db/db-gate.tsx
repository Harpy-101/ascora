import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import { db } from "./client";

type DbGateProps = {
  children: React.ReactNode;
};

export function DbGate({ children }: DbGateProps) {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-destructive">
          Migration error: {error.message}
        </Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text>Preparing local database...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
