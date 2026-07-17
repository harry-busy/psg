/**
 * White-label brand config. Ospyr is the vendor; each jewellery client
 * (PSG Gold first) gets its own brand stored per-workspace in the DataStore.
 */

export interface Brand {
  name: string; // showroom name, e.g. "PSG Gold"
  tagline: string;
  whatsapp: string; // 91XXXXXXXXXX
  email: string;
  city: string;
  reviewLink: string; // Google review URL
  primary: string; // hex
  gold: string; // hex
  logoDataUrl?: string; // optional uploaded logo
  velvet: boolean; // dark premium theme
}

export const VENDOR = {
  name: "Ospyr",
  url: "https://www.ospyr.com",
  pitch: "The team you cannot afford to hire, in one partner.",
  product: "Ospyr Jewellery OS",
} as const;

export const DEFAULT_BRAND: Brand = {
  name: "PSG Gold",
  tagline: "Trusted hallmark jewellery since generations",
  whatsapp: "",
  email: "",
  city: "",
  reviewLink: "",
  primary: "#d2042d",
  gold: "#c9a227",
  velvet: false,
};
