"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ShoppingCart, Users, TrendingUp, Plus, Eye, ArrowUpRight } from "lucide-react";
import React from "react";

interface Stats {
  products: number;
  orders: number;
  users: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("pk_token");
    const fetchData = async () => {
      try {
        const pRes = await fetch("/api/products", { headers: { Authorization: `Bearer ${token}` } });
        const pData = await pRes.json();
        const products = pData.products || [];
        setRecentProducts(products.slice(0, 5));
        setStats((s) => ({ ...s, products: products.length }));
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
    bg,
  }: {
    icon: any;
    label: string;
    value: number | string;
    color: string;
    bg: string;
  }) => (
    <div
      className="rounded-xl p-6 flex items-center gap-5"
      style={{
        background: "rgba(15,20,30,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
        <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-white/40 text-xs tracking-widest uppercase mb-1">{label}</p>
        <p className="font-serif text-3xl text-white">{loading ? "—" : value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p style={{ fontFamily: "var(--font-manrope)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.6)" }} className="mb-1">
          Admin Dashboard
        </p>
        <h1 className="font-serif text-4xl font-light text-white">Overview</h1>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wider text-black transition-all"
          style={{ background: "#D4AF37" }}
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          Add Product
        </Link>
        <Link
          href="/admin/products"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm tracking-wider text-white/70 border border-white/10 hover:border-white/25 hover:text-white transition-all"
        >
          <Eye className="w-4 h-4" strokeWidth={1.4} />
          View All Products
        </Link>
        <Link
          href="/marketplace"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm tracking-wider text-[#D4AF37] border border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.05)] transition-all"
        >
          <ArrowUpRight className="w-4 h-4" strokeWidth={1.4} />
          Visit Store
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard icon={Package} label="Total Products" value={stats.products} color="#D4AF37" bg="rgba(212,175,55,0.1)" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.orders || 0} color="#097969" bg="rgba(9,121,105,0.1)" />
        <StatCard icon={Users} label="Customers" value={stats.users || 0} color="#0F52BA" bg="rgba(15,82,186,0.1)" />
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)" }} />

      {/* Recent Products */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-white">Recent Products</h2>
          <Link href="/admin/products" className="text-[#D4AF37] text-xs tracking-widest uppercase hover:text-[#F3E5AB] transition-colors flex items-center gap-1">
            View All <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-white/3 animate-pulse" />
            ))}
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="text-center py-12 rounded-xl" style={{ border: "1px dashed rgba(212,175,55,0.15)", background: "rgba(15,20,30,0.4)" }}>
            <Package className="w-12 h-12 text-white/10 mx-auto mb-3" strokeWidth={0.8} />
            <p className="text-white/30 text-sm">No products yet</p>
            <Link href="/admin/products/new" className="mt-3 inline-block text-[#D4AF37] text-sm hover:underline">
              Add your first product →
            </Link>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Product", "Category", "Price", "Stock", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] tracking-widest uppercase text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{
                      background: i % 2 === 0 ? "rgba(15,20,30,0.5)" : "rgba(10,13,20,0.5)",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                    className="hover:bg-white/3 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image_url} alt={p.name} className="w-10 h-12 object-cover rounded" />
                        <span className="text-sm text-white/80 font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-white/40 tracking-wider">{p.category}</td>
                    <td className="px-5 py-4 text-sm text-[#D4AF37]">₹{Number(p.price).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] tracking-wider font-medium ${p.in_stock ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                        {p.in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/products/${p.id}/edit`} className="text-xs text-[#D4AF37] hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
