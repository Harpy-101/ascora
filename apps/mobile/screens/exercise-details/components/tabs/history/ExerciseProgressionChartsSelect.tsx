import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartMetric } from "@/screens/exercise-details/types";
import { TriggerRef } from "@rn-primitives/select";
import { useRef } from "react";

const METRIC_OPTIONS = [
  { label: "Estimated 1RM", value: "estimatedOneRepMax" },
  { label: "Max weight", value: "maxWeight" },
  { label: "Session volume", value: "sessionVolume" },
] as const;

type MetricOption = (typeof METRIC_OPTIONS)[number];

function getMetricOption(metric: ChartMetric): MetricOption {
  return (
    METRIC_OPTIONS.find((option) => option.value === metric) ??
    METRIC_OPTIONS[0]
  );
}

function isChartMetric(value: unknown): value is ChartMetric {
  return (
    value === "estimatedOneRepMax" ||
    value === "maxWeight" ||
    value === "sessionVolume"
  );
}

type ProgressionMetricSelectProps = {
  value: ChartMetric;
  onChange: (metric: ChartMetric) => void;
};

export default function ProgressionMetricSelect({
  value,
  onChange,
}: ProgressionMetricSelectProps) {
  const ref = useRef<TriggerRef>(null);

  return (
    <Select
      value={getMetricOption(value)}
      onValueChange={(option) => {
        if (!option) return;

        if (isChartMetric(option.value)) {
          onChange(option.value);
        }
      }}
    >
      <SelectTrigger ref={ref} className="w-40">
        <SelectValue placeholder="Metric" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {METRIC_OPTIONS.map((option) => (
            <SelectItem
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
