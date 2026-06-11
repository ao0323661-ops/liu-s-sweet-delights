export const SHOP = {
  name: "Tortas e Doces da Liu",
  tagline: "Confeitaria artesanal feita com carinho",
  whatsapp: "5571999999999", // TODO: substituir pelo número real (com DDI 55 + DDD)
  baseCep: "40226-580",
  deliveryArea: "Da Barra ao Rio Vermelho e redondezas (Salvador-BA)",
};

export const DELIVERY_ZONES = [
  {
    id: "zona-1",
    name: "Zona 1",
    label: "Zona 1 — Próxima",
    distanceLabel: "Próxima",
    fee: 6,
    neighborhoods: ["Barra", "Graça", "Vitória", "Canela", "Campo Grande"],
  },
  {
    id: "zona-2",
    name: "Zona 2",
    label: "Zona 2 — Média",
    distanceLabel: "Média",
    fee: 8,
    neighborhoods: ["Garcia", "Ondina", "Chame-Chame", "Jardim Apipema", "Alto das Pombas"],
  },
  {
    id: "zona-3",
    name: "Zona 3",
    label: "Zona 3 — Mais distante",
    distanceLabel: "Mais distante",
    fee: 10,
    neighborhoods: ["Federação", "Garibaldi", "Rio Vermelho"],
  },
] as const;

export const DELIVERY_NEIGHBORHOODS = DELIVERY_ZONES.flatMap((zone) => zone.neighborhoods);

export const DELIVERY_CEP_PREFIXES = ["40", "41"] as const;

export type DeliveryNeighborhood = (typeof DELIVERY_NEIGHBORHOODS)[number];
export type DeliveryZone = (typeof DELIVERY_ZONES)[number];

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  sizes?: { label: string; price: number }[];
};

export type Category = {
  id: string;
  title: string;
  blurb: string;
  products: Product[];
};

const quicheSalgadoSabores = [
  { id: "bacalhau", name: "Bacalhau" },
  { id: "carne-seca", name: "Carne Seca" },
  { id: "frango", name: "Frango" },
  { id: "camarao", name: "Camarão" },
];

const tortaSizes = [
  { label: "16 cm", price: 85 },
  { label: "20 cm", price: 120 },
  { label: "25 cm", price: 160 },
  { label: "28 cm", price: 195 },
  { label: "30 cm", price: 230 },
];

export const CATEGORIES: Category[] = [
  {
    id: "doces",
    title: "Doces",
    blurb: "Pequenos prazeres feitos no dia.",
    products: [
      { id: "picole-biscoito", name: "Picolé de Biscoito", price: 12 },
      { id: "pudim", name: "Pudim", price: 18 },
      { id: "brigadeiro-copo", name: "Brigadeiro de Copo", price: 14 },
    ],
  },
  {
    id: "quiches-doces",
    title: "Quiches Doces",
    blurb: "Massa amanteigada e recheios cremosos.",
    products: [
      { id: "qd-maracuja", name: "Quiche de Maracujá", price: 28 },
      { id: "qd-limao", name: "Quiche de Limão", price: 28 },
      { id: "qd-chocolate", name: "Quiche de Chocolate", price: 30 },
      { id: "qd-doce-leite", name: "Quiche de Doce de Leite", price: 30 },
    ],
  },
  {
    id: "quiches-salgados",
    title: "Quiches Salgados",
    blurb: "Receita clássica com toque artesanal.",
    products: quicheSalgadoSabores.map((s) => ({
      id: `qs-${s.id}`,
      name: `Quiche de ${s.name}`,
      price: 32,
    })),
  },
  {
    id: "quiches-vegetarianos",
    title: "Quiches Vegetarianos",
    blurb: "Sabores leves e cheios de personalidade.",
    products: [
      { id: "qv-alho-poro", name: "Quiche de Alho-poró", price: 30 },
      { id: "qv-legumes", name: "Quiche de Legumes", price: 30 },
      {
        id: "qv-palmito-alho-poro",
        name: "Quiche de Palmito com Alho-poró",
        price: 32,
      },
      { id: "qv-ricota", name: "Quiche de Creme de Ricota", price: 30 },
    ],
  },
  {
    id: "tortas",
    title: "Tortas",
    blurb: "Escolha o sabor e o tamanho ideal para a sua mesa.",
    products: quicheSalgadoSabores.map((s) => ({
      id: `torta-${s.id}`,
      name: `Torta de ${s.name}`,
      description: "Disponível em 5 tamanhos",
      price: tortaSizes[0].price,
      sizes: tortaSizes,
    })),
  },
  {
    id: "bolos",
    title: "Bolos",
    blurb: "Receitas de família, no ponto certo.",
    products: [
      { id: "bolo-milho", name: "Bolo de Milho", price: 45 },
      { id: "bolo-aipim", name: "Bolo de Aipim", price: 45 },
      { id: "bolo-laranja", name: "Bolo de Laranja", price: 42 },
      { id: "bolo-tapioca", name: "Bolo de Tapioca", price: 45 },
    ],
  },
];

export function findProduct(id: string): Product | undefined {
  for (const c of CATEGORIES) {
    const p = c.products.find((p) => p.id === id);
    if (p) return p;
  }
  return undefined;
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatCep(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function isCepFormatValid(cep: string): boolean {
  return onlyDigits(cep).length === 8;
}

export function isCepLikelyInSalvador(cep: string): boolean {
  const digits = onlyDigits(cep);
  return (
    isCepFormatValid(digits) && DELIVERY_CEP_PREFIXES.some((prefix) => digits.startsWith(prefix))
  );
}

export function findSupportedNeighborhood(value: string): DeliveryNeighborhood | undefined {
  const normalized = normalizeText(value);
  return DELIVERY_NEIGHBORHOODS.find((neighborhood) => normalizeText(neighborhood) === normalized);
}

export function getDeliveryZoneForNeighborhood(
  value: string,
): { neighborhood: DeliveryNeighborhood; zone: DeliveryZone } | undefined {
  const normalized = normalizeText(value);

  for (const zone of DELIVERY_ZONES) {
    const neighborhood = zone.neighborhoods.find((item) => normalizeText(item) === normalized);

    if (neighborhood) {
      return { neighborhood, zone };
    }
  }

  return undefined;
}

export function getDeliveryValidation({ cep, bairro }: { cep: string; bairro: string }): {
  ok: boolean;
  message: string;
  neighborhood?: DeliveryNeighborhood;
  zone?: DeliveryZone;
  fee?: number;
} {
  if (!isCepFormatValid(cep)) {
    return {
      ok: false,
      message: "Informe um CEP com 8 números.",
    };
  }

  if (!isCepLikelyInSalvador(cep)) {
    return {
      ok: false,
      message: "No momento, não entregamos nessa região. Você pode escolher retirada no local.",
    };
  }

  if (!bairro.trim()) {
    return {
      ok: false,
      message: "Escolha um bairro atendido para delivery.",
    };
  }

  const deliveryZone = getDeliveryZoneForNeighborhood(bairro);

  if (!deliveryZone) {
    return {
      ok: false,
      message: "No momento, não entregamos nessa região. Você pode escolher retirada no local.",
    };
  }

  return {
    ok: true,
    message: `Entrega disponível para ${deliveryZone.neighborhood} (${deliveryZone.zone.label}).`,
    neighborhood: deliveryZone.neighborhood,
    zone: deliveryZone.zone,
    fee: deliveryZone.zone.fee,
  };
}
