"use client";

import { ShoppingCart } from "lucide-react";
import React from "react";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p style={{ fontFamily: "var(--font-manrope)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.6)" }} className="mb-1">
          Order Management
        </p>
        <h1 className="font-serif text-4xl font-light text-white">Orders</h1>
      </div>

      <div className="text-center py-24 rounded-xl" style={{ border: "1px dashed rgba(212,175,55,0.15)", background: "rgba(15,20,30,0.4)" }}>
        <ShoppingCart className="w-16 h-16 text-white/10 mx-auto mb-4" strokeWidth={0.8} />
        <p className="font-serif text-2xl text-white/30">No orders yet</p>
        <p className="text-sm text-white/20 mt-2">Orders from your store will appear here</p>
      </div>
    </div>
  );
}
