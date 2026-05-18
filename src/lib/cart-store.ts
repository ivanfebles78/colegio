"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLineKind = "BOOK" | "UNIFORM";

export interface CartLine {
  // Identificador único para distinguir books vs variantes de uniforme
  key: string;
  kind: CartLineKind;
  // BOOK: bookId. UNIFORM: variantId.
  refId: string;
  name: string;
  detail?: string;   // ISBN o talla
  imageUrl?: string;
  unitPriceCents: number;
  quantity: number;
  // metadatos para mostrar
  courseSlug?: string;
  stockAvailable: number;
}

interface CartState {
  lines: CartLine[];
  add: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  remove: (key: string) => void;
  setQty: (key: string, quantity: number) => void;
  clear: () => void;
  // selectors helpers
  count: () => number;
  subtotalCents: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (input) =>
        set((state) => {
          const existing = state.lines.find((l) => l.key === input.key);
          if (existing) {
            const newQty = Math.min(
              existing.quantity + (input.quantity ?? 1),
              Math.max(existing.stockAvailable, 1),
            );
            return {
              lines: state.lines.map((l) =>
                l.key === input.key ? { ...l, quantity: newQty } : l,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              { ...input, quantity: input.quantity ?? 1 } as CartLine,
            ],
          };
        }),
      remove: (key) =>
        set((state) => ({ lines: state.lines.filter((l) => l.key !== key) })),
      setQty: (key, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.key === key
              ? {
                  ...l,
                  quantity: Math.max(
                    1,
                    Math.min(quantity, Math.max(l.stockAvailable, 1)),
                  ),
                }
              : l,
          ),
        })),
      clear: () => set({ lines: [] }),
      count: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotalCents: () =>
        get().lines.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0),
    }),
    { name: "britanico-shop-cart" },
  ),
);
