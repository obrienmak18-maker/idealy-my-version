import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional classes without leaving conflicting Tailwind utilities behind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
