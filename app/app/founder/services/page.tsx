"use client";

import { PageHead } from "@/components/Shell";
import { Card, CardTitle, Badge } from "@/components/ui";
import { Sparkles, Bot, Camera, Rocket, RotateCcw, Truck, Star, CalendarDays, LifeBuoy, Store, Gauge, CheckSquare, ClipboardList, Mail } from "lucide-react";

/** The capability Arihant proves on the group's own brands, then sells to outside clients. */
const BUSINESS = [
  { icon: Sparkles, name: "AI Content Studio", desc: "Topic → branded caption, hashtags, image brief, best post-time.", price: "₹20k setup + ₹6k/mo" },
  { icon: Bot, name: "Lead Qualifier & Booking Bot", desc: "Chat qualifies + books + saves to CRM. No lead dropped.", price: "₹20k + ₹6k/mo" },
  { icon: Camera, name: "Photo → creative + video", desc: "One product photo → branded post card and showcase video.", price: "₹20k + ₹8k/mo" },
  { icon: Rocket, name: "New product → live everywhere", desc: "Store + marketplaces + socials in one push.", price: "project" },
  { icon: RotateCcw, name: "Cart / enquiry recovery", desc: "WhatsApp + email win-back flows.", price: "₹6k/mo" },
  { icon: Truck, name: "Order-status auto-updates", desc: "Shipping updates drafted and sent automatically.", price: "₹5k/mo" },
  { icon: Star, name: "Review & UGC requests", desc: "After purchase, ask for a review + collect UGC.", price: "₹5k/mo" },
  { icon: CalendarDays, name: "Festive / occasion broadcasts", desc: "Auto-scheduled campaigns + reminders.", price: "₹6k/mo" },
  { icon: LifeBuoy, name: "AI support assistant", desc: "FAQ, sizing, order status - 24/7.", price: "₹8k/mo" },
  { icon: Store, name: "Marketplace listing sync", desc: "Keep Amazon/Flipkart/Myntra in sync.", price: "project" },
];
const FOUNDER = [
  { icon: Mail, name: "Daily 8am business digest", desc: "Whole business in one morning message.", price: "₹5k/mo" },
  { icon: Gauge, name: "Founder command dashboard", desc: "One screen across every brand.", price: "₹40k + ₹10k/mo" },
  { icon: CheckSquare, name: "One-tap approvals", desc: "Creative / spend / hires, approve from your phone.", price: "included" },
  { icon: ClipboardList, name: "Weekly auto-scorecard", desc: "Targets vs actuals, built and sent for you.", price: "included" },
];

export default function FounderServices() {
  return (
    <>
      <PageHead title="Arihant Services" sub="The capability you prove on your own brands - then sell to outside clients as the case studies stack up." />

      <Card className="mb-5">
        <CardTitle>The flywheel</CardTitle>
        <p className="text-sm leading-relaxed text-[var(--color-muted)]">
          Arihant builds and markets Aurra, Designomics and Loop In at internal cost. Every real result becomes a
          case study; each case study wins outside clients; each client funds more capability that compounds back
          into the brands. These are the productised offers to pitch - the same automations already running your group.
        </p>
      </Card>

      <h3 className="font-display mb-3 text-lg font-semibold">For client businesses</h3>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BUSINESS.map((s) => (
          <Card key={s.name} className="p-5">
            <s.icon size={20} className="text-[var(--color-crimson)]" />
            <h4 className="font-display mt-2 font-semibold">{s.name}</h4>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{s.desc}</p>
            <Badge className="mt-3">{s.price}</Badge>
          </Card>
        ))}
      </div>

      <h3 className="font-display mb-3 text-lg font-semibold">For the founder</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FOUNDER.map((s) => (
          <Card key={s.name} className="p-5">
            <s.icon size={20} className="text-[var(--color-crimson)]" />
            <h4 className="font-display mt-2 font-semibold">{s.name}</h4>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{s.desc}</p>
            <Badge className="mt-3">{s.price}</Badge>
          </Card>
        ))}
      </div>
    </>
  );
}
