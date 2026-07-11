import React, { useState, useRef } from "react";
import { Upload, Link2, FileImage, RefreshCw } from "lucide-react";

export function ProductFormFields({ form, update }: { form: any; update: any }) {
  const [uploading, setUploading] = useState(false);
  const [useUrlOnly, setUseUrlOnly] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fields = [
    { key: "name", label: "Product Name", type: "text", placeholder: "e.g. Kanjivaram Silk Saree", required: true },
    { key: "fabric", label: "Fabric / Material", type: "text", placeholder: "e.g. Pure Silk, Cotton-Silk" },
    { key: "color", label: "Color", type: "text", placeholder: "e.g. Ruby Red, Peacock Green" },
    { key: "price", label: "Selling Price (₹)", type: "number", placeholder: "0", required: true },
    { key: "original_price", label: "Original Price (₹, optional)", type: "number", placeholder: "0" },
  ];

  const handleUpload = async (file: File) => {
    setUploading(true);
    const token = localStorage.getItem("pk_token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        // Trigger the form state update passed down from parents
        update("image_url")({ target: { value: data.url } } as any);
      } else {
        alert(data.error || "Failed to upload image. Please check Cloudinary environment variables in .env.local.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <Field>
        <FieldLabel required={true}>Product Name</FieldLabel>
        <input
          type="text"
          value={form.name}
          onChange={update("name")}
          placeholder="e.g. Kanjivaram Silk Saree"
          required={true}
          className="w-full px-4 py-3 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
        />
      </Field>

      {/* Cloudinary Upload & Image URL Field */}
      <Field>
        <div className="flex justify-between items-center mb-1">
          <FieldLabel required={true}>Product Image</FieldLabel>
          <button
            type="button"
            onClick={() => setUseUrlOnly(!useUrlOnly)}
            className="text-[10px] tracking-widest uppercase text-[#D4AF37] hover:text-[#F3E5AB] transition-colors flex items-center gap-1"
          >
            {useUrlOnly ? (
              <>
                <Upload className="w-3 h-3" /> Upload File
              </>
            ) : (
              <>
                <Link2 className="w-3 h-3" /> Paste URL
              </>
            )}
          </button>
        </div>

        {useUrlOnly ? (
          <input
            type="url"
            value={form.image_url}
            onChange={update("image_url")}
            placeholder="https://images.pexels.com/..."
            required={true}
            className="w-full px-4 py-3 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
          />
        ) : (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full py-8 border border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              dragActive 
                ? "border-[#D4AF37] bg-[rgba(212,175,55,0.04)]" 
                : "border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/5"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" strokeWidth={1.5} />
                <span className="text-xs text-white/50">Uploading image to Cloudinary...</span>
              </div>
            ) : form.image_url ? (
              <div className="flex flex-col items-center gap-2">
                <FileImage className="w-8 h-8 text-green-400" strokeWidth={1.5} />
                <span className="text-xs text-green-400 font-medium">Image uploaded! Click or drag to replace</span>
                <span className="text-[10px] text-white/30 truncate max-w-xs px-4">{form.image_url}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-white/30 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                <span className="text-xs text-white/50">Drag & drop product image here, or <span className="text-[#D4AF37] underline">browse</span></span>
                <span className="text-[9px] text-white/35">Supports JPG, PNG, WEBP (Max 5MB)</span>
              </div>
            )}
          </div>
        )}
      </Field>

      {/* Render remaining fields: fabric, color, price, original_price */}
      {fields.slice(1).map(({ key, label, type, placeholder, required }) => (
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
