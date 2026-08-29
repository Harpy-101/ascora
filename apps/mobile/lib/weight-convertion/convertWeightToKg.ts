import { WeightUnit } from "@/contexts/user-prefrences-context";
import { lbToKg } from "../utils";

export default function convertWeightToKg(weight: number, unit: WeightUnit) {
  switch (unit) {
    case "kg":
      return weight;

    case "lb":
      return lbToKg(weight);
  }
}
