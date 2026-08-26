import { clamp } from "@/lib/utils";

export default function calculateGoalProgress(
  startValue: number,
  targetValue: number,
  currentValue: number,
) {
  const totalChange = targetValue - startValue;

  if (totalChange === 0) {
    return 100;
  }

  const currentChnage = currentValue - startValue;

  return clamp((currentChnage / totalChange) * 100, 0, 100);
}
