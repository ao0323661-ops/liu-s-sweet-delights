import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { formatBRL, type Product } from "@/lib/shop";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const hasSizes = !!product.sizes?.length;
  const selectedSize = hasSizes ? product.sizes![sizeIdx] : undefined;
  const unitPrice = selectedSize?.price ?? product.price;
  const sizeLabel = selectedSize?.label;

  function handleAdd() {
    add({
      productId: product.id,
      name: product.name,
      sizeLabel,
      unitPrice,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
      <h3 className="font-serif text-3xl leading-tight text-foreground">{product.name}</h3>
      {product.description && (
        <p className="mt-2 text-lg leading-relaxed text-muted-foreground">{product.description}</p>
      )}

      {hasSizes && (
        <div className="mt-4">
          <p className="mb-2 text-base font-semibold text-foreground">Tamanho</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes!.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setSizeIdx(i)}
                aria-pressed={i === sizeIdx}
                className={`min-h-12 rounded-lg border px-4 py-2 text-lg font-medium transition ${
                  i === sizeIdx
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto pt-6">
        <p className="text-base font-medium text-muted-foreground">
          {hasSizes ? "Preço do tamanho escolhido" : "Preço"}
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <span className="font-serif text-4xl text-primary">{formatBRL(unitPrice)}</span>
          <div className="flex items-center rounded-lg border border-border bg-background p-1">
            <button
              type="button"
              onClick={() => setQty((value) => Math.max(1, value - 1))}
              className="grid h-11 w-11 place-items-center rounded-md text-foreground transition hover:bg-secondary"
              aria-label={`Diminuir quantidade de ${product.name}`}
            >
              <Minus className="h-5 w-5" />
            </button>
            <span
              className="w-10 text-center text-xl font-semibold"
              aria-label={`${qty} unidade${qty > 1 ? "s" : ""}`}
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((value) => value + 1)}
              className="grid h-11 w-11 place-items-center rounded-md text-foreground transition hover:bg-secondary"
              aria-label={`Aumentar quantidade de ${product.name}`}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-5 inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-4 text-xl font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 active:scale-[0.99]"
        aria-live="polite"
      >
        {added ? (
          <>
            <Check className="h-5 w-5" /> Adicionado
          </>
        ) : (
          <>
            <Plus className="h-5 w-5" /> Adicionar ao pedido
          </>
        )}
      </button>
    </article>
  );
}
