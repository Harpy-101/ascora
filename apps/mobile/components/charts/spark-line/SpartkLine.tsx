import { useMemo } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Area, CartesianChart, Line } from "victory-native";
import { LinearGradient, vec } from "@shopify/react-native-skia";

type SparklineProps<T> = {
  data: T[];
  getDate: (item: T) => string | Date;
  getValue: (item: T) => number | null | undefined;
  color?: string;
  height?: number;
};

export default function Sparkline<T>({
  data,
  getDate,
  getValue,
  color = "#2563EB",
  height = 70,
}: SparklineProps<T>) {
  const chartData = useMemo(() => {
    return data
      .map((item) => {
        const value = getValue(item);

        if (value == null) {
          return null;
        }

        const date = new Date(getDate(item));

        if (Number.isNaN(date.getTime())) {
          return null;
        }

        return {
          x: date.getTime(),
          y: value,
        };
      })
      .filter(
        (
          point,
        ): point is {
          x: number;
          y: number;
        } => point !== null,
      )
      .sort((a, b) => a.x - b.x);
  }, [data, getDate, getValue]);

  if (chartData.length < 2) {
    return (
      <View style={{ height }} className="items-center justify-center">
        <Text className="text-xs text-muted-foreground">
          Not enough data yet
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        height,
        width: "100%",
      }}
    >
      <CartesianChart
        data={chartData}
        xKey="x"
        yKeys={["y"]}
        padding={{
          top: 6,
          bottom: 6,
          left: 4,
          right: 4,
        }}
        domainPadding={{
          top: 8,
          bottom: 8,
        }}
      >
        {({ points, chartBounds }) => (
          <>
            <Area
              points={points.y}
              y0={chartBounds.bottom}
              curveType="natural"
            />

            <Line
              points={points.y}
              color={color}
              strokeWidth={2.5}
              curveType="natural"
            />

            <LinearGradient
              start={vec(0, chartBounds.top)}
              end={vec(0, chartBounds.bottom)}
              colors={[withOpacity(color, 0.2), withOpacity(color, 0)]}
            />
          </>
        )}
      </CartesianChart>
    </View>
  );
}

function withOpacity(hex: string, opacity: number) {
  const normalizedHex = hex.replace("#", "");

  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${normalizedHex}${alpha}`;
}
