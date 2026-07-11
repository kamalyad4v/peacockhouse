"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Plus, 
  Eye, 
  ArrowUpRight, 
  DollarSign 
} from "lucide-react";
import React from "react";

interface Stats {
  products: number;
  orders: number;
  users: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("pk_token");
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/stats", { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders || []);
        }
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
        <p className="font-serif text-2xl sm:text-3xl text-white">{loading ? "—" : value}</p>
      </div>
    </div>
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-400";
      case "processing":
        return "bg-cyan-500/10 text-cyan-400";
      case "shipped":
        return "bg-emerald-500/10 text-emerald-400";
      case "delivered":
        return "bg-indigo-500/10 text-indigo-400";
      case "cancelled":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-white/5 text-white/50";
    }
  };

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
          href="/admin/orders"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm tracking-wider text-white/70 border border-white/10 hover:border-white/25 hover:text-white transition-all"
        >
          <ShoppingCart className="w-4 h-4" strokeWidth={1.4} />
          Manage Orders
        </Link>
        <Link
          href="/marketplace"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm tracking-wider text-[#D4AF37] border border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.05)] transition-all"
        >
          <ArrowUpRight className="w-4 h-4" strokeWidth={1.4} />
          Visit Store
        </Link>
      </div>

      {/* Stats Grid (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          icon={TrendingUp} 
          label="Total Revenue" 
          value={`₹${stats.revenue.toLocaleString("en-IN")}`} 
          color="#D4AF37" 
          bg="rgba(212,175,55,0.1)" 
        />
        <StatCard 
          icon={ShoppingCart} 
          label="Total Orders" 
          value={stats.orders} 
          color="#097969" 
          bg="rgba(9,121,105,0.1)" 
        />
        <StatCard 
          icon={Package} 
          label="Total Products" 
          value={stats.products} 
          color="#0F52BA" 
          bg="rgba(15,82,186,0.1)" 
        />
        <StatCard 
          icon={Users} 
          label="Registered Customers" 
          value={stats.users} 
          color="#A855F7" 
          bg="rgba(168,85,247,0.1)" 
        />
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)" }} />

      {/* Recent Orders section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-[#D4AF37] text-xs tracking-widest uppercase hover:text-[#F3E5AB] transition-colors flex items-center gap-1">
            Manage All <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-white/3 animate-pulse" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12 rounded-xl" style={{ border: "1px dashed rgba(212,175,55,0.15)", background: "rgba(15,20,30,0.4)" }}>
            <ShoppingCart className="w-12 h-12 text-white/10 mx-auto mb-3" strokeWidth={0.8} />
            <p className="text-white/30 text-sm">No orders yet</p>
            <p className="text-xs text-white/20 mt-1">Pending purchases from the store will appear here</p>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Order ID", "Customer", "Date", "Total Paid", "Status", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] tracking-widest uppercase text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr
                    key={o.id}
                    style={{
                      background: i % 2 === 0 ? "rgba(15,20,30,0.5)" : "rgba(10,13,20,0.5)",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                    className="hover:bg-white/3 transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-white/40">#{o.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-white/80 font-medium">
                          {o.shipping_address?.name || o.customer_name || "Guest Customer"}
                        </span>
                        <span className="text-xs text-white/30">
                          {o.shipping_address?.email || o.customer_email || "No Email"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-white/40">
                      {new Date(o.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#D4AF37]">₹{Number(o.total).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] tracking-wider uppercase font-semibold ${getStatusBadgeClass(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link href="/admin/orders" className="text-xs text-[#D4AF37] hover:underline">
                        Manage
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
