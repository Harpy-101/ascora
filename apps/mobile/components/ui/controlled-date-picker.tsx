import { Keyboard, Modal, Platform, Pressable, View } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useState } from "react";
import { Text } from "@/components/ui/text";
import ThemedIcon from "./themed-icon";
import { CalendarDays, ChevronRight } from "lucide-react-native";
import { Button } from "./button";

type ControlledDatePickerProps<TFieldValue extends FieldValues> = {
  control: Control<TFieldValue, any, any>;
  name: Path<TFieldValue>;
  title: string;
  minimumDate?: string;
  maximumDate?: string;
};

export default function ControlledDatePicker<TFieldValue extends FieldValues>({
  name,
  control,
  title,
  minimumDate,
  maximumDate,
}: ControlledDatePickerProps<TFieldValue>) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [draftDate, setDraftDate] = useState(new Date());

  return (
    <Controller
      name={name}
      control={control}
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
            <Text>{title}</Text>

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
                          console.log();
                          // field.onChange(draftDate.toISOString());
                          // field.onChange()

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
                      minimumDate={convertToDate(minimumDate)}
                      maximumDate={convertToDate(maximumDate)}
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
  );
}

function convertToDate(value: Date | string | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;

  const parsed = new Date(value);
  return !isNaN(parsed.getTime()) ? parsed : undefined;
}
