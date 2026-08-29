import Constants from "expo-constants";
import { Dumbbell, Sparkles, TrendingUp } from "lucide-react-native";
import { ScrollView, View } from "react-native";

import { Text } from "@/components/ui/text";
import ScreenHeader from "@/components/ui/screen-header";
import AboutHero from "./components/AboutHero";
import AboutFeature from "./components/AboutFeature";
import InfoRow from "./components/InfoRow";

export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 40,
      }}
    >
      <ScreenHeader title="About Ascora" showBack />

      <View className="gap-8">
        <AboutHero version={version} />

        <View className="gap-3">
          <Text className="text-xs font-medium uppercase text-muted-foreground">
            About
          </Text>

          <View className="gap-3">
            <Text className="leading-6 text-muted-foreground">
              Ascora is a workout tracking and training companion designed to
              make planning, recording, and understanding your training simple.
            </Text>

            <Text className="leading-6 text-muted-foreground">
              Track workouts, follow your progress, set goals, and turn your
              training history into useful insights.
            </Text>
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-xs font-medium uppercase text-muted-foreground">
            What Ascora helps with
          </Text>

          <View className="overflow-hidden rounded-xl border border-border bg-card">
            <AboutFeature
              icon={Dumbbell}
              title="Workout tracking"
              description="Plan and record your training sessions."
            />

            <Separator />

            <AboutFeature
              icon={TrendingUp}
              title="Progress"
              description="Follow your training, body weight, and goals."
            />

            <Separator />

            <AboutFeature
              icon={Sparkles}
              title="Insights"
              description="Turn your workout history into useful training feedback."
            />
          </View>
        </View>

        <View className="gap-3">
          <Text className="text-xs font-medium uppercase text-muted-foreground">
            App
          </Text>

          <View className="overflow-hidden rounded-xl border border-border bg-card">
            <InfoRow label="Version" value={version} />

            <Separator />

            <InfoRow
              label="Build"
              value={
                Constants.expoConfig?.ios?.buildNumber ??
                Constants.expoConfig?.android?.versionCode?.toString() ??
                "Development"
              }
            />
          </View>
        </View>

        <Text className="text-center text-xs text-muted-foreground">
          Made for better training.
        </Text>
      </View>
    </ScrollView>
  );
}

function Separator() {
  return <View className="ml-16 h-px bg-border" />;
}
