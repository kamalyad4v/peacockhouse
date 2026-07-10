"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
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

export function ProductFormFields({ form, update }: { form: any; update: any }) {
  const fields = [
    { key: "name", label: "Product Name", type: "text", placeholder: "e.g. Kanjivaram Silk Saree", required: true },
    { key: "image_url", label: "Image URL", type: "url", placeholder: "https://images.pexels.com/...", required: true },
    { key: "fabric", label: "Fabric / Material", type: "text", placeholder: "e.g. Pure Silk, Cotton-Silk" },
    { key: "color", label: "Color", type: "text", placeholder: "e.g. Ruby Red, Peacock Green" },
    { key: "price", label: "Selling Price (₹)", type: "number", placeholder: "0", required: true },
    { key: "original_price", label: "Original Price (₹, optional)", type: "number", placeholder: "0" },
  ];

  return (
    <>
      {fields.map(({ key, label, type, placeholder, required }) => (
        <Field key={key}>
          <FieldLabel required={required}>{label}</FieldLabel>
          <input
            type={type}
            value={form[key]}
            onChange={update(key)}
            placeholder={placeholder}
            required={required}
            min={type === "number" ? "0" : undefined}
            step={type === "number" ? "0.01" : undefined}
            className="w-full px-4 py-3 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
          />
        </Field>
      ))}

      <Field>
        <FieldLabel>Category</FieldLabel>
        <select
          value={form.category}
          onChange={update("category")}
          className="w-full px-4 py-3 rounded-lg text-white text-sm focus:outline-none transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          {["Silk", "Cotton", "Designer", "Handcrafted"].map((c) => (
            <option key={c} value={c} style={{ background: "#0A0D14" }}>{c}</option>
          ))}
        </select>
      </Field>

      <Field>
        <FieldLabel>Description</FieldLabel>
        <textarea
          value={form.description}
          onChange={update("description")}
          placeholder="Describe this saree — fabric, occasion, craftsmanship..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none transition-all resize-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
        />
      </Field>

      <div className="flex gap-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.in_stock}
            onChange={update("in_stock")}
            className="w-4 h-4 accent-[#D4AF37]"
          />
          <span className="text-sm text-white/60">In Stock</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={update("featured")}
            className="w-4 h-4 accent-[#D4AF37]"
          />
          <span className="text-sm text-white/60">Featured Product</span>
        </label>
      </div>

      {/* Preview */}
      {form.image_url && (
        <div className="mt-2">
          <FieldLabel>Image Preview</FieldLabel>
          <img
            src={form.image_url}
            alt="Preview"
            className="w-32 h-40 object-cover rounded-lg"
            style={{ border: "1px solid rgba(212,175,55,0.2)" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}
    </>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs tracking-widest uppercase" style={{ color: "rgba(212,175,55,0.55)" }}>
      {children} {required && <span className="text-red-400">*</span>}
    </label>
  );
}
