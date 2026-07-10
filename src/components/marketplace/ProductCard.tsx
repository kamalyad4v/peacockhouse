"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { Product } from "@/lib/cart";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import React from "react";

interface ProductCardProps {
  product: Product;
  onCartChange?: () => void;
}

export default function ProductCard({ product, onCartChange }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [hovered, setHovered] = useState(false);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(product);
    onCartChange?.();
    toast.success(`${product.name} added to cart`, {
      description: `₹${product.price.toLocaleString("en-IN")}`,
    });
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <Link href={`/marketplace/${product.id}`}>
      <div
        className="group relative rounded-lg overflow-hidden cursor-pointer transition-all duration-500"
        style={{
          background: "rgba(15,20,30,0.7)",
          border: hovered ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(255,255,255,0.06)",
          boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.1)" : "0 4px 20px rgba(0,0,0,0.3)",
          transform: hovered ? "translateY(-4px)" : "none",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4]">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: "linear-gradient(to top, rgba(5,7,10,0.9) 0%, rgba(5,7,10,0.2) 50%, transparent 100%)",
              opacity: hovered ? 1 : 0.5,
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase bg-[#D4AF37] text-black rounded">
                Featured
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider bg-[rgba(9,121,105,0.85)] text-white rounded">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWishlisted(!wishlisted);
              toast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200"
            style={{
              background: wishlisted ? "rgba(212,175,55,0.85)" : "rgba(5,7,10,0.6)",
              border: "1px solid rgba(212,175,55,0.3)",
            }}
          >
            <Heart
              className="w-4 h-4"
              fill={wishlisted ? "#000" : "none"}
              stroke={wishlisted ? "#000" : "#D4AF37"}
              strokeWidth={1.5}
            />
          </button>

          {/* Quick view on hover */}
          <div
            className="absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300"
            style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)" }}
          >
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold tracking-widest uppercase transition-all"
              style={{
                background: adding ? "rgba(212,175,55,0.7)" : "#D4AF37",
                color: "#000",
                borderRadius: "4px",
              }}
            >
              <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} />
              {adding ? "Added!" : "Add to Cart"}
            </button>
            <Link
              href={`/marketplace/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-10 flex items-center justify-center border border-[rgba(212,175,55,0.4)] rounded hover:bg-[rgba(212,175,55,0.1)] transition-colors"
            >
              <Eye className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.4} />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5" fill="#D4AF37" stroke="none" />
            ))}
            <span className="text-[10px] text-white/40 ml-1">(4.9)</span>
          </div>

          <p
            style={{
              fontFamily: "var(--font-manrope), Manrope, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(212,175,55,0.6)",
              marginBottom: "4px",
            }}
          >
            {product.category} · {product.fabric}
          </p>

          <h3 className="font-serif text-white text-base leading-tight mb-3 group-hover:text-[#F3E5AB] transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-3">
            <span className="font-serif text-lg text-[#D4AF37]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.original_price && (
              <span className="text-sm text-white/30 line-through">
                ₹{product.original_price.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <p className="text-[11px] text-white/40 mt-1">{product.color}</p>
        </div>
      </div>
    </Link>
  );
}
