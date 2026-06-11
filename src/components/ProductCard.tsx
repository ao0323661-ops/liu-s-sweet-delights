import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { formatBRL, type Product } from "@/lib/shop";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [sizeIdx, setSizeIdx] = useState(0);
  const [added, setAdded] = useState(false);

  const hasSizes = !!product.sizes?.length;
  const unitPrice = hasSizes ? product.sizes![sizeIdx].price : product.price;
  const sizeLabel = hasSizes ? product.sizes![sizeIdx].label : undefined;

  function handleAdd() {
    add({
      productId: product.id,
      name: product.name,
      sizeLabel,
      unitPrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
      <h3 className="font-serif text-2xl leading-tight text-foreground">
        {product.name}
      </h3>
      {product.description && (
        <p className="mt-1 text-base text-muted-foreground">
          {product.description}
        </p>
      )}

      {hasSizes && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Tamanho
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes!.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setSizeIdx(i)}
                className={`rounded-full border px-4 py-2 text-base transition ${
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

      <div className="mt-6 flex items-end justify-between gap-3">
        <span className="font-serif text-3xl text-primary">
          {formatBRL(unitPrice)}
        </span>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-lg font-medium text-primary-foreground shadow-sm transition hover:brightness-110 active:scale-[0.99]"
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
