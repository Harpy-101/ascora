import convertWeightFromKg from "@/lib/weight-convertion/convertWeightFromKg";
import convertWeightToKg from "@/lib/weight-convertion/convertWeightToKg";
import formatWeight from "@/lib/weight-convertion/formatWeight";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { Uniwind, useUniwind } from "uniwind";

export type ThemePreference = "system" | "light" | "dark";

export type WeightUnit = "kg" | "lb";

export type AppPreferences = {
  theme: ThemePreference;
  weightUnit: WeightUnit;
};

type PreferencesContextValue = {
  theme: ThemePreference;
  weightUnit: WeightUnit;

  setTheme: (theme: ThemePreference) => void;
  setWeightUnit: (unit: WeightUnit) => void;
  displayWeight: (weightKg: number) => number;
  weightToKg: (weight: number) => number;
  formatWeight: (
    weightKg: number,
    decimals?: number,
    addUnit?: boolean,
  ) => string;
};

const PreferencesContext = createContext<PreferencesContextValue | undefined>(
  undefined,
);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { theme } = useUniwind();

  const [weightUnit, setWeightUnit] = useState<WeightUnit>("lb");

  const displayWeight = useCallback(
    (weightInKg: number) => convertWeightFromKg(weightInKg, weightUnit),
    [weightUnit],
  );

  const weightToKg = useCallback(
    (weight: number) => convertWeightToKg(weight, weightUnit),
    [weightUnit],
  );

  const formatedWeight = useCallback(
    (weightInKg: number, decimals = 0, addUnit = false) =>
      formatWeight(weightInKg, weightUnit, decimals, addUnit),
    [weightUnit],
  );

  function setTheme(value: ThemePreference) {
    Uniwind.setTheme(value);
  }

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        weightUnit,
        setTheme,
        setWeightUnit,
        displayWeight,
        weightToKg,
        formatWeight: formatedWeight,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }

  return context;
}
