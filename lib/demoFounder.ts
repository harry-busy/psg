"use client";

import { store } from "./data/store";
import { uid, today, daysAgo } from "./utils";
import { BRAND_KEYS, PIPELINE, type BrandKey, type BrandMetricDay, type Lead, type Approval, type Task } from "./data/types";

const rnd = (min: number, max: number) => min + Math.random() * (max - min);
const ri = (min: number, max: number) => Math.round(rnd(min, max));
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

// Per-brand daily shape (revenue band, orders band, spend ratio, cogs ratio, rto rate)
const SHAPE: Record<BrandKey, { rev: [number, number]; ord: [number, number]; spend: number; cogs: number; rto: number }> = {
  aurra: { rev: [25000, 90000], ord: [12, 45], spend: 0.32, cogs: 0.42, rto: 0.18 },
  designomics: { rev: [15000, 55000], ord: [6, 22], spend: 0.18, cogs: 0.38, rto: 0.05 },
  loopin: { rev: [0, 120000], ord: [0, 3], spend: 0.06, cogs: 0.5, rto: 0.0 },
  arihant: { rev: [20000, 60000], ord: [1, 5], spend: 0.03, cogs: 0.25, rto: 0.0 },
};

const LEAD_NAMES = ["Ananya Rao", "Karan Mehta", "Zomato Corp", "Infosys Gifting", "Rohit Sharma", "Nykaa Team", "Priya Events", "Swiggy HR", "Vikram Singh", "Meesho Brand", "Aditi Nair", "CRED Ops"];
const SOURCES = ["Instagram", "Referral", "Meta ad", "Website", "LinkedIn", "Walk-in"];

export async function seedFounderDemo() {
  const metrics: BrandMetricDay[] = [];
  for (const brand of BRAND_KEYS) {
    const sh = SHAPE[brand];
    for (let d = 29; d >= 0; d--) {
      const revenue = brand === "loopin" && Math.random() < 0.7 ? 0 : ri(sh.rev[0], sh.rev[1]);
      const orders = revenue ? ri(sh.ord[0] || 1, sh.ord[1]) : 0;
      metrics.push({
        id: uid(),
        brand,
        date: daysAgo(d),
        revenue,
        spend: Math.round(revenue * sh.spend * rnd(0.7, 1.3)),
        orders,
        cogs: Math.round(revenue * sh.cogs),
        rtoOrders: Math.round(orders * sh.rto * rnd(0.5, 1.5)),
      });
    }
  }

  const leads: Lead[] = [];
  for (let i = 0; i < 26; i++) {
    const brand = pick(BRAND_KEYS);
    const corporate = brand === "designomics" || brand === "arihant" || brand === "loopin";
    leads.push({
      id: uid(),
      brand,
      name: pick(LEAD_NAMES),
      company: corporate ? pick(["Infosys", "Zomato", "CRED", "Nykaa", "Swiggy", ""]) : "",
      phone: "98" + ri(10000000, 99999999),
      source: pick(SOURCES),
      value: corporate ? ri(50000, 500000) : ri(1200, 8000),
      stage: pick(PIPELINE),
      detail: brand === "loopin" ? "Corporate offsite, ~200 pax" : brand === "designomics" ? "Diwali hampers x150" : "",
      next: Math.random() < 0.4 ? daysAgo(-ri(1, 5)) : "",
      created: daysAgo(ri(0, 20)),
    });
  }

  const approvals: Approval[] = [
    { id: uid(), brand: "aurra", kind: "Ad spend", title: "Scale winning reel ad +₹15k/day", amount: 15000, requestedBy: "Media buyer", status: "pending", created: today() },
    { id: uid(), brand: "aurra", kind: "Creative", title: "New drop hero video - approve to publish", status: "pending", created: today() },
    { id: uid(), brand: "designomics", kind: "Purchase order", title: "Reorder kraft gift boxes x2000", amount: 48000, requestedBy: "Ops", status: "pending", created: today() },
    { id: uid(), brand: "arihant", kind: "Hire", title: "Contract performance marketer (3 mo)", amount: 120000, requestedBy: "You", status: "pending", created: today() },
  ];

  const tasks: Task[] = [
    { id: uid(), brand: "loopin", title: "Finalise rebrand shortlist + trademark search", due: daysAgo(-3), done: false, created: today() },
    { id: uid(), brand: "aurra", title: "Lock next drop date + waitlist page", due: daysAgo(-5), done: false, created: today() },
    { id: uid(), brand: "designomics", title: "Send 5 corporate gifting proposals", due: daysAgo(-2), done: false, created: today() },
    { id: uid(), brand: "group", title: "Monthly unit-economics review with CA", due: daysAgo(-7), done: false, created: today() },
  ];

  await store.replace("fMetrics", metrics);
  await store.replace("fLeads", leads);
  await store.replace("fApprovals", approvals);
  await store.replace("fTasks", tasks);
}
