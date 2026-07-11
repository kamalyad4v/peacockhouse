"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { ProductFormFields } from "@/components/ProductFormFields";
import React from "react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("pk_token");
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.product) {
          setForm({
            ...data.product,
            price: String(data.product.price),
            original_price: data.product.original_price ? String(data.product.original_price) : "",
          });
        }
      } catch {}
      setLoading(false);
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f: any) => ({ ...f, [k]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const token = localStorage.getItem("pk_token");
    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          original_price: form.original_price ? parseFloat(form.original_price) : null,
          images: form.image_url ? [form.image_url] : [],
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Failed to update product");
        return;
      }

      toast.success("Product updated successfully!");
      setTimeout(() => router.push("/admin/products"), 1000);
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[rgba(212,175,55,0.3)] border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-20">
        <p className="font-serif text-xl text-white/30">Product not found</p>
        <Link href="/admin/products" className="mt-4 inline-block text-[#D4AF37] hover:underline text-sm">← Back to products</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Toaster theme="dark" position="bottom-center" toastOptions={{ style: { background: "rgba(10,13,20,0.9)", color: "#F8F9FA", border: "1px solid rgba(212,175,55,0.25)" } }} />

      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-white/30 hover:text-[#D4AF37] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p style={{ fontFamily: "var(--font-manrope)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.6)" }} className="mb-0.5">Edit Product</p>
          <h1 className="font-serif text-3xl font-light text-white truncate max-w-xs">{form.name}</h1>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-red-300" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <ProductFormFields form={form} update={update} />

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold tracking-wider text-black transition-all"
            style={{ background: saving ? "rgba(212,175,55,0.6)" : "#D4AF37" }}
          >
            {saving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save className="w-4 h-4" strokeWidth={2} />}
            {saving ? "Saving..." : "Update Product"}
          </button>
          <Link
            href="/admin/products"
            className="flex items-center px-6 py-3 rounded-lg text-sm text-white/50 border border-white/10 hover:border-white/25 hover:text-white transition-all"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
