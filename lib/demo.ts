"use client";

import { store } from "./data/store";
import { uid, today, daysAgo } from "./utils";
import type { Enquiry, Sale, SchemeLead, Product, Source, Stage } from "./data/types";

const NAMES = ["Aarti Rao", "Meena Iyer", "Lakshmi Devi", "Priya Nair", "Sushma Gowda", "Divya Shetty", "Kavya Reddy", "Anjali Menon", "Rekha Pillai", "Sneha Kulkarni", "Vidya Bhat", "Roopa Hegde"];
const ITEMS = ["Bridal necklace set", "Gold bangles", "Antique jhumkas", "Mangalsutra", "Gold chain", "Diamond ring", "Temple haram", "Kada pair", "Nose pin", "Baby anklets"];
const SOURCES: Source[] = ["WhatsApp", "Instagram", "Walk-in", "Call", "Justdial", "Referral"];
const STAGES: Stage[] = ["New", "Contacted", "Appointment", "Visited", "Sold", "Lost"];
const rnd = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export async function seedDemo() {
  const enquiries: Enquiry[] = [];
  const sales: Sale[] = [];
  for (let d = 13; d >= 0; d--) {
    const date = daysAgo(d);
    const n = 2 + Math.floor(Math.random() * 5);
    for (let i = 0; i < n; i++) {
      const sold = Math.random() < 0.22;
      const name = rnd(NAMES);
      const item = rnd(ITEMS);
      const stage: Stage = sold ? "Sold" : rnd(STAGES.slice(0, 4));
      enquiries.push({
        id: uid(), name, phone: "98" + Math.floor(10000000 + Math.random() * 8e7),
        source: rnd(SOURCES), item, budget: String(30000 + Math.floor(Math.random() * 20) * 10000),
        occasion: rnd(["Wedding", "Festival", "Investment", "Daily wear", ""]),
        next: Math.random() < 0.3 ? daysAgo(-(1 + (d % 3))) : "",
        stage, created: date,
      });
      if (sold) sales.push({ id: uid(), customer: name, item, amount: 30000 + Math.floor(Math.random() * 220000), date });
    }
  }
  const schemeLeads: SchemeLead[] = NAMES.slice(0, 5).map((n) => ({
    id: uid(), name: n, phone: "98" + Math.floor(10000000 + Math.random() * 8e7), monthly: rnd([2000, 5000, 10000]), created: daysAgo(Math.floor(Math.random() * 10)),
  }));
  const products: Product[] = ITEMS.slice(0, 6).map((name, i) => ({
    id: uid(), name, purity: rnd(["22K · 916 Hallmark", "18K · 750", "Diamond · IGI"]),
    weight: (6 + i * 2.4).toFixed(1) + " g", price: String(40000 + i * 18000), category: rnd(["Necklace", "Bangles", "Ring", "Earrings"]),
    huid: "HUID" + Math.floor(100000 + Math.random() * 899999), created: today(),
  }));

  await store.replace("enquiries", enquiries);
  await store.replace("sales", sales);
  await store.replace("schemeLeads", schemeLeads);
  await store.replace("products", products);
}
