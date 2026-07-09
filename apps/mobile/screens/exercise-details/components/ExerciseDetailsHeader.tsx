import { Text } from "@/components//ui/text";
import { View } from "react-native";
import { Image } from "expo-image";
import { Dumbbell } from "lucide-react-native";
import { capitalize } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ExerciseDetailsHeaderProps = {
  name: string;
  imageUrl?: string | null;
  equipments: string[];
  bodyParts: string[];
  exerciseType: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  onAddToWorkout?: () => void;
  onToggleSave?: () => void;
};

export default function ExerciseDetailsHeader({
  name,
  imageUrl,
  equipments,
  bodyParts,
  exerciseType,
  targetMuscles,
  secondaryMuscles,
  onAddToWorkout,
  onToggleSave,
}: ExerciseDetailsHeaderProps) {
  const primaryMuscleLabel = targetMuscles[0] ?? "General";
  const equipmentLabel = equipments[0] ?? "Bodyweight";
  const bodyPartLabel = bodyParts[0] ?? "Full body";

  return (
    <View className="overflow-hidden rounded-3xl border border-border bg-card">
      <View className="relative h-70 w-full bg-muted">
        {imageUrl ? (
          <Image
            source={imageUrl}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-muted">
            <Dumbbell size={40} color="#6B7280" />
          </View>
        )}

        <View className="absolute top-2 right-2">
          <Button
            onPress={() => {
              console.log("pressed btn");
              onAddToWorkout?.();
            }}
            className="h-12 rounded-2xl z-10"
            variant={"secondary"}
          >
            <Text className="font-semibold">Add to workout</Text>
          </Button>
        </View>

        <View className="absolute inset-0 bg-black/20" />

        {/* <View className="absolute left-4 right-4 top-4 flex-row items-center justify-between"> */}
        {/* <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-background/90"
          >
            <ArrowLeft size={20} color="#111827" />
          </Pressable> */}

        {/* <Pressable
            onPress={onToggleSave}
            className="h-10 w-10 items-center justify-center rounded-full bg-background/90"
          >
            <Bookmark size={20} color="#111827" />
          </Pressable>
        </View> */}

        <View className="absolute bottom-0 left-0 right-0 gap-3 bg-black/45 p-4">
          <View className="gap-1">
            <Text className="text-3xl font-bold tracking-tight text-white">
              {name}
            </Text>

            {/* <Text className="text-sm font-medium text-white/80">
              {capitalize(exerciseType)} • {capitalize(equipmentLabel)} •{" "}
              {capitalize(bodyPartLabel)}
            </Text> */}
          </View>

          <View className="flex-row flex-wrap gap-2">
            <HeaderChip label={capitalize(primaryMuscleLabel)} />
            <HeaderChip label={capitalize(equipmentLabel)} />
            <HeaderChip label={capitalize(exerciseType)} />
          </View>
        </View>
      </View>

      {/* <View className="gap-4 p-4"> */}
      {/* <View className="gap-3"> */}
      {/* <View className="gap-1">
            <Text className="text-sm font-semibold text-foreground">
              Primary muscles
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {targetMuscles.map((muscle) => (
                <MuscleChip key={muscle} label={muscle} variant="primary" />
              ))}
            </View>
          </View> */}
      {/* 
          {secondaryMuscles.length > 0 ? (
            <View className="gap-1">
              <Text className="text-sm font-semibold text-foreground">
                Secondary muscles
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {secondaryMuscles.slice(0, 3).map((muscle) => (
                  <MuscleChip key={muscle} label={muscle} variant="secondary" />
                ))}

                {secondaryMuscles.length > 3 ? (
                  <View className="rounded-full bg-muted px-3 py-1.5">
                    <Text className="text-xs font-medium text-muted-foreground">
                      +{secondaryMuscles.length - 3} more
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}
        </View> */}

      {/* </View> */}
    </View>
  );
}

function HeaderChip({ label }: { label: string }) {
  return (
    <View className="rounded-full bg-white/15 px-3 py-1.5">
      <Text className="text-xs font-semibold text-white">{label}</Text>
    </View>
  );
}

function MuscleChip({
  label,
  variant,
}: {
  label: string;
  variant: "primary" | "secondary";
}) {
  return (
    <View
      className={
        variant === "primary"
          ? "rounded-full bg-primary/10 px-3 py-1.5"
          : "rounded-full bg-muted px-3 py-1.5"
      }
    >
      <Text
        className={
          variant === "primary"
            ? "text-xs font-medium text-primary"
            : "text-xs font-medium text-muted-foreground"
        }
      >
        {label}
      </Text>
    </View>
  );
}
