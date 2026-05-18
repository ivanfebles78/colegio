import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Shirt, ShieldCheck, Truck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { schoolConfig } from "@/lib/school-config";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function Home() {
  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { books: true } },
    },
  });

  // Agrupar por nivel para mostrarlos como secciones
  const grouped = courses.reduce<Record<string, typeof courses>>((acc, c) => {
    (acc[c.level] ||= []).push(c);
    return acc;
  }, {});

  const levelLabels: Record<string, string> = {
    INFANTIL: "Educación Infantil",
    PRIMARIA: "Educación Primaria",
    ESO: "Educación Secundaria — ESO",
    BACHILLERATO: "Bachillerato",
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* ============================= HERO ============================= */}
        <section className="relative overflow-hidden">
          <div className="container-tight pt-16 pb-20 md:pt-24 md:pb-28 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <Badge variant="accent" className="mb-5">
                Curso {schoolConfig.academicYear}
              </Badge>
              <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl text-primary leading-[1.05] mb-6">
                Libros y uniforme oficial,<br />
                <span className="text-accent-foreground/80 italic">en un solo sitio.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
                Compra desde casa todo lo que tu hijo o hija necesita para el nuevo curso.
                Lista oficial por curso, tallas reales del uniforme y recogida en el colegio.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="#cursos"
                  className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-7 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Ver libros por curso
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/uniforme"
                  className="inline-flex h-12 items-center gap-2 rounded-lg border border-border bg-card px-7 text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Explorar uniforme
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                <Feature icon={<ShieldCheck className="h-4 w-4" />} label="Lista oficial del colegio" />
                <Feature icon={<Truck className="h-4 w-4" />} label="Recogida en secretaría" />
                <Feature icon={<BookOpen className="h-4 w-4" />} label="Curso 2025–2026" />
              </div>
            </div>

            {/* Hero visual: pila editorial de tarjetas */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative h-[500px]">
                <HeroStack />
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 -bottom-12 h-24 bg-gradient-to-b from-transparent to-background" />
        </section>

        {/* ============================ CURSOS ============================ */}
        <section id="cursos" className="border-t border-border/40 bg-background/60">
          <div className="container-tight py-20">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-accent-foreground/70 mb-3">
                  Catálogo por curso
                </div>
                <h2 className="heading-display text-4xl md:text-5xl text-primary">
                  Elige el curso de tu hijo
                </h2>
                <p className="text-muted-foreground mt-3 max-w-xl">
                  {courses.length} cursos disponibles. Cada uno muestra los libros oficiales,
                  precios y disponibilidad inmediata.
                </p>
              </div>
            </div>

            <div className="space-y-12">
              {(["INFANTIL", "PRIMARIA", "ESO", "BACHILLERATO"] as const).map((level) => {
                const list = grouped[level];
                if (!list?.length) return null;
                return (
                  <div key={level}>
                    <div className="flex items-center gap-3 mb-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        {levelLabels[level]}
                      </h3>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {list.map((c) => (
                        <Link
                          key={c.id}
                          href={`/curso/${c.slug}`}
                          className="group card-elevated p-6 hover:border-primary/40 hover:-translate-y-0.5 transition-all"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-1">
                                {c.displayAge ?? `${c.year}º curso`}
                              </div>
                              <div className="font-medium tracking-tight text-lg leading-snug">
                                {c.shortName}
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                          </div>
                          <div className="mt-5 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {c._count.books} libros
                            </span>
                            <span className="text-primary font-medium">Ver lista</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================== UNIFORME =========================== */}
        <section className="border-t border-border/40">
          <div className="container-tight py-20 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-accent-foreground/70 mb-3">
                Uniforme oficial
              </div>
              <h2 className="heading-display text-4xl md:text-5xl text-primary mb-5">
                Todas las prendas,<br />todas las tallas.
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Pantalón de chándal, camisa de vestir, zapatos colegiales, abrigo de invierno…
                cada prenda con sus tallas reales y disponibilidad en tiempo real. Si una talla
                está agotada, puedes <strong>solicitar reserva</strong> y te avisamos cuando llegue.
              </p>
              <Link
                href="/uniforme"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Ver uniforme completo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <UniformPreview />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-foreground/80">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/15 text-accent-foreground">
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}

function HeroStack() {
  return (
    <>
      {/* Tarjeta libro principal — Lengua de 1º Primaria */}
      <div className="absolute top-0 right-0 w-64 card-elevated p-5 rotate-2 z-30">
        <div className="relative aspect-[3/4] rounded-lg bg-secondary/40 overflow-hidden mb-3">
          <Image
            src="/books/lengua.png"
            alt="Lengua Castellana — 1º Primaria"
            fill
            sizes="256px"
            className="object-contain p-2"
          />
        </div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">SANTILLANA</div>
        <div className="font-serif text-base leading-tight mt-0.5 text-primary">Lengua Castellana</div>
        <div className="text-xs text-muted-foreground">1º Primaria</div>
        <div className="mt-2 text-sm font-semibold text-primary">35,00 €</div>
      </div>
      {/* Tarjeta chándal — conjunto completo */}
      <div className="absolute top-20 left-0 w-56 card-elevated p-5 -rotate-3 z-20">
        <div className="relative aspect-square rounded-lg bg-secondary/40 overflow-hidden mb-3">
          <Image
            src="/uniform/chandal.png"
            alt="Chándal del colegio"
            fill
            sizes="224px"
            className="object-contain p-3"
          />
        </div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Uniforme</div>
        <div className="font-medium text-sm leading-tight">Chándal</div>
        <div className="mt-1 text-sm font-semibold text-primary">58,90 €</div>
      </div>
      {/* Tarjeta inglés — Amazing Journey 1 */}
      <div className="absolute bottom-12 right-10 w-56 card-elevated p-5 rotate-3 z-10">
        <div className="relative aspect-[3/4] rounded-lg bg-secondary/40 overflow-hidden mb-3">
          <Image
            src="/books/student_book.png"
            alt="Amazing Journey 1 — 1º Primaria"
            fill
            sizes="224px"
            className="object-contain p-2"
          />
        </div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">RICHMOND</div>
        <div className="font-serif text-sm leading-tight mt-0.5 text-primary">Amazing Journey 1</div>
        <div className="text-xs text-muted-foreground">1º Primaria · Inglés</div>
        <div className="mt-2 text-sm font-semibold text-primary">45,00 €</div>
      </div>
    </>
  );
}

function UniformPreview() {
  const items = [
    { name: "Chándal", price: "58,90 €", src: "/uniform/chandal.png" },
    { name: "Suéter cuello de pico", price: "34,90 €", src: "/uniform/sueter.png" },
    { name: "Falda de vestir", price: "31,90 €", src: "/uniform/falda.png" },
    { name: "Zapatos colegiales", price: "39,90 €", src: "/uniform/zapato_nino.jpg" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((it, i) => (
        <div
          key={i}
          className="card-elevated p-4 hover:-translate-y-0.5 transition-transform"
        >
          <div className="relative aspect-square rounded-lg bg-secondary/40 overflow-hidden mb-3">
            <Image
              src={it.src}
              alt={it.name}
              fill
              sizes="(max-width: 1024px) 50vw, 220px"
              className="object-contain p-3"
            />
          </div>
          <div className="text-sm font-medium leading-snug">{it.name}</div>
          <div className="text-sm text-primary font-semibold mt-1">{it.price}</div>
        </div>
      ))}
    </div>
  );
}
