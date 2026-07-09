import { View } from "react-native";
import { Text } from "@/components/ui/text";

type ExerciseTipsProps = {
  tips: string[];
};

export function ExerciseTips({ tips }: ExerciseTipsProps) {
  return (
    <View className="gap-4 rounded-2xl border border-border bg-card p-4">
      <View className="gap-1">
        <Text variant="h3">Technique Tips</Text>
        <Text className="text-sm text-muted-foreground">
          Small details that help you perform the movement better.
        </Text>
      </View>

      <View className="gap-3">
        {tips.map((tip, idx) => {
          const parsedTip = parseTip(tip);

          return (
            <View
              key={`${parsedTip.title}-${idx}`}
              className="flex-row overflow-hidden rounded-xl border border-border bg-muted/40"
            >
              <View className="w-1 bg-primary" />

              <View className="flex-1 gap-1 p-3">
                <Text className="font-semibold text-foreground">
                  {parsedTip.title}
                </Text>

                <Text className="text-sm leading-5 text-muted-foreground">
                  {parsedTip.body}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function parseTip(tip: string) {
  const [title, ...rest] = tip.split(":");

  if (rest.length === 0) {
    return {
      title: "Tip",
      body: tip.trim(),
    };
  }

  return {
    title: title.trim(),
    body: rest.join(":").trim(),
  };
}
