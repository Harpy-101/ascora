import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  if (!str) return "";

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const KG_TO_LB = 2.2046226218;

export function kgToLb(kg: number) {
  return kg * KG_TO_LB;
}

export function lbToKg(lb: number) {
  return lb / KG_TO_LB;
}
