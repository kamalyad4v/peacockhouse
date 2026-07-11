"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { ProductFormFields } from "@/components/ProductFormFields";
import React from "react";

const CATEGORIES = ["Silk", "Cotton", "Designer", "Handcrafted"];

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  original_price: "",
  category: "Silk",
  fabric: "",
  color: "",
  image_url: "",
  featured: false,
  in_stock: true,
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.price || !form.image_url) {
      setError("Name, price, and image URL are required");
      return;
    }

    setSaving(true);
    const token = localStorage.getItem("pk_token");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
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
        setError(d.error || "Failed to create product");
        return;
      }

      toast.success("Product created successfully!");
      setTimeout(() => router.push("/admin/products"), 1000);
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Toaster theme="dark" position="bottom-center" toastOptions={{ style: { background: "rgba(10,13,20,0.9)", color: "#F8F9FA", border: "1px solid rgba(212,175,55,0.25)" } }} />

      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-white/30 hover:text-[#D4AF37] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p style={{ fontFamily: "var(--font-manrope)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.6)" }} className="mb-0.5">New Product</p>
          <h1 className="font-serif text-3xl font-light text-white">Add Product</h1>
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
            {saving ? "Saving..." : "Create Product"}
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
