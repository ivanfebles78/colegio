/**
 * Catálogo de libros del Centro Educativo Británico S21 — Curso 2025-2026.
 *
 * Los datos de 1º Infantil hasta 4º ESO se han transcrito desde los listados
 * oficiales publicados en https://britanicos21.es/informacion/libros/.
 *
 * Los datos de Bachillerato son orientativos (a confirmar con secretaría) y
 * pueden editarse desde el panel de administración tras el primer login.
 *
 * Los PRECIOS están almacenados en CÉNTIMOS. Son precios orientativos de
 * mercado para libros escolares en España; ajustables en el panel admin.
 */

export interface SeedBook {
  title: string;
  publisher: string;
  isbn: string | null;
  category: string;
  priceCents: number;
  stock: number;
  exclusiveAtSchool: boolean;
  notes?: string;
}

// Categorías de libro (orden visual)
export const BOOK_CATEGORIES = [
  "PROYECTOS",
  "LECTOESCRITURA",
  "MATEMÁTICAS",
  "LENGUA CASTELLANA Y LITERATURA",
  "CONOCIMIENTO DEL MEDIO",
  "GEOGRAFÍA E HISTORIA",
  "BIOLOGÍA Y GEOLOGÍA",
  "FÍSICA Y QUÍMICA",
  "FILOSOFÍA",
  "ECONOMÍA",
  "TECNOLOGÍA E INGENIERÍA",
  "DIBUJO TÉCNICO",
  "LATÍN",
  "INGLÉS",
  "FRANCÉS",
  "MÚSICA",
  "ARTS & CRAFTS",
  "YOGA",
  "EDUCACIÓN EMOCIONAL",
  "TUTORÍA Y ORIENTACIÓN",
];

const cover = (isbn: string | null) =>
  isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : null;

// Helper para precios razonables según tipología
const P = {
  proyecto: 3200,
  cuadernillo: 1100,
  textoPrincipal: 3500,
  lectura: 1200,
  ingleStudentsPack: 4500,
  ingleActivityPack: 3200,
  lecturaIngles: 1450,
  frances: 2900,
  licenciaDigital: 2400,
  matLicencia: 2800,
  yoga: 1500,
  musica: 1900,
  arts: 1900,
  emocional: 1600,
  tutoria: 1500,
};

