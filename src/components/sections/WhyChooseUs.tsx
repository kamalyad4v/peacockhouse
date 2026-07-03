"use client";

import { useRef, useState } from "react";
import useReveal from "@/hooks/useReveal";
import { Scissors, Leaf, Gem, Sparkles, type LucideIcon } from "lucide-react";
import React from "react";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
  accent: string;
  testid: string;
}

const features: Feature[] = [
  {
    icon: Scissors,
    title: "Craftsmanship",
    body: "Thirty-hour hand-tailoring by third-generation atelier masters. Every dart is set to your breath.",
    accent: "#D4AF37",
    testid: "pk-feat-craft",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    body: "Zero-water dyeing. Peace silk sourced from six certified reeling villages. Fabric offcuts reborn as heirloom linings.",
    accent: "#097969",
    testid: "pk-feat-sustain",
  },
  {
    icon: Gem,
    title: "Exclusive Designs",
    body: "Each pattern is drawn once, embroidered once, and never repeated. You wear a manuscript.",
    accent: "#0F52BA",
    testid: "pk-feat-exclusive",
  },
  {
    icon: Sparkles,
    title: "Premium Materials",
    body: "Zari drawn from real silver-gilt wire. Kanchipuram silk. Belgian glass beads. Nothing less.",
    accent: "#F3E5AB",
    testid: "pk-feat-materials",
  },
];

export default function WhyChooseUs() {
  const [refHead, vHead] = useReveal(0.3);

  return (
    <section
      className="relative z-[10] overflow-hidden bg-transparent"
      data-testid="pk-why-section"
    >
      <div className="relative mx-auto max-w-[100rem] px-6 py-32 md:px-12 md:py-48 lg:px-24">
        <div className="mb-24 grid grid-cols-12 gap-8">
          <div
            ref={refHead as React.RefObject<HTMLDivElement | null>}
            className={`col-span-12 md:col-span-8 transition-all duration-[1400ms] ${
              vHead ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="pk-label mb-6" data-testid="pk-why-eyebrow">
              Chapter III · Why Us
            </p>
            <h2
              className="font-serif text-4xl font-light leading-[1.02] tracking-tight md:text-6xl lg:text-[5rem]"
              data-testid="pk-why-heading"
            >
              Four vows,
              <br />
              <span className="italic text-[color:var(--pk-gold-light)]">
                pressed into every seam.
              </span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <TiltCard key={f.testid} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TiltCardProps {
  feature: Feature;
  index: number;
}

function TiltCard({ feature, index }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glowX: 50, glowY: 50 });
  const [ref, visible] = useReveal(0.2);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 14;
    const rx = -(py - 0.5) * 14;
    setTilt({ rx, ry, glowX: px * 100, glowY: py * 100 });
  };

  const onLeave = () => {
    setTilt({ rx: 0, ry: 0, glowX: 50, glowY: 50 });
  };

  const Icon = feature.icon;

  return (
    <div
      ref={(el) => {
        if (el) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-testid={feature.testid}
      data-cursor="hover"
      className={`group relative min-h-[380px] border border-[color:var(--pk-gold)]/15 bg-[color:var(--pk-surface)]/60 p-8 backdrop-blur-md transition-all duration-[1200ms] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: `${index * 120}ms`,
        transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: "transform 300ms cubic-bezier(0.16,1,0.3,1), opacity 1200ms, border-color 300ms",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, ${feature.accent}22 0%, transparent 55%)`,
        }}
      />

      <div className="relative z-[1] flex h-full flex-col justify-between gap-8">
        <div
          className="flex h-12 w-12 items-center justify-center border transition-colors"
          style={{ borderColor: `${feature.accent}55`, color: feature.accent }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.4} />
        </div>

        <div className="flex flex-col gap-4">
          <p className="pk-label opacity-70">0{index + 1}</p>
          <h3 className="font-serif text-3xl font-light leading-tight md:text-4xl">
            {feature.title}
          </h3>
          <p className="font-sans text-sm font-light leading-relaxed text-white/60 md:text-[15px]">
            {feature.body}
          </p>
        </div>
      </div>

      <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-[color:var(--pk-gold)]/60" />
      <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-[color:var(--pk-gold)]/60" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[color:var(--pk-gold)]/60" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[color:var(--pk-gold)]/60" />
    </div>
  );
}
