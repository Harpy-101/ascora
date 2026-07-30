import { Pressable, View } from "react-native";
import { ArrowDown, ArrowUp, Minus, Plus, Trash2 } from "lucide-react-native";
import { Controller, type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { WorkoutPlanFormValues } from "../validation/planExerciseSchema";
import ThemedIcon from "@/components/ui/themed-icon";

type PlanExerciseCardProps = {
  index: number;
  form: UseFormReturn<WorkoutPlanFormValues>;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
};

function toOptionalNumber(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

export function PlanExerciseCard({
  index,
  form,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onRemove,
}: PlanExerciseCardProps) {
  const exercise = form.watch(`exercises.${index}`);
  const setCount = exercise.setCount;
  console.log("setCount", exercise);

  function updateSetCount(amount: number) {
    form.setValue(
      `exercises.${index}.setCount`,
      Math.max(1, Math.min(20, setCount + amount)),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  }

  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-card">
      <View className="flex-row items-center gap-3 border-b border-border px-4 py-3">
        <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <Text className="font-semibold text-primary">{index + 1}</Text>
        </View>

        <View className="flex-1">
          <Text numberOfLines={1} className="font-semibold">
            {exercise.name}
          </Text>

          <Text className="text-xs text-muted-foreground">
            {setCount} {setCount === 1 ? "set" : "sets"}
            {exercise.targetReps ? ` · ${exercise.targetReps} reps` : ""}
          </Text>
        </View>

        <View className="flex-row">
          <Pressable
            disabled={!canMoveUp}
            onPress={onMoveUp}
            className="h-9 w-9 items-center justify-center disabled:opacity-25"
          >
            <ThemedIcon icon={ArrowUp} size={17} colorToken="foreground" />
          </Pressable>

          <Pressable
            disabled={!canMoveDown}
            onPress={onMoveDown}
            className="h-9 w-9 items-center justify-center disabled:opacity-25"
          >
            <ThemedIcon icon={ArrowDown} size={17} colorToken="foreground" />
          </Pressable>

          <Pressable
            onPress={onRemove}
            className="h-9 w-9 items-center justify-center"
          >
            <ThemedIcon icon={Trash2} size={17} colorToken="foreground" />
          </Pressable>
        </View>
      </View>

      <View className="gap-4 p-4">
        <View className="gap-2">
          <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Sets
          </Text>

          <View className="flex-row items-center self-start rounded-xl border border-border">
            <Pressable
              onPress={() => updateSetCount(-1)}
              className="h-10 w-10 items-center justify-center"
            >
              <ThemedIcon icon={Minus} size={16} colorToken="foreground" />
            </Pressable>

            <Text className="min-w-10 text-center font-semibold">
              {setCount}
            </Text>

            <Pressable
              onPress={() => updateSetCount(1)}
              className="h-10 w-10 items-center justify-center"
            >
              <ThemedIcon icon={Plus} size={16} colorToken="foreground" />
            </Pressable>
          </View>
        </View>

        <View className="flex-row gap-3">
          <Controller
            control={form.control}
            name={`exercises.${index}.targetReps`}
            render={({ field, fieldState }) => (
              <View className="flex-1 gap-2">
                <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Target reps
                </Text>

                <Input
                  value={field.value === null ? "" : String(field.value)}
                  onChangeText={(value) =>
                    field.onChange(toOptionalNumber(value))
                  }
                  onBlur={field.onBlur}
                  placeholder="8"
                  keyboardType="number-pad"
                  className="text-center"
                />

                {fieldState.error?.message ? (
                  <Text className="text-xs text-destructive">
                    {fieldState.error.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={form.control}
            name={`exercises.${index}.targetWeight`}
            render={({ field, fieldState }) => (
              <View className="flex-1 gap-2">
                <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Target weight
                </Text>

                <Input
                  value={field.value === null ? "" : String(field.value)}
                  onChangeText={(value) =>
                    field.onChange(toOptionalNumber(value))
                  }
                  onBlur={field.onBlur}
                  placeholder="Optional"
                  keyboardType="decimal-pad"
                />

                {fieldState.error?.message ? (
                  <Text className="text-xs text-destructive">
                    {fieldState.error.message}
                  </Text>
                ) : null}
              </View>
            )}
          />
        </View>
        {/* 
        <Controller
          control={form.control}
          name={`exercises.${index}.restSeconds`}
          render={({ field, fieldState }) => (
            <View className="gap-2">
              <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Rest between sets
              </Text>

              <Input
                value={String(field.value)}
                onChangeText={(value) =>
                  field.onChange(Number(value) || 0)
                }
                onBlur={field.onBlur}
                placeholder="90"
                keyboardType="number-pad"
              />

              <Text className="text-xs text-muted-foreground">
                Enter rest time in seconds.
              </Text>

              {fieldState.error?.message ? (
                <Text className="text-xs text-destructive">
                  {fieldState.error.message}
                </Text>
              ) : null}
            </View>
          )}
        /> */}
      </View>
    </View>
  );
}
