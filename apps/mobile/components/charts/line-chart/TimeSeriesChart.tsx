import { ReactNode, useMemo } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Area, CartesianChart, Line, Scatter } from "victory-native";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";

type TimeSeriesChartProps<T> = {
  data: T[];

  getDate: (item: T) => string | Date;
  getValue: (item: T) => number | null | undefined;

  title: string;
  subtitle?: string;

  unit?: string;
  color?: string;

  header?: ReactNode;
  controls?: ReactNode;

  emptyMessage?: string;

  formatValue?: (value: number) => string;
  formatDate?: (date: Date) => string;

  showSummary?: boolean;
};

export function TimeSeriesChart<T>({
  data,
  getDate,
  getValue,

  title,
  subtitle,

  unit = "",
  color = "#2563EB",

  header,
  controls,

  emptyMessage = "No data available yet.",

  formatValue = (value) => Math.round(value * 10) / 10 + unit,

  formatDate = defaultDateFormatter,

  showSummary = true,
}: TimeSeriesChartProps<T>) {
  const font = useFont(
    require("@/assets/fonts/Inter-Italic-VariableFont_opsz,wght.ttf"),
    11,
  );

  const chartData = useMemo(() => {
    return data
      .map((item) => {
        const rawValue = getValue(item);

        if (rawValue == null) {
          return null;
        }

        const date = new Date(getDate(item));

        if (Number.isNaN(date.getTime())) {
          return null;
        }

        return {
          x: date.getTime(),
          y: Math.round(rawValue * 10) / 10,
          date,
        };
      })
      .filter(
        (
          point,
        ): point is {
          x: number;
          y: number;
          date: Date;
        } => point !== null,
      )
      .sort((a, b) => a.x - b.x);
  }, [data, getDate, getValue]);

  if (chartData.length === 0) {
    return (
      <View className="rounded-2xl border border-border bg-card p-4">
        <Text variant="h3">{title}</Text>

        {subtitle && (
          <Text className="mt-1 text-sm text-muted-foreground">{subtitle}</Text>
        )}

        <View className="mt-4 h-55 items-center justify-center rounded-xl bg-muted/40 px-6">
          <Text className="text-center text-sm text-muted-foreground">
            {emptyMessage}
          </Text>
        </View>
      </View>
    );
  }

  if (!font) {
    return (
      <View className="rounded-2xl border border-border bg-card p-4">
        <Text variant="h3">{title}</Text>

        <View className="mt-4 h-65 rounded-xl bg-muted/40" />
      </View>
    );
  }

  const firstPoint = chartData[0];
  const latestPoint = chartData[chartData.length - 1];

  const delta = latestPoint.y - firstPoint.y;

  return (
    <View className="gap-4 rounded-2xl border border-border bg-card p-4">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-1">
          <Text variant="h3">{title}</Text>

          {subtitle && (
            <Text className="text-sm text-muted-foreground">{subtitle}</Text>
          )}
        </View>

        {header && <View className="shrink-0">{header}</View>}
      </View>

      {showSummary && (
        <View className="items-end">
          <Text className="text-lg font-semibold text-foreground">
            {formatValue(latestPoint.y)}
          </Text>

          <Text className="text-xs text-muted-foreground">
            {delta >= 0 ? "+" : ""}
            {formatValue(delta)}
          </Text>
        </View>
      )}

      <View
        style={{
          height: 260,
          width: "100%",
        }}
      >
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={["y"]}
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
            formatXLabel: (value) => formatDate(new Date(Number(value))),
          }}
          yAxis={[
            {
              font,
              labelColor: "#6B7280",
              formatYLabel: (value) => formatValue(Number(value)),
            },
          ]}
        >
          {({ points, chartBounds }) => (
            <>
              <Area
                points={points.y}
                y0={chartBounds.bottom}
                curveType="catmullRom100"
                // animate={{
                //   type: "timing",
                //   duration: 1000,
                // }}
              />

              <Line
                points={points.y}
                color={color}
                strokeWidth={3}
                curveType="catmullRom100"
                // animate={{
                //   type: "timing",
                //   duration: 1000,
                // }}
              />

              <Scatter
                points={points.y}
                radius={4}
                color={color}
                // animate={{
                //   type: "timing",
                //   duration: 1000,
                // }}
              />

              <LinearGradient
                start={vec(0, chartBounds.top)}
                end={vec(0, chartBounds.bottom)}
                colors={[
                  withOpacity(color, 0.32),
                  withOpacity(color, 0.18),
                  withOpacity(color, 0),
                ]}
              />
            </>
          )}
        </CartesianChart>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-xs text-muted-foreground">
          {formatDate(firstPoint.date)}
        </Text>

        <Text className="text-xs text-muted-foreground">
          {formatDate(latestPoint.date)}
        </Text>
      </View>

      {controls && <View className="shrink-0">{controls}</View>}
    </View>
  );
}

function defaultDateFormatter(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function withOpacity(hex: string, opacity: number) {
  const normalizedHex = hex.replace("#", "");

  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${normalizedHex}${alpha}`;
}
