"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import Navbar from "@/components/marketplace/Navbar";
import ProductCard from "@/components/marketplace/ProductCard";
import { Product, getCart, getCartCount } from "@/lib/cart";
import { Toaster } from "sonner";
import React from "react";

const CATEGORIES = ["All", "Silk", "Cotton", "Designer", "Handcrafted"];
const SORT_OPTIONS = [
  { value: "default", label: "Featured First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name A-Z" },
];

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(() => {
    setCartCount(getCartCount(getCart()));
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.fabric.toLowerCase().includes(q) || p.color.toLowerCase().includes(q)
      );
    }
    result = result.filter((p) => p.price <= maxPrice);

    switch (sort) {
      case "price_asc": result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "name_asc": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFiltered(result);
  }, [products, category, search, sort, maxPrice]);

  return (
    <div className="min-h-screen" style={{ background: "var(--pk-bg)" }}>
      <Navbar />
      <Toaster theme="dark" position="bottom-center" toastOptions={{ style: { background: "rgba(10,13,20,0.9)", color: "#F8F9FA", border: "1px solid rgba(212,175,55,0.25)", backdropFilter: "blur(12px)" } }} />

      {/* Hero Banner */}
      <div className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full opacity-15" style={{ background: "radial-gradient(circle, rgba(9,121,105,0.4) 0%, transparent 70%)", filter: "blur(40px)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p style={{ fontFamily: "var(--font-manrope)", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.75)" }} className="mb-4">
            The Collection · Season 2025
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-white leading-tight mb-6">
            Woven in{" "}
            <span className="italic" style={{ color: "#F3E5AB" }}>Thread & Gold</span>
          </h1>
          <p className="text-white/50 text-sm tracking-widest max-w-xl mx-auto">
            DISCOVER OUR CURATED COLLECTION OF HANDCRAFTED SAREES FROM ACROSS INDIA
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5))" }} />
            <span className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase">{products.length} Pieces</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.5), transparent)" }} />
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="sticky top-16 z-40 border-y border-[rgba(212,175,55,0.1)]" style={{ background: "rgba(5,7,10,0.95)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" strokeWidth={1.4} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sarees, fabrics..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[rgba(212,175,55,0.4)] transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-white/30" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-4 py-1.5 text-xs tracking-widest uppercase rounded transition-all duration-200"
                style={{
                  background: category === cat ? "#D4AF37" : "rgba(255,255,255,0.04)",
                  color: category === cat ? "#000" : "rgba(255,255,255,0.5)",
                  border: `1px solid ${category === cat ? "#D4AF37" : "rgba(255,255,255,0.08)"}`,
                  fontWeight: category === cat ? 600 : 400,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort + Filter toggle */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-xs tracking-wider text-white/60 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-[rgba(212,175,55,0.4)] cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-white/60 border border-white/10 rounded hover:border-[rgba(212,175,55,0.3)] hover:text-white transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>
        </div>

        {/* Expandable filter panel */}
        {showFilters && (
          <div className="border-t border-white/5 px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-7xl mx-auto">
              <label className="block text-xs text-white/50 tracking-widest uppercase mb-2">
                Max Price: ₹{maxPrice.toLocaleString("en-IN")}
              </label>
              <input
                type="range"
                min={1000}
                max={100000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full max-w-xs accent-[#D4AF37]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden" style={{ background: "rgba(15,20,30,0.7)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="aspect-[3/4] bg-white/5 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-white/5 rounded animate-pulse w-3/4" />
                  <div className="h-5 bg-white/5 rounded animate-pulse" />
                  <div className="h-4 bg-white/5 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Filter className="w-16 h-16 text-white/10 mx-auto mb-4" strokeWidth={0.8} />
            <p className="font-serif text-2xl text-white/40">No sarees found</p>
            <p className="text-sm text-white/25 mt-2">Try adjusting your filters or search term</p>
            <button
              onClick={() => { setCategory("All"); setSearch(""); setMaxPrice(100000); }}
              className="mt-6 px-6 py-2.5 border border-[rgba(212,175,55,0.4)] text-[#D4AF37] text-sm tracking-wider uppercase hover:bg-[rgba(212,175,55,0.05)] transition-all rounded"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-white/30 text-xs tracking-widest uppercase mb-8">
              Showing {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} onCartChange={refreshCart} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer spacer */}
      <div className="h-20" />
    </div>
  );
}
