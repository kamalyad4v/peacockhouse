"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Home } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/marketplace/Navbar";
import { clearCart } from "@/lib/cart";
import { Toaster } from "sonner";
import React from "react";

export default function CheckoutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ background: "var(--pk-bg)" }}>
      <Navbar />
      <Toaster theme="dark" position="bottom-center" toastOptions={{ style: { background: "rgba(10,13,20,0.9)", color: "#F8F9FA", border: "1px solid rgba(212,175,55,0.25)" } }} />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
            <ShoppingBag className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.2} />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center">
            <span className="text-black text-xs font-bold">✓</span>
          </div>
        </div>

        <p style={{ fontFamily: "var(--font-manrope)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.6)" }} className="mb-3">
          Checkout
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
          Coming <span className="italic text-[#F3E5AB]">Soon</span>
        </h1>
        <p className="text-white/40 text-sm max-w-md leading-relaxed mb-10">
          Our secure checkout experience is being crafted with the same care as our sarees. 
          For purchases, please contact us directly at{" "}
          <span className="text-[#D4AF37]">atelier@peacockblouse.house</span>
        </p>

        <div className="flex gap-4">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold tracking-wider text-black rounded transition-all"
            style={{ background: "#D4AF37" }}
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={2} />
            Keep Shopping
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 text-sm text-white/60 border border-white/15 rounded hover:border-white/30 hover:text-white transition-all"
          >
            <Home className="w-4 h-4" strokeWidth={1.4} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
