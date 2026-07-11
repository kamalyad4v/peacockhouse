"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  TrendingUp, 
  X, 
  CheckCircle,
  Truck,
  Package,
  AlertCircle
} from "lucide-react";
import { toast, Toaster } from "sonner";

interface Order {
  id: number;
  user_id: number | null;
  total: number;
  status: string;
  items: any[];
  shipping_address: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  created_at: string;
  customer_name?: string;
  customer_email?: string;
}

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    const token = localStorage.getItem("pk_token");
    try {
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.error || "Failed to fetch orders");
      }
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    const token = localStorage.getItem("pk_token");
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Order #${id} status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder?.id === id) {
          setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return { text: "text-amber-400 border-amber-500/20 bg-amber-500/5", label: "Pending" };
      case "processing":
        return { text: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5", label: "Processing" };
      case "shipped":
        return { text: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", label: "Shipped" };
      case "delivered":
        return { text: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5", label: "Delivered" };
      case "cancelled":
        return { text: "text-red-400 border-red-500/20 bg-red-500/5", label: "Cancelled" };
      default:
        return { text: "text-white/40 border-white/10 bg-white/5", label: status };
    }
  };

  const filtered = orders.filter((o) => {
    const term = search.toLowerCase();
    const addressName = o.shipping_address?.name?.toLowerCase() || "";
    const addressEmail = o.shipping_address?.email?.toLowerCase() || "";
    const customerName = o.customer_name?.toLowerCase() || "";
    const orderIdStr = String(o.id);

    return (
      addressName.includes(term) ||
      addressEmail.includes(term) ||
      customerName.includes(term) ||
      orderIdStr.includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <Toaster theme="dark" position="bottom-center" toastOptions={{ style: { background: "rgba(10,13,20,0.9)", color: "#F8F9FA", border: "1px solid rgba(212,175,55,0.25)" } }} />

      {/* Header */}
      <div>
        <p style={{ fontFamily: "var(--font-manrope)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.6)" }} className="mb-1">
          Order Management
        </p>
        <h1 className="font-serif text-4xl font-light text-white">Orders</h1>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" strokeWidth={1.4} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer, email or ID..."
          className="w-full pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 rounded-lg focus:outline-none transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.4)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
        />
      </div>

      {/* Table / Grid */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 rounded-xl" style={{ border: "1px dashed rgba(212,175,55,0.15)", background: "rgba(15,20,30,0.4)" }}>
          <ShoppingCart className="w-16 h-16 text-white/10 mx-auto mb-4" strokeWidth={0.8} />
          <p className="font-serif text-2xl text-white/30">{search ? "No orders match search" : "No orders yet"}</p>
          <p className="text-sm text-white/20 mt-2">Orders from checkout will appear here dynamically</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Order ID", "Customer", "Date", "Items Count", "Total Paid", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] tracking-widest uppercase text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => {
                  const style = getStatusStyle(o.status);
                  return (
                    <tr
                      key={o.id}
                      style={{
                        background: i % 2 === 0 ? "rgba(15,20,30,0.5)" : "rgba(10,13,20,0.5)",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                      className="hover:bg-white/3 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono text-xs text-white/50">#{o.id}</td>
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
                      <td className="px-5 py-4 text-xs text-white/50">
                        {new Date(o.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-4 text-xs text-white/60 font-mono">
                        {o.items?.reduce((sum, item) => sum + (item.quantity || 1), 0)} pcs
                      </td>
                      <td className="px-5 py-4 text-sm text-[#D4AF37] font-medium">
                        ₹{Number(o.total).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full border text-[10px] tracking-wider font-semibold uppercase ${style.text}`}>
                          {style.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 hover:border-[#D4AF37]/50 text-white/60 hover:text-white text-xs transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Popup Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div 
            className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            style={{ 
              background: "rgba(10,13,20,0.98)", 
              border: "1px solid rgba(212,175,55,0.2)",
              backdropFilter: "blur(24px)"
            }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/5">
              <div>
                <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase">Order Detailed Report</span>
                <h2 className="font-serif text-xl text-white">Order #{selectedOrder.id}</h2>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Order Status Controller */}
              <div className="p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <p className="text-[10px] tracking-widest text-white/30 uppercase">Operational Status</p>
                  <p className="text-sm font-semibold uppercase mt-0.5 text-white/80">
                    Current: {selectedOrder.status}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/40">Change Status:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    disabled={updatingId === selectedOrder.id}
                    className="pl-3 pr-8 py-1.5 text-xs text-white bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#D4AF37]/50 cursor-pointer disabled:opacity-50"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status} style={{ background: "#0A0D14" }}>
                        {status.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid: Customer & Delivery Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                {/* Shipping Details */}
                <div className="p-5 rounded-xl space-y-3" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <h3 className="font-serif text-base border-b border-white/5 pb-2 text-[#D4AF37] flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Shipping Address
                  </h3>
                  <div className="space-y-2 text-white/70">
                    <p className="flex items-center gap-2 text-xs"><User className="w-3.5 h-3.5 text-white/30" /> {selectedOrder.shipping_address?.name}</p>
                    <p className="flex items-center gap-2 text-xs"><Mail className="w-3.5 h-3.5 text-white/30" /> {selectedOrder.shipping_address?.email}</p>
                    <p className="flex items-center gap-2 text-xs"><Phone className="w-3.5 h-3.5 text-white/30" /> {selectedOrder.shipping_address?.phone}</p>
                    <div className="text-xs pl-5 border-l border-white/5 text-white/50 space-y-1">
                      <p>{selectedOrder.shipping_address?.address}</p>
                      <p>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.pincode}</p>
                    </div>
                  </div>
                </div>

                {/* Logistics Info */}
                <div className="p-5 rounded-xl space-y-3" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <h3 className="font-serif text-base border-b border-white/5 pb-2 text-[#D4AF37] flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Order Info & Timeline
                  </h3>
                  <div className="space-y-2 text-xs text-white/70">
                    <div className="flex justify-between">
                      <span className="text-white/30 uppercase tracking-wider text-[10px]">Payment Method</span>
                      <span className="font-mono">Credit Card (Simulated)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/30 uppercase tracking-wider text-[10px]">Placed On</span>
                      <span>
                        {new Date(selectedOrder.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/30 uppercase tracking-wider text-[10px]">Registry Link</span>
                      <span>{selectedOrder.user_id ? `User Account ID: ${selectedOrder.user_id}` : "Guest Checkout"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h3 className="font-serif text-base border-b border-white/5 pb-2 text-[#D4AF37] flex items-center gap-2">
                  <Package className="w-4 h-4" /> Ordered Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.product.id} className="flex gap-4 p-3 rounded-lg hover:bg-white/3 transition-all" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
                      <div className="w-14 h-18 rounded overflow-hidden bg-white/5 flex-shrink-0">
                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif text-sm text-white/80 leading-tight">{item.product.name}</h4>
                          <p className="text-[10px] text-white/35 mt-0.5">{item.product.fabric} · {item.product.color}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs mt-1">
                          <span className="text-white/40">₹{item.product.price.toLocaleString("en-IN")} x {item.quantity}</span>
                          <span className="text-[#D4AF37] font-medium">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-black/20">
              <span className="text-xs text-white/40">Verify physical address before shipping</span>
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/50">Total Paid:</span>
                <span className="text-[#D4AF37] font-serif text-xl">₹{Number(selectedOrder.total).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
