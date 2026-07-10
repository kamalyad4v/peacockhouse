"use client";

import { useEffect, useRef, useState } from "react";
import Peacock3D from "@/components/peacock/Peacock3D";
import { ChevronDown, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollProgressRef = useRef<number>(0);
  const [textStage, setTextStage] = useState(0);
  const [globalProgress, setGlobalProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setTextStage(1), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const totalScroll = el.offsetHeight - window.innerHeight;
        const y = -rect.top;
        const p = Math.min(1, Math.max(0, y / Math.max(1, totalScroll)));
        scrollProgressRef.current = p;
        setGlobalProgress(p);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const canvasOpacity = 1;

  return (
    <>
      <div
        className="fixed inset-0 z-[1] transition-opacity duration-500"
        style={{ opacity: canvasOpacity }}
        data-testid="pk-peacock-canvas-wrap"
      >
        <Peacock3D scrollProgressRef={scrollProgressRef} />
      </div>

      <section
        ref={sectionRef}
        data-testid="pk-hero-section"
        className="relative z-[2]"
        style={{ height: "260vh" }}
      >
        <div className="sticky top-0 flex h-screen w-full items-end justify-center overflow-hidden pb-24 md:pb-32">
          <div className="pointer-events-none absolute inset-0 z-[0]">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[85vh] w-[85vh] rounded-full opacity-90"
              style={{
                background:
                  "radial-gradient(circle, rgba(15,82,186,0.10) 0%, rgba(9,121,105,0.06) 35%, transparent 65%)",
              }}
            />
          </div>

          <div
            className={`absolute top-16 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center text-center transition-all duration-[1400ms] md:top-24 ${
              textStage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
            style={{ opacity: Math.max(0, 1 - globalProgress * 1.6) }}
          >
            <p className="pk-label" data-testid="pk-hero-eyebrow">
              House of Ateliers · Est. Twenty Twenty
            </p>
          </div>

          <div
            className={`relative z-[3] flex flex-col items-center justify-center px-6 text-center transition-all duration-[1400ms] ${
              textStage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{
              transform: `translateY(${Math.min(30, globalProgress * -60)}px)`,
              opacity: Math.max(0, 1 - globalProgress * 1.6),
              textShadow: "0 0 40px rgba(5,7,10,0.95), 0 0 80px rgba(5,7,10,0.75)",
            }}
          >
            <h1
              className="font-serif text-5xl font-light leading-[0.95] tracking-tight text-[color:var(--pk-text)] md:text-7xl lg:text-[6.5rem]"
              data-testid="pk-hero-title"
            >
              <span className="pk-shimmer-text">Peacock</span>{" "}
              <span className="italic text-[color:var(--pk-gold-light)]/90">
                Blouse House
              </span>
            </h1>

            <div className="mt-8 flex items-center gap-4">
              <div className="pk-hairline w-16" />
              <p
                className="max-w-xl font-sans text-xs font-light tracking-[0.28em] text-white/70 md:text-[13px]"
                data-testid="pk-hero-subtitle"
              >
                COUTURE SAREES &amp; BLOUSES · HAND-EMBROIDERED FOR THE MODERN MUSE
              </p>
              <div className="pk-hairline w-16" />
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex items-center gap-4 flex-wrap justify-center">
              <Link
                href="/marketplace"
                className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold tracking-[0.2em] uppercase text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                style={{ background: '#D4AF37', borderRadius: '2px' }}
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={2} />
                Shop Collection
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-7 py-3.5 text-sm font-medium tracking-[0.2em] uppercase text-[#D4AF37] border border-[rgba(212,175,55,0.45)] transition-all duration-300 hover:bg-[rgba(212,175,55,0.06)] hover:border-[#D4AF37]"
                style={{ borderRadius: '2px' }}
              >
                <User className="w-4 h-4" strokeWidth={1.4} />
                Sign In
              </Link>
            </div>
          </div>

          <div
            className="absolute bottom-6 left-1/2 z-[4] -translate-x-1/2 flex-col items-center gap-2 flex"
            style={{ opacity: Math.max(0, 1 - globalProgress * 3) }}
            data-testid="pk-scroll-indicator"
          >
            <span className="pk-label text-[10px]">SCROLL TO EXPLORE</span>
            <ChevronDown
              className="h-4 w-4 text-[color:var(--pk-gold)]"
              style={{ animation: "pk-bounce 1.8s ease-in-out infinite" }}
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[color:var(--pk-bg)]" />
        </div>
      </section>
    </>
  );
}
