"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu, X, Shield, ChevronRight } from "lucide-react";
import { isAdmin, logout, getUser } from "@/lib/auth";
import React from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      router.replace("/auth/login");
    } else {
      setReady(true);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--pk-bg)" }}>
        <div className="w-8 h-8 border-2 border-[rgba(212,175,55,0.3)] border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  const user = getUser();

  return (
    <div className="min-h-screen flex" style={{ background: "var(--pk-bg)" }}>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          background: "rgba(5,7,10,0.98)",
          borderRight: "1px solid rgba(212,175,55,0.1)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(212,175,55,0.1)]">
          <Link href="/admin" className="flex items-center gap-3">
            <FeatherMark />
            <div>
              <p className="font-serif text-sm italic text-[#F3E5AB]">Admin Portal</p>
              <p style={{ fontFamily: "var(--font-manrope)", fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(212,175,55,0.5)" }}>Peacock Blouse House</p>
            </div>
          </Link>
          <button className="lg:hidden text-white/40" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin badge */}
        <div className="mx-4 mt-4 px-3 py-2.5 rounded-lg" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)" }}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.4} />
            <div>
              <p className="text-xs text-white/80 font-medium">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-[#D4AF37]/70 tracking-wider">Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group"
                style={{
                  background: active ? "rgba(212,175,55,0.1)" : "transparent",
                  color: active ? "#D4AF37" : "rgba(255,255,255,0.45)",
                  border: active ? "1px solid rgba(212,175,55,0.2)" : "1px solid transparent",
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.4} />
                <span style={{ fontFamily: "var(--font-manrope)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>{label}</span>
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/5 space-y-2">
          <Link href="/marketplace" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/30 hover:text-white/60 transition-colors text-xs tracking-wider">
            ← View Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all text-xs tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-white/5" style={{ background: "rgba(5,7,10,0.95)" }}>
          <button onClick={() => setSidebarOpen(true)} className="text-white/60">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-serif italic text-[#F3E5AB] text-sm">Admin Portal</span>
          <div className="w-5" />
        </div>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function FeatherMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <ellipse cx="17" cy="17" rx="14" ry="16" stroke="#D4AF37" strokeOpacity="0.6" />
      <ellipse cx="17" cy="17" rx="9" ry="11" stroke="#097969" strokeOpacity="0.7" />
      <ellipse cx="17" cy="17" rx="5" ry="7" stroke="#0F52BA" strokeOpacity="0.8" />
      <circle cx="17" cy="17" r="2" fill="#D4AF37" />
    </svg>
  );
}
