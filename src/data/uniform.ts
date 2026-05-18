/**
 * Catálogo de uniforme del colegio.
 *
 * Estructura:
 *   - SECCIÓN (DEPORTE, VESTIR, CALZADO, ABRIGO, COMPLEMENTOS)
 *     - PRENDA (UniformItem): nombre, descripción, género (UNISEX | NIÑO | NIÑA), precio base
 *       - VARIANTES (UniformVariant): cada talla con su stock independiente
 *
 * Las imágenes están en `public/uniform/*.{png,jpg}` y se sirven como
 * estáticos por Next.js (sin configuración adicional).
 */

export type GenderKey = "UNISEX" | "NINO" | "NINA";
export type UniformSectionKey =
  | "DEPORTE"
  | "VESTIR"
  | "CALZADO"
  | "ABRIGO"
  | "COMPLEMENTOS";

export interface SeedUniformVariant {
  size: string;
  stock: number;
  priceCents?: number;
}

export interface SeedUniformItem {
  slug: string;
  name: string;
  description: string;
  section: UniformSectionKey;
  gender: GenderKey;
  basePriceCents: number;
  imageUrl?: string;
  order: number;
  variants: SeedUniformVariant[];
}

// Generadores de tallas reutilizables
const sizesKids = ["2", "4", "6", "8", "10", "12", "14", "16"];
const sizesAdult = ["XS", "S", "M", "L", "XL"];
const sizesShoes = ["24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42"];

// Genera variantes con stock pseudo-aleatorio pero determinista por tamaño.
const variants = (sizes: string[], lowStockSizes: string[] = [], outOfStockSizes: string[] = []): SeedUniformVariant[] => {
  return sizes.map((size) => {
    if (outOfStockSizes.includes(size)) return { size, stock: 0 };
    if (lowStockSizes.includes(size)) return { size, stock: 2 };
    return { size, stock: 8 + ((size.charCodeAt(0) + size.length) % 6) };
  });
};

let _order = 0;
const o = () => ++_order;

