import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Shirt } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookCard } from "@/components/book-card";
import { Badge } from "@/components/ui/badge";
import { ReservationDialog } from "@/components/reservation-dialog";
import { levelLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CursoPage({ params }: { params: { slug: string } }) {
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      books: {
        include: { category: true },
        orderBy: [{ category: { order: "asc" } }, { title: "asc" }],
      },
    },
  });

  if (!course) notFound();

  // Agrupar libros por categoría
  const byCategory = course.books.reduce<Record<string, typeof course.books>>(
    (acc, b) => {
      (acc[b.category.name] ||= []).push(b);
      return acc;
    },
    {},
  );

  const orderedCategories = [...new Set(course.books.map((b) => b.category.name))];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border/40">
          <div className="container-tight pt-10 pb-12">
            <Link
              href="/#cursos"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a la lista de cursos
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Badge variant="muted">{levelLabel(course.level)}</Badge>
              {course.displayAge && <Badge variant="accent">{course.displayAge}</Badge>}
            </div>

            <h1 className="heading-display text-4xl md:text-5xl text-primary mb-3">
              {course.fullName}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Lista oficial de libros del curso 2025–2026.
              {" "}Los libros marcados como <em>venta exclusiva en el colegio</em> se reciben
              en secretaría a partir de septiembre.
            </p>
          </div>
        </section>

        {/* Libros agrupados por categoría */}
        <section className="container-tight py-12">
          {orderedCategories.length === 0 ? (
            <div className="card-elevated p-10 text-center">
              <p className="text-muted-foreground">
                Aún no hay libros disponibles para este curso.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {orderedCategories.map((catName) => {
                const list = byCategory[catName];
                return (
                  <div key={catName}>
                    <div className="flex items-center gap-3 mb-5">
                      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        {catName}
                      </h2>
                      <span className="text-xs text-muted-foreground">{list.length} {list.length === 1 ? "libro" : "libros"}</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {list.map((b) => (
                        <BookCard
                          key={b.id}
                          book={{
                            id: b.id,
                            title: b.title,
                            publisher: b.publisher,
                            isbn: b.isbn,
                            priceCents: b.priceCents,
                            stock: b.stock,
                            exclusiveAtSchool: b.exclusiveAtSchool,
                            coverUrl: b.coverUrl,
                            category: b.category.name,
                            notes: b.notes,
                            courseSlug: course.slug,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ¿No encuentras un libro? */}
          <div className="mt-16 card-elevated p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary/30">
            <div>
              <h3 className="font-semibold text-lg">¿No encuentras un libro?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Si necesitas un libro que no aparece en la lista, dínoslo y lo gestionamos.
              </p>
            </div>
            <ReservationDialog
              target={{
                kind: "BOOK",
                productName: "Libro no listado",
                productDetail: course.shortName,
              }}
              triggerLabel="Solicitar libro"
              variant="default"
            />
          </div>
        </section>

        {/* CTA uniforme */}
        <section className="border-t border-border/40 bg-primary text-primary-foreground">
          <div className="container-tight py-16 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-accent/90 mb-3">
                ¿Y el uniforme?
              </div>
              <h2 className="heading-display text-3xl md:text-4xl mb-3">
                Encuentra todas las prendas del colegio
              </h2>
              <p className="text-primary-foreground/80 max-w-md">
                Chándal, vestir, calzado, abrigo. Todas las tallas con disponibilidad en
                tiempo real y reserva si está agotada.
              </p>
            </div>
            <div className="md:justify-self-end">
              <Link
                href="/uniforme"
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-7 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors shadow-sm"
              >
                <Shirt className="h-5 w-5" />
                Ver uniforme completo
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
