import { ReactNode, useMemo } from "react";
import { View } from "react-native";
import { Area, CartesianChart, Line, Scatter } from "victory-native";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";

import { Text } from "@/components/ui/text";
import { ChartMetric } from "@/screens/exercise-details/types";
import { usePreferences } from "@/contexts/user-prefrences-context";

type ProgressionPoint = {
  date: string;
  workoutId: string;
  maxWeight: number | null;
  estimatedOneRepMax: number | null;
  sessionVolume: number;
  totalReps: number;
};

type ExerciseProgressionChartProps = {
  progression: ProgressionPoint[];
  metric?: ChartMetric;
  header?: ReactNode;
  controls?: ReactNode;
};

export function ExerciseProgressionChart({
  progression,
  metric = "estimatedOneRepMax",
  header,
  controls,
}: ExerciseProgressionChartProps) {
  const { weightUnit, displayWeight } = usePreferences();
  const METRIC_CONFIG = {
    estimatedOneRepMax: {
      label: "Estimated 1RM",
      ySuffix: weightUnit,
      color: "#059669",
    },
    maxWeight: {
      label: "Max weight",
      ySuffix: weightUnit,
      color: "#2563EB",
    },
    sessionVolume: {
      label: "Session volume",
      ySuffix: weightUnit,
      color: "#7C3AED",
    },
  } as const;

  const font = useFont(
    require("@/assets/fonts/Inter-Italic-VariableFont_opsz,wght.ttf"),
    11,
  );

  const config = METRIC_CONFIG[metric];

  const chartData = useMemo(() => {
    return progression
      .map((point, index) => {
        const value = point[metric];

        if (value == null) {
          return null;
        }

        return {
          session: index + 1,
          value: Math.round(displayWeight(value) * 10) / 10,
          dateLabel: formatDateLabel(point.date),
          workoutId: point.workoutId,
        };
      })
      .filter((point): point is NonNullable<typeof point> => point !== null);
  }, [progression, metric, displayWeight]);

  if (chartData.length === 0) {
    return (
      <View className="rounded-2xl border border-border bg-card p-4">
        <Text variant="h3">Progression</Text>

        <View className="mt-4 h-55 items-center justify-center rounded-xl bg-muted/40 px-6">
          <Text className="text-center text-sm text-muted-foreground">
            No logged sets for this exercise yet. Complete a workout to start
            seeing your progression here.
          </Text>
        </View>
      </View>
    );
  }

  if (!font) {
    return (
      <View className="rounded-2xl border border-border bg-card p-4">
        <Text variant="h3">Progression</Text>
        <View className="mt-4 h-65 rounded-xl bg-muted/40" />
      </View>
    );
  }

  const latestPoint = chartData[chartData.length - 1];
  const firstPoint = chartData[0];
  const delta = latestPoint.value - firstPoint.value;

  return (
    <View className="gap-4 rounded-2xl border border-border bg-card p-4">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-1">
          <Text variant="h3">Progression</Text>
          <Text className="text-sm text-muted-foreground">
            {config.label} across completed sessions
          </Text>
        </View>

        {header ? <View className="shrink-0">{header}</View> : null}
      </View>

      <View className="items-end">
        <Text className="text-lg font-semibold text-foreground">
          {latestPoint.value}
          {config.ySuffix}
        </Text>

        <Text
          className={
            delta >= 0 ? "text-xs text-emerald-600" : "text-xs text-destructive"
          }
        >
          {delta >= 0 ? "+" : ""}
          {Math.round(delta * 10) / 10}
          {config.ySuffix}
        </Text>
      </View>

      <View style={{ height: 260, width: "100%" }}>
        <CartesianChart
          data={chartData}
          xKey="dateLabel"
          yKeys={["value"]}
          padding={{
            top: 20,
            left: 8,
            right: 8,
            bottom: 20,
          }}
          domainPadding={{
            left: 20,
            right: 20,
            top: 24,
            bottom: 20,
          }}
          xAxis={{
            font,
            labelColor: "#6B7280",
            // lineColor: "#E5E7EB",
            // tickCount: Math.min(chartData.length, 5),
            formatXLabel: (value) => `#${value}`,
          }}
          yAxis={[
            {
              font,
              labelColor: "#6B7280",
              // lineColor: "#E5E7EB",
              // tickCount: 4,
              formatYLabel: (value) =>
                `${Math.round(Number(value))}${config.ySuffix}`,
            },
          ]}
        >
          {({ points, chartBounds }) => (
            <>
              <Area
                points={points.value}
                y0={chartBounds.bottom}
                curveType="natural"
                animate={{
                  type: "timing",
                  duration: 300,
                }}
              />

              <Line
                points={points.value}
                color={config.color}
                strokeWidth={3}
                curveType="natural"
                animate={{
                  type: "timing",
                  duration: 300,
                }}
              />

              <Scatter points={points.value} radius={4} color={config.color} />

              <LinearGradient
                start={vec(0, chartBounds.top)}
                end={vec(0, chartBounds.bottom)}
                colors={[
                  withOpacity(config.color, 0.32),
                  withOpacity(config.color, 0.18),
                  withOpacity(config.color, 0),
                ]}
              />
            </>
          )}
        </CartesianChart>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-xs text-muted-foreground">
          First: {firstPoint.dateLabel}
        </Text>

        <Text className="text-xs text-muted-foreground">
          Latest: {latestPoint.dateLabel}
        </Text>
      </View>

      {controls ? <View className="shrink-0">{controls}</View> : null}
    </View>
  );
}

function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function withOpacity(hex: string, opacity: number) {
  const normalizedHex = hex.replace("#", "");

  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${normalizedHex}${alpha}`;
}
export { ChartMetric };
