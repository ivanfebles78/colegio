import Image from "next/image";
import { BookOpen, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "./add-to-cart-button";
import { ReservationDialog } from "./reservation-dialog";
import { formatEuro } from "@/lib/utils";

export interface BookCardData {
  id: string;
  title: string;
  publisher: string;
  isbn: string | null;
  priceCents: number;
  stock: number;
  exclusiveAtSchool: boolean;
  coverUrl: string | null;
  category: string;
  notes?: string | null;
  courseSlug?: string;
}

export function BookCard({ book }: { book: BookCardData }) {
  const outOfStock = book.stock <= 0;

  return (
    <article className="card-elevated overflow-hidden flex flex-col">
      <div className="relative aspect-[3/4] bg-gradient-to-br from-secondary to-muted">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center px-4">
              <BookOpen className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" strokeWidth={1.2} />
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {book.publisher}
              </div>
              <div className="font-serif text-sm leading-tight mt-1 line-clamp-3">
                {book.title}
              </div>
            </div>
          </div>
        )}
        {book.exclusiveAtSchool && (
          <div className="absolute left-3 top-3">
            <Badge variant="accent">Solo en colegio · sept</Badge>
          </div>
        )}
        {outOfStock && !book.exclusiveAtSchool && (
          <div className="absolute right-3 top-3">
            <Badge variant="destructive">Agotado</Badge>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="text-[10px] uppercase tracking-[0.14em] text-accent-foreground/70 mb-1.5">
          {book.category}
        </div>
        <h3 className="font-medium leading-snug text-[15px] line-clamp-2">{book.title}</h3>
        <div className="text-xs text-muted-foreground mt-1">
          {book.publisher}
          {book.isbn ? ` · ISBN ${book.isbn}` : ""}
        </div>

        {book.notes && (
          <div className="mt-2 flex items-start gap-1.5 text-[11px] text-muted-foreground italic">
            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{book.notes}</span>
          </div>
        )}

        <div className="mt-auto pt-4 flex items-end justify-between gap-2">
          <div>
            <div className="text-lg font-semibold text-primary">
              {formatEuro(book.priceCents)}
            </div>
            {!outOfStock && (
              <div className="text-[11px] text-muted-foreground">
                {book.stock} en stock
              </div>
            )}
          </div>

          {outOfStock ? (
            <ReservationDialog
              target={{
                kind: "BOOK",
                refId: book.id,
                productName: book.title,
                productDetail: book.isbn ?? undefined,
              }}
              triggerLabel="Reservar"
            />
          ) : (
            <AddToCartButton
              size="sm"
              line={{
                key: `book-${book.id}`,
                kind: "BOOK",
                refId: book.id,
                name: book.title,
                detail: book.isbn ? `ISBN ${book.isbn}` : book.publisher,
                imageUrl: book.coverUrl ?? undefined,
                unitPriceCents: book.priceCents,
                stockAvailable: book.stock,
                courseSlug: book.courseSlug,
              }}
            />
          )}
        </div>
      </div>
    </article>
  );
}
