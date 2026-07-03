"use client";

import { useEffect, useRef, useState } from "react";
import useReveal from "@/hooks/useReveal";
import React from 'react';

interface CounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  testid: string;
}

function Counter({ target, suffix = "", duration = 1600, testid }: CounterProps) {
  const [value, setValue] = useState(0);
  const [ref, visible] = useReveal(0.35);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!visible || startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, target, duration]);

  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement | null>}
      data-testid={testid}
      className="font-serif text-6xl font-light leading-none text-[color:var(--pk-gold-light)] md:text-8xl lg:text-9xl"
    >
      {value}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 100, suffix: "%", label: "Premium mulberry silk & khadi cotton", testid: "pk-stat-silk" },
  { value: 42, suffix: "", label: "Hours of hand-embroidery per blouse", testid: "pk-stat-hours" },
  { value: 7, suffix: "", label: "Master artisans behind every piece", testid: "pk-stat-artisans" },
];

const fabricImages = [
  {
    src: "https://images.pexels.com/photos/6275998/pexels-photo-6275998.jpeg",
    alt: "Rich blue satin fabric texture",
    testid: "pk-fabric-1",
  },
  {
    src: "https://images.pexels.com/photos/2933639/pexels-photo-2933639.jpeg",
    alt: "Gold embroidery detail",
    testid: "pk-fabric-2",
  },
  {
    src: "https://images.pexels.com/photos/4863033/pexels-photo-4863033.jpeg",
    alt: "Folded dark elegant fabric",
    testid: "pk-fabric-3",
  },
];

export default function ClothQuality() {
  const [refHead, vHead] = useReveal(0.3);

  return (
    <section
      className="relative z-[10] overflow-hidden bg-transparent"
      data-testid="pk-quality-section"
    >
      <div className="pk-hairline w-full" />

      <div className="relative mx-auto max-w-[100rem] px-6 py-32 md:px-12 md:py-48 lg:px-24">
        <div className="grid grid-cols-12 gap-8">
          <div
            ref={refHead as React.RefObject<HTMLDivElement | null>}
            className={`col-span-12 md:col-span-7 md:col-start-2 transition-all duration-[1400ms] ${
              vHead ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="pk-label mb-6" data-testid="pk-quality-eyebrow">
              Chapter II · The Cloth
            </p>
            <h2
              className="font-serif text-4xl font-light leading-[1.02] tracking-tight md:text-6xl lg:text-[5rem]"
              data-testid="pk-quality-heading"
            >
              Cloth so refined,
              <br />
              <span className="italic text-[color:var(--pk-gold-light)]">
                it remembers the light.
              </span>
            </h2>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 items-start">
          {fabricImages.map((img, i) => (
            <FabricCard
              key={i}
              img={img}
              index={i}
              className=""
            />
          ))}
        </div>

        <div className="mt-28 grid grid-cols-1 gap-16 border-t border-[color:var(--pk-gold)]/15 pt-16 md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.testid} className="flex flex-col gap-4">
              <Counter target={s.value} suffix={s.suffix} testid={s.testid} />
              <p className="max-w-[22ch] font-sans text-sm font-light leading-relaxed text-white/60 md:text-base">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FabricCardProps {
  img: {
    src: string;
    alt: string;
    testid: string;
  };
  index: number;
  className: string;
}

function FabricCard({ img, index, className }: FabricCardProps) {
  const [ref, visible] = useReveal(0.2);
  const wrapRef = useRef<HTMLElement>(null);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const el = wrapRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const p = (window.innerHeight / 2 - mid) / window.innerHeight;
        setScroll(p);
      }
      boxRaf();
    };
    const boxRaf = () => {
      raf = requestAnimationFrame(tick);
    };
    boxRaf();
    return () => cancelAnimationFrame(raf);
  }, []);

  const shift = scroll * 40;
  return (
    <figure
      ref={(el) => {
        if (el) {
          (ref as React.MutableRefObject<HTMLElement | null>).current = el;
          (wrapRef as React.MutableRefObject<HTMLElement | null>).current = el;
        }
      }}
      className={`group relative overflow-hidden border border-[color:var(--pk-gold)]/10 ${className} transition-all duration-[1400ms] ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ aspectRatio: index === 1 ? "3/4" : "4/5" }}
    >
      <img
        src={img.src}
        alt={img.alt}
        data-testid={img.testid}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-105"
        style={{
          transform: `translateY(${shift}px) scale(${1.05 + Math.abs(scroll) * 0.05})`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--pk-bg)]/85 via-transparent to-transparent" />
      <figcaption className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white/70">
        <span className="pk-label">
          {index === 0 ? "Satin · Sapphire" : index === 1 ? "Zardosi · Gold" : "Silk · Onyx"}
        </span>
        <span className="pk-label">0{index + 1}</span>
      </figcaption>
    </figure>
  );
}
