import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Heart, MapPin, ShoppingBag, Truck } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { DELIVERY_ZONES, SHOP, formatBRL } from "@/lib/shop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tortas e Doces da Liu — Confeitaria artesanal em Salvador" },
      {
        name: "description",
        content:
          "Tortas, quiches, bolos e doces feitos à mão. Peça pelo WhatsApp com retirada ou entrega da Barra ao Rio Vermelho.",
      },
      { property: "og:title", content: "Tortas e Doces da Liu" },
      {
        property: "og:description",
        content: "Confeitaria artesanal: tortas, quiches, bolos e doces feitos com carinho.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <img
          src={heroImg}
          alt=""
          width={1536}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-foreground/70" />

        <div className="relative mx-auto max-w-6xl px-5 py-12 sm:py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-lg bg-background/95 px-4 py-2 text-base font-semibold text-primary shadow-sm">
              <Heart className="h-5 w-5" />
              Feito artesanalmente em Salvador
            </p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
              Tortas e doces da Liu
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-primary-foreground/95 sm:text-2xl">
              Escolha no cardápio, revise o carrinho e envie o pedido pronto pelo WhatsApp. Sem
              login, sem cadastro.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/cardapio"
                className="inline-flex min-h-16 items-center justify-center gap-3 rounded-lg bg-primary px-8 py-5 text-xl font-semibold text-primary-foreground shadow-lg transition hover:brightness-110 active:scale-[0.99]"
              >
                Ver cardápio <ArrowRight className="h-6 w-6" />
              </Link>
              <a
                href={`https://wa.me/${SHOP.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-16 items-center justify-center gap-3 rounded-lg border-2 border-background bg-background px-8 py-5 text-xl font-semibold text-primary transition hover:bg-secondary"
              >
                Falar no WhatsApp
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-lg text-primary-foreground/95">
              <span className="inline-flex items-center gap-2 rounded-lg bg-background/15 px-4 py-2 backdrop-blur">
                <ShoppingBag className="h-5 w-5" />
                Pedido simples
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg bg-background/15 px-4 py-2 backdrop-blur">
                <Truck className="h-5 w-5" />
                Retirada ou delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-7">
          <h2 className="font-serif text-4xl text-foreground">Como pedir</h2>
          <p className="mt-2 max-w-2xl text-xl leading-relaxed text-muted-foreground">
            O fluxo foi pensado para ser rápido, claro e confortável no celular.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: ShoppingBag,
              title: "Escolha os itens",
              text: "Veja preços grandes, escolha o tamanho e adicione ao pedido.",
            },
            {
              icon: Truck,
              title: "Informe a entrega",
              text: "Retire no local ou valide CEP e bairro para delivery.",
            },
            {
              icon: Clock,
              title: "Envie pelo WhatsApp",
              text: "A Liu recebe uma mensagem organizada com todos os detalhes.",
            },
          ].map((v) => (
            <div key={v.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-accent/45 text-primary">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-3xl">{v.title}</h3>
              <p className="mt-2 text-lg leading-relaxed text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-lg font-semibold text-primary">
              <MapPin className="h-5 w-5" />
              Área atendida
            </p>
            <h2 className="mt-2 font-serif text-4xl text-foreground">
              Delivery da Barra ao Rio Vermelho
            </h2>
            <p className="mt-3 text-xl leading-relaxed text-muted-foreground">
              Também atendemos bairros próximos selecionados. No carrinho, o site valida CEP, bairro
              e calcula a taxa correta antes de liberar o envio.
            </p>
          </div>
          <div className="grid gap-3">
            {DELIVERY_ZONES.map((zone) => (
              <div
                key={zone.id}
                className="rounded-lg border border-border bg-background p-4 text-foreground"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-serif text-3xl">{zone.label}</h3>
                  <span className="rounded-lg bg-primary px-3 py-2 text-lg font-semibold text-primary-foreground">
                    {formatBRL(zone.fee)}
                  </span>
                </div>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {zone.neighborhoods.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-4xl text-foreground sm:text-5xl">Pronto para escolher?</h2>
          <p className="mt-3 text-xl leading-relaxed text-muted-foreground">
            O cardápio completo tem doces, quiches, tortas e bolos artesanais.
          </p>
          <Link
            to="/cardapio"
            className="mt-7 inline-flex min-h-16 items-center justify-center gap-3 rounded-lg bg-primary px-8 py-5 text-xl font-semibold text-primary-foreground shadow-md transition hover:brightness-110"
          >
            Ver cardápio <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
