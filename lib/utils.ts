import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumberWithDecimal(num: number | string): string {
  const [int, decimal] = num.toString().split(".");

  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
  if (error.issues && Array.isArray(error.issues)) {
    const fieldErrors = error.issues.map(
      (err: { message: string }) => err.message
    );
    return fieldErrors.join(". ") + ".";
  }

  if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    const field = error.meta?.target?.[0] || "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  return typeof error.message === "string"
    ? error.message
    : JSON.stringify(error.message);
}

export function convertToPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function roundTwo(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value must be a number or string");
  }
}

// Shorten UUID for display (shows last 6 characters)
// Example: "f5c1d8f4-5a09-4e0d-9f7b-93abc0" → "..93abc0"
export function formatId(id: string) {
  return `..${id.substring(id.length - 6).toUpperCase()}`;
}

// Format date string into multiple readable formats
export function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  const dateTime = date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const dateOnly = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeOnly = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return { dateTime, dateOnly, timeOnly };
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
}
