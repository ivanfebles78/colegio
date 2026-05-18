/**
 * Configuración del colegio: nombre, marca y colores.
 *
 * IMPORTANTE: para hacer demo a otro colegio basta con:
 *   1) Sobrescribir los valores aquí, o
 *   2) Definir las variables NEXT_PUBLIC_SCHOOL_* en `.env`.
 *
 * Los valores leídos desde process.env se aplican en tiempo de build.
 */

const env = (key: string, fallback: string) =>
  (typeof process !== "undefined" && process.env?.[key]) || fallback;

export const schoolConfig = {
  name: env("NEXT_PUBLIC_SCHOOL_NAME", "Centro Educativo Británico S21"),
  shortName: env("NEXT_PUBLIC_SCHOOL_SHORT_NAME", "Británico S21"),
  location: env("NEXT_PUBLIC_SCHOOL_LOCATION", "La Laguna, Tenerife"),
  domain: env("NEXT_PUBLIC_SCHOOL_DOMAIN", "britanicos21.es"),
  phone: env("NEXT_PUBLIC_SCHOOL_PHONE", "922 25 80 19"),
  email: env("NEXT_PUBLIC_SCHOOL_EMAIL", "info@britanicos21.es"),
  pickupAddress: env(
    "NEXT_PUBLIC_SCHOOL_ADDRESS",
    "Camino Las Mantecas, s/n · 38108 La Laguna · Tenerife",
  ),
  // Colores corporativos (en HSL para Tailwind/shadcn). El verde profundo y
  // el dorado discreto del logotipo institucional dan tono editorial.
  colors: {
    primaryHsl: env("NEXT_PUBLIC_SCHOOL_PRIMARY_HSL", "158 36% 16%"),
    primaryFgHsl: "0 0% 100%",
    accentHsl: env("NEXT_PUBLIC_SCHOOL_ACCENT_HSL", "39 42% 60%"),
    accentFgHsl: "20 14% 15%",
    mutedHsl: "40 30% 96%",
  },
  // Curso académico mostrado en cabeceras
  academicYear: env("NEXT_PUBLIC_ACADEMIC_YEAR", "2025–2026"),
  // Texto del hero de la home
  tagline: env(
    "NEXT_PUBLIC_SCHOOL_TAGLINE",
    "Libros y uniforme oficial · Recogida en el colegio",
  ),
  // ¿Tiene Bachillerato con itinerarios?
  bachilleratoBranches: true,
} as const;

export type SchoolConfig = typeof schoolConfig;
