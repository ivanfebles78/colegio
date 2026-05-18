/**
 * Estructura académica del colegio.
 * 15 cursos:
 *   - 3 cursos de Educación Infantil (3, 4, 5 años)
 *   - 6 cursos de Educación Primaria
 *   - 4 cursos de ESO
 *   - 2 cursos de Bachillerato × 2 itinerarios (Ciencias y Tecnología, Humanidades y Ciencias Sociales)
 */

export type EducationLevelKey = "INFANTIL" | "PRIMARIA" | "ESO" | "BACHILLERATO";
export type BachilleratoBranchKey = "CIENCIAS_Y_TECNOLOGIA" | "HUMANIDADES_Y_CCSS";

export interface CourseDefinition {
  slug: string;
  level: EducationLevelKey;
  year: number;
  branch?: BachilleratoBranchKey;
  shortName: string;
  fullName: string;
  displayAge?: string;
  order: number;
}

const ord = (() => {
  let i = 0;
  return () => ++i;
})();

export const courses: CourseDefinition[] = [
  // INFANTIL
  {
    slug: "1-infantil",
    level: "INFANTIL",
    year: 1,
    shortName: "1º Infantil",
    fullName: "Primero de Educación Infantil",
    displayAge: "3 años",
    order: ord(),
  },
  {
    slug: "2-infantil",
    level: "INFANTIL",
    year: 2,
    shortName: "2º Infantil",
    fullName: "Segundo de Educación Infantil",
    displayAge: "4 años",
    order: ord(),
  },
  {
    slug: "3-infantil",
    level: "INFANTIL",
    year: 3,
    shortName: "3º Infantil",
    fullName: "Tercero de Educación Infantil",
    displayAge: "5 años",
    order: ord(),
  },
  // PRIMARIA
  ...Array.from({ length: 6 }, (_, i) => {
    const year = i + 1;
    const ordinals = ["Primero", "Segundo", "Tercero", "Cuarto", "Quinto", "Sexto"];
    return {
      slug: `${year}-primaria`,
      level: "PRIMARIA" as const,
      year,
      shortName: `${year}º Primaria`,
      fullName: `${ordinals[i]} de Educación Primaria`,
      order: ord(),
    };
  }),
  // ESO
  ...Array.from({ length: 4 }, (_, i) => {
    const year = i + 1;
    const ordinals = ["Primero", "Segundo", "Tercero", "Cuarto"];
    return {
      slug: `${year}-eso`,
      level: "ESO" as const,
      year,
      shortName: `${year}º ESO`,
      fullName: `${ordinals[i]} de Educación Secundaria Obligatoria`,
      order: ord(),
    };
  }),
  // BACHILLERATO — 2 itinerarios × 2 cursos = 4
  {
    slug: "1-bachillerato-ciencias",
    level: "BACHILLERATO",
    year: 1,
    branch: "CIENCIAS_Y_TECNOLOGIA",
    shortName: "1º Bach · Ciencias y Tecnología",
    fullName: "Primero de Bachillerato — Ciencias y Tecnología",
    order: ord(),
  },
  {
    slug: "2-bachillerato-ciencias",
    level: "BACHILLERATO",
    year: 2,
    branch: "CIENCIAS_Y_TECNOLOGIA",
    shortName: "2º Bach · Ciencias y Tecnología",
    fullName: "Segundo de Bachillerato — Ciencias y Tecnología",
    order: ord(),
  },
  {
    slug: "1-bachillerato-humanidades",
    level: "BACHILLERATO",
    year: 1,
    branch: "HUMANIDADES_Y_CCSS",
    shortName: "1º Bach · Humanidades y CCSS",
    fullName: "Primero de Bachillerato — Humanidades y Ciencias Sociales",
    order: ord(),
  },
  {
    slug: "2-bachillerato-humanidades",
    level: "BACHILLERATO",
    year: 2,
    branch: "HUMANIDADES_Y_CCSS",
    shortName: "2º Bach · Humanidades y CCSS",
    fullName: "Segundo de Bachillerato — Humanidades y Ciencias Sociales",
    order: ord(),
  },
];

export const coursesBySlug = new Map(courses.map((c) => [c.slug, c]));
