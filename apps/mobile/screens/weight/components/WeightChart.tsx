import { TimeSeriesChart } from "@/components/charts/line-chart/TimeSeriesChart";
import { useMemo, useState } from "react";
import { WeightEntry } from "../types";
import RangeSelector, {
  SelectorOption,
} from "@/components/charts/components/RangSelector";

type DateRange = "1W" | "1M" | "3M" | "1Y" | "ALL";

type WeightChartValues = {
  weightHistory: WeightEntry[];
};

export default function WeightChart({ weightHistory = [] }: WeightChartValues) {
  const [range, setRange] = useState<DateRange>("1M");

  const TIME_RANGES: SelectorOption<DateRange>[] = [
    { label: "1W", value: "1W" },
    { label: "1M", value: "1M" },
    { label: "3M", value: "3M" },
    { label: "1Y", value: "1Y" },
    { label: "ALL", value: "ALL" },
  ];

  const filterProggresion = useMemo(() => {
    return filterProggressionByRange(weightHistory, range);
  }, [weightHistory, range]);

  function filterProggressionByRange(
    proggression: WeightEntry[],
    range: DateRange,
  ) {
    if (range === "ALL") {
      return proggression;
    }

    const now = new Date();
    const startDate = new Date(now);

    switch (range) {
      case "1W":
        startDate.setDate(now.getDate() - 7);
        break;

      case "1M":
        startDate.setMonth(now.getMonth() - 1);
        break;

      case "3M":
        startDate.setMonth(now.getMonth() - 3);
        break;

      case "1Y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return proggression.filter((points) => {
      return new Date(points.recordedAt) >= startDate;
    });
  }

  return (
    <TimeSeriesChart
      data={filterProggresion}
      getDate={(entry: WeightEntry) => entry.recordedAt}
      getValue={(entry: WeightEntry) => entry.weightInKg}
      title="Weight trend"
      subtitle="Your weight over time"
      unit=" kg"
      emptyMessage="Log your weight to start seeing your trend."
      controls={
        <RangeSelector<DateRange>
          value={range}
          onChange={setRange}
          options={TIME_RANGES}
        />
      }
    />
  );
}
