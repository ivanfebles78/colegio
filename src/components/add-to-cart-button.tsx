"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Check } from "lucide-react";
import { useCart, type CartLine } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  line: Omit<CartLine, "quantity">;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function AddToCartButton({ line, disabled, className, size = "default" }: Props) {
  const add = useCart((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);

  if (disabled) {
    return (
      <Button variant="outline" disabled size={size} className={className}>
        Agotado
      </Button>
    );
  }

  return (
    <Button
      onClick={() => {
        add(line);
        setJustAdded(true);
        toast.success("Añadido a la cesta", {
          description: line.name + (line.detail ? ` · ${line.detail}` : ""),
        });
        setTimeout(() => setJustAdded(false), 1200);
      }}
      size={size}
      className={cn(className)}
    >
      {justAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {justAdded ? "Añadido" : "Añadir a la cesta"}
    </Button>
  );
}
