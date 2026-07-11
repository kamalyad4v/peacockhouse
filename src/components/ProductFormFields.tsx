import React from "react";

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
