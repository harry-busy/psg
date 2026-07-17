/** Gold/silver estimate math - the single source of truth for pricing. */

export const PURITY: Record<string, number | "silver"> = {
  "Gold 24K (995/999)": 1,
  "Gold 22K (916)": 0.916,
  "Gold 18K (750)": 0.75,
  "Gold 14K (585)": 0.585,
  "Silver (925/pure)": "silver",
};

export interface EstimateInput {
  purityKey: string;
  weight: number; // grams
  rate24: number; // ₹/g for 24K gold
  rateSilver: number; // ₹/g
  making: number;
  makingType: "pct" | "pg" | "flat";
  wastagePct?: number;
  oldGoldDeduct?: number;
}

export interface Estimate {
  ratePerGram: number;
  metal: number;
  making: number;
  gst: number;
  oldGold: number;
  total: number;
  grams24Equivalent: number;
}

export function estimate(i: EstimateInput): Estimate {
  const factor = PURITY[i.purityKey];
  const ratePerGram = factor === "silver" ? i.rateSilver : i.rate24 * (factor as number);
  const wastageG = (i.weight * (i.wastagePct || 0)) / 100;
  const metal = (i.weight + wastageG) * ratePerGram;
  let making = i.making || 0;
  if (i.makingType === "pct") making = (metal * making) / 100;
  else if (i.makingType === "pg") making = making * i.weight;
  const gst = (metal + making) * 0.03; // Indian jewellery GST = 3%
  const oldGold = i.oldGoldDeduct || 0;
  const total = metal + making + gst - oldGold;
  return {
    ratePerGram,
    metal,
    making,
    gst,
    oldGold,
    total,
    grams24Equivalent: i.rate24 ? total / i.rate24 : 0,
  };
}

/** Derive display rates for each karat from a 24K rate. */
export function karatRates(rate24: number) {
  return {
    "24K": rate24,
    "22K": rate24 * 0.916,
    "18K": rate24 * 0.75,
    "14K": rate24 * 0.585,
  };
}
