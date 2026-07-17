import type { BrandKey, BrandMetricDay, Lead } from "./data/types";

/**
 * The four Harshdeep Group brands. Colours/fonts are configurable placeholders
 * until the real logos/typography are supplied (Aurra Hype, Designomics, etc.).
 */
export interface BrandDef {
  key: BrandKey;
  name: string;
  short: string;
  tagline: string;
  role: string; // its role in the group flywheel
  primary: string; // hex
  accent: string; // hex
  font: string; // display font hint
  pipeline: "product" | "corporate" | "events" | "agency";
  site?: string;
}

export const BRANDS: BrandDef[] = [
  {
    key: "aurra",
    name: "Aurra Hype",
    short: "Aurra",
    tagline: "Bengaluru streetwear & hype apparel",
    role: "Revenue + content brand - D2C drops",
    primary: "#111111",
    accent: "#FF3B30",
    font: "var(--font-display)",
    pipeline: "product",
    site: "aurahyped.com",
  },
  {
    key: "designomics",
    name: "Designomics India",
    short: "Designomics",
    tagline: "Curated & personalised gifting · Made in Bharat",
    role: "Design/print/packaging arm + gifting revenue",
    primary: "#1A1A1A",
    accent: "#C9A227",
    font: "var(--font-display)",
    pipeline: "corporate",
    site: "designomicsindia.com",
  },
  {
    key: "loopin",
    name: "Loop In Events",
    short: "Loop In",
    tagline: "Experiential & event management",
    role: "Experiential brand - runs launches (rebrand pending)",
    primary: "#4338CA",
    accent: "#EC4899",
    font: "var(--font-display)",
    pipeline: "events",
  },
  {
    key: "arihant",
    name: "Arihant Digital",
    short: "Arihant",
    tagline: "The in-house growth engine, productised",
    role: "Engine - builds/markets the group, sells to outside clients",
    primary: "#1F2A44",
    accent: "#22C55E",
    font: "var(--font-display)",
    pipeline: "agency",
  },
];

export const brandDef = (key: BrandKey) => BRANDS.find((b) => b.key === key)!;

/* ── KPI math (the primitives Triple Whale / Polar centre on) ─────────────────── */

export interface BrandKPIs {
  revenue: number;
  spend: number;
  orders: number;
  cogs: number;
  rtoOrders: number;
  roas: number; // revenue / spend
  aov: number; // revenue / orders
  cac: number; // spend / orders
  rtoRate: number; // rtoOrders / orders
  contribution: number; // revenue - cogs - spend - est. RTO loss
  contributionMargin: number; // contribution / revenue
}

export function kpis(rows: BrandMetricDay[]): BrandKPIs {
  const s = rows.reduce(
    (a, r) => ({
      revenue: a.revenue + r.revenue,
      spend: a.spend + r.spend,
      orders: a.orders + r.orders,
      cogs: a.cogs + r.cogs,
      rtoOrders: a.rtoOrders + r.rtoOrders,
    }),
    { revenue: 0, spend: 0, orders: 0, cogs: 0, rtoOrders: 0 }
  );
  const roas = s.spend ? s.revenue / s.spend : 0;
  const aov = s.orders ? s.revenue / s.orders : 0;
  const cac = s.orders ? s.spend / s.orders : 0;
  const rtoRate = s.orders ? s.rtoOrders / s.orders : 0;
  const rtoLoss = s.rtoOrders * (aov * 0.4); // shipping+handling loss on a returned order
  const contribution = s.revenue - s.cogs - s.spend - rtoLoss;
  return {
    ...s,
    roas,
    aov,
    cac,
    rtoRate,
    contribution,
    contributionMargin: s.revenue ? contribution / s.revenue : 0,
  };
}

export function leadValue(leads: Lead[], stages: Lead["stage"][]) {
  return leads.filter((l) => stages.includes(l.stage)).reduce((a, l) => a + (l.value || 0), 0);
}
