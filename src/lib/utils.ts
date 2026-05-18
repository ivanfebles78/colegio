import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convierte céntimos enteros a un string con formato "12,34 €". */
export function formatEuro(cents: number | null | undefined): string {
  const value = (cents ?? 0) / 100;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

/** Slug seguro para URLs (sin tildes, sin espacios). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Genera un número de pedido legible: BR-YYYY-XXXX */
export function generateOrderNumber(seq: number, year = new Date().getFullYear()): string {
  return `BR-${year}-${String(seq).padStart(4, "0")}`;
}

/** Etiqueta legible de nivel educativo. */
export function levelLabel(level: string): string {
  switch (level) {
    case "INFANTIL":
      return "Educación Infantil";
    case "PRIMARIA":
      return "Educación Primaria";
    case "ESO":
      return "ESO";
    case "BACHILLERATO":
      return "Bachillerato";
    default:
      return level;
  }
}
