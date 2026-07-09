import { useMemo, useState } from "react";
import { ProgressionPoint } from "../../../types";

import ProgressionMetricSelect from "./ExerciseProgressionChartsSelect";
import {
  ChartMetric,
  ExerciseProgressionChart,
} from "./ExerciseProgressionChart";
import HistoryRangeSelector from "./HistoryRangeSelector";

type HistoryRange = "1M" | "3M" | "6M" | "12M" | "ALL";

type ExerciseProgressionChartWithSelectProps = {
  progression: ProgressionPoint[];
};

export default function ExerciseProgressionChartWithControls({
  progression,
}: ExerciseProgressionChartWithSelectProps) {
  const [metric, setMetric] = useState<ChartMetric>("estimatedOneRepMax");
  const [range, setRange] = useState<HistoryRange>("3M");

  const filterProgression = useMemo(() => {
    return filterProgressionByRange(progression, range);
  }, [progression, range]);

  function filterProgressionByRange(
    progression: ProgressionPoint[],
    range: HistoryRange,
  ) {
    if (range === "ALL") return progression;

    const now = new Date();
    const startDate = new Date(now);

    switch (range) {
      case "1M":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3M":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6M":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "12M":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return progression.filter((point) => {
      return new Date(point.date) >= startDate;
    });
  }

  return (
    <ExerciseProgressionChart
      progression={filterProgression}
      metric={metric}
      header={<ProgressionMetricSelect value={metric} onChange={setMetric} />}
      controls={<HistoryRangeSelector value={range} onChange={setRange} />}
    />
  );
}
