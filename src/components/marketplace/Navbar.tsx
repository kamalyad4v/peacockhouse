"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, User, LogOut, Menu, X, Shield, ChevronDown } from "lucide-react";
import { getUser, logout, isAuthenticated, isAdmin } from "@/lib/auth";
import { getCart, getCartCount } from "@/lib/cart";
import CartDrawer from "@/components/marketplace/CartDrawer";
import React from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [authed, setAuthed] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const update = () => {
      setAuthed(isAuthenticated());
      setAdmin(isAdmin());
      const user = getUser();
      setUserName(user?.name || "");
      setCartCount(getCartCount(getCart()));
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setAuthed(false);
    setAdmin(false);
    setUserMenuOpen(false);
    router.push("/");
  };

  const isMarket = pathname?.startsWith("/marketplace") || pathname?.startsWith("/admin");

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || isMarket
            ? "bg-[rgba(5,7,10,0.92)] backdrop-blur-xl border-b border-[rgba(212,175,55,0.12)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <FeatherMark />
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-base italic text-[#F3E5AB] group-hover:text-[#D4AF37] transition-colors">
                  Peacock
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-manrope), Manrope, sans-serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(212,175,55,0.75)",
                    marginTop: "-2px",
                  }}
                >
                  Blouse House
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="/" label="Home" active={pathname === "/"} />
              <NavLink href="/marketplace" label="Shop" active={pathname?.startsWith("/marketplace")} />
              <NavLink href="/#about" label="About" active={false} />
              {admin && (
                <NavLink href="/admin" label="Admin" active={pathname?.startsWith("/admin")} admin />
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-white/70 hover:text-[#D4AF37] transition-colors" strokeWidth={1.4} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {authed ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(212,175,55,0.25)] hover:border-[rgba(212,175,55,0.6)] transition-all text-sm text-white/80"
                  >
                    <User className="w-4 h-4" strokeWidth={1.4} />
                    <span className="hidden sm:inline max-w-[80px] truncate">{userName}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-44 rounded-lg border border-[rgba(212,175,55,0.2)] bg-[rgba(10,13,20,0.97)] backdrop-blur-xl shadow-2xl overflow-hidden">
                      {admin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-[#D4AF37] hover:bg-white/5 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors border-t border-white/5"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium tracking-wider text-[#D4AF37] border border-[rgba(212,175,55,0.4)] hover:border-[#D4AF37] hover:bg-[rgba(212,175,55,0.05)] transition-all rounded"
                >
                  <User className="w-4 h-4" strokeWidth={1.4} />
                  Sign In
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden w-10 h-10 flex items-center justify-center"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? (
                  <X className="w-5 h-5 text-white/70" />
                ) : (
                  <Menu className="w-5 h-5 text-white/70" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[rgba(5,7,10,0.98)] border-t border-[rgba(212,175,55,0.1)] px-4 py-4 space-y-2">
            <MobileNavLink href="/" label="Home" onClick={() => setMenuOpen(false)} />
            <MobileNavLink href="/marketplace" label="Shop" onClick={() => setMenuOpen(false)} />
            <MobileNavLink href="/#about" label="About" onClick={() => setMenuOpen(false)} />
            {admin && <MobileNavLink href="/admin" label="Admin Panel" onClick={() => setMenuOpen(false)} />}
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCartChange={() => setCartCount(getCartCount(getCart()))} />
    </>
  );
}

function NavLink({ href, label, active, admin }: { href: string; label: string; active?: boolean; admin?: boolean }) {
  return (
    <Link
      href={href}
      style={{
        fontFamily: "var(--font-manrope), Manrope, sans-serif",
        fontSize: "0.72rem",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: admin
          ? "#D4AF37"
          : active
          ? "rgba(248,249,250,1)"
          : "rgba(248,249,250,0.55)",
        transition: "color 0.2s",
        fontWeight: 400,
      }}
      className="hover:text-white transition-colors"
    >
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-2 py-3 text-sm tracking-wider uppercase text-white/70 hover:text-[#D4AF37] border-b border-white/5 transition-colors"
    >
      {label}
    </Link>
  );
}

function FeatherMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <ellipse cx="17" cy="17" rx="14" ry="16" stroke="#D4AF37" strokeOpacity="0.6" />
      <ellipse cx="17" cy="17" rx="9" ry="11" stroke="#097969" strokeOpacity="0.7" />
      <ellipse cx="17" cy="17" rx="5" ry="7" stroke="#0F52BA" strokeOpacity="0.8" />
      <circle cx="17" cy="17" r="2" fill="#D4AF37" />
    </svg>
  );
}
