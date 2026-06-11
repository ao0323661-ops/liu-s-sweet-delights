import { SHOP } from "@/lib/shop";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/70 bg-secondary/60">
      <div className="mx-auto max-w-6xl px-5 py-10 text-center">
        <p className="font-serif text-2xl text-foreground">{SHOP.name}</p>
        <p className="mt-2 text-base text-muted-foreground">
          {SHOP.deliveryArea}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Pedidos pelo WhatsApp • Pagamento enviado após a confirmação
        </p>
      </div>
    </footer>
  );
}
