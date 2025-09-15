import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const commonPasswords = [
  "password",
  "football",
  "computer",
  "baseball",
  "sunshine",
  "princess",
  "mountain",
  "elephant",
  "homework",
  "hospital",
  "children",
  "notebook",
  "vacation",
  "absolute",
  "carefree",
  "location",
  "marriage",
  "generate",
  "dominate",
  "apparent",
  "happiest",
  "valuable",
  "domestic",
  "concrete",
  "separate",
  "engineer",
  "guidance",
  "handsome",
  "pleasant"
];
