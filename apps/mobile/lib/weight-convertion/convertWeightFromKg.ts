import { WeightUnit } from "@/contexts/user-prefrences-context";
import { kgToLb } from "../utils";

export default function convertWeightFromKg(
  weightKg: number,
  unit: WeightUnit,
) {
  switch (unit) {
    case "kg":
      return weightKg;

    case "lb":
      return kgToLb(weightKg);
  }
}
