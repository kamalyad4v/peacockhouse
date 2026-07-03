"use client";

import { useEffect, useState } from "react";
import React from "react";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setFadingOut(true);
        setTimeout(() => onDone && onDone(), 700);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      data-testid="pk-preloader"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[color:var(--pk-bg)] transition-opacity duration-700 ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.10) 0%, rgba(15,82,186,0.05) 40%, transparent 70%)",
            animation: "pk-glow-pulse 3s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        <div className="relative h-24 w-24">
          <div
            className="absolute inset-0 rounded-full border border-[color:var(--pk-gold)]/30"
            style={{ animation: "pk-spin 8s linear infinite" }}
          />
          <div
            className="absolute inset-2 rounded-full border border-[color:var(--pk-sapphire)]/40"
            style={{ animation: "pk-spin 6s linear infinite reverse" }}
          />
          <div
            className="absolute inset-4 rounded-full border border-[color:var(--pk-emerald)]/40"
            style={{ animation: "pk-spin 5s linear infinite" }}
          />
          <div className="absolute inset-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--pk-gold)] shadow-[0_0_18px_rgba(212,175,55,0.7)]" />
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="pk-label" data-testid="pk-preloader-label">
            Preparing the feathers
          </p>
          <h1 className="font-serif text-3xl tracking-wide text-[color:var(--pk-gold-light)]">
            Peacock Blouse House
          </h1>
        </div>

        <div className="flex w-72 flex-col gap-2">
          <div className="h-[2px] w-full overflow-hidden bg-white/5">
            <div
              className="h-full origin-left bg-gradient-to-r from-[color:var(--pk-emerald)] via-[color:var(--pk-sapphire)] to-[color:var(--pk-gold)]"
              style={{ width: `${progress}%`, transition: "width 120ms linear" }}
              data-testid="pk-preloader-progress-bar"
            />
          </div>
          <div
            className="flex justify-between text-[10px] tracking-[0.28em] text-white/50"
            data-testid="pk-preloader-progress-text"
          >
            <span>LOADING</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
