import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Truck, Clock } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { SHOP } from "@/lib/shop";

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
        content:
          "Confeitaria artesanal: tortas, quiches, bolos e doces feitos com carinho.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="paper-texture mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-12 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12 md:pt-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Feito artesanalmente em Salvador
            </span>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
              Sabor de casa,<br />
              <em className="not-italic text-primary">feito com carinho.</em>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground sm:text-xl">
              Tortas, quiches, bolos e doces preparados todos os dias na cozinha
              da Liu. Peça em poucos passos e receba em casa.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/cardapio"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-5 text-xl font-medium text-primary-foreground shadow-md transition hover:brightness-110 active:scale-[0.99]"
              >
                Ver cardápio <ArrowRight className="h-6 w-6" />
              </Link>
              <a
                href={`https://wa.me/${SHOP.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-background px-8 py-5 text-xl font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-accent/40 blur-2xl" />
            <img
              src={heroImg}
              alt="Variedade de quiches artesanais sobre toalha de linho"
              width={1536}
              height={1024}
              className="aspect-[4/3] w-full rounded-[1.75rem] border border-border object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Heart,
              title: "Receitas de família",
              text: "Massas e recheios preparados à mão, sem pressa.",
            },
            {
              icon: Truck,
              title: "Entrega na sua porta",
              text: `${SHOP.deliveryArea}.`,
            },
            {
              icon: Clock,
              title: "Pedido em 1 minuto",
              text: "Escolha, adicione e finalize pelo WhatsApp.",
            },
          ].map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="grid h-12 w-12 place-items-center rounded-full bg-accent/40 text-primary">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-2xl">{v.title}</h3>
              <p className="mt-1 text-base text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="rounded-3xl bg-primary px-8 py-12 text-center text-primary-foreground shadow-lg">
          <h2 className="font-serif text-4xl sm:text-5xl">
            Pronto para escolher o seu?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg opacity-90">
            Cardápio completo de doces, quiches, tortas e bolos.
          </p>
          <Link
            to="/cardapio"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-background px-8 py-5 text-xl font-medium text-primary shadow-md transition hover:brightness-105"
          >
            Ver cardápio <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