export const booksByCourseSlug: Record<string, SeedBook[]> = {
  // ===========================================================================
  // 1º INFANTIL (3 años)
  // ===========================================================================
  "1-infantil": [
    { title: "Proyecto Alrededor del Mundo. Nivel 1", publisher: "ANAYA", isbn: "9788414343999", category: "PROYECTOS", priceCents: P.proyecto, stock: 12, exclusiveAtSchool: false },
    { title: "Proyecto Emergencia ¡Llama al 112! Nivel 1", publisher: "ANAYA", isbn: "9788414337622", category: "PROYECTOS", priceCents: P.proyecto, stock: 12, exclusiveAtSchool: false },
    { title: "Ludiletras. 3 años", publisher: "TEKMAN", isbn: "9788418863837", category: "LECTOESCRITURA", priceCents: P.textoPrincipal, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "EMAT Matemáticas para la vida. 3 años", publisher: "TEKMAN", isbn: "9788419718549", category: "MATEMÁTICAS", priceCents: P.textoPrincipal, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Libro de Yoga", publisher: "Centro", isbn: null, category: "YOGA", priceCents: P.yoga, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "New Hooray Starter — Student's Book", publisher: "RICHMOND", isbn: "9788466833493", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 15, exclusiveAtSchool: false },
  ],

  // ===========================================================================
  // 2º INFANTIL (4 años)
  // ===========================================================================
  "2-infantil": [
    { title: "Proyecto Alrededor del Mundo. Nivel 2", publisher: "ANAYA", isbn: "9788414344002", category: "PROYECTOS", priceCents: P.proyecto, stock: 11, exclusiveAtSchool: false },
    { title: "Proyecto Emergencia ¡Llama al 112! Nivel 2", publisher: "ANAYA", isbn: "9788414337639", category: "PROYECTOS", priceCents: P.proyecto, stock: 9, exclusiveAtSchool: false },
    { title: "Ludiletras. 4 años", publisher: "TEKMAN", isbn: "9788418863875", category: "LECTOESCRITURA", priceCents: P.textoPrincipal, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "EMAT Matemáticas para la vida. 4 años", publisher: "TEKMAN", isbn: "9788419718556", category: "MATEMÁTICAS", priceCents: P.textoPrincipal, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Libro de Yoga", publisher: "Centro", isbn: null, category: "YOGA", priceCents: P.yoga, stock: 0, exclusiveAtSchool: true, notes: "Solo para usuarios de comedor" },
    { title: "New Hooray Activity & Projects A", publisher: "RICHMOND", isbn: "9788466833530", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 14, exclusiveAtSchool: false },
  ],

  // ===========================================================================
  // 3º INFANTIL (5 años)
  // ===========================================================================
  "3-infantil": [
    { title: "Proyecto Alrededor del Mundo. Nivel 3", publisher: "ANAYA", isbn: "9788414344019", category: "PROYECTOS", priceCents: P.proyecto, stock: 10, exclusiveAtSchool: false },
    { title: "Proyecto Emergencia ¡Llama al 112! Nivel 3", publisher: "ANAYA", isbn: "9788414337646", category: "PROYECTOS", priceCents: P.proyecto, stock: 8, exclusiveAtSchool: false },
    { title: "Ludiletras. 5 años", publisher: "TEKMAN", isbn: "9788418863912", category: "LECTOESCRITURA", priceCents: P.textoPrincipal, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "EMAT Matemáticas para la vida. 5 años", publisher: "TEKMAN", isbn: "9788419718563", category: "MATEMÁTICAS", priceCents: P.textoPrincipal, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Libro de Yoga", publisher: "Centro", isbn: null, category: "YOGA", priceCents: P.yoga, stock: 0, exclusiveAtSchool: true, notes: "Solo para usuarios de comedor" },
    { title: "New Hooray Activity & Projects B", publisher: "RICHMOND", isbn: "9788466833547", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 13, exclusiveAtSchool: false },
  ],

  // ===========================================================================
  // 1º PRIMARIA
  // ===========================================================================
  "1-primaria": [
    { title: "1º Primaria Lengua Paso Cuaderno CM ED22", publisher: "SANTILLANA", isbn: "9788468071596", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.textoPrincipal, stock: 7, exclusiveAtSchool: false },
    { title: "1.1 Primaria Cuaderno Lengua Lecto Cuadr. ED22", publisher: "SANTILLANA", isbn: "9788468071282", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.cuadernillo, stock: 0, exclusiveAtSchool: false },
    { title: "1.2 Primaria Cuaderno Lengua Lecto Cuadr. CM E22", publisher: "SANTILLANA", isbn: "9788468071206", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.cuadernillo, stock: 11, exclusiveAtSchool: false },
    { title: "1.3 Primaria Lecturas 1x8 ED22", publisher: "SANTILLANA", isbn: "9788468067933", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 14, exclusiveAtSchool: false },
    { title: "Pack Libro Alumno EMAT + Juegos Lemon", publisher: "TEKMAN", isbn: "9788419718075", category: "MATEMÁTICAS", priceCents: 4200, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Conocimiento del Medio 1º — Proyecto Construyendo Mundos", publisher: "SANTILLANA", isbn: "9788414122341", category: "CONOCIMIENTO DEL MEDIO", priceCents: P.textoPrincipal, stock: 9, exclusiveAtSchool: false },
    { title: "Amazing Journey 1 — Student's Pack", publisher: "RICHMOND", isbn: "9788466826228", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 10, exclusiveAtSchool: false },
    { title: "Amazing Journey 1 — Activity Pack", publisher: "RICHMOND", isbn: "9788466825801", category: "INGLÉS", priceCents: P.ingleActivityPack, stock: 9, exclusiveAtSchool: false },
    { title: "Les Petits Loustics 1 — Méthode de Français", publisher: "HACHETTE", isbn: "9782016252765", category: "FRANCÉS", priceCents: P.frances, stock: 8, exclusiveAtSchool: false },
    { title: "Les Petits Loustics 1 — Cahier d'activités", publisher: "HACHETTE", isbn: "9782016252772", category: "FRANCÉS", priceCents: P.cuadernillo, stock: 8, exclusiveAtSchool: false },
    { title: "1º Pri Cuaderno Music ED22", publisher: "SANTILLANA", isbn: "9788468061214", category: "MÚSICA", priceCents: P.musica, stock: 12, exclusiveAtSchool: false },
  ],

  // ===========================================================================
  // 2º PRIMARIA
  // ===========================================================================
  "2-primaria": [
    { title: "2 Primaria C. del Medio CM Canar ED23 Anillas", publisher: "SANTILLANA", isbn: "9788468097473", category: "CONOCIMIENTO DEL MEDIO", priceCents: P.textoPrincipal, stock: 10, exclusiveAtSchool: false },
    { title: "2 Primaria Lengua Canar M Ligera CM ED23", publisher: "SANTILLANA", isbn: "9788414123423", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.textoPrincipal, stock: 11, exclusiveAtSchool: false },
    { title: "Lecturas 1x8 Cast ED23", publisher: "SANTILLANA", isbn: null, category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 13, exclusiveAtSchool: false },
    { title: "2-1 Primaria Cuad Lengua CM Cuadric Cast ED23", publisher: "SANTILLANA", isbn: "9788414424919", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.cuadernillo, stock: 14, exclusiveAtSchool: false },
    { title: "2-2 Primaria Cuad Lengua CM Cuadric Cast ED23", publisher: "SANTILLANA", isbn: "9788414424889", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.cuadernillo, stock: 14, exclusiveAtSchool: false },
    { title: "2-3 Primaria Cuad Lengua CM Cuadric Cast ED23", publisher: "SANTILLANA", isbn: "9788414424926", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.cuadernillo, stock: 12, exclusiveAtSchool: false },
    { title: "Libro Alumno EMAT 2º Primaria", publisher: "TEKMAN", isbn: "9788419718129", category: "MATEMÁTICAS", priceCents: P.textoPrincipal, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "2º Pri Music in Tune Activity Book ED23", publisher: "SANTILLANA", isbn: "9788468061221", category: "MÚSICA", priceCents: P.musica, stock: 9, exclusiveAtSchool: false },
    { title: "Amazing Journey 2 — Student's Pack", publisher: "RICHMOND", isbn: "9788466828482", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 12, exclusiveAtSchool: false },
    { title: "Amazing Journey 2 — Activity Pack", publisher: "RICHMOND", isbn: "9788466828246", category: "INGLÉS", priceCents: P.ingleActivityPack, stock: 8, exclusiveAtSchool: false },
    { title: "Licencia Digital de Inglés", publisher: "MILTON", isbn: null, category: "INGLÉS", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Passe Passe 1 — A1.1 Livre de l'élève", publisher: "DIDIER / SANTILLANA", isbn: "9782278087204", category: "FRANCÉS", priceCents: P.frances, stock: 6, exclusiveAtSchool: false },
    { title: "Passe Passe 1 — A1.1 Cahier d'activités", publisher: "DIDIER / SANTILLANA", isbn: "9782278112012", category: "FRANCÉS", priceCents: P.cuadernillo, stock: 6, exclusiveAtSchool: false },
  ],

  // ===========================================================================
  // 3º PRIMARIA
  // ===========================================================================
  "3-primaria": [
    { title: "3º Pri Lengua M. Lig CM Canar ED22", publisher: "SANTILLANA", isbn: "9788414122327", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.textoPrincipal, stock: 10, exclusiveAtSchool: false },
    { title: "3º Pri Lecturas 1x8 ED22", publisher: "SANTILLANA", isbn: "9788468083827", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 12, exclusiveAtSchool: false },
    { title: "3-1 Pri Cuad Lengua CM ED22", publisher: "SANTILLANA", isbn: "9788468077451", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.cuadernillo, stock: 14, exclusiveAtSchool: false },
    { title: "3-2 Pri Cuad Lengua CM Cast ED22", publisher: "SANTILLANA", isbn: "9788468077437", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.cuadernillo, stock: 14, exclusiveAtSchool: false },
    { title: "3-3 Pri Cuad Lengua CM Cast ED22", publisher: "SANTILLANA", isbn: "9788468077468", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.cuadernillo, stock: 14, exclusiveAtSchool: false },
    { title: "La Gallina Balbina", publisher: "ANAYA", isbn: "9788469833537", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 8, exclusiveAtSchool: false },
    { title: "¡Ay, cuánto me quiero!", publisher: "LOQUELEO", isbn: "9788491220176", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 9, exclusiveAtSchool: false },
    { title: "Un día con suerte", publisher: "LOQUELEO", isbn: "9788491225218", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 9, exclusiveAtSchool: false },
    { title: "3º Pri Matemáticas M. Lig CM ED22", publisher: "SANTILLANA", isbn: "9788468071367", category: "MATEMÁTICAS", priceCents: P.textoPrincipal, stock: 11, exclusiveAtSchool: false },
    { title: "3º Pri C. del Medio M. Lig CM Canar ED22", publisher: "SANTILLANA", isbn: "9788414122440", category: "CONOCIMIENTO DEL MEDIO", priceCents: P.textoPrincipal, stock: 10, exclusiveAtSchool: false },
    { title: "Amazing Journey 3 — Student's Pack", publisher: "RICHMOND", isbn: "9788466825528", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 10, exclusiveAtSchool: false },
    { title: "Amazing Journey 3 — Activity Pack", publisher: "RICHMOND", isbn: "9788466826358", category: "INGLÉS", priceCents: P.ingleActivityPack, stock: 8, exclusiveAtSchool: false },
    { title: "Licencia Digital de Inglés", publisher: "MILTON", isbn: null, category: "INGLÉS", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "3 Primaria Arts and Craft WM E22", publisher: "RICHMOND", isbn: "9788468072067", category: "ARTS & CRAFTS", priceCents: P.arts, stock: 11, exclusiveAtSchool: false },
    { title: "Les Loustics 1 — Méthode de Français", publisher: "HACHETTE", isbn: "9782011559036", category: "FRANCÉS", priceCents: P.frances, stock: 7, exclusiveAtSchool: false },
    { title: "Les Loustics 1 — Cahier d'activités", publisher: "HACHETTE", isbn: "9782011559050", category: "FRANCÉS", priceCents: P.cuadernillo, stock: 7, exclusiveAtSchool: false },
    { title: "Mundo Emociones 3", publisher: "ANAYA", isbn: "9788467883916", category: "EDUCACIÓN EMOCIONAL", priceCents: P.emocional, stock: 9, exclusiveAtSchool: false },
    { title: "Music in Tune Activity Book 3 Primary", publisher: "RICHMOND", isbn: "9788468061252", category: "MÚSICA", priceCents: P.musica, stock: 8, exclusiveAtSchool: false },
  ],

  // ===========================================================================
  // 4º PRIMARIA
  // ===========================================================================
  "4-primaria": [
    { title: "4º Pri Matemáticas M. Lig. CM ED 23", publisher: "SANTILLANA", isbn: "9788414407691", category: "MATEMÁTICAS", priceCents: P.textoPrincipal, stock: 9, exclusiveAtSchool: false },
    { title: "4º Prim C. del Medio M. Lig. CM Canar ED 23", publisher: "SANTILLANA", isbn: "9788414123843", category: "CONOCIMIENTO DEL MEDIO", priceCents: P.textoPrincipal, stock: 9, exclusiveAtSchool: false },
    { title: "4º Pri M. Lig. CM Canar ED 23 (Lengua)", publisher: "SANTILLANA", isbn: "9788414123430", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.textoPrincipal, stock: 9, exclusiveAtSchool: false },
    { title: "4.1 Cuad Leng CM ED23", publisher: "SANTILLANA", isbn: "9788414402856", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.cuadernillo, stock: 12, exclusiveAtSchool: false },
    { title: "4.2 Cuad Leng CM ED23", publisher: "SANTILLANA", isbn: "9788414402863", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.cuadernillo, stock: 12, exclusiveAtSchool: false },
    { title: "4.3 Cuad Leng CM ED23", publisher: "SANTILLANA", isbn: "9788414402870", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.cuadernillo, stock: 12, exclusiveAtSchool: false },
    { title: "Yo salvaré a los pingüinos de Rosa del Real", publisher: "SANTILLANA", isbn: "9788491225430", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 7, exclusiveAtSchool: false },
    { title: "Violeta Volcán y el tesoro de Willian Winter", publisher: "ANAYA", isbn: "9788469891131", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 6, exclusiveAtSchool: false },
    { title: "Secretos que pican", publisher: "ANAYA", isbn: "9788469848333", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 7, exclusiveAtSchool: false },
    { title: "Amazing Journey 4 — Student's Pack", publisher: "RICHMOND", isbn: "9788466826976", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 9, exclusiveAtSchool: false },
    { title: "Amazing Journey 4 — Activity Pack", publisher: "RICHMOND", isbn: "9788466827249", category: "INGLÉS", priceCents: P.ingleActivityPack, stock: 7, exclusiveAtSchool: false },
    { title: "Licencia Digital de Inglés", publisher: "MILTON", isbn: null, category: "INGLÉS", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Sésame Ouvre-Toi! — Méthode de Français", publisher: "HACHETTE / SANTILLANA", isbn: "9788490497364", category: "FRANCÉS", priceCents: P.frances, stock: 6, exclusiveAtSchool: false },
    { title: "Sésame Ouvre-Toi! — Cahier d'activités", publisher: "HACHETTE / SANTILLANA", isbn: "9788490497371", category: "FRANCÉS", priceCents: P.cuadernillo, stock: 6, exclusiveAtSchool: false },
    { title: "4 Primaria Arts & Craft WM ED23", publisher: "SANTILLANA", isbn: "9788414408292", category: "ARTS & CRAFTS", priceCents: P.arts, stock: 9, exclusiveAtSchool: false },
    { title: "4º Pri Music in Tune Activity Book ED23", publisher: "SANTILLANA", isbn: "9788468061207", category: "MÚSICA", priceCents: P.musica, stock: 8, exclusiveAtSchool: false },
    { title: "Libertad no tiene miedo", publisher: "CELAENO BOOKS", isbn: null, category: "EDUCACIÓN EMOCIONAL", priceCents: P.emocional, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
  ],

  // ===========================================================================
  // 5º PRIMARIA
  // ===========================================================================
  "5-primaria": [
    { title: "Lengua Castellana M. Lig CM Canarias ED 22 5º Primaria", publisher: "SANTILLANA", isbn: "9788414122365", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.textoPrincipal, stock: 10, exclusiveAtSchool: false },
    { title: "Bichos raros", publisher: "LOQUELEO", isbn: "9788491221968", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 8, exclusiveAtSchool: false },
    { title: "Querido hijo: estamos en huelga", publisher: "LOQUELEO", isbn: "9788491221050", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 7, exclusiveAtSchool: false },
    { title: "Secretos que hielan", publisher: "ANAYA", isbn: "9788469885635", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 7, exclusiveAtSchool: false },
    { title: "Petits pas vers le DELF", publisher: "LE LIVRE OUVERT", isbn: "9786185681210", category: "FRANCÉS", priceCents: P.frances, stock: 5, exclusiveAtSchool: false },
    { title: "Ma première grammaire", publisher: "CLE INTERNATIONAL", isbn: "9782090351651", category: "FRANCÉS", priceCents: P.frances, stock: 6, exclusiveAtSchool: false, notes: "También se usará en 6º Primaria en 2026-2027" },
    { title: "5 Primaria Arts & Craft WM E22", publisher: "SANTILLANA", isbn: "9788468072166", category: "ARTS & CRAFTS", priceCents: P.arts, stock: 8, exclusiveAtSchool: false },
    { title: "Matemáticas — Licencia Digital", publisher: "SANTILLANA", isbn: null, category: "MATEMÁTICAS", priceCents: P.matLicencia, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Conocimiento del Medio — Licencia Digital", publisher: "SANTILLANA", isbn: null, category: "CONOCIMIENTO DEL MEDIO", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Amazing Journey 5 — Student's Pack", publisher: "RICHMOND", isbn: "9788466826808", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 8, exclusiveAtSchool: false },
    { title: "Amazing Journey 5 — Activity Pack", publisher: "RICHMOND", isbn: "9788466828284", category: "INGLÉS", priceCents: P.ingleActivityPack, stock: 7, exclusiveAtSchool: false },
    { title: "Charlotte's Web — E. B. White", publisher: "PENGUIN BOOKS", isbn: "9780141368832", category: "INGLÉS", priceCents: P.lecturaIngles, stock: 9, exclusiveAtSchool: false },
  ],

  // ===========================================================================
  // 6º PRIMARIA
  // ===========================================================================
  "6-primaria": [
    { title: "J'aime 1 — Méthode de Français", publisher: "ANAYA", isbn: "9788414316979", category: "FRANCÉS", priceCents: P.frances, stock: 6, exclusiveAtSchool: false },
    { title: "J'aime 1 — Cahier d'exercice", publisher: "ANAYA", isbn: "9782090357493", category: "FRANCÉS", priceCents: P.cuadernillo, stock: 6, exclusiveAtSchool: false },
    { title: "Lengua Castellana — Licencia Digital · Libro Net", publisher: "SANTILLANA", isbn: null, category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "La canción de Amina", publisher: "SM", isbn: "9788467591576", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 8, exclusiveAtSchool: false },
    { title: "Sopa de Europa", publisher: "LOQUELEO", isbn: "9788491221104", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 7, exclusiveAtSchool: false },
    { title: "Familia a la fuga. En busca y captura", publisher: "LOQUELEO", isbn: "9788491223726", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 7, exclusiveAtSchool: false },
    { title: "Matemáticas — Licencia Digital (Libro Media)", publisher: "SANTILLANA", isbn: null, category: "MATEMÁTICAS", priceCents: P.matLicencia, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Conocimiento del Medio — Licencia Digital (Libro Media)", publisher: "SANTILLANA", isbn: null, category: "CONOCIMIENTO DEL MEDIO", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "See You in the Cosmos", publisher: "PENGUIN", isbn: "9780399186387", category: "INGLÉS", priceCents: P.lecturaIngles, stock: 8, exclusiveAtSchool: false },
    { title: "Amazing Journey 6 — Student's Pack", publisher: "RICHMOND", isbn: "9788466826860", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 8, exclusiveAtSchool: false },
    { title: "Amazing Journey 6 — Activity Pack", publisher: "RICHMOND", isbn: "9788466826662", category: "INGLÉS", priceCents: P.ingleActivityPack, stock: 7, exclusiveAtSchool: false },
  ],

  // ===========================================================================
  // 1º ESO
  // ===========================================================================
  "1-eso": [
    { title: "Lengua Castellana — Licencia Digital · Libro Net", publisher: "SANTILLANA", isbn: null, category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "El Reino de las Tres Lunas", publisher: "LOQUELEO", isbn: "9788491221203", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 8, exclusiveAtSchool: false },
    { title: "Nadie es perfecto", publisher: "LOQUELEO", isbn: "9788491225164", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 7, exclusiveAtSchool: false },
    { title: "Matemáticas — Licencia Digital (Libro Media)", publisher: "SANTILLANA", isbn: null, category: "MATEMÁTICAS", priceCents: P.matLicencia, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Geografía e Historia — Licencia Digital (Edubook)", publisher: "VICENS VIVES", isbn: null, category: "GEOGRAFÍA E HISTORIA", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Biología y Geología — Licencia Digital", publisher: "CASALS", isbn: null, category: "BIOLOGÍA Y GEOLOGÍA", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Silhouette 2 — Livre de l'élève", publisher: "OXFORD", isbn: "9780190540326", category: "FRANCÉS", priceCents: P.frances, stock: 7, exclusiveAtSchool: false },
    { title: "Silhouette 2 — Cahier d'exercices", publisher: "OXFORD", isbn: "9780190540401", category: "FRANCÉS", priceCents: P.cuadernillo, stock: 7, exclusiveAtSchool: false },
    { title: "Gold Experience 2nd B1 — Student's Book & Interactive eBook", publisher: "PEARSON", isbn: "9781292392806", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 8, exclusiveAtSchool: false },
    { title: "Gold Experience 2nd B1 — Workbook", publisher: "PEARSON", isbn: "9781292194646", category: "INGLÉS", priceCents: P.ingleActivityPack, stock: 7, exclusiveAtSchool: false },
    { title: "Wonder — R. J. Palacio", publisher: "TRANSWORLD PUBLISHERS", isbn: "9780552565974", category: "INGLÉS", priceCents: P.lecturaIngles, stock: 9, exclusiveAtSchool: false },
  ],

  // ===========================================================================
  // 2º ESO
  // ===========================================================================
  "2-eso": [
    { title: "Física y Química — Licencia Digital", publisher: "SM-REVUELA", isbn: null, category: "FÍSICA Y QUÍMICA", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Silhouette 3 — Livre de l'élève", publisher: "OXFORD", isbn: "9780190540333", category: "FRANCÉS", priceCents: P.frances, stock: 6, exclusiveAtSchool: false },
    { title: "Silhouette 3 — Cahier d'exercices", publisher: "OXFORD", isbn: "9780190540418", category: "FRANCÉS", priceCents: P.cuadernillo, stock: 6, exclusiveAtSchool: false },
    { title: "Gold Experience 2nd B1+ — Student's Book & Interactive eBook", publisher: "PEARSON", isbn: "9781292392820", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 8, exclusiveAtSchool: false },
    { title: "Gold Experience 2nd B1+ — Workbook", publisher: "PEARSON", isbn: "9781292194776", category: "INGLÉS", priceCents: P.ingleActivityPack, stock: 7, exclusiveAtSchool: false },
    { title: "The Boy at the Back of the Class", publisher: "PENGUIN", isbn: "9781510105010", category: "INGLÉS", priceCents: P.lecturaIngles, stock: 8, exclusiveAtSchool: false },
    { title: "Matemáticas — Licencia Digital (Libro Media)", publisher: "SANTILLANA", isbn: null, category: "MATEMÁTICAS", priceCents: P.matLicencia, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Lengua Castellana y Literatura — Operación Mundo", publisher: "ANAYA", isbn: "9788414324394", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.textoPrincipal, stock: 9, exclusiveAtSchool: false },
    { title: "Lectia 2. Competencia lectora", publisher: "VICENS VIVES", isbn: "9788411936576", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.cuadernillo, stock: 8, exclusiveAtSchool: false },
    { title: "Tierra, gofio, sal", publisher: "ANAYA", isbn: "9788414340097", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 7, exclusiveAtSchool: false },
    { title: "Campanarios y primaveras", publisher: "DIEGO PUN", isbn: "9788412281248", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 6, exclusiveAtSchool: false },
    { title: "Geografía e Historia — Licencia Digital", publisher: "ANAYA", isbn: null, category: "GEOGRAFÍA E HISTORIA", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Viaje por los mitos del mundo", publisher: "LA GALERA", isbn: "9788424674557", category: "GEOGRAFÍA E HISTORIA", priceCents: P.lectura, stock: 7, exclusiveAtSchool: false },
    { title: "Historia del Arte en cómic. La Edad Media", publisher: "DESPERTA FERRO", isbn: "9788412079838", category: "GEOGRAFÍA E HISTORIA", priceCents: 2500, stock: 6, exclusiveAtSchool: false },
  ],

  // ===========================================================================
  // 3º ESO
  // ===========================================================================
  "3-eso": [
    { title: "Física y Química — Licencia Digital", publisher: "SM", isbn: null, category: "FÍSICA Y QUÍMICA", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Aprende Nomenclatura y Formulación", publisher: "BRUÑO", isbn: "9788469617038", category: "FÍSICA Y QUÍMICA", priceCents: 1450, stock: 9, exclusiveAtSchool: false },
    { title: "Partage A2-B1", publisher: "SANTILLANA", isbn: "9788490498231", category: "FRANCÉS", priceCents: P.frances, stock: 6, exclusiveAtSchool: false },
    { title: "Matemáticas — Licencia Digital", publisher: "SANTILLANA", isbn: null, category: "MATEMÁTICAS", priceCents: P.matLicencia, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Geografía e Historia — Licencia Digital", publisher: "VICENS VIVES", isbn: null, category: "GEOGRAFÍA E HISTORIA", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Gold Experience 2nd B2 — Student's Book & Interactive eBook", publisher: "PEARSON", isbn: "9781292392844", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 8, exclusiveAtSchool: false },
    { title: "Gold Experience 2nd — Workbook", publisher: "PEARSON", isbn: "9781292194905", category: "INGLÉS", priceCents: P.ingleActivityPack, stock: 7, exclusiveAtSchool: false },
    { title: "The Curious Incident of the Dog in the Nighttime — Mark Haddon", publisher: "RANDOM HOUSE UK LTD", isbn: "9780099470434", category: "INGLÉS", priceCents: P.lecturaIngles, stock: 7, exclusiveAtSchool: false },
    { title: "Lectia 3. Competencia lectora", publisher: "VICENS VIVES", isbn: "9788411936583", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.cuadernillo, stock: 8, exclusiveAtSchool: false },
    { title: "La Isla Alzada", publisher: "LE CANARIEN EDICIONES", isbn: "9788418603297", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: P.lectura, stock: 6, exclusiveAtSchool: false },
    { title: "Libro de Tutoría y Orientación", publisher: "HENKO / ANAYA", isbn: null, category: "TUTORÍA Y ORIENTACIÓN", priceCents: P.tutoria, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio. Válido también para 4º ESO el próximo curso 2026-2027" },
  ],

  // ===========================================================================
  // 4º ESO
  // ===========================================================================
  "4-eso": [
    { title: "Matemáticas — Licencia Digital", publisher: "SANTILLANA", isbn: null, category: "MATEMÁTICAS", priceCents: P.matLicencia, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Física y Química — Licencia Digital", publisher: "SM", isbn: null, category: "FÍSICA Y QUÍMICA", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "Aprende Nomenclatura y Formulación", publisher: "BRUÑO", isbn: "9788469617038", category: "FÍSICA Y QUÍMICA", priceCents: 1450, stock: 9, exclusiveAtSchool: false, notes: "Mismo libro que en 3º ESO 2024-2025" },
    { title: "J'aime 4 — Livre de l'élève", publisher: "ANAYA", isbn: "9788414335741", category: "FRANCÉS", priceCents: P.frances, stock: 5, exclusiveAtSchool: false },
    { title: "J'aime 4 — Cahier d'activités", publisher: "ANAYA", isbn: "9788414335758", category: "FRANCÉS", priceCents: P.cuadernillo, stock: 5, exclusiveAtSchool: false },
    { title: "Gold Experience 2nd B2+ — Student's Book & Interactive eBook", publisher: "PEARSON", isbn: "9781292392868", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 8, exclusiveAtSchool: false },
    { title: "Gold Experience 2nd B2+ — Workbook", publisher: "PEARSON", isbn: "9781292195032", category: "INGLÉS", priceCents: P.ingleActivityPack, stock: 7, exclusiveAtSchool: false },
    { title: "One of Us Is Lying — Karen M. McManus", publisher: "PENGUIN UK", isbn: "9780141375632", category: "INGLÉS", priceCents: P.lecturaIngles, stock: 8, exclusiveAtSchool: false },
    { title: "Geografía e Historia — Licencia Digital", publisher: "ANAYA", isbn: null, category: "GEOGRAFÍA E HISTORIA", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Venta exclusiva en el colegio a partir de septiembre" },
    { title: "La Guillotina", publisher: "SM", isbn: "9788467593464", category: "GEOGRAFÍA E HISTORIA", priceCents: P.lectura, stock: 7, exclusiveAtSchool: false },
  ],

  // ===========================================================================
  // BACHILLERATO — Catálogo orientativo (a confirmar con secretaría desde el panel admin)
  // ===========================================================================
  "1-bachillerato-ciencias": [
    { title: "Matemáticas I — Operación Mundo", publisher: "ANAYA", isbn: "9788414323250", category: "MATEMÁTICAS", priceCents: 4200, stock: 6, exclusiveAtSchool: false },
    { title: "Física y Química 1º Bach", publisher: "SANTILLANA", isbn: null, category: "FÍSICA Y QUÍMICA", priceCents: P.licenciaDigital, stock: 0, exclusiveAtSchool: true, notes: "Licencia digital — confirmar con secretaría" },
    { title: "Biología, Geología y Ciencias Ambientales 1º Bach", publisher: "SANTILLANA", isbn: "9788414325568", category: "BIOLOGÍA Y GEOLOGÍA", priceCents: 4100, stock: 5, exclusiveAtSchool: false },
    { title: "Dibujo Técnico I", publisher: "EDITEX", isbn: "9788491619437", category: "DIBUJO TÉCNICO", priceCents: 3800, stock: 5, exclusiveAtSchool: false },
    { title: "Gold Experience C1 — Student's Book", publisher: "PEARSON", isbn: "9781292239811", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 7, exclusiveAtSchool: false },
    { title: "Gold Experience C1 — Workbook", publisher: "PEARSON", isbn: "9781292239873", category: "INGLÉS", priceCents: P.ingleActivityPack, stock: 6, exclusiveAtSchool: false },
    { title: "Lengua Castellana y Literatura 1º Bach — Operación Mundo", publisher: "ANAYA", isbn: "9788414324820", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: 4000, stock: 7, exclusiveAtSchool: false },
    { title: "Filosofía 1º Bach", publisher: "SM", isbn: "9788491829935", category: "FILOSOFÍA", priceCents: 3500, stock: 6, exclusiveAtSchool: false },
  ],
  "2-bachillerato-ciencias": [
    { title: "Matemáticas II — Operación Mundo", publisher: "ANAYA", isbn: "9788414330616", category: "MATEMÁTICAS", priceCents: 4300, stock: 6, exclusiveAtSchool: false },
    { title: "Física 2º Bach", publisher: "SANTILLANA", isbn: "9788414111390", category: "FÍSICA Y QUÍMICA", priceCents: 4200, stock: 5, exclusiveAtSchool: false },
    { title: "Química 2º Bach", publisher: "SANTILLANA", isbn: "9788414111383", category: "FÍSICA Y QUÍMICA", priceCents: 4200, stock: 5, exclusiveAtSchool: false },
    { title: "Biología 2º Bach", publisher: "SANTILLANA", isbn: "9788414111376", category: "BIOLOGÍA Y GEOLOGÍA", priceCents: 4200, stock: 5, exclusiveAtSchool: false },
    { title: "Dibujo Técnico II", publisher: "EDITEX", isbn: "9788491619468", category: "DIBUJO TÉCNICO", priceCents: 3900, stock: 4, exclusiveAtSchool: false },
    { title: "Gold Experience C1+ — Student's Book", publisher: "PEARSON", isbn: "9781292239828", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 6, exclusiveAtSchool: false },
    { title: "Gold Experience C1+ — Workbook", publisher: "PEARSON", isbn: "9781292239880", category: "INGLÉS", priceCents: P.ingleActivityPack, stock: 6, exclusiveAtSchool: false },
    { title: "Historia de España 2º Bach", publisher: "VICENS VIVES", isbn: "9788468297453", category: "GEOGRAFÍA E HISTORIA", priceCents: 4000, stock: 7, exclusiveAtSchool: false },
    { title: "Historia de la Filosofía", publisher: "SM", isbn: "9788491829942", category: "FILOSOFÍA", priceCents: 3600, stock: 6, exclusiveAtSchool: false },
  ],
  "1-bachillerato-humanidades": [
    { title: "Lengua Castellana y Literatura 1º Bach — Operación Mundo", publisher: "ANAYA", isbn: "9788414324820", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: 4000, stock: 7, exclusiveAtSchool: false },
    { title: "Historia del Mundo Contemporáneo", publisher: "VICENS VIVES", isbn: "9788468284217", category: "GEOGRAFÍA E HISTORIA", priceCents: 4000, stock: 6, exclusiveAtSchool: false },
    { title: "Latín I", publisher: "EDITEX", isbn: "9788491619413", category: "LATÍN", priceCents: 3700, stock: 4, exclusiveAtSchool: false },
    { title: "Economía 1º Bach", publisher: "SM", isbn: "9788491829959", category: "ECONOMÍA", priceCents: 3600, stock: 5, exclusiveAtSchool: false },
    { title: "Matemáticas Aplicadas a las CCSS I", publisher: "ANAYA", isbn: "9788414323274", category: "MATEMÁTICAS", priceCents: 4100, stock: 6, exclusiveAtSchool: false },
    { title: "Gold Experience C1 — Student's Book", publisher: "PEARSON", isbn: "9781292239811", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 7, exclusiveAtSchool: false },
    { title: "Gold Experience C1 — Workbook", publisher: "PEARSON", isbn: "9781292239873", category: "INGLÉS", priceCents: P.ingleActivityPack, stock: 6, exclusiveAtSchool: false },
    { title: "Filosofía 1º Bach", publisher: "SM", isbn: "9788491829935", category: "FILOSOFÍA", priceCents: 3500, stock: 6, exclusiveAtSchool: false },
  ],
  "2-bachillerato-humanidades": [
    { title: "Lengua Castellana y Literatura 2º Bach", publisher: "ANAYA", isbn: "9788414330555", category: "LENGUA CASTELLANA Y LITERATURA", priceCents: 4100, stock: 7, exclusiveAtSchool: false },
    { title: "Historia de España 2º Bach", publisher: "VICENS VIVES", isbn: "9788468297453", category: "GEOGRAFÍA E HISTORIA", priceCents: 4000, stock: 7, exclusiveAtSchool: false },
    { title: "Latín II", publisher: "EDITEX", isbn: "9788491619444", category: "LATÍN", priceCents: 3800, stock: 4, exclusiveAtSchool: false },
    { title: "Economía de la Empresa 2º Bach", publisher: "SM", isbn: "9788491829966", category: "ECONOMÍA", priceCents: 3700, stock: 5, exclusiveAtSchool: false },
    { title: "Matemáticas Aplicadas a las CCSS II", publisher: "ANAYA", isbn: "9788414330623", category: "MATEMÁTICAS", priceCents: 4200, stock: 6, exclusiveAtSchool: false },
    { title: "Gold Experience C1+ — Student's Book", publisher: "PEARSON", isbn: "9781292239828", category: "INGLÉS", priceCents: P.ingleStudentsPack, stock: 6, exclusiveAtSchool: false },
    { title: "Gold Experience C1+ — Workbook", publisher: "PEARSON", isbn: "9781292239880", category: "INGLÉS", priceCents: P.ingleActivityPack, stock: 6, exclusiveAtSchool: false },
    { title: "Historia de la Filosofía", publisher: "SM", isbn: "9788491829942", category: "FILOSOFÍA", priceCents: 3600, stock: 6, exclusiveAtSchool: false },
  ],
};

/**
 * URL de portada de un libro.
 *
 * Estrategia en cascada:
 *   1) Mapeo directo por ISBN (preciso, evita ambigüedad entre libros
 *      con títulos parecidos como los tres cuadernos 1.1/1.2/1.3).
 *   2) Mapeo por título (para series sin ISBN únicos: Ludiletras, etc.)
 *   3) Fallback a OpenLibrary por ISBN.
 *   4) Si todo falla → null y la tarjeta usa placeholder con icono.
 */
const localBookByIsbn: Record<string, string> = {
  // 1º Primaria — Lengua
  "9788468071596": "/books/lengua.png",            // Lengua Paso Cuaderno CM ED22
  "9788468071282": "/books/lengua_cuaderno.jpg",   // 1.1 Cuaderno Lengua Lecto
  "9788468071206": "/books/lengua_cuaderno.jpg",   // 1.2 Cuaderno Lengua Lecto
  "9788468067933": "/books/primeras_lecturas.jpg", // 1.3 Lecturas 1x8 ED22
  // 1º Primaria — Matemáticas, Conocimiento del Medio
  "9788419718075": "/books/pack_juegos.png",       // Pack EMAT + Juegos Lemon
  "9788414122341": "/books/cono.png",              // Conocimiento del Medio 1º
  // 1º Primaria — Inglés
  "9788466826228": "/books/student_book.png",      // Amazing Journey 1 Student's Pack
  "9788466825801": "/books/ingles.png",            // Amazing Journey 1 Activity Pack
};

export function bookCoverUrl(
  isbn: string | null | undefined,
  title?: string,
): string | null {
  if (isbn && localBookByIsbn[isbn]) return localBookByIsbn[isbn];

  const t = (title ?? "").toLowerCase();
  if (t.includes("ludiletras")) return "/books/ludiletras.png";
  if (t.includes("alrededor del mundo")) return "/books/alrededordelmundo.jpg";
  if (t.includes("emergencia") && t.includes("112")) return "/books/emergencia.png";

  return cover(isbn ?? null);
}
