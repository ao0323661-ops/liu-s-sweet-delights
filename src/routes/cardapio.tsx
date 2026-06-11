import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { CATEGORIES } from "@/lib/shop";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cardapio")({
  head: () => ({
    meta: [
      { title: "Cardápio — Tortas e Doces da Liu" },
      {
        name: "description",
        content:
          "Cardápio completo: doces, quiches doces e salgados, quiches vegetarianos, tortas em 5 tamanhos e bolos artesanais.",
      },
      { property: "og:title", content: "Cardápio — Tortas e Doces da Liu" },
      {
        property: "og:description",
        content:
          "Doces, quiches, tortas e bolos artesanais. Adicione ao pedido e finalize pelo WhatsApp.",
      },
    ],
  }),
  component: Cardapio,
});

function Cardapio() {
  const [active, setActive] = useState<string>(CATEGORIES[0].id);
  const { count } = useCart();

  function scrollTo(id: string) {
    setActive(id);
    const el = document.getElementById(`cat-${id}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-10">
      <header className="mb-8">
        <h1 className="font-serif text-5xl text-foreground sm:text-6xl">
          Cardápio
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Escolha os seus favoritos e adicione ao pedido.
        </p>
      </header>

      {/* Sticky category nav */}
      <nav className="sticky top-[76px] z-20 -mx-5 mb-8 border-y border-border bg-background/90 px-5 py-3 backdrop-blur">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => scrollTo(c.id)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-base transition ${
                active === c.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </nav>

      <div className="space-y-14">
        {CATEGORIES.map((c) => (
          <section key={c.id} id={`cat-${c.id}`} className="scroll-mt-36">
            <div className="mb-5">
              <h2 className="font-serif text-3xl text-foreground sm:text-4xl">
                {c.title}
              </h2>
              <p className="mt-1 text-base text-muted-foreground">{c.blurb}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {c.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {count > 0 && (
        <Link
          to="/carrinho"
          className="fixed bottom-5 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-3 rounded-full bg-primary px-7 py-4 text-lg font-medium text-primary-foreground shadow-xl transition hover:brightness-110"
        >
          <ShoppingBag className="h-5 w-5" />
          Ver pedido
          <span className="grid h-7 min-w-7 place-items-center rounded-full bg-background px-2 text-sm font-semibold text-primary">
            {count}
          </span>
        </Link>
      )}
    </div>
  );
}