export const uniformCatalog: SeedUniformItem[] = [
  // ===========================================================================
  //  DEPORTE
  // ===========================================================================
  {
    slug: "chandal",
    name: "Chándal",
    description: "Conjunto oficial de chándal: chaqueta con cremallera completa y pantalón a juego. Escudo del colegio bordado. Se vende como conjunto, no por piezas separadas.",
    section: "DEPORTE",
    gender: "UNISEX",
    basePriceCents: 5890,
    imageUrl: "/uniform/chandal.png",
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult), ["XS"], ["16"]),
  },
  {
    slug: "camiseta-blanca-deporte",
    name: "Camiseta blanca de deporte",
    description: "Camiseta técnica de manga corta con escudo del colegio en el pecho. Tejido absorbente y de secado rápido.",
    section: "DEPORTE",
    gender: "UNISEX",
    basePriceCents: 1290,
    imageUrl: "/uniform/camiseta_deporte.png",
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult)),
  },
  {
    slug: "pantalon-corto-deporte",
    name: "Pantalón corto de deporte",
    description: "Pantalón corto técnico azul marino con escudo bordado. Para meses cálidos y educación física.",
    section: "DEPORTE",
    gender: "UNISEX",
    basePriceCents: 1490,
    imageUrl: "/uniform/pantalon_corto.png",
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult), [], ["2"]),
  },
  {
    slug: "calcetines-blancos-deporte",
    name: "Calcetines blancos de deporte",
    description: "Pack de tres pares. Algodón con refuerzo en talón y puntera.",
    section: "DEPORTE",
    gender: "UNISEX",
    basePriceCents: 690,
    imageUrl: "/uniform/calcetines_deporte.png",
    order: o(),
    variants: variants(["S", "M", "L"]),
  },
  {
    slug: "tenis-blancos",
    name: "Tenis blancos deportivos",
    description: "Zapatillas blancas oficiales para educación física. Suela antideslizante y plantilla amortiguada. Velcro hasta talla 32; cordón a partir de talla 33.",
    section: "CALZADO",
    gender: "UNISEX",
    basePriceCents: 3290,
    imageUrl: "/uniform/tenis.jpg",
    order: o(),
    variants: variants(sizesShoes, ["24", "42"], ["41"]),
  },

  // ===========================================================================
  //  VESTIR
  // ===========================================================================
  {
    slug: "polo-vestir-blanco",
    name: "Polo blanco de vestir",
    description: "Polo de manga corta con escudo bordado. Cuello con dos botones.",
    section: "VESTIR",
    gender: "UNISEX",
    basePriceCents: 1690,
    imageUrl: "/uniform/polo.png",
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult)),
  },
  {
    slug: "pantalon-vestir",
    name: "Pantalón de vestir azul marino",
    description: "Pantalón clásico azul marino con cinturilla ajustable interior hasta la talla 12.",
    section: "VESTIR",
    gender: "NINO",
    basePriceCents: 2890,
    imageUrl: "/uniform/pantalon_largo.png",
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult), ["L"], []),
  },
  {
    slug: "falda-vestir",
    name: "Falda de vestir cuadros",
    description: "Falda de tablas con tela del colegio (azul marino y verde). Cinturilla ajustable.",
    section: "VESTIR",
    gender: "NINA",
    basePriceCents: 3190,
    imageUrl: "/uniform/falda.png",
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult), ["14"], ["XS"]),
  },
  {
    slug: "suter-cuello-pico",
    name: "Suéter cuello de pico",
    description: "Suéter de lana verde con detalle en cuello y puños del color institucional. Escudo bordado.",
    section: "VESTIR",
    gender: "UNISEX",
    basePriceCents: 3490,
    imageUrl: "/uniform/sueter.png",
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult)),
  },
  {
    slug: "medias-azul-marino",
    name: "Medias azul marino",
    description: "Medias por debajo de la rodilla. Pack de dos pares.",
    section: "VESTIR",
    gender: "NINA",
    basePriceCents: 890,
    imageUrl: "/uniform/medias.png",
    order: o(),
    variants: variants(["XS", "S", "M", "L"]),
  },
  {
    slug: "calcetines-azul-marino",
    name: "Calcetines azul marino",
    description: "Pack de tres pares. Algodón con refuerzo en talón y puntera.",
    section: "VESTIR",
    gender: "UNISEX",
    basePriceCents: 690,
    imageUrl: "/uniform/calcetines_azules.png",
    order: o(),
    variants: variants(["S", "M", "L"]),
  },

  // ===========================================================================
  //  CALZADO institucional (por género)
  // ===========================================================================
  {
    slug: "zapatos-colegiales-nino",
    name: "Zapatos colegiales (niño)",
    description: "Zapato clásico oficial para niño. Piel sintética. Velcro hasta talla 32, cordón a partir de talla 33.",
    section: "CALZADO",
    gender: "NINO",
    basePriceCents: 3990,
    imageUrl: "/uniform/zapato_nino.jpg",
    order: o(),
    variants: variants(sizesShoes, ["38"], ["24"]),
  },
  {
    slug: "zapatos-colegiales-nina",
    name: "Zapatos colegiales (niña)",
    description: "Zapato clásico oficial para niña. Piel sintética con detalle de hebilla. Velcro hasta talla 32, cordón a partir de talla 33.",
    section: "CALZADO",
    gender: "NINA",
    basePriceCents: 3990,
    imageUrl: "/uniform/zapato_nina.png",
    order: o(),
    variants: variants(sizesShoes, ["32", "34"], []),
  },

  // ===========================================================================
  //  ABRIGO
  // ===========================================================================
  {
    slug: "abrigo-grueso",
    name: "Abrigo grueso de invierno",
    description: "Abrigo acolchado verde con interior cálido. Capucha desmontable. Bolsillos con cremallera.",
    section: "ABRIGO",
    gender: "UNISEX",
    basePriceCents: 6490,
    imageUrl: "/uniform/abrigo.png",
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult), ["12"], ["2", "XL"]),
  },
  // ===========================================================================
  //  Infantil
  // ===========================================================================
  {
    slug: "bata-infantil",
    name: "Bata escolar de Infantil",
    description: "Bata con cuello y puños institucionales. Obligatoria solo en Educación Infantil.",
    section: "VESTIR",
    gender: "UNISEX",
    basePriceCents: 1990,
    imageUrl: "/uniform/babi.png",
    order: o(),
    variants: [
      { size: "3 años", stock: 8 },
      { size: "4 años", stock: 10 },
      { size: "5 años", stock: 9 },
    ],
  },
];
