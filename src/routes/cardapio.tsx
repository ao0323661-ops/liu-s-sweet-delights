import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
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
    <div className="mx-auto max-w-6xl px-5 pb-32 pt-8 sm:pt-10">
      <header className="mb-8">
        <p className="text-lg font-semibold text-primary">Cardápio artesanal</p>
        <h1 className="mt-2 font-serif text-5xl leading-tight text-foreground sm:text-6xl">
          Cardápio
        </h1>
        <p className="mt-3 max-w-3xl text-xl leading-relaxed text-muted-foreground">
          Escolha os seus favoritos, ajuste quantidade e tamanho quando houver. Depois revise tudo
          no carrinho antes de enviar pelo WhatsApp.
        </p>
      </header>

      <nav
        className="sticky top-[76px] z-20 -mx-5 mb-10 border-y border-border bg-background/95 px-5 py-3 backdrop-blur"
        aria-label="Categorias do cardápio"
      >
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => scrollTo(c.id)}
              className={`min-h-12 shrink-0 rounded-lg border px-5 py-2.5 text-lg font-medium transition ${
                active === c.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary"
              }`}
              aria-current={active === c.id ? "true" : undefined}
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
              <h2 className="font-serif text-4xl text-foreground sm:text-5xl">{c.title}</h2>
              <p className="mt-2 text-xl leading-relaxed text-muted-foreground">{c.blurb}</p>
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
          className="fixed bottom-4 left-4 right-4 z-40 inline-flex min-h-16 items-center justify-center gap-3 rounded-lg bg-primary px-6 py-4 text-xl font-semibold text-primary-foreground shadow-xl transition hover:brightness-110 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:px-8"
          aria-label={`Ver carrinho com ${count} ${count === 1 ? "item" : "itens"}`}
        >
          <ShoppingBag className="h-5 w-5" />
          Ver pedido
          <span className="grid h-8 min-w-8 place-items-center rounded-md bg-background px-2 text-base font-bold text-primary">
            {count}
          </span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      )}
    </div>
  );
}
