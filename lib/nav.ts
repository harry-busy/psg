import {
  Home, Camera, Gem, Calculator, Users, Wallet, Heart, CalendarDays,
  Sparkles, Mail, Star, LayoutDashboard, Workflow, Settings, Wand2,
  Gauge, Boxes, MessageSquare, CheckSquare, ClipboardList, Briefcase, Bot,
  TrendingUp, FileText, BarChart3,
  type LucideIcon,
} from "lucide-react";
import type { Sector } from "./sector";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group: string;
  /** If set, the item only shows when the current workspace slug includes this. */
  workspace?: string;
}

export const NAV: NavItem[] = [
  { href: "/app/home", label: "Home", icon: Home, group: "Run the day" },
  { href: "/app/story", label: "Growth Story", icon: TrendingUp, group: "Run the day", workspace: "psg-gold" },
  { href: "/app/diyam", label: "Growth Blueprint", icon: TrendingUp, group: "Run the day", workspace: "diyam" },
  { href: "/app/diyam/content", label: "Content Library", icon: FileText, group: "Diyam Playbook", workspace: "diyam" },
  { href: "/app/diyam/calendar", label: "Content Calendar", icon: CalendarDays, group: "Diyam Playbook", workspace: "diyam" },
  { href: "/app/diyam/reports", label: "Reports & Decks", icon: BarChart3, group: "Diyam Playbook", workspace: "diyam" },
  { href: "/app/padmavathi", label: "Growth Story", icon: TrendingUp, group: "Run the day", workspace: "padmav" },
  { href: "/app/vardhman", label: "Growth Blueprint", icon: TrendingUp, group: "Run the day", workspace: "vardh" },
  { href: "/app/crm", label: "Enquiry CRM", icon: Users, group: "Run the day" },
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Run the day" },

  { href: "/app/studio", label: "Photo Studio", icon: Camera, group: "Create" },
  { href: "/app/cards", label: "Product Cards", icon: Gem, group: "Create" },
  { href: "/app/catalog", label: "Catalog", icon: Gem, group: "Create" },
  { href: "/app/content", label: "Content Studio", icon: Sparkles, group: "Create" },
  { href: "/app/generate", label: "Image & Video", icon: Wand2, group: "Create" },

  { href: "/app/calculator", label: "Gold Estimator", icon: Calculator, group: "Sell" },
  { href: "/app/scheme", label: "Savings Scheme", icon: Wallet, group: "Sell" },
  { href: "/app/bridal", label: "Bridal Pipeline", icon: Heart, group: "Sell" },
  { href: "/app/loyalty", label: "Loyalty", icon: Star, group: "Sell" },

  { href: "/app/calendar", label: "Festive Calendar", icon: CalendarDays, group: "Grow" },
  { href: "/app/email", label: "Email Concierge", icon: Mail, group: "Grow" },
  { href: "/app/reviews", label: "Reviews & QR", icon: Star, group: "Grow" },
  { href: "/app/automations", label: "Automations", icon: Workflow, group: "Grow" },

  { href: "/app/settings", label: "Settings", icon: Settings, group: "System" },
];

export const NAV_GROUPS = ["Run the day", "Diyam Playbook", "Create", "Sell", "Grow", "System"];

/** Harshdeep Founder OS navigation. */
export const FOUNDER_NAV: NavItem[] = [
  { href: "/app/founder/command", label: "Command Center", icon: Gauge, group: "Run the day" },
  { href: "/app/founder/chief", label: "AI Chief of Staff", icon: Bot, group: "Run the day" },
  { href: "/app/founder/approvals", label: "Approvals", icon: CheckSquare, group: "Run the day" },

  { href: "/app/founder/brands", label: "Brands", icon: Boxes, group: "Businesses" },
  { href: "/app/founder/leads", label: "Leads & CRM", icon: Users, group: "Businesses" },
  { href: "/app/founder/money", label: "Money & Runway", icon: Wallet, group: "Businesses" },
  { href: "/app/founder/scorecard", label: "Weekly Scorecard", icon: ClipboardList, group: "Businesses" },

  { href: "/app/founder/content", label: "Content Studio", icon: Sparkles, group: "Create" },
  { href: "/app/founder/generate", label: "Image & Video", icon: Wand2, group: "Create" },

  { href: "/app/founder/services", label: "Arihant Services", icon: Briefcase, group: "Grow" },
  { href: "/app/founder/automations", label: "Automations", icon: Workflow, group: "Grow" },
  { href: "/app/founder/settings", label: "Settings", icon: Settings, group: "System" },
];
export const FOUNDER_GROUPS = ["Run the day", "Businesses", "Create", "Grow", "System"];

export function navFor(sector: Sector) {
  return sector === "founder"
    ? { items: FOUNDER_NAV, groups: FOUNDER_GROUPS }
    : { items: NAV, groups: NAV_GROUPS };
}
