import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { View } from "react-native";
import StripeSection from "./StripeSection";

type GoalProgressBarProps = {
  progress: number;
  expectedProgress: number;
  tone: "positive" | "negative" | "neutral";
};

export default function GoalProgressBar({
  progress,
  expectedProgress,
  tone,
}: GoalProgressBarProps) {
  const [width, setWidth] = useState(0);

  const actual = clamp(progress, 0, 100);
  const expected = clamp(expectedProgress, 0, 100);

  const sharedProgress = Math.min(actual, expected);
  const differenceStart = Math.min(actual, expected);
  const differenceEnd = Math.max(actual, expected);
  const difference = differenceEnd - differenceStart;
  const markerX = width * (actual / 100);
  const stripeLeft = width * (differenceStart / 100);
  const stripeWidth = width * (difference / 100);

  return (
    <View
      className="relative"
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width);
      }}
    >
      <Progress
        value={sharedProgress}
        className={cn(
          "h-3 rounded-full",
          tone === "positive" && "bg-emerald-200",
          tone === "negative" && "bg-red-200",
          tone === "neutral" && "bg-muted",
        )}
        indicatorClassName={cn(
          tone === "positive" && "bg-emerald-700",
          tone === "negative" && "bg-red-700",
          tone === "neutral" && "bg-primary",
        )}
      />

      {width > 0 && difference > 0 && (
        <StripeSection left={stripeLeft} width={stripeWidth} tone={tone} />
      )}

      {width > 0 && (
        <View
          pointerEvents="none"
          className={cn(
            "absolute top-1/2 h-6 w-6 rounded-full border-4 border-background shadow-sm",
            tone === "positive" && "bg-emerald-700",
            tone === "negative" && "bg-red-700",
            tone === "neutral" && "bg-primary",
          )}
          style={{
            left: markerX - 12,
            transform: [
              {
                translateY: -12,
              },
            ],
          }}
        />
      )}
    </View>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
