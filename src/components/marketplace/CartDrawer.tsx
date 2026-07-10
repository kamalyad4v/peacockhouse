"use client";

import { useState, useEffect } from "react";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { getCart, removeFromCart, updateQuantity, getCartTotal, CartItem } from "@/lib/cart";
import Link from "next/link";
import React from "react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCartChange: () => void;
}

export default function CartDrawer({ open, onClose, onCartChange }: CartDrawerProps) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, [open]);

  const handleRemove = (id: number) => {
    const updated = removeFromCart(id);
    setCart(updated);
    onCartChange();
  };

  const handleQty = (id: number, qty: number) => {
    if (qty < 1) { handleRemove(id); return; }
    const updated = updateQuantity(id, qty);
    setCart(updated);
    onCartChange();
  };

  const total = getCartTotal(cart);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md z-[201] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{
          background: "rgba(5,7,10,0.98)",
          borderLeft: "1px solid rgba(212,175,55,0.15)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(212,175,55,0.12)]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.4} />
            <h2 className="font-serif text-xl text-white">Your Cart</h2>
            {cart.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[rgba(212,175,55,0.15)] text-[#D4AF37] text-xs font-mono">
                {cart.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <ShoppingBag className="w-16 h-16 text-white/10 mb-4" strokeWidth={0.8} />
              <p className="font-serif text-xl text-white/40">Your cart is empty</p>
              <p className="text-sm text-white/25 mt-2">Add something beautiful from our collection</p>
              <Link
                href="/marketplace"
                onClick={onClose}
                className="mt-6 px-6 py-2.5 border border-[rgba(212,175,55,0.4)] text-[#D4AF37] text-sm tracking-wider uppercase hover:bg-[rgba(212,175,55,0.05)] transition-all rounded"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 py-4 border-b border-white/5">
                <div className="w-20 h-24 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm text-white leading-tight">{item.product.name}</h4>
                  <p className="text-xs text-white/40 mt-0.5">{item.product.fabric} · {item.product.color}</p>
                  <p className="text-[#D4AF37] font-medium mt-1 text-sm">
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2 border border-white/10 rounded px-2 py-1">
                      <button onClick={() => handleQty(item.product.id, item.quantity - 1)} className="text-white/50 hover:text-white transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm text-white w-4 text-center">{item.quantity}</span>
                      <button onClick={() => handleQty(item.product.id, item.quantity + 1)} className="text-white/50 hover:text-white transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[rgba(212,175,55,0.12)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm tracking-wider uppercase">Total</span>
              <span className="font-serif text-2xl text-white">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#D4AF37] text-black text-sm font-semibold tracking-widest uppercase rounded hover:bg-[#F3E5AB] transition-all"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-sm text-white/40 hover:text-white/70 transition-colors tracking-wider"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
