import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const commonPasswords = [
  "password",
  "123456",
  "123456789",
  "qwerty",
  "abc123",
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
  "passw0rd",
  "master",
  "hello",
  "ninja",
  "trustno1"
];
