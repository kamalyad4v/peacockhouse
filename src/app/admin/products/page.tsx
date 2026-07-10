"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Search, Package, AlertCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import React from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchProducts = async () => {
    const token = localStorage.getItem("pk_token");
    try {
      const res = await fetch("/api/products", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setProducts(data.products || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const token = localStorage.getItem("pk_token");
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success(`"${name}" deleted`);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Toaster theme="dark" position="bottom-center" toastOptions={{ style: { background: "rgba(10,13,20,0.9)", color: "#F8F9FA", border: "1px solid rgba(212,175,55,0.25)" } }} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p style={{ fontFamily: "var(--font-manrope)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.6)" }} className="mb-1">
            Product Management
          </p>
          <h1 className="font-serif text-4xl font-light text-white">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wider text-black transition-all"
          style={{ background: "#D4AF37" }}
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" strokeWidth={1.4} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 rounded-lg focus:outline-none transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.4)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 rounded-xl" style={{ border: "1px dashed rgba(212,175,55,0.15)", background: "rgba(15,20,30,0.4)" }}>
          <Package className="w-16 h-16 text-white/10 mx-auto mb-4" strokeWidth={0.8} />
          <p className="font-serif text-xl text-white/30">{search ? "No products match your search" : "No products yet"}</p>
          {!search && (
            <Link href="/admin/products/new" className="mt-4 inline-block text-[#D4AF37] text-sm hover:underline">
              Add your first product →
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["#", "Product", "Category", "Fabric", "Price", "Stock", "Featured", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{
                      background: i % 2 === 0 ? "rgba(15,20,30,0.5)" : "rgba(10,13,20,0.5)",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                    className="hover:bg-white/3 transition-colors group"
                  >
                    <td className="px-4 py-3 text-xs text-white/20 font-mono">{p.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image_url} alt={p.name} className="w-10 h-12 object-cover rounded flex-shrink-0" />
                        <span className="text-sm text-white/80 font-medium leading-tight max-w-[200px] truncate">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/40">{p.category}</td>
                    <td className="px-4 py-3 text-xs text-white/40">{p.fabric}</td>
                    <td className="px-4 py-3 text-sm text-[#D4AF37] font-medium">₹{Number(p.price).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] tracking-wider font-medium ${p.in_stock ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                        {p.in_stock ? "In Stock" : "Out"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.featured ? (
                        <span className="px-2 py-0.5 rounded text-[10px] tracking-wider bg-[rgba(212,175,55,0.1)] text-[#D4AF37]">Yes</span>
                      ) : (
                        <span className="text-[10px] text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="w-8 h-8 flex items-center justify-center rounded border border-transparent hover:border-[rgba(212,175,55,0.3)] hover:text-[#D4AF37] text-white/30 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deleting === p.id}
                          className="w-8 h-8 flex items-center justify-center rounded border border-transparent hover:border-red-500/30 hover:text-red-400 text-white/30 transition-all"
                          title="Delete"
                        >
                          {deleting === p.id ? (
                            <div className="w-3.5 h-3.5 border border-red-400/50 border-t-red-400 rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-white/5 text-xs text-white/20">
            {filtered.length} {filtered.length === 1 ? "product" : "products"} total
          </div>
        </div>
      )}
    </div>
  );
}
