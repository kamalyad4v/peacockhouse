"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { setSession, isAuthenticated } from "@/lib/auth";
import React from "react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) router.push("/marketplace");
  }, [router]);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      setSession(data.token, data.user);
      router.push("/marketplace");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const pwColors = ["transparent", "#ef4444", "#f59e0b", "#10b981"];
  const pwLabels = ["", "Weak", "Fair", "Strong"];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative" style={{ background: "var(--pk-bg)" }}>
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full opacity-15" style={{ background: "radial-gradient(circle, rgba(15,82,186,0.3) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")" }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center mb-10 group">
          <FeatherMark />
          <span className="font-serif text-2xl italic text-[#F3E5AB] mt-3 group-hover:text-[#D4AF37] transition-colors">
            Peacock Blouse House
          </span>
          <p style={{ fontFamily: "var(--font-manrope)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.5)", marginTop: 4 }}>
            Create your account
          </p>
        </Link>

        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(10,13,20,0.85)",
            border: "1px solid rgba(212,175,55,0.15)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <h2 className="font-serif text-3xl font-light text-white mb-2">Join the House</h2>
          <p className="text-white/40 text-sm mb-8">Create your account to start shopping</p>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 mb-6 rounded-lg text-sm text-red-300" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { key: "name", label: "Full Name", type: "text", placeholder: "Priya Sharma" },
              { key: "email", label: "Email Address", type: "email", placeholder: "priya@example.com" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs text-white/40 tracking-widest uppercase mb-2">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={update(key)}
                  placeholder={placeholder}
                  required
                  className="w-full px-4 py-3 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
              </div>
            ))}

            <div>
              <label className="block text-xs text-white/40 tracking-widest uppercase mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i <= pwStrength ? pwColors[pwStrength] : "rgba(255,255,255,0.08)" }} />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: pwColors[pwStrength] }}>{pwLabels[pwStrength]}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs text-white/40 tracking-widest uppercase mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={form.confirm}
                  onChange={update("confirm")}
                  placeholder="Re-enter password"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
                {form.confirm && form.password === form.confirm && (
                  <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10b981]" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-lg text-sm font-bold tracking-widest uppercase transition-all duration-300"
              style={{ background: loading ? "rgba(212,175,55,0.6)" : "#D4AF37", color: "#000" }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/30 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#D4AF37] hover:text-[#F3E5AB] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatherMark() {
  return (
    <svg width="44" height="44" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <ellipse cx="17" cy="17" rx="14" ry="16" stroke="#D4AF37" strokeOpacity="0.6" />
      <ellipse cx="17" cy="17" rx="9" ry="11" stroke="#097969" strokeOpacity="0.7" />
      <ellipse cx="17" cy="17" rx="5" ry="7" stroke="#0F52BA" strokeOpacity="0.8" />
      <circle cx="17" cy="17" r="2" fill="#D4AF37" />
    </svg>
  );
}
