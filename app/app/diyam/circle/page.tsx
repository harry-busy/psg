"use client";

import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users, Crown, Gift, Activity, Search, ChevronLeft, X,
  Star, Clock, Check, Trash2, AlertTriangle, Eye,
  ChevronDown, ChevronUp, Calendar, Phone, Mail,
} from "lucide-react";

/* ── theme (two-colour: deep emerald + sea glass only) ─────────────────────── */
const RED = "#1B4D3E";                 // deep emerald (primary)
const RED_DEEP = "#0D3326";            // darker emerald
const CREAM = "#C6E6DB";               // light sea glass
const CREAM_2 = "#A8D4C2";             // light sea glass, deeper
const GOLD = "#6BB091";                // deep sea glass (accent)
const GOLD_SOFT = "#7EBFA3";           // sea glass
const INK = "var(--color-ink)";        // dark emerald text
const MUTED = "#3F6E5C";               // secondary text on sea-glass surfaces (dark, matches globals card-muted)
const redWash = `linear-gradient(135deg, ${RED} 0%, ${RED_DEEP} 100%)`;

/* ── types ──────────────────────────────────────────────────────────────── */
type Tier = "member" | "vip";
type ArrivalKind = "first" | "fast" | "standard" | "expired";
type RewardStatus = "active" | "redeemed" | "expired";

interface Reward {
  code: string; issuedAt: string; fastPct: number; fastByDate: string;
  standardPct: number; standardByDate: string; status: RewardStatus;
}
interface Visit {
  sequence: number; date: string; redeemedTier: ArrivalKind; earnedPct: number | null;
}
interface Member {
  id: string; name: string; phone: string; email?: string; birthday?: string;
  createdAt: string; tier: Tier; visitCount: number; visits: Visit[];
  activeReward: Reward | null;
}
interface Stats {
  totalMembers: number; vipCount: number; memberCount: number;
  activeRewards: number; visitsToday: number; totalVisits: number; recentVisits: number;
}

/* ── helpers ────────────────────────────────────────────────────────────── */
function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

/* ── small components ───────────────────────────────────────────────────── */
function TierBadge({ tier }: { tier: Tier }) {
  if (tier === "vip") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
        style={{ background: `linear-gradient(90deg,${GOLD},${GOLD_SOFT})`, color: INK }}
      >
        <Crown size={10} /> VIP
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide"
      style={{ borderColor: RED, color: RED }}
    >
      <Star size={10} /> Member
    </span>
  );
}

function RewardBadge({ status }: { status: RewardStatus | null }) {
  if (!status) return <span className="text-[12px]" style={{ color: MUTED }}>—</span>;
  /* three states expressed in emerald + sea glass only, kept distinct via
     fill / faint-tint / outline (no other hues). */
  const map: Record<RewardStatus, { label: string; bg: string; color: string; border: string }> = {
    active:   { label: "Active",   bg: "#7EBFA3",     color: "#0E3327", border: "transparent" }, // sea-glass fill
    redeemed: { label: "Redeemed", bg: "#C6E6DB",     color: MUTED,     border: "transparent" }, // faint emerald tint
    expired:  { label: "Expired",  bg: "transparent", color: MUTED,     border: "#6BB091" },      // outlined emerald
  };
  const s = map[status];
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {s.label}
    </span>
  );
}

function StatCard({
  icon: Icon, label, value, sub, color,
}: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] p-5 shadow-[0_8px_24px_-12px_rgba(8,26,16,0.22)]">
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{ color: MUTED }}
          >
            {label}
          </p>
          <p
            className="mt-1 font-display text-[2rem] font-semibold leading-none tabular-nums"
            style={{ color: color ?? RED }}
          >
            {value}
          </p>
          {sub && (
            <p className="mt-1 text-[12px]" style={{ color: MUTED }}>
              {sub}
            </p>
          )}
        </div>
        <div className="rounded-xl p-2.5" style={{ background: CREAM_2 }}>
          <Icon size={20} style={{ color: color ?? RED }} />
        </div>
      </div>
    </div>
  );
}

