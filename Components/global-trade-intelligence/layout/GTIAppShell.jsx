
"use client";

import { useState } from "react";
import GTISidebar from "./GTISidebar";

export default function GTIAppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="gti-shell">
      <GTISidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="gti-mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="gti-shell-content">
        <div className="gti-mobile-header">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="gti-mobile-menu-button"
            aria-label="Open navigation"
          >
            <span />
            <span />
            <span />
          </button>

          <span className="gti-mobile-brand">
            <span className="gti-brand-mark">GT</span>
            Global Trade Intelligence
          </span>
        </div>

        <div className="gti-page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
