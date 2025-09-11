import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const commonPasswords = [
  "password",
  "qwerty",
  "letmein",
  "monkey",
  "football",
  "iloveyou",
  "admin",
  "welcome",
  "login",
  "princess",
  "dragon",
  "sunshine",
  "master",
  "hello",
  "ninja",
  "trustno",
  "secret",
  "shadow",
  "freedom",
  "computer"
];
