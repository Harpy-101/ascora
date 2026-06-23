import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { allBodyParts } from "../utils/filters";
import { Pressable, ScrollView, View } from "react-native";
import { ExerciseFilterAction } from "../functions/exerciseFiltersReducer";
import { Dispatch, useMemo } from "react";
import { capitalize } from "@/lib/utils";

type FilterRowProps = {
  selectedBodyParts: string[];
  dispatch: Dispatch<ExerciseFilterAction>;
};

export default function FilterRow({
  selectedBodyParts,
  dispatch,
}: FilterRowProps) {
  const selectedSet = useMemo(
    () => new Set(selectedBodyParts),
    [selectedBodyParts],
  );

  const sortedBodyParts = useMemo(() => {
    return [...allBodyParts].sort((a, b) => {
      const aSelected = selectedSet.has(a.name);
      const bSelected = selectedSet.has(b.name);

      if (aSelected === bSelected) return 0;

      return aSelected ? -1 : 1;
    });
  }, [selectedSet]);
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {sortedBodyParts.map((bp) => {
          const isSelected = selectedSet.has(bp.name);

          return (
            <Pressable
              key={bp.name}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() =>
                dispatch({
                  type: "toggleBodyPart",
                  bodyPart: bp.name,
                })
              }
            >
              <Badge variant={isSelected ? "default" : "outline"}>
                <Text>{capitalize(bp.name)}</Text>
              </Badge>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
