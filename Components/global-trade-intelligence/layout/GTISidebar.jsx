
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Map,
  ChartNoAxesCombined,
  TrendingUp,
  Newspaper,
  Calculator,
  ChevronLeft,
  ChevronRight,
  X,
  Globe2,
} from "lucide-react";

const intelligenceItems = [
  {
    label: "Overview",
    href: "/global-trade-intelligence",
    icon: LayoutDashboard,
  },
  {
    label: "Trade Flows",
    href: "/global-trade-intelligence/trade-flows",
    icon: ArrowLeftRight,
  },
  {
    label: "Country Intelligence",
    href: "/global-trade-intelligence/countries",
    icon: Map,
  },
  {
    label: "Trade Trends",
    href: "/global-trade-intelligence/trends",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Commodities",
    href: "/global-trade-intelligence/commodities",
    icon: TrendingUp,
  },
  {
    label: "Trade News",
    href: "/global-trade-intelligence/news",
    icon: Newspaper,
  },
];

const toolItems = [
  {
    label: "Trade Tools",
    href: "/global-trade-intelligence/tools",
    icon: Calculator,
  },
];

function NavigationItem({
  item,
  collapsed,
  onNavigate,
}) {
  const pathname = usePathname();
  const Icon = item.icon;

  const isActive =
    item.href === "/global-trade-intelligence"
      ? pathname === item.href
      : pathname === item.href ||
        pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={`gti-nav-item ${
        isActive ? "gti-nav-item-active" : ""
      }`}
    >
      <Icon size={19} strokeWidth={1.8} />

      {!collapsed && (
        <span className="gti-nav-label">{item.label}</span>
      )}

      {collapsed && (
        <span className="gti-tooltip">{item.label}</span>
      )}
    </Link>
  );
}

export default function GTISidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`gti-sidebar ${
          collapsed ? "gti-sidebar-collapsed" : ""
        }`}
      >
        <div className="gti-sidebar-top">
          <Link
            href="/global-trade-intelligence"
            className="gti-brand"
          >
            <div className="gti-brand-mark">
              <Globe2 size={21} />
            </div>

            {!collapsed && (
              <div className="gti-brand-text">
                <span className="gti-brand-title">ONS INTELLIGENCE</span>
                <span className="gti-brand-subtitle">
                  Global Trade Intelligence
                </span>
              </div>
            )}
          </Link>

          <div className="gti-nav-section">
            {!collapsed && (
              <p className="gti-section-label">INTELLIGENCE</p>
            )}

            {intelligenceItems.map((item) => (
              <NavigationItem
                key={item.href}
                item={item}
                collapsed={collapsed}
              />
            ))}
          </div>

          <div className="gti-nav-section gti-tools-section">
            {!collapsed && (
              <p className="gti-section-label">TOOLS</p>
            )}

            {toolItems.map((item) => (
              <NavigationItem
                key={item.href}
                item={item}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="gti-collapse-button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span>Collapse sidebar</span>
            </>
          )}
        </button>
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`gti-mobile-sidebar ${
          mobileOpen ? "gti-mobile-sidebar-open" : ""
        }`}
      >
        <div className="gti-mobile-sidebar-header">
          <div className="gti-brand">
            <div className="gti-brand-mark">
              <Globe2 size={21} />
            </div>

            <div className="gti-brand-text">
              <span className="gti-brand-title">ONS INTELLIGENCE</span>
              <span className="gti-brand-subtitle">
                Global Trade Intelligence
              </span>
            </div>
          </div>

          <button
            type="button"
            className="gti-mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="gti-mobile-nav">
          <p className="gti-section-label">INTELLIGENCE</p>

          {intelligenceItems.map((item) => (
            <NavigationItem
              key={item.href}
              item={item}
              collapsed={false}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}

          <div className="gti-nav-section gti-tools-section">
            <p className="gti-section-label">TOOLS</p>

            {toolItems.map((item) => (
              <NavigationItem
                key={item.href}
                item={item}
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
