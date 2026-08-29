import { useState } from "react";
import useCreateWeightEntry from "../hooks/use-create-weight-entry";
import { Controller, useForm } from "react-hook-form";
import {
  WeightEntryInput,
  weightEntrySchema,
  WeightEntryValues,
} from "../validation/weightEntrySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import ThemedIcon from "@/components/ui/themed-icon";
import { CalendarDays, ChevronRight, CircleCheck } from "lucide-react-native";
import FormField from "@/screens/auth/components/FormField";
import { Input } from "@/components/ui/input";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { WeightEntry } from "../types";
import useUpdateWeightEntry from "../hooks/use-update-weight-entry";
import ScreenHeader from "@/components/ui/screen-header";
import { usePreferences } from "@/contexts/user-prefrences-context";

type WeightEntryFormProps = {
  entry?: WeightEntry;
  lastWeight?: WeightEntry;
};

export default function WeightEntryForm({
  entry,
  lastWeight,
}: WeightEntryFormProps) {
  const { weightToKg, displayWeight } = usePreferences();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [draftDate, setDraftDate] = useState(new Date());
  const createWeightEntry = useCreateWeightEntry();
  const updateWeightEntry = useUpdateWeightEntry();

  const form = useForm<WeightEntryInput, unknown, WeightEntryValues>({
    resolver: zodResolver(weightEntrySchema),
    defaultValues: {
      recordedAt: entry?.recordedAt ?? new Date().toISOString(),
      weightInKg:
        (entry && displayWeight(entry?.weightInKg).toFixed(1).toString()) ||
        (lastWeight &&
          displayWeight(lastWeight?.weightInKg).toFixed(1).toString()) ||
        "",
    },
  });

  function onSubmit(values: WeightEntryValues) {
    console.log("weight values", values);
    console.log("Attempting to fire");
    if (entry) {
      updateWeightEntry.mutate({
        values: { ...values, weightInKg: weightToKg(values.weightInKg) },
        weightEntryId: entry?.id,
      });
    } else {
      createWeightEntry.mutate({
        ...values,
        weightInKg: weightToKg(values.weightInKg),
      });
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 w-full"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1 w-full"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          flexGrow: 1,
          width: "100%",
          padding: 16,
          gap: 16,
        }}
      >
        <ScreenHeader
          title={entry ? "Update Entry" : "Add Entry"}
          showBack
          rightAction={
            <Button
              onPress={form.handleSubmit(onSubmit)}
              size="icon"
              variant="ghost"
              hitSlop={10}
            >
              <ThemedIcon icon={CircleCheck} colorToken="primary" size={24} />
            </Button>
          }
        />

        <Controller
          name="weightInKg"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <FormField label="Weight" error={fieldState.error?.message}>
                <Input
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  keyboardType="decimal-pad"
                  placeholder="Current weight..."
                  returnKeyType="done"
                  accessibilityLabel="Weight"
                />
              </FormField>
              {fieldState.error && (
                <Text className="text-sm text-destructive">
                  {fieldState.error.message}
                </Text>
              )}
            </>
          )}
        />

        <Controller
          name="recordedAt"
          control={form.control}
          render={({ field, fieldState }) => {
            const value = field.value ? new Date(field.value) : new Date();

            const openDatePicker = () => {
              Keyboard.dismiss();

              if (Platform.OS === "android") {
                DateTimePickerAndroid.open({
                  value,
                  mode: "date",
                  maximumDate: new Date(),

                  onChange: (event, selectedDate) => {
                    console.log("event type", event.type);
                    if (event.type !== "dismissed" && selectedDate) {
                      field.onChange(selectedDate.toISOString());
                    }
                  },
                });

                return;
              }

              setDraftDate(value);
              setShowDatePicker(true);
            };

            return (
              <View className="gap-2">
                <Text>Recorded date</Text>

                <Pressable
                  onPress={openDatePicker}
                  className="h-12 w-full flex-row items-center justify-between rounded-md border px-3"
                >
                  <View className="flex-row items-center gap-2">
                    <ThemedIcon
                      icon={CalendarDays}
                      size={18}
                      colorToken="mutedForeground"
                    />

                    <Text>
                      {value.toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>

                  <ThemedIcon
                    icon={ChevronRight}
                    size={18}
                    colorToken="mutedForeground"
                  />
                </Pressable>

                {Platform.OS === "ios" && (
                  <Modal
                    visible={showDatePicker}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowDatePicker(false)}
                  >
                    <Pressable
                      className="flex-1 justify-end bg-black/40"
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Pressable
                        className="rounded-t-3xl bg-background p-4"
                        onPress={(event) => event.stopPropagation()}
                      >
                        <View className="mb-4 flex-row items-center justify-between">
                          <Button
                            variant="ghost"
                            onPress={() => setShowDatePicker(false)}
                          >
                            <Text>Cancel</Text>
                          </Button>

                          <Text variant="h3">Select date</Text>

                          <Button
                            variant="ghost"
                            onPress={() => {
                              field.onChange(draftDate.toISOString());

                              setShowDatePicker(false);
                            }}
                          >
                            <Text>Done</Text>
                          </Button>
                        </View>

                        <DateTimePicker
                          value={draftDate}
                          mode="date"
                          display="inline"
                          maximumDate={new Date()}
                          onChange={(_, date) => {
                            if (!date) {
                              return;
                            }

                            field.onChange(date.toISOString());
                          }}
                        />
                      </Pressable>
                    </Pressable>
                  </Modal>
                )}
                {fieldState.error && (
                  <Text className="text-sm text-destructive">
                    {fieldState.error.message}
                  </Text>
                )}
              </View>
            );
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
