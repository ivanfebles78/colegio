/**
 * Seed para la base de datos del shop del colegio.
 *
 * Crea:
 *   - 20 categorías de libro
 *   - 15 cursos (3 Infantil + 6 Primaria + 4 ESO + 2 itinerarios × 2 Bachillerato)
 *   - ~170 libros (13 cursos con datos reales + 4 Bachillerato orientativos)
 *   - ~22 prendas de uniforme con variantes por talla
 *
 * Uso:
 *   npm run db:seed
 */

import { PrismaClient } from "@prisma/client";
import { courses } from "../src/data/courses";
import { booksByCourseSlug, BOOK_CATEGORIES, bookCoverUrl } from "../src/data/books-britanico";
import { uniformCatalog } from "../src/data/uniform";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Iniciando seed...");

  // ---------------------------------------------------------------------------
  // 0) Limpiar (orden importa por las FKs)
  // ---------------------------------------------------------------------------
  console.log("🧹  Limpiando tablas...");
  await prisma.stockReservation.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.uniformVariant.deleteMany();
  await prisma.uniformItem.deleteMany();
  await prisma.book.deleteMany();
  await prisma.bookCategory.deleteMany();
  await prisma.course.deleteMany();

  // ---------------------------------------------------------------------------
  // 1) Categorías de libro
  // ---------------------------------------------------------------------------
  console.log("📚  Creando categorías de libro...");
  const categoryRecords = await Promise.all(
    BOOK_CATEGORIES.map((name, idx) =>
      prisma.bookCategory.create({ data: { name, order: idx } }),
    ),
  );
  const categoryByName = new Map(categoryRecords.map((c) => [c.name, c]));
  console.log(`   → ${categoryRecords.length} categorías creadas`);

  // ---------------------------------------------------------------------------
  // 2) Cursos
  // ---------------------------------------------------------------------------
  console.log("🎓  Creando cursos...");
  const courseRecords = await Promise.all(
    courses.map((c) =>
      prisma.course.create({
        data: {
          slug: c.slug,
          level: c.level,
          year: c.year,
          branch: c.branch,
          shortName: c.shortName,
          fullName: c.fullName,
          displayAge: c.displayAge,
          order: c.order,
        },
      }),
    ),
  );
  const courseBySlug = new Map(courseRecords.map((c) => [c.slug, c]));
  console.log(`   → ${courseRecords.length} cursos creados`);

  // ---------------------------------------------------------------------------
  // 3) Libros
  // ---------------------------------------------------------------------------
  console.log("📖  Creando libros...");
  let bookCount = 0;
  for (const [slug, books] of Object.entries(booksByCourseSlug)) {
    const course = courseBySlug.get(slug);
    if (!course) {
      console.warn(`   ⚠️  Curso ${slug} no encontrado, saltando ${books.length} libros`);
      continue;
    }
    for (const b of books) {
      const category = categoryByName.get(b.category);
      if (!category) {
        console.warn(`   ⚠️  Categoría "${b.category}" no encontrada para "${b.title}"`);
        continue;
      }
      await prisma.book.create({
        data: {
          title: b.title,
          publisher: b.publisher,
          isbn: b.isbn,
          priceCents: b.priceCents,
          stock: b.stock,
          exclusiveAtSchool: b.exclusiveAtSchool,
          coverUrl: bookCoverUrl(b.isbn, b.title),
          notes: b.notes,
          courseId: course.id,
          categoryId: category.id,
        },
      });
      bookCount++;
    }
  }
  console.log(`   → ${bookCount} libros creados`);

  // ---------------------------------------------------------------------------
  // 4) Uniforme (prenda + variantes por talla)
  // ---------------------------------------------------------------------------
  console.log("👕  Creando catálogo de uniforme...");
  let variantCount = 0;
  for (const item of uniformCatalog) {
    const created = await prisma.uniformItem.create({
      data: {
        name: item.name,
        description: item.description,
        section: item.section,
        gender: item.gender,
        basePriceCents: item.basePriceCents,
        imageUrl: item.imageUrl,
        order: item.order,
      },
    });
    for (const v of item.variants) {
      await prisma.uniformVariant.create({
        data: {
          itemId: created.id,
          size: v.size,
          stock: v.stock,
          priceCents: v.priceCents,
          sku: `${item.slug}--${v.size}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
        },
      });
      variantCount++;
    }
  }
  console.log(`   → ${uniformCatalog.length} prendas, ${variantCount} variantes`);

  console.log("\n✅  Seed completado.\n");
}

main()
  .catch((err) => {
    console.error("❌  Error en seed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
