/**
 * Catálogo de uniforme del colegio.
 *
 * Estructura:
 *   - SECCIÓN (DEPORTE, VESTIR, CALZADO, ABRIGO, COMPLEMENTOS)
 *     - PRENDA (UniformItem): nombre, descripción, género (UNISEX | NIÑO | NIÑA), precio base
 *       - VARIANTES (UniformVariant): cada talla con su stock independiente
 *
 * Las tallas dependen del tipo de prenda:
 *   - Infantil/Primaria por edad: 2, 3, 4, 6, 8, 10, 12, 14, 16 años
 *   - Adulto: XS, S, M, L, XL
 *   - Calzado: 22-46
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
  priceCents?: number; // si se omite, hereda basePriceCents
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
  //  DEPORTE — chándal completo + complementos
  // ===========================================================================
  {
    slug: "pantalon-chandal",
    name: "Pantalón de chándal",
    description: "Pantalón de chándal oficial con escudo del colegio bordado en la pernera izquierda. Tejido transpirable y resistente. Cintura elástica con cordón.",
    section: "DEPORTE",
    gender: "UNISEX",
    basePriceCents: 2890,
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult), ["XS"], ["16"]),
  },
  {
    slug: "chaqueta-chandal",
    name: "Chaqueta de chándal",
    description: "Chaqueta oficial a juego con el pantalón. Cremallera completa, dos bolsillos laterales con cremallera. Logotipo bordado en el pecho izquierdo.",
    section: "DEPORTE",
    gender: "UNISEX",
    basePriceCents: 3490,
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult), ["S"], []),
  },
  {
    slug: "camiseta-blanca-deporte",
    name: "Camiseta blanca de deporte",
    description: "Camiseta técnica de manga corta con escudo del colegio en el pecho. Tejido absorbente y de secado rápido.",
    section: "DEPORTE",
    gender: "UNISEX",
    basePriceCents: 1290,
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
    order: o(),
    variants: variants(sizesShoes, ["24", "42"], ["41"]),
  },

  // ===========================================================================
  //  VESTIR — uniforme institucional
  // ===========================================================================
  {
    slug: "polo-vestir-blanco",
    name: "Polo blanco de vestir",
    description: "Polo de manga corta con escudo bordado. Cuello con dos botones.",
    section: "VESTIR",
    gender: "UNISEX",
    basePriceCents: 1690,
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult)),
  },
  {
    slug: "camisa-vestir",
    name: "Camisa blanca de vestir",
    description: "Camisa de manga larga, cuello clásico. Para uniforme de gala y eventos institucionales.",
    section: "VESTIR",
    gender: "UNISEX",
    basePriceCents: 2390,
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult), ["XS"], []),
  },
  {
    slug: "pantalon-vestir",
    name: "Pantalón de vestir azul marino",
    description: "Pantalón clásico azul marino con cinturilla ajustable interior hasta la talla 12.",
    section: "VESTIR",
    gender: "NINO",
    basePriceCents: 2890,
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
    order: o(),
    variants: variants(["S", "M", "L"]),
  },

  // ===========================================================================
  //  CALZADO
  // ===========================================================================
  {
    slug: "zapatos-colegiales-negros",
    name: "Zapatos colegiales negros",
    description: "Zapato clásico de piel sintética con velcro hasta talla 32. Cordón a partir de talla 33.",
    section: "CALZADO",
    gender: "UNISEX",
    basePriceCents: 3990,
    order: o(),
    variants: variants(sizesShoes, ["38"], ["24"]),
  },
  {
    slug: "zapatos-colegiales-azul-marino",
    name: "Zapatos colegiales azul marino",
    description: "Alternativa al zapato negro. Mismo modelo en azul marino oficial.",
    section: "CALZADO",
    gender: "UNISEX",
    basePriceCents: 3990,
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
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult), ["12"], ["2", "XL"]),
  },
  {
    slug: "chubasquero",
    name: "Chubasquero impermeable",
    description: "Chubasquero verde con escudo bordado. Costuras termoselladas. Para días de lluvia.",
    section: "ABRIGO",
    gender: "UNISEX",
    basePriceCents: 2890,
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult)),
  },
  {
    slug: "chaleco-acolchado",
    name: "Chaleco acolchado",
    description: "Chaleco verde acolchado para entretiempo. Cremallera completa.",
    section: "ABRIGO",
    gender: "UNISEX",
    basePriceCents: 3290,
    order: o(),
    variants: variants(sizesKids.concat(sizesAdult), ["10"], []),
  },

  // ===========================================================================
  //  COMPLEMENTOS
  // ===========================================================================
  {
    slug: "mochila",
    name: "Mochila oficial del colegio",
    description: "Mochila de espalda acolchada con escudo bordado. Compartimento para portátil y bolsillo interior con cremallera.",
    section: "COMPLEMENTOS",
    gender: "UNISEX",
    basePriceCents: 4290,
    order: o(),
    variants: [
      { size: "Pequeña (Infantil)", stock: 7 },
      { size: "Mediana (Primaria)", stock: 12 },
      { size: "Grande (Secundaria/Bach)", stock: 9 },
    ],
  },
  {
    slug: "bolsa-deporte",
    name: "Bolsa de deporte",
    description: "Bolsa con compartimento separado para zapatillas. Tela impermeable.",
    section: "COMPLEMENTOS",
    gender: "UNISEX",
    basePriceCents: 1990,
    order: o(),
    variants: [{ size: "Única", stock: 14 }],
  },
  {
    slug: "estuche-tres-pisos",
    name: "Estuche de tres pisos",
    description: "Estuche con escudo bordado, ideal para Primaria y ESO. Tres compartimentos independientes.",
    section: "COMPLEMENTOS",
    gender: "UNISEX",
    basePriceCents: 1290,
    order: o(),
    variants: [{ size: "Única", stock: 0 }], // agotado a propósito para demo
  },
  {
    slug: "bata-infantil",
    name: "Bata escolar de Infantil",
    description: "Bata con cuello y puños institucionales. Obligatoria solo en Educación Infantil.",
    section: "VESTIR",
    gender: "UNISEX",
    basePriceCents: 1990,
    order: o(),
    variants: [
      { size: "3 años", stock: 8 },
      { size: "4 años", stock: 10 },
      { size: "5 años", stock: 9 },
    ],
  },
];
