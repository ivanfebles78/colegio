import Link from "next/link";
import { schoolConfig } from "@/lib/school-config";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/60">
      <div className="container-tight py-12 grid gap-10 md:grid-cols-3 text-sm">
        <div>
          <div className="font-serif text-xl text-primary mb-2">{schoolConfig.name}</div>
          <p className="text-muted-foreground">{schoolConfig.location}</p>
          <p className="text-muted-foreground mt-1">{schoolConfig.pickupAddress}</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-3">
            Tienda
          </div>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-primary">Inicio</Link></li>
            <li><Link href="/#cursos" className="hover:text-primary">Libros por curso</Link></li>
            <li><Link href="/uniforme" className="hover:text-primary">Uniforme</Link></li>
            <li><Link href="/carrito" className="hover:text-primary">Mi cesta</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-3">
            Contacto
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href={`tel:${schoolConfig.phone.replace(/\s/g, "")}`} className="hover:text-primary">{schoolConfig.phone}</a></li>
            <li><a href={`mailto:${schoolConfig.email}`} className="hover:text-primary">{schoolConfig.email}</a></li>
            <li>Curso académico {schoolConfig.academicYear}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-tight py-5 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {schoolConfig.name}. Todos los derechos reservados.</span>
          <span>
            <Link href="/admin/login" className="hover:text-primary">Acceso administrativo</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
