import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { expoDb } from "./client";
export function DrizzleStudioDevtools() {
  useDrizzleStudio(expoDb);

  return null;
}
