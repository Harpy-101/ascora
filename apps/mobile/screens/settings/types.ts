import {
  ThemePreference,
  WeightUnit,
} from "@/contexts/user-prefrences-context";
import { PreferenceOption } from "./components/CompactPreferencePicker";

export const THEME_OPTIONS = [
  //   {
  //     label: "System",
  //     value: "system",
  //   },
  {
    label: "Light",
    value: "light",
  },
  {
    label: "Dark",
    value: "dark",
  },
] satisfies PreferenceOption<ThemePreference>[];

export const WEIGHT_UNIT_OPTIONS = [
  {
    label: "kg",
    value: "kg",
  },
  {
    label: "lb",
    value: "lb",
  },
] satisfies PreferenceOption<WeightUnit>[];
