import type { LucideIcon } from "lucide-react";
import {
  Building2,
  ClipboardCheck,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  Leaf,
  Map,
  Package,
  RefreshCw,
  ScrollText,
  Shield,
  Users,
} from "lucide-react";

export interface NavItem {
  labelKey: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  labelKey: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    labelKey: "sidebar.main",
    items: [
      { labelKey: "navigation.dashboard", href: "/", icon: LayoutDashboard },
      { labelKey: "navigation.farmers", href: "/farmers", icon: Users },
      { labelKey: "navigation.farmMap", href: "/farm-map", icon: Map },
    ],
  },
  {
    labelKey: "sidebar.operations",
    items: [
      { labelKey: "navigation.inspections", href: "/inspections", icon: ClipboardCheck },
      { labelKey: "navigation.traceability", href: "/traceability", icon: Package },
      { labelKey: "navigation.training", href: "/training", icon: GraduationCap },
    ],
  },
  {
    labelKey: "sidebar.compliance",
    items: [
      { labelKey: "navigation.eudr", href: "/eudr", icon: Leaf },
      { labelKey: "navigation.reports", href: "/reports", icon: FileBarChart },
    ],
  },
  {
    labelKey: "sidebar.admin",
    items: [
      { labelKey: "navigation.adminUsers", href: "/admin/users", icon: Shield },
      { labelKey: "navigation.adminCooperatives", href: "/admin/cooperatives", icon: Building2 },
      { labelKey: "navigation.adminSync", href: "/admin/sync", icon: RefreshCw },
      { labelKey: "navigation.adminAudit", href: "/admin/audit", icon: ScrollText },
    ],
  },
];
