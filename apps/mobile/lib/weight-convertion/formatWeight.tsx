import { WeightUnit } from "@/contexts/user-prefrences-context";
import convertWeightFromKg from "./convertWeightFromKg";

export default function formatWeight(
  weightKg: number,
  unit: WeightUnit,
  decimals = 1,
  addUnit: boolean,
) {
  const value = convertWeightFromKg(weightKg, unit);

  return `${value.toFixed(decimals)} ${addUnit ? unit : ""}`;
}
