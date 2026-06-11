import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { SHOP } from "@/lib/shop";

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary font-serif text-xl text-primary-foreground"
          >
            L
          </span>
          <span className="min-w-0">
            <span className="block truncate font-serif text-xl leading-tight text-foreground sm:text-2xl">
              {SHOP.name}
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              Confeitaria artesanal
            </span>
          </span>
        </Link>

        <Link
          to="/carrinho"
          className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-base font-medium text-foreground shadow-sm transition hover:border-primary hover:text-primary"
          aria-label={`Carrinho com ${count} ${count === 1 ? "item" : "itens"}`}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="hidden sm:inline">Pedido</span>
          <span className="grid h-7 min-w-7 place-items-center rounded-full bg-primary px-2 text-sm font-semibold text-primary-foreground">
            {count}
          </span>
        </Link>
      </div>
    </header>
  );
}
