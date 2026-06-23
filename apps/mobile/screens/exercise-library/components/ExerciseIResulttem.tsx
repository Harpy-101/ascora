import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import ThemedIcon from "@/components/ui/themed-icon";
import { Plus } from "lucide-react-native";
import { Image } from "expo-image";

type ExerciseResultItemProps = {
  id: string;
  name: string;
  imageUrl?: string;
  primaryMuscle?: string;
  equipment?: string;
  category?: string;
  isSelected?: boolean;
  onPress?: () => void;
  onAdd?: () => void;
};

export function ExerciseResultItem({
  id,
  name,
  imageUrl,
  primaryMuscle,
  equipment,
  category,
  isSelected = false,
  onPress,
  onAdd,
}: ExerciseResultItemProps) {
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <Pressable
      onPress={onPress}
      className={[
        "rounded-xl border bg-card p-2 active:opacity-80",
        isSelected ? "border-primary" : "border-border",
      ].join(" ")}
    >
      <View className="flex-row items-center justify-between gap-3">
        {imageUrl ? (
          <View className="h-20 w-20 overflow-hidden rounded-lg bg-muted">
            <Image
              source={imageUrl}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={200}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        ) : null}

        <View className="flex-1">
          <Text
            numberOfLines={2}
            className="text-base font-semibold text-card-foreground"
          >
            {name}
          </Text>

          <View className="mt-1 flex-row flex-wrap items-center gap-x-2 gap-y-1">
            {primaryMuscle ? (
              <Text className="text-sm text-muted-foreground">
                {primaryMuscle}
              </Text>
            ) : null}

            {primaryMuscle && equipment ? (
              <Text className="text-sm text-muted-foreground">·</Text>
            ) : null}

            {equipment ? (
              <Text className="text-sm text-muted-foreground">{equipment}</Text>
            ) : null}
          </View>

          {category ? (
            <View className="mt-3 self-start rounded-full bg-muted px-2.5 py-1">
              <Text className="text-xs text-muted-foreground">{category}</Text>
            </View>
          ) : null}
        </View>

        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onAdd?.();
            }}
            hitSlop={10}
            className="h-9 w-9 items-center justify-center rounded-full border border-border active:opacity-80"
          >
            <ThemedIcon icon={Plus} colorToken="mutedForeground" size={18} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
