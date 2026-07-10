"use client";

import { useState } from "react";
import { Save, Key, Database, Bell } from "lucide-react";
import { toast, Toaster } from "sonner";
import React from "react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success("Settings saved");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <Toaster theme="dark" position="bottom-center" toastOptions={{ style: { background: "rgba(10,13,20,0.9)", color: "#F8F9FA", border: "1px solid rgba(212,175,55,0.25)" } }} />

      <div>
        <p style={{ fontFamily: "var(--font-manrope)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.6)" }} className="mb-1">
          Configuration
        </p>
        <h1 className="font-serif text-4xl font-light text-white">Settings</h1>
      </div>

      {/* Store Info */}
      <SettingsSection icon={Database} title="Store Information">
        {[
          { label: "Store Name", value: "Peacock Blouse House", placeholder: "Store name" },
          { label: "Contact Email", value: "atelier@peacockblouse.house", placeholder: "contact@store.com" },
          { label: "Address", value: "12 Silk Road, Mylapore, Chennai", placeholder: "Store address" },
        ].map(({ label, value, placeholder }) => (
          <SettingsField key={label} label={label}>
            <input
              defaultValue={value}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-lg text-white text-sm placeholder:text-white/20 focus:outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
          </SettingsField>
        ))}
      </SettingsSection>

      {/* Admin Credentials */}
      <SettingsSection icon={Key} title="Admin Credentials">
        <div
          className="px-4 py-3 rounded-lg text-sm"
          style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}
        >
          <p className="text-[#D4AF37]/80 text-xs tracking-widest uppercase mb-2">Current Admin</p>
          <p className="text-white/60 text-sm">admin@peacock.house</p>
          <p className="text-white/30 text-xs mt-1">Password configured in environment variables</p>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection icon={Bell} title="Notifications">
        {[
          { label: "New Order Alerts", checked: true },
          { label: "Low Stock Warnings", checked: true },
          { label: "New Customer Registrations", checked: false },
          { label: "Newsletter Subscriptions", checked: true },
        ].map(({ label, checked }) => (
          <label key={label} className="flex items-center justify-between py-3 border-b border-white/5 cursor-pointer group">
            <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{label}</span>
            <div className="relative">
              <input type="checkbox" defaultChecked={checked} className="sr-only peer" />
              <div className="w-10 h-5 rounded-full peer-checked:bg-[#D4AF37] bg-white/10 transition-all cursor-pointer" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all peer-checked:translate-x-5" />
            </div>
          </label>
        ))}
      </SettingsSection>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold tracking-wider text-black transition-all"
        style={{ background: saved ? "rgba(212,175,55,0.7)" : "#D4AF37" }}
      >
        <Save className="w-4 h-4" strokeWidth={2} />
        {saved ? "Saved!" : "Save Settings"}
      </button>
    </div>
  );
}

function SettingsSection({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-6 space-y-4" style={{ background: "rgba(15,20,30,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-4 h-4 text-[#D4AF37]" strokeWidth={1.4} />
        <h2 className="font-serif text-lg text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SettingsField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs tracking-widest uppercase" style={{ color: "rgba(212,175,55,0.55)" }}>{label}</label>
      {children}
    </div>
  );
}
