import { SHOP } from "@/lib/shop";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-secondary/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="font-serif text-3xl text-foreground">{SHOP.name}</p>
          <p className="mt-1 text-lg text-muted-foreground">{SHOP.deliveryArea}</p>
        </div>
        <p className="text-base text-muted-foreground">
          Pedidos pelo WhatsApp. Pagamento após confirmação.
        </p>
      </div>
    </footer>
  );
}
