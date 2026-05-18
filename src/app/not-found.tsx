import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 container-tight py-24 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-accent-foreground/70 mb-3">
          Error 404
        </div>
        <h1 className="heading-display text-5xl text-primary mb-4">
          Esta página no existe
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          El enlace que has seguido puede estar roto o el contenido haberse movido.
        </p>
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Volver al inicio
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
