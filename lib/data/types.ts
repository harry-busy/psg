/** Domain model shared across every module. */

export type Stage = "New" | "Contacted" | "Appointment" | "Visited" | "Sold" | "Lost";
export const STAGES: Stage[] = ["New", "Contacted", "Appointment", "Visited", "Sold", "Lost"];

export type Source =
  | "WhatsApp" | "Instagram" | "Walk-in" | "Call" | "Facebook" | "Justdial" | "Referral" | "Website" | "Email";
export const SOURCES: Source[] = [
  "WhatsApp", "Instagram", "Walk-in", "Call", "Facebook", "Justdial", "Referral", "Website", "Email",
];

export interface Enquiry {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  source: Source;
  item?: string;
  budget?: string;
  occasion?: string;
  next?: string; // follow-up date YYYY-MM-DD
  stage: Stage;
  created: string;
  notes?: string;
  score?: number; // 1-10 AI lead score
  scoreReason?: string;
  nextAction?: string;
}

export interface Product {
  id: string;
  name: string;
  purity: string; // "22K · 916 Hallmark"
  weight?: string; // "12.4 g"
  price?: string;
  huid?: string; // hallmark unique id
  category?: string; // Necklace, Bangles, Ring...
  imageDataUrl?: string;
  created: string;
}

export interface Sale {
  id: string;
  customer: string;
  phone?: string;
  item?: string;
  amount: number;
  date: string;
  staff?: string;
}

export interface SchemeLead {
  id: string;
  name: string;
  phone: string;
  monthly: number;
  created: string;
}

export interface BridalLead {
  id: string;
  bride: string;
  phone?: string;
  weddingDate: string; // YYYY-MM-DD
  budget?: string;
  milestones: Record<string, boolean>; // keyed by milestone id
  created: string;
}

export interface LoyaltyMember {
  id: string;
  name: string;
  phone?: string;
  points: number;
  tier: "Silver" | "Gold" | "Platinum";
  created: string;
}

export interface EmailThread {
  id: string;
  from: string; // customer email
  name?: string;
  subject: string;
  incoming: string; // the customer's message
  draft?: string; // AI-written reply
  status: "new" | "drafted" | "sent";
  tone?: string;
  created: string;
  sentAt?: string;
}

/* ───────────────────────── Harshdeep Founder sector ───────────────────────── */

export type BrandKey = "aurra" | "designomics" | "loopin" | "arihant";
export const BRAND_KEYS: BrandKey[] = ["aurra", "designomics", "loopin", "arihant"];

/** One day of performance for one brand - the atom of the command center. */
export interface BrandMetricDay {
  id: string;
  brand: BrandKey;
  date: string; // YYYY-MM-DD
  revenue: number;
  spend: number; // ad spend
  orders: number;
  cogs: number; // cost of goods
  rtoOrders: number; // returned-to-origin (apparel margin killer)
}

export type PipelineStage = "New" | "Qualified" | "Quote" | "Won" | "Lost";
export const PIPELINE: PipelineStage[] = ["New", "Qualified", "Quote", "Won", "Lost"];

/** Brand-tagged lead/deal - powers Leads CRM + brand pipelines (events, corporate, agency). */
export interface Lead {
  id: string;
  brand: BrandKey;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  source?: string;
  value?: number; // deal size ₹
  stage: PipelineStage;
  detail?: string; // event date / gifting qty / retainer scope
  next?: string; // follow-up date
  created: string;
  score?: number;
  scoreReason?: string;
  nextAction?: string;
}

export type ApprovalKind = "Creative" | "Ad spend" | "Hire" | "Discount" | "Purchase order";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export interface Approval {
  id: string;
  brand: BrandKey;
  kind: ApprovalKind;
  title: string;
  amount?: number;
  requestedBy?: string;
  status: ApprovalStatus;
  created: string;
  decidedAt?: string;
}

export interface Task {
  id: string;
  brand: BrandKey | "group";
  title: string;
  owner?: string;
  due?: string;
  done: boolean;
  created: string;
}

/** Collections keyed in the store (both sectors). */
export interface Collections {
  // Jewellery sector
  enquiries: Enquiry[];
  products: Product[];
  sales: Sale[];
  schemeLeads: SchemeLead[];
  bridal: BridalLead[];
  loyalty: LoyaltyMember[];
  emails: EmailThread[];
  // Founder sector
  fMetrics: BrandMetricDay[];
  fLeads: Lead[];
  fApprovals: Approval[];
  fTasks: Task[];
}

export type CollectionName = keyof Collections;
