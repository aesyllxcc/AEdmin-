import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '0';
  const num = Number(value);
  if (isNaN(num)) return '0';
  return num.toLocaleString();
}

export function formatCurrency(value: number | string | undefined | null, showDecimals: boolean = false): string {
  if (value === undefined || value === null || value === '') return '$0';
  const num = Number(value);
  if (isNaN(num)) return '$0';
  return `$${showDecimals ? num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : num.toLocaleString()}`;
}
