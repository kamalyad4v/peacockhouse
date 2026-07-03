"use client";

import { useEffect, useRef } from "react";
import React from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  hue: "gold" | "teal";
  alpha: number;
}

export default function ParticleField({ count = 60 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    const dpr = window.devicePixelRatio || 1;

    let particles: Particle[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.scale(dpr, dpr);
      init(w, h);
    };

    const init = (w: number, h: number) => {
      particles = new Array(count).fill(null).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vy: -Math.random() * 0.35 - 0.05,
        vx: (Math.random() - 0.5) * 0.15,
        hue: Math.random() > 0.5 ? "gold" : "teal",
        alpha: Math.random() * 0.5 + 0.15,
      }));
    };

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        const color = p.hue === "gold" ? "212,175,55" : "9,121,105";
        grad.addColorStop(0, `rgba(${color},${p.alpha})`);
        grad.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${color},${p.alpha + 0.15})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) {
      ro.observe(canvas.parentElement);
    }
    resize();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      data-testid="pk-particle-canvas"
    />
  );
}
