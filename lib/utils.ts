import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateNumbers(
  start: number,
  end: number,
  padLength: number
): Record<string, number> {
  const numbers: Record<string, number> = {};
  for (let i = start; i <= end; i++) {
    numbers[i.toString().padStart(padLength, "0")] = 0;
  }
  return numbers;
}

export function formatNumber(num: number, length: number): string {
  return num.toString().padStart(length, "0");
}
