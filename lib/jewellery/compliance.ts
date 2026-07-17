/** Indian jewellery-retail compliance helpers (guidance, not legal advice). */

export const PAN_THRESHOLD = 200000; // ₹2L cash - Rule 114B PAN/KYC

export function complianceForSale(amount: number): string[] {
  const notes: string[] = [];
  if (amount >= PAN_THRESHOLD)
    notes.push("PAN + KYC required (Income-tax Rule 114B - cash sale ≥ ₹2,00,000).");
  notes.push("Bill must show HUID / BIS hallmark for each hallmarked article.");
  notes.push("GST 3% (1.5% CGST + 1.5% SGST) on gold + making; HSN 7113.");
  return notes;
}

export const COMPLIANCE_CHECKLIST = [
  { id: "bis", label: "BIS hallmark (HUID) on every gold article", cadence: "always" },
  { id: "pan", label: "PAN/KYC captured for cash sales ≥ ₹2L", cadence: "per-sale" },
  { id: "gst", label: "GST 3% return filed (GSTR-1 / 3B)", cadence: "monthly" },
  { id: "insurance", label: "Stock insurance / jeweller's block policy valid", cadence: "annual" },
  { id: "calibration", label: "Weighing scale re-verified (Legal Metrology stamp)", cadence: "annual" },
];
