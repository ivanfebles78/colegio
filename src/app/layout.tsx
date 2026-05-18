import type { Metadata } from "next";
import "./globals.css";
import { schoolConfig } from "@/lib/school-config";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: `Tienda · ${schoolConfig.shortName}`,
    template: `%s · Tienda ${schoolConfig.shortName}`,
  },
  description: `Compra online de libros y uniforme oficial del ${schoolConfig.name}. Curso ${schoolConfig.academicYear}. Recogida en el colegio.`,
  metadataBase: new URL(`https://${schoolConfig.domain}`),
  openGraph: {
    title: `Tienda · ${schoolConfig.shortName}`,
    description: schoolConfig.tagline,
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="surface-paper min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col">{children}</div>
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            classNames: {
              toast: "rounded-xl border border-border shadow-lg",
            },
          }}
        />
      </body>
    </html>
  );
}
