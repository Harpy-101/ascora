import { Controller, useForm, useWatch } from "react-hook-form";
import { goalSchema, GoalSchemaValues } from "../validation/goalSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, View } from "react-native";
import { Text } from "@/components/ui/text";
import { GoalEntry, GoalOptions } from "../types";
import GoalTypeSelector from "./GoalTypeSelector";
import { GoalType } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import ControlledDatePicker from "@/components/ui/controlled-date-picker";
import { WeightEntry } from "@/screens/weight/types";
import { usePreferences } from "@/contexts/user-prefrences-context";

type GoalFormProps = {
  entry?: GoalEntry;
  latestValue?: WeightEntry;
  onSubmit: (values: GoalSchemaValues) => void;
};

export default function GoalForm({
  entry,
  onSubmit,
  latestValue,
}: GoalFormProps) {
  const { displayWeight, weightUnit } = usePreferences();
  const router = useRouter();

  const form = useForm<GoalSchemaValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      type: entry?.type || "weight",
      startDate: entry?.startDate || new Date().toISOString(),
      dueDate: entry?.dueDate || new Date().toISOString(),
      startValue:
        (entry && displayWeight(entry.startValue).toFixed(1)) ||
        (latestValue && displayWeight(latestValue?.weightInKg).toFixed(1)) ||
        "",
      targetValue:
        (entry && displayWeight(entry?.targetValue).toFixed(1)) || "",
    },
  });

  const startDateValue = useWatch({
    control: form.control,
    name: "startDate",
  });

  const startValueValue = useWatch({
    control: form.control,
    name: "startValue",
  });

  return (
    <View className="flex-1 gap-4">
      <Controller
        name="type"
        control={form.control}
        render={({ field, fieldState }) => (
          <View className="gap-3">
            <View className="gap-1">
              <Text variant="h3"> Goal type</Text>

              <Text className="text-sm text-muted-foreground">
                Choose what you want to work toward.
              </Text>
            </View>

            <GoalTypeSelector<GoalType>
              value={field.value}
              onChange={field.onChange}
              options={GoalOptions}
            />

            {fieldState.error && (
              <Text className="text-sm text-destructive">
                {fieldState.error.message}
              </Text>
            )}
          </View>
        )}
      />

      {startValueValue ? (
        <View className="rounded-xl border border-border bg-card p-4">
          <Text className="text-sm text-muted-foreground">
            {entry ? "Start weight" : "Current weight"}
          </Text>
          <Text className="mt-1 text-2xl font-semibold">{startValueValue}</Text>
          {/* <Text className="mt-1 text-xs text-muted-foreground">
            {`Last recorded ${las}}`}
          </Text> */}
        </View>
      ) : (
        <View className=" flex-col gap-4 rounded-xl border border-border p-4 bg-card">
          <Text className="text-sm text-muted-foreground">
            No weight recorded yet.
          </Text>
          <Text className="font-semibold">
            Log your current weight before creating a weight goal.
          </Text>
          <Button onPress={() => router.push("/weight/new")}>
            <Text>Log Weight</Text>
          </Button>
        </View>
      )}

      <Controller
        name="targetValue"
        control={form.control}
        render={({ field, fieldState }) => (
          <View className="items-center py-6">
            <Text className="mb-3 text-sm text-muted-foreground">
              Target weight
            </Text>

            <View className="flex-row items-baseline border-b border-border pb-1">
              <TextInput
                value={field.value}
                onChangeText={field.onChange}
                keyboardType="decimal-pad"
                className="min-w-28 text-center text-4xl font-semibold text-foreground"
              />
              <Text className="ml-2 text-xl text-muted-foreground">
                {weightUnit}
              </Text>
            </View>

            {fieldState.error && (
              <Text className="text-sm text-destructive">
                {fieldState.error.message}
              </Text>
            )}
          </View>
        )}
      />

      <ControlledDatePicker
        control={form.control}
        name="startDate"
        title="Start date"
      />

      <ControlledDatePicker
        control={form.control}
        name="dueDate"
        title="Target date"
        minimumDate={startDateValue}
      />

      <View className="mt-auto pt-6">
        <Button onPress={form.handleSubmit(onSubmit)}>
          <Text>{entry ? "Save goal" : "Create goal"}</Text>
        </Button>
      </View>
    </View>
  );
}
