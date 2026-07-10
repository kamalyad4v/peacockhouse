"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingBag, Heart, ArrowLeft, Star, Truck, Shield, RefreshCw, Package } from "lucide-react";
import Navbar from "@/components/marketplace/Navbar";
import ProductCard from "@/components/marketplace/ProductCard";
import { Product, addToCart, getCart, getCartCount } from "@/lib/cart";
import { toast, Toaster } from "sonner";
import React from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        setProduct(data.product);

        if (data.product) {
          const relRes = await fetch(`/api/products?category=${data.product.category}`);
          const relData = await relRes.json();
          setRelated((relData.products || []).filter((p: Product) => p.id !== data.product.id).slice(0, 4));
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    setAdding(true);
    for (let i = 0; i < quantity; i++) addToCart(product);
    toast.success(`Added ${quantity} × ${product.name} to cart`);
    setTimeout(() => setAdding(false), 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--pk-bg)" }}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-[3/4] rounded-lg bg-white/5" />
            <div className="space-y-6 pt-4">
              <div className="h-4 bg-white/5 rounded w-1/3" />
              <div className="h-10 bg-white/5 rounded w-3/4" />
              <div className="h-8 bg-white/5 rounded w-1/4" />
              <div className="h-24 bg-white/5 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--pk-bg)" }}>
        <Navbar />
        <p className="font-serif text-2xl text-white/40 mt-24">Product not found</p>
        <button onClick={() => router.push("/marketplace")} className="mt-4 text-[#D4AF37] hover:underline text-sm">
          ← Back to Collection
        </button>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.image_url];
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--pk-bg)" }}>
      <Navbar />
      <Toaster theme="dark" position="bottom-center" toastOptions={{ style: { background: "rgba(10,13,20,0.9)", color: "#F8F9FA", border: "1px solid rgba(212,175,55,0.25)", backdropFilter: "blur(12px)" } }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Breadcrumb */}
        <button
          onClick={() => router.push("/marketplace")}
          className="flex items-center gap-2 text-white/40 hover:text-[#D4AF37] transition-colors text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </button>

        {/* Main Product */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div
              className="rounded-xl overflow-hidden aspect-[3/4] relative"
              style={{ border: "1px solid rgba(212,175,55,0.1)" }}
            >
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.featured && (
                <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-[#D4AF37] text-black rounded">
                  Featured
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 px-3 py-1 text-[10px] font-bold tracking-wider bg-[rgba(9,121,105,0.9)] text-white rounded">
                  {discount}% OFF
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="w-20 h-24 rounded overflow-hidden flex-shrink-0 transition-all"
                    style={{ border: i === activeImg ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="py-4">
            <p style={{ fontFamily: "var(--font-manrope)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.7)" }} className="mb-2">
              {product.category} · {product.fabric}
            </p>

            <h1 className="font-serif text-4xl md:text-5xl font-light text-white leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5" fill="#D4AF37" stroke="none" />
                ))}
              </div>
              <span className="text-white/40 text-sm">(4.9) · 128 reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-serif text-4xl text-[#D4AF37]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.original_price && (
                <>
                  <span className="text-xl text-white/30 line-through">
                    ₹{product.original_price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[#097969] text-sm font-medium">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: "Color", value: product.color },
                { label: "Fabric", value: product.fabric },
                { label: "Category", value: product.category },
                { label: "Availability", value: product.in_stock ? "In Stock" : "Out of Stock" },
              ].map(({ label, value }) => (
                <div key={label} className="px-4 py-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[10px] text-white/30 tracking-widest uppercase mb-1">{label}</p>
                  <p className="text-sm text-white/80">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-white/60 text-sm leading-relaxed mb-8">{product.description}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-white/40 text-xs tracking-widest uppercase">Quantity</span>
              <div className="flex items-center border border-white/15 rounded overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-lg"
                >
                  −
                </button>
                <span className="px-5 py-2 text-white border-x border-white/15">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={adding || !product.in_stock}
                className="flex-1 flex items-center justify-center gap-3 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 rounded"
                style={{
                  background: adding ? "rgba(212,175,55,0.7)" : "#D4AF37",
                  color: "#000",
                  opacity: !product.in_stock ? 0.5 : 1,
                }}
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={2} />
                {adding ? "Added to Cart!" : "Add to Cart"}
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="w-14 flex items-center justify-center rounded border transition-all"
                style={{
                  background: wishlisted ? "rgba(212,175,55,0.15)" : "transparent",
                  borderColor: wishlisted ? "#D4AF37" : "rgba(255,255,255,0.15)",
                }}
              >
                <Heart className="w-5 h-5" fill={wishlisted ? "#D4AF37" : "none"} stroke={wishlisted ? "#D4AF37" : "rgba(255,255,255,0.5)"} strokeWidth={1.5} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/5">
              {[
                { icon: Truck, label: "Free Shipping", sub: "On orders ₹5000+" },
                { icon: Shield, label: "Authenticity", sub: "100% Genuine" },
                { icon: RefreshCw, label: "Easy Returns", sub: "7-day policy" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <Icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.4} />
                  <p className="text-xs text-white/60">{label}</p>
                  <p className="text-[10px] text-white/30">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3))" }} />
              <h2 className="font-serif text-3xl text-white">You May Also Love</h2>
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.3), transparent)" }} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
