import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Minus, Plus, Trash2, MessageCircle, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart";
import { SHOP, formatBRL } from "@/lib/shop";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Seu pedido — Tortas e Doces da Liu" },
      {
        name: "description",
        content:
          "Revise os itens, escolha retirada ou entrega e finalize seu pedido pelo WhatsApp.",
      },
    ],
  }),
  component: Carrinho;
});

type Mode = "retirada" | "entrega";

function Carrinho() {
  const { items, setQty, remove, subtotal, clear } = useCart();
  const [mode, setMode] = useState<Mode>("retirada");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [obs, setObs] = useState("");

  const deliveryFee = mode === "entrega" ? SHOP.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  const canFinish = useMemo(() => {
    if (items.length === 0) return false;
    if (!nome.trim()) return false;
    if (mode === "entrega") {
      if (!cep.trim() || !bairro.trim() || !endereco.trim()) return false;
    }
    return true;
  }, [items.length, nome, mode, cep, bairro, endereco]);

  function buildMessage(): string {
    const lines: string[] = [];
    lines.push(`*Novo pedido — ${SHOP.name}*`);
    lines.push("");
    lines.push(`*Cliente:* ${nome}`);
    if (telefone) lines.push(`*Telefone:* ${telefone}`);
    lines.push("");
    lines.push("*Itens:*");
    items.forEach((i) => {
      const size = i.sizeLabel ? ` (${i.sizeLabel})` : "";
      lines.push(
        `• ${i.qty}x ${i.name}${size} — ${formatBRL(i.unitPrice * i.qty)}`,
      );
    });
    lines.push("");
    lines.push(`*Subtotal:* ${formatBRL(subtotal)}`);
    if (mode === "entrega") {
      lines.push(`*Taxa de entrega:* ${formatBRL(deliveryFee)}`);
    }
    lines.push(`*Total:* ${formatBRL(total)}`);
    lines.push("");
    if (mode === "retirada") {
      lines.push("*Modalidade:* Retirada no local");
    } else {
      lines.push("*Modalidade:* Entrega");
      lines.push(`*CEP:* ${cep}`);
      lines.push(`*Bairro:* ${bairro}`);
      lines.push(`*Endereço:* ${endereco}`);
    }
    if (obs.trim()) {
      lines.push("");
      lines.push(`*Observações:* ${obs}`);
    }
    lines.push("");
    lines.push("_Aguardo a confirmação e as instruções de pagamento._");
    return lines.join("\n");
  }

  function finish() {
    const msg = encodeURIComponent(buildMessage());
    const url = `https://wa.me/${SHOP.whatsapp}?text=${msg}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <h1 className="font-serif text-5xl text-foreground">Seu pedido está vazio</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Que tal escolher uma delícia no cardápio?
        </p>
        <Link
          to="/cardapio"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-5 text-xl font-medium text-primary-foreground shadow-md transition hover:brightness-110"
        >
          Ver cardápio
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 pb-16 pt-8">
      <Link
        to="/cardapio"
        className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Continuar comprando
      </Link>

      <h1 className="mt-3 font-serif text-5xl text-foreground sm:text-6xl">
        Seu pedido
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* ITEMS */}
        <section className="space-y-4">
          {items.map((i) => (
            <article
              key={i.key}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="min-w-0">
                <h3 className="truncate font-serif text-2xl text-foreground">
                  {i.name}
                </h3>
                {i.sizeLabel && (
                  <p className="text-base text-muted-foreground">
                    Tamanho: {i.sizeLabel}
                  </p>
                )}
                <p className="mt-1 text-base text-primary">
                  {formatBRL(i.unitPrice)} cada
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
                  <button
                    type="button"
                    onClick={() => setQty(i.key, i.qty - 1)}
                    className="grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-secondary"
                    aria-label="Diminuir"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-lg font-medium">
                    {i.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(i.key, i.qty + 1)}
                    className="grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-secondary"
                    aria-label="Aumentar"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(i.key)}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" /> Remover
                </button>
              </div>
            </article>
          ))}

          <button
            type="button"
            onClick={clear}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
          >
            Esvaziar pedido
          </button>
        </section>

        {/* CHECKOUT */}
        <aside className="space-y-6">
          {/* Mode */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-serif text-2xl">Como você prefere receber?</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(["retirada", "entrega"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-xl border px-4 py-4 text-base font-medium transition ${
                    mode === m
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary"
                  }`}
                >
                  {m === "retirada" ? "Retirar no local" : "Entrega"}
                </button>
              ))}
            </div>

            {mode === "entrega" && (
              <div className="mt-4 rounded-xl bg-accent/30 p-4 text-sm text-foreground">
                Atendemos a região {SHOP.deliveryArea}.<br />
                CEP base: <strong>{SHOP.baseCep}</strong>.
              </div>
            )}
          </div>

          {/* Form */}
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-serif text-2xl">Seus dados</h2>

            <Field label="Seu nome" value={nome} onChange={setNome} required />
            <Field
              label="Telefone (opcional)"
              value={telefone}
              onChange={setTelefone}
              inputMode="tel"
              placeholder="(71) 9 0000-0000"
            />

            {mode === "entrega" && (
              <>
                <Field
                  label="CEP"
                  value={cep}
                  onChange={setCep}
                  inputMode="numeric"
                  placeholder="40000-000"
                  required
                />
                <Field
                  label="Bairro"
                  value={bairro}
                  onChange={setBairro}
                  required
                />
                <Field
                  label="Endereço (rua, número, complemento)"
                  value={endereco}
                  onChange={setEndereco}
                  required
                />
              </>
            )}

            <div>
              <label className="mb-1 block text-base font-medium text-foreground">
                Observações
              </label>
              <textarea
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg text-foreground outline-none focus:border-primary"
                placeholder="Algum detalhe que devamos saber?"
              />
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <Row label="Subtotal" value={formatBRL(subtotal)} />
            <Row
              label={
                mode === "entrega" ? "Taxa de entrega" : "Retirada no local"
              }
              value={mode === "entrega" ? formatBRL(deliveryFee) : "Grátis"}
            />
            <div className="border-t border-border pt-3" />
            <Row
              label="Total"
              value={formatBRL(total)}
              bold
            />

            <button
              type="button"
              disabled={!canFinish}
              onClick={finish}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-5 text-xl font-medium text-primary-foreground shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MessageCircle className="h-6 w-6" />
              Finalizar pelo WhatsApp
            </button>
            <p className="text-center text-sm text-muted-foreground">
              O pagamento será enviado pela Liu após a confirmação do pedido.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  inputMode?: "text" | "tel" | "numeric" | "email";
}) {
  return (
    <div>
      <label className="mb-1 block text-base font-medium text-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        placeholder={placeholder}
        maxLength={200}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg text-foreground outline-none focus:border-primary"
      />
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between ${
        bold ? "text-xl font-semibold" : "text-base"
      }`}
    >
      <span className={bold ? "font-serif text-2xl" : "text-muted-foreground"}>
        {label}
      </span>
      <span className={bold ? "font-serif text-2xl text-primary" : ""}>
        {value}
      </span>
    </div>
  );
}
