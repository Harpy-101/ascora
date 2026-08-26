import { cn } from "@/lib/utils";
import { View } from "react-native";

type StripeSectionProps = {
  left: number;
  width: number;
  tone: "positive" | "negative" | "neutral";
};

export default function StripeSection({
  left,
  width,
  tone,
}: StripeSectionProps) {
  return (
    <View
      pointerEvents="none"
      className="absolute top-0 h-3 overflow-hidden"
      style={{
        left,
        width,
      }}
    >
      <View className="relative h-full w-full">
        {Array.from({
          length: Math.ceil(width / 7) + 3,
        }).map((_, index) => (
          <View
            key={index}
            className={cn(
              "absolute h-5 w-1",
              tone === "positive" && "bg-emerald-500",
              tone === "negative" && "bg-red-500",
              tone === "neutral" && "bg-primary",
            )}
            style={{
              left: index * 7 - 5,
              top: -4,

              transform: [
                {
                  rotate: "35deg",
                },
              ],
            }}
          />
        ))}
      </View>
    </View>
  );
}
