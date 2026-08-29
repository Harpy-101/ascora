import ScreenHeader from "@/components/ui/screen-header";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import SettingsSection from "./components/SettingsSection";
import SettingsRow from "./components/SettingsRow";
import { Box, Info, LogOut, Moon, Scale } from "lucide-react-native";
import SettingsSeparator from "./components/SettingsSeparator";
import { authClient } from "@/lib/auth/auth-client";
import { Text } from "@/components/ui/text";
import { useUniwind } from "uniwind";
import CompactPreferencePicker from "./components/CompactPreferencePicker";
import { THEME_OPTIONS, WEIGHT_UNIT_OPTIONS } from "./types";
import { usePreferences } from "@/contexts/user-prefrences-context";
import ThemedIcon from "@/components/ui/themed-icon";

export default function SettingsScreen() {
  const router = useRouter();
  const { theme } = useUniwind();
  const { setTheme, weightUnit, setWeightUnit } = usePreferences();

  async function handleSignOut() {
    await authClient.signOut();
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 40,
        gap: 24,
      }}
    >
      <ScreenHeader title="Settings" />

      {/* <ProfileSummary user={user} /> */}

      <SettingsSection title="Preferences">
        <View className="gap-5 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row gap-3 items-center">
              <View className="size-9  items-center justify-center rounded-lg bg-muted">
                <ThemedIcon icon={Moon} colorToken="foreground" size={18} />
              </View>
              <View className="gap-0.5">
                <Text className="font-medium">Theme</Text>

                <Text className="text-xs text-muted-foreground">
                  App appearance
                </Text>
              </View>
            </View>

            <CompactPreferencePicker
              value={theme}
              onChange={setTheme}
              options={THEME_OPTIONS}
            />
          </View>

          <SettingsSeparator />

          <View className="flex-row items-center justify-between">
            <View className="flex-row gap-3 items-center">
              <View className="size-9  items-center justify-center rounded-lg bg-muted">
                <ThemedIcon icon={Scale} colorToken="foreground" size={18} />
              </View>

              <View className="gap-0.5">
                <Text className="font-medium">Weight units</Text>

                <Text className="text-xs text-muted-foreground">
                  Used throughout Ascora
                </Text>
              </View>
            </View>

            <CompactPreferencePicker
              value={weightUnit}
              onChange={setWeightUnit}
              options={WEIGHT_UNIT_OPTIONS}
            />
          </View>
        </View>
      </SettingsSection>

      <SettingsSection title="Account">
        <SettingsRow
          icon={LogOut}
          title="Sign out"
          destructive
          showChevron={false}
          onPress={handleSignOut}
        />
      </SettingsSection>

      <SettingsSection title="About">
        <SettingsRow
          icon={Info}
          title="About Ascora"
          onPress={() => router.push("/settings/about")}
        />

        <SettingsSeparator />

        <SettingsRow
          icon={Box}
          title="Version"
          value="1.0.0"
          showChevron={false}
        />
      </SettingsSection>
    </ScrollView>
  );
}
