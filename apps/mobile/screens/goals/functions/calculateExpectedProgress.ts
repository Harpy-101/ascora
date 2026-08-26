import { clamp } from "@/lib/utils";

export default function calculateExpectedProgres(
  startDate: Date,
  dueDate: Date,
  now = new Date(),
) {
  const totalDuration = dueDate.getTime() - startDate.getTime();

  if (totalDuration <= 0) {
    return 100;
  }

  const elapsed = now.getTime() - startDate.getTime();

  return clamp((elapsed / totalDuration) * 100, 0, 100);
}
