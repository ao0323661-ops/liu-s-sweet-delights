import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Home,
  MessageCircle,
  Minus,
  Plus,
  Store,
  Trash2,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import {
  DELIVERY_NEIGHBORHOODS,
  SHOP,
  buildWhatsappUrl,
  findSupportedNeighborhood,
  formatBRL,
  formatCep,
  getDeliveryValidation,
  onlyDigits,
} from "@/lib/shop";

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
  component: Carrinho,
});

type Mode = "retirada" | "entrega";
type CepLookupStatus = "idle" | "loading" | "found" | "not-found" | "error";

function Carrinho() {
  const { items, setQty, remove, subtotal, clear, count } = useCart();
  const [mode, setMode] = useState<Mode>("retirada");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState("");
  const [detectedBairro, setDetectedBairro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [referencia, setReferencia] = useState("");
  const [obs, setObs] = useState("");
  const [cepLookupStatus, setCepLookupStatus] = useState<CepLookupStatus>("idle");
  const deliveryBairro = detectedBairro || bairro;

  const deliveryCheck = useMemo(
    () => (mode === "entrega" ? getDeliveryValidation({ cep, bairro: deliveryBairro }) : undefined),
    [mode, cep, deliveryBairro],
  );

  const deliveryFee = mode === "entrega" && deliveryCheck?.ok ? (deliveryCheck.fee ?? 0) : 0;
  const total = subtotal + deliveryFee;
  const totalLabel = mode === "entrega" && !deliveryCheck?.ok ? "A confirmar" : formatBRL(total);

  const finishHelp = useMemo(() => {
    if (!nome.trim()) return "Informe seu nome para finalizar.";
    if (mode === "entrega") {
      if (!deliveryCheck?.ok) {
        return deliveryCheck?.message ?? "Confirme CEP e bairro de entrega.";
      }
      if (!endereco.trim()) return "Informe rua, número e complemento.";
    }
    return "";
  }, [nome, mode, deliveryCheck, endereco]);

  const canFinish = items.length > 0 && !finishHelp;

  useEffect(() => {
    if (mode !== "entrega") {
      setCepLookupStatus("idle");
      setDetectedBairro("");
      return;
    }

    const digits = onlyDigits(cep);
    if (digits.length !== 8) {
      setCepLookupStatus("idle");
      setDetectedBairro("");
      return;
    }

    const controller = new AbortController();
    setCepLookupStatus("loading");

    fetch(`https://viacep.com.br/ws/${digits}/json/`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data: { erro?: boolean; bairro?: string; logradouro?: string }) => {
        if (data.erro) {
          setCepLookupStatus("not-found");
          setDetectedBairro("");
          return;
        }

        const supportedNeighborhood = data.bairro
          ? findSupportedNeighborhood(data.bairro)
          : undefined;

        setDetectedBairro(data.bairro ?? "");
        if (supportedNeighborhood) setBairro(supportedNeighborhood);
        if (data.logradouro) {
          setEndereco((current) => current || data.logradouro || "");
        }
        setCepLookupStatus("found");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setCepLookupStatus("error");
      });

    return () => controller.abort();
  }, [cep, mode]);

  function buildMessage(): string {
    const lines: string[] = [];
    lines.push(`*Novo pedido - ${SHOP.name}*`);
    lines.push("");
    lines.push("*Cliente*");
    lines.push(`Nome: ${nome.trim()}`);
    if (telefone.trim()) lines.push(`Telefone: ${telefone.trim()}`);
    lines.push("");
    lines.push("*Itens*");
    items.forEach((item) => {
      const size = item.sizeLabel ? ` (${item.sizeLabel})` : "";
      lines.push(
        `- ${item.qty}x ${item.name}${size} | ${formatBRL(
          item.unitPrice,
        )} cada | ${formatBRL(item.unitPrice * item.qty)}`,
      );
    });
    lines.push("");
    lines.push("*Resumo*");
    lines.push(`Subtotal: ${formatBRL(subtotal)}`);
    if (mode === "entrega") {
      lines.push(`Bairro: ${deliveryCheck?.neighborhood ?? deliveryBairro}`);
      lines.push(`Zona de entrega: ${deliveryCheck?.zone?.label ?? "A confirmar"}`);
      lines.push(`Taxa de entrega: ${formatBRL(deliveryFee)}`);
    } else {
      lines.push("Taxa de entrega: Retirada no local");
    }
    lines.push(`Total: ${formatBRL(total)}`);
    lines.push("");
    lines.push("*Recebimento*");
    if (mode === "retirada") {
      lines.push("Retirada no local");
    } else {
      lines.push("Delivery");
      lines.push(`CEP: ${cep}`);
      lines.push(`Bairro: ${deliveryCheck?.neighborhood ?? deliveryBairro}`);
      lines.push(`Zona: ${deliveryCheck?.zone?.label ?? "A confirmar"}`);
      lines.push(`Endereço: ${endereco.trim()}`);
      if (referencia.trim()) lines.push(`Referência: ${referencia.trim()}`);
      lines.push(`Área validada: ${deliveryCheck?.message ?? "Pendente"}`);
    }
    if (obs.trim()) {
      lines.push("");
      lines.push("*Observações*");
      lines.push(obs.trim());
    }
    lines.push("");
    lines.push("Aguardo a confirmação e as instruções de pagamento.");
    return lines.join("\n");
  }

  function finish() {
    if (!canFinish) return;

    const url = buildWhatsappUrl(buildMessage());
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-secondary text-primary">
          <Store className="h-8 w-8" />
        </div>
        <h1 className="mt-5 font-serif text-5xl leading-tight text-foreground">
          Seu pedido está vazio
        </h1>
        <p className="mt-3 text-xl leading-relaxed text-muted-foreground">
          Escolha uma delícia no cardápio para montar seu pedido.
        </p>
        <Link
          to="/cardapio"
          className="mt-8 inline-flex min-h-16 items-center justify-center gap-2 rounded-lg bg-primary px-8 py-5 text-xl font-semibold text-primary-foreground shadow-md transition hover:brightness-110"
        >
          Ver cardápio
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-8">
      <Link
        to="/cardapio"
        className="inline-flex min-h-11 items-center gap-2 text-lg font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-5 w-5" /> Continuar comprando
      </Link>

      <header className="mt-5">
        <p className="text-lg font-semibold text-primary">Carrinho</p>
        <h1 className="mt-2 font-serif text-5xl leading-tight text-foreground sm:text-6xl">
          Revise seu pedido
        </h1>
        <p className="mt-3 max-w-3xl text-xl leading-relaxed text-muted-foreground">
          Confira os itens, escolha retirada ou delivery e envie tudo pronto para o WhatsApp da Liu.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.8fr)] lg:items-start">
        <section aria-labelledby="itens-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="itens-heading" className="font-serif text-4xl">
                Itens escolhidos
              </h2>
              <p className="mt-1 text-lg text-muted-foreground">
                {count} {count === 1 ? "item" : "itens"} no pedido
              </p>
            </div>
            <button
              type="button"
              onClick={clear}
              className="inline-flex min-h-11 items-center rounded-lg border border-border bg-background px-4 py-2 text-base font-semibold text-muted-foreground transition hover:border-destructive hover:text-destructive"
            >
              Esvaziar pedido
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.key}
                className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <h3 className="font-serif text-3xl leading-tight text-foreground">{item.name}</h3>
                  {item.sizeLabel && (
                    <p className="mt-1 text-lg text-muted-foreground">Tamanho: {item.sizeLabel}</p>
                  )}
                  <p className="mt-2 text-lg font-semibold text-primary">
                    {formatBRL(item.unitPrice)} cada
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="flex items-center rounded-lg border border-border bg-background p-1">
                    <button
                      type="button"
                      onClick={() => setQty(item.key, item.qty - 1)}
                      className="grid h-12 w-12 place-items-center rounded-md text-foreground transition hover:bg-secondary"
                      aria-label={`Diminuir quantidade de ${item.name}`}
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="w-12 text-center text-2xl font-semibold">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.key, item.qty + 1)}
                      className="grid h-12 w-12 place-items-center rounded-md text-foreground transition hover:bg-secondary"
                      aria-label={`Aumentar quantidade de ${item.name}`}
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-3xl text-primary">
                      {formatBRL(item.unitPrice * item.qty)}
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(item.key)}
                      className="mt-2 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-base font-medium text-muted-foreground transition hover:bg-secondary hover:text-destructive"
                    >
                      <Trash2 className="h-5 w-5" /> Remover
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-5 lg:sticky lg:top-28">
          <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h2 className="font-serif text-3xl">Recebimento</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <ModeButton
                active={mode === "retirada"}
                icon={Home}
                title="Retirada"
                text="Buscar no local"
                onClick={() => setMode("retirada")}
              />
              <ModeButton
                active={mode === "entrega"}
                icon={Truck}
                title="Delivery"
                text="Taxa calculada por bairro"
                onClick={() => setMode("entrega")}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm">
            <h2 className="font-serif text-3xl">Dados do pedido</h2>
            <Field
              id="nome"
              label="Seu nome"
              value={nome}
              onChange={setNome}
              autoComplete="name"
              required
            />
            <Field
              id="telefone"
              label="Telefone"
              value={telefone}
              onChange={setTelefone}
              inputMode="tel"
              autoComplete="tel"
              placeholder="(71) 9 0000-0000"
            />

            {mode === "entrega" && (
              <>
                <Field
                  id="cep"
                  label="CEP"
                  value={cep}
                  onChange={(value) => {
                    setCep(formatCep(value));
                    setBairro("");
                    setDetectedBairro("");
                  }}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="40000-000"
                  maxLength={9}
                  required
                />
                <SelectField
                  id="bairro"
                  label="Bairro"
                  value={bairro}
                  onChange={setBairro}
                  options={[...DELIVERY_NEIGHBORHOODS]}
                  placeholder="Selecione o bairro"
                  required
                />
                <DeliveryNotice
                  status={cepLookupStatus}
                  detectedBairro={detectedBairro}
                  message={deliveryCheck?.message}
                  ok={deliveryCheck?.ok}
                  zoneLabel={deliveryCheck?.zone?.label}
                  fee={deliveryCheck?.fee}
                />
                <Field
                  id="endereco"
                  label="Endereço"
                  value={endereco}
                  onChange={setEndereco}
                  autoComplete="street-address"
                  placeholder="Rua, número e complemento"
                  required
                />
                <Field
                  id="referencia"
                  label="Ponto de referência"
                  value={referencia}
                  onChange={setReferencia}
                  placeholder="Ex.: portaria, prédio, casa azul"
                />
              </>
            )}

            <TextareaField
              id="obs"
              label="Observações"
              value={obs}
              onChange={setObs}
              placeholder="Algum detalhe que a Liu precisa saber?"
            />
          </section>

          <section className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm">
            <h2 className="font-serif text-3xl">Resumo</h2>
            <Row label="Subtotal" value={formatBRL(subtotal)} />
            {mode === "entrega" ? (
              <>
                <Row
                  label="Bairro"
                  value={(deliveryCheck?.neighborhood ?? deliveryBairro) || "A informar"}
                />
                <Row label="Zona de entrega" value={deliveryCheck?.zone?.label ?? "A confirmar"} />
                <Row
                  label="Taxa de entrega"
                  value={deliveryCheck?.ok ? formatBRL(deliveryFee) : "A confirmar"}
                />
              </>
            ) : (
              <Row label="Retirada no local" value="Grátis" />
            )}
            <div className="border-t border-border pt-4" />
            <Row label="Total final" value={totalLabel} bold />

            <button
              type="button"
              disabled={!canFinish}
              onClick={finish}
              className="inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-lg bg-primary px-6 py-5 text-xl font-semibold text-primary-foreground shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
            >
              <MessageCircle className="h-6 w-6" />
              Enviar pedido no WhatsApp
            </button>
            <p
              className={`text-center text-base ${
                finishHelp ? "text-destructive" : "text-muted-foreground"
              }`}
              aria-live="polite"
            >
              {finishHelp || "O pagamento será combinado após a confirmação do pedido."}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  icon: Icon,
  title,
  text,
  onClick,
}: {
  active: boolean;
  icon: LucideIcon;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-20 items-start gap-3 rounded-lg border p-4 text-left transition ${
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-foreground hover:border-primary"
      }`}
    >
      <Icon className="mt-1 h-6 w-6 shrink-0" />
      <span>
        <span className="block text-xl font-semibold">{title}</span>
        <span
          className={`mt-1 block text-base leading-snug ${
            active ? "text-primary-foreground/90" : "text-muted-foreground"
          }`}
        >
          {text}
        </span>
      </span>
    </button>
  );
}

function DeliveryNotice({
  status,
  detectedBairro,
  message,
  ok,
  zoneLabel,
  fee,
}: {
  status: CepLookupStatus;
  detectedBairro: string;
  message?: string;
  ok?: boolean;
  zoneLabel?: string;
  fee?: number;
}) {
  const isPositive = ok === true;
  const Icon = isPositive ? CheckCircle2 : AlertCircle;
  const statusText =
    status === "loading"
      ? "Consultando CEP..."
      : status === "found" && detectedBairro
        ? `CEP encontrado: ${detectedBairro}.`
        : status === "not-found"
          ? "Não encontramos esse CEP automaticamente."
          : status === "error"
            ? "Não foi possível consultar o CEP agora."
            : "";

  return (
    <div
      className={`rounded-lg border p-4 text-base leading-relaxed ${
        isPositive
          ? "border-primary/35 bg-secondary text-foreground"
          : "border-destructive/30 bg-destructive/10 text-foreground"
      }`}
    >
      <div className="flex gap-3">
        <Icon
          className={`mt-1 h-5 w-5 shrink-0 ${isPositive ? "text-primary" : "text-destructive"}`}
        />
        <div>
          <p className="font-semibold">
            {message ?? "Informe CEP e bairro para validar a entrega."}
          </p>
          {isPositive && zoneLabel && typeof fee === "number" && (
            <p className="mt-1 font-semibold text-primary">
              {zoneLabel}. Taxa de entrega: {formatBRL(fee)}.
            </p>
          )}
          {statusText && <p className="mt-1 text-muted-foreground">{statusText}</p>}
          <p className="mt-1 text-muted-foreground">Atendemos {SHOP.deliveryArea}.</p>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  required,
  placeholder,
  inputMode,
  autoComplete,
  maxLength = 200,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  inputMode?: "text" | "tel" | "numeric" | "email";
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-lg font-semibold text-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        className="min-h-14 w-full rounded-lg border border-input bg-background px-4 py-3 text-xl text-foreground outline-none transition placeholder:text-muted-foreground/75 focus:border-primary focus:ring-2 focus:ring-ring/25"
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-lg font-semibold text-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="min-h-14 w-full rounded-lg border border-input bg-background px-4 py-3 text-xl text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/25"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-lg font-semibold text-foreground">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-xl text-foreground outline-none transition placeholder:text-muted-foreground/75 focus:border-primary focus:ring-2 focus:ring-ring/25"
        placeholder={placeholder}
      />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      className={`flex items-start justify-between gap-4 ${
        bold ? "text-2xl font-semibold" : "text-lg"
      }`}
    >
      <span className={bold ? "font-serif text-3xl" : "text-muted-foreground"}>{label}</span>
      <span className={`text-right ${bold ? "font-serif text-3xl text-primary" : ""}`}>
        {value}
      </span>
    </div>
  );
}
