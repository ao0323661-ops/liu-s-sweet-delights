import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { SHOP } from "@/lib/shop";

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary font-serif text-2xl text-primary-foreground"
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

        <nav className="flex shrink-0 items-center gap-2" aria-label="Principal">
          <Link
            to="/cardapio"
            className="hidden min-h-12 items-center rounded-lg border border-border bg-card px-4 py-2 text-base font-semibold text-foreground shadow-sm transition hover:border-primary hover:text-primary sm:inline-flex"
          >
            Cardápio
          </Link>
          <Link
            to="/carrinho"
            className="relative inline-flex min-h-12 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-base font-semibold text-foreground shadow-sm transition hover:border-primary hover:text-primary"
            aria-label={`Carrinho com ${count} ${count === 1 ? "item" : "itens"}`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden sm:inline">Pedido</span>
            <span className="grid h-8 min-w-8 place-items-center rounded-md bg-primary px-2 text-base font-bold text-primary-foreground">
              {count}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