/* ── member detail modal ────────────────────────────────────────────────── */
function MemberModal({
  member: m, onClose,
}: {
  member: Member; onClose: () => void;
}) {
  /* live data for this member so mutations reflect instantly */
  const live = useQuery(anyApi.members.getById, { id: m.id }) as Member | null | undefined;
  const member = live ?? m;

  const updateTier      = useMutation(anyApi.members.updateTier);
  const markRedeemed    = useMutation(anyApi.members.markRewardRedeemed);
  const deleteMember    = useMutation(anyApi.members.deleteMember);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  async function doTier(tier: Tier) {
    setBusy(true);
    try { await updateTier({ id: member.id, tier }); } finally { setBusy(false); }
  }
  async function doRedeem() {
    setBusy(true);
    try { await markRedeemed({ id: member.id }); } finally { setBusy(false); }
  }
  async function doDelete() {
    setBusy(true);
    try { await deleteMember({ id: member.id }); onClose(); } finally { setBusy(false); }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--color-surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* modal header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ background: redWash, color: "#EFF8F4", borderRadius: "16px 16px 0 0" }}
        >
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-semibold">{member.name}</h2>
              <TierBadge tier={member.tier} />
            </div>
            <p className="mt-1 text-[13px] opacity-75">
              {member.phone}
              {member.email && ` · ${member.email}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* member metadata */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
            {[
              { icon: Calendar, label: "Joined",         value: fmt(member.createdAt) },
              { icon: Activity, label: "Total Visits",   value: member.visitCount.toString() },
              ...(member.birthday
                ? [{ icon: Clock, label: "Birthday", value: member.birthday }]
                : []),
              ...(member.email
                ? [{ icon: Mail, label: "Email", value: member.email }]
                : []),
            ].map(({ icon: Ic, label, value }) => (
              <div key={label}>
                <p
                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                  style={{ color: MUTED }}
                >
                  <Ic size={10} /> {label}
                </p>
                <p className="mt-0.5 text-[13px] font-medium" style={{ color: INK }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* active reward */}
          {member.activeReward ? (
            <div
              className="rounded-xl p-4"
              style={{ background: CREAM, borderLeft: `3px solid ${GOLD}` }}
            >
              <div className="mb-3 flex items-center justify-between">
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.1em]"
                  style={{ color: GOLD }}
                >
                  Active Reward
                </p>
                <RewardBadge status={member.activeReward.status} />
              </div>
              <p
                className="font-display text-2xl font-semibold tracking-[0.18em]"
                style={{ color: INK }}
              >
                {member.activeReward.code}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-4 text-[12px]">
                <div>
                  <span style={{ color: MUTED }}>Fast return (≤90 days):</span>{" "}
                  <strong style={{ color: RED }}>{member.activeReward.fastPct}% off</strong>
                  <p style={{ color: MUTED }}>By {fmt(member.activeReward.fastByDate)}</p>
                </div>
                <div>
                  <span style={{ color: MUTED }}>Standard (≤180 days):</span>{" "}
                  <strong style={{ color: INK }}>{member.activeReward.standardPct}% off</strong>
                  <p style={{ color: MUTED }}>By {fmt(member.activeReward.standardByDate)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: CREAM_2 }}
            >
              <Gift size={20} className="mx-auto mb-1" style={{ color: MUTED }} />
              <p className="text-[13px]" style={{ color: MUTED }}>No active reward coupon</p>
            </div>
          )}

          {/* visit history */}
          <div>
            <p
              className="mb-3 font-display text-[15px] font-semibold"
              style={{ color: INK }}
            >
              Visit History
            </p>
            {member.visits.length === 0 ? (
              <p className="text-[13px]" style={{ color: MUTED }}>No visits recorded yet.</p>
            ) : (
              <div
                className="overflow-hidden rounded-xl border"
                style={{ borderColor: CREAM_2 }}
              >
                <table className="w-full text-[12px]">
                  <thead>
                    <tr style={{ background: CREAM }}>
                      {["#", "Date", "Arrival Tier", "Discount Earned"].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left font-bold uppercase tracking-[0.07em]"
                          style={{ color: MUTED }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...member.visits].reverse().map((v) => (
                      <tr
                        key={v.sequence}
                        className="border-t"
                        style={{ borderColor: CREAM_2 }}
                      >
                        <td
                          className="px-3 py-2 font-semibold"
                          style={{ color: RED }}
                        >
                          {v.sequence}
                        </td>
                        <td className="px-3 py-2" style={{ color: INK }}>
                          {fmt(v.date)}
                        </td>
                        <td
                          className="px-3 py-2 capitalize"
                          style={{ color: MUTED }}
                        >
                          {v.redeemedTier}
                        </td>
                        <td
                          className="px-3 py-2 font-semibold"
                          style={{ color: v.earnedPct != null ? GOLD : MUTED }}
                        >
                          {v.earnedPct != null ? `${v.earnedPct}%` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* action buttons */}
          <div
            className="flex flex-wrap items-center gap-3 border-t pt-5"
            style={{ borderColor: CREAM_2 }}
          >
            {member.tier === "member" ? (
              <button
                disabled={busy}
                onClick={() => doTier("vip")}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-opacity disabled:opacity-50"
                style={{
                  background: `linear-gradient(90deg,${GOLD},${GOLD_SOFT})`,
                  color: INK,
                }}
              >
                <Crown size={14} /> Upgrade to VIP
              </button>
            ) : (
              <button
                disabled={busy}
                onClick={() => doTier("member")}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-opacity disabled:opacity-50"
                style={{ borderColor: MUTED, color: MUTED }}
              >
                <Star size={14} /> Set to Member
              </button>
            )}

            {member.activeReward?.status === "active" && (
              <button
                disabled={busy}
                onClick={doRedeem}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-opacity disabled:opacity-50"
                style={{ background: RED }}
              >
                <Check size={14} /> Mark Reward Redeemed
              </button>
            )}

            <div className="ml-auto">
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold"
                  style={{ borderColor: RED, color: RED }}
                >
                  <Trash2 size={14} /> Delete Member
                </button>
              ) : (
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ background: CREAM_2 }}
                >
                  <AlertTriangle size={14} style={{ color: RED }} />
                  <span className="text-[12px]" style={{ color: RED }}>
                    Delete permanently?
                  </span>
                  <button
                    disabled={busy}
                    onClick={doDelete}
                    className="rounded-full px-3 py-1 text-[12px] font-bold text-white disabled:opacity-50"
                    style={{ background: RED }}
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-full px-3 py-1 text-[12px] font-semibold"
                    style={{ color: MUTED }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── main page ──────────────────────────────────────────────────────────── */
export default function CircleAdmin() {
  const members = useQuery(anyApi.members.getAll) as Member[] | undefined;
  const stats   = useQuery(anyApi.members.getStats) as Stats | undefined;

  const [search, setSearch]         = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | Tier>("all");
  const [sortBy, setSortBy]         = useState<"name" | "visits" | "lastVisit">("lastVisit");
  const [sortDir, setSortDir]       = useState<"asc" | "desc">("desc");
  const [selected, setSelected]     = useState<Member | null>(null);

  const filtered = useMemo(() => {
    if (!members) return [];
    let list = [...members];
    if (tierFilter !== "all") list = list.filter((m) => m.tier === tierFilter);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (m) => m.name.toLowerCase().includes(q) || m.phone.includes(q)
      );
    }
    list.sort((a, b) => {
      let av: string | number, bv: string | number;
      if (sortBy === "name") {
        av = a.name.toLowerCase(); bv = b.name.toLowerCase();
      } else if (sortBy === "visits") {
        av = a.visitCount; bv = b.visitCount;
      } else {
        av = a.visits.at(-1)?.date ?? a.createdAt;
        bv = b.visits.at(-1)?.date ?? b.createdAt;
      }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [members, search, tierFilter, sortBy, sortDir]);

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("desc"); }
  }

  function SortIcon({ col }: { col: typeof sortBy }) {
    if (sortBy !== col) return null;
    return sortDir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />;
  }

  const colHeaders: { label: string; col?: typeof sortBy }[] = [
    { label: "Name",       col: "name" },
    { label: "Phone" },
    { label: "Tier" },
    { label: "Visits",     col: "visits" },
    { label: "Last Visit", col: "lastVisit" },
    { label: "Reward" },
    { label: "" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-canvas)" }}>
      {/* ── page header ─────────────────────────────────────────────────── */}
      <div
        className="px-5 py-10 sm:px-8"
        style={{ background: `linear-gradient(160deg, ${RED} 0%, ${RED_DEEP} 100%)`, color: "#ffffff" }}
      >
        <Link
          href="/app/diyam"
          className="mb-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] opacity-70 transition-opacity hover:opacity-100"
          style={{ color: GOLD_SOFT }}
        >
          <ChevronLeft size={14} /> DIYAM
        </Link>
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <Users size={20} style={{ color: GOLD_SOFT }} />
          </div>
          <div>
            <h1 className="font-display text-[clamp(1.4rem,4vw,2.2rem)] font-semibold leading-tight">
              The Circle · Member Console
            </h1>
            <p className="mt-0.5 text-[13px] opacity-70">
              In-store loyalty programme — live data from Convex
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8">
        {/* ── stats strip ─────────────────────────────────────────────── */}
        {stats ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={Users}   label="Total Members"
              value={stats.totalMembers}
              sub={`${stats.recentVisits} visits · last 30 days`}
            />
            <StatCard
              icon={Crown}   label="VIP Members"
              value={stats.vipCount}
              sub={`${stats.memberCount} regular members`}
              color={RED}
            />
            <StatCard
              icon={Gift}    label="Active Rewards"
              value={stats.activeRewards}
              sub="Valid coupons in hand"
            />
            <StatCard
              icon={Activity} label="Visits Today"
              value={stats.visitsToday}
              sub={`${stats.totalVisits} all-time`}
              color={RED}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-[var(--color-surface)]"
                style={{ opacity: 0.6 }}
              />
            ))}
          </div>
        )}

        {/* ── member table ─────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-[0_8px_32px_-16px_rgba(8,26,16,0.2)]">
          {/* filters bar */}
          <div
            className="flex flex-wrap items-center gap-3 border-b px-5 py-4"
            style={{ borderColor: CREAM_2 }}
          >
            <div className="relative min-w-[200px] flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: MUTED }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or phone…"
                className="w-full rounded-full border bg-[var(--color-surface-2)] py-2 pl-9 pr-4 text-[13px] outline-none focus:ring-2 focus:ring-[#1B4D3E]/30"
                style={{ borderColor: CREAM_2 }}
              />
            </div>
            <div className="flex gap-1.5">
              {(["all", "member", "vip"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTierFilter(f)}
                  className="rounded-full px-3 py-1.5 text-[12px] font-semibold capitalize transition-all"
                  style={
                    tierFilter === f
                      ? { background: RED, color: "#fff" }
                      : { background: CREAM_2, color: MUTED }
                  }
                >
                  {f === "all" ? "All" : f === "vip" ? "VIP" : "Members"}
                </button>
              ))}
            </div>
          </div>

          {/* table or empty/loading state */}
          {members === undefined ? (
            <div className="px-5 py-14 text-center">
              <p className="text-[13px] animate-pulse" style={{ color: MUTED }}>
                Loading members…
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <Users size={38} className="mx-auto mb-3" style={{ color: CREAM_2 }} />
              <p className="font-display text-lg font-semibold" style={{ color: INK }}>
                {members.length === 0 ? "No members yet" : "No members match your search"}
              </p>
              <p className="mt-1 text-[13px]" style={{ color: MUTED }}>
                {members.length === 0
                  ? "Members appear here once the kiosk records its first visit."
                  : "Try adjusting the search or filter."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-[13px]">
                  <thead>
                    <tr style={{ background: CREAM }}>
                      {colHeaders.map(({ label, col }) => (
                        <th
                          key={label}
                          className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.08em] ${col ? "cursor-pointer select-none" : ""}`}
                          style={{ color: MUTED }}
                          onClick={col ? () => toggleSort(col) : undefined}
                        >
                          <span className="inline-flex items-center gap-1">
                            {label}
                            {col && <SortIcon col={col} />}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((m) => {
                      const lastVisit = m.visits.at(-1);
                      return (
                        <tr
                          key={m.id}
                          className="cursor-pointer border-t transition-colors"
                          style={{ borderColor: CREAM_2 }}
                          onClick={() => setSelected(m)}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLTableRowElement).style.background = "#C6E6DB";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLTableRowElement).style.background = "";
                          }}
                        >
                          <td className="px-4 py-3">
                            <span className="font-semibold" style={{ color: INK }}>
                              {m.name}
                            </span>
                          </td>
                          <td className="px-4 py-3" style={{ color: MUTED }}>
                            <span className="inline-flex items-center gap-1.5">
                              <Phone size={11} />
                              {m.phone}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <TierBadge tier={m.tier} />
                          </td>
                          <td
                            className="px-4 py-3 font-semibold tabular-nums"
                            style={{ color: RED }}
                          >
                            {m.visitCount}
                          </td>
                          <td className="px-4 py-3" style={{ color: MUTED }}>
                            {lastVisit ? fmt(lastVisit.date) : fmt(m.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <RewardBadge status={m.activeReward?.status ?? null} />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors hover:bg-[var(--color-surface-2)]"
                              style={{ borderColor: RED, color: RED }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(m);
                              }}
                            >
                              <Eye size={11} /> View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div
                className="border-t px-5 py-3 text-[12px]"
                style={{ borderColor: CREAM_2, color: MUTED }}
              >
                Showing {filtered.length} of {members.length} member
                {members.length !== 1 ? "s" : ""}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── member detail modal ──────────────────────────────────────────── */}
      {selected && (
        <MemberModal member={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
