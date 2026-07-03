"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Instagram, Twitter, Youtube, ArrowUpRight, Mail, MapPin } from "lucide-react";
import useReveal from "@/hooks/useReveal";
import React from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API = BACKEND_URL ? `${BACKEND_URL.replace(/\/+$/, "")}/api` : "/api";

export default function FooterSection() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refHead, vHead] = useReveal(0.25);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/newsletter`, { email });
      toast.success("Welcome to the House — check your inbox soon.");
      setEmail("");
    } catch (err: any) {
      if (err?.response?.status === 409) {
        toast.error("This email is already subscribed.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer
      className="relative z-[10] overflow-hidden bg-transparent"
      data-testid="pk-footer"
    >
      <div className="relative">
        <div className="pk-feather-divider h-[2px] w-full" />
        <FeatherOrnament />
      </div>

      <div className="relative mx-auto max-w-[100rem] px-6 py-24 md:px-12 md:py-32 lg:px-24">
        <div
          ref={refHead as React.RefObject<HTMLDivElement | null>}
          className={`grid grid-cols-12 gap-8 border-b border-[color:var(--pk-gold)]/15 pb-20 transition-all duration-[1200ms] ${
            vHead ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="col-span-12 md:col-span-7">
            <p className="pk-label mb-6" data-testid="pk-footer-eyebrow">
              The Letter · Sent quarterly
            </p>
            <h3
              className="font-serif text-4xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
              data-testid="pk-footer-heading"
            >
              Receive the House
              <br />
              <span className="italic text-[color:var(--pk-gold-light)]">
                dispatch.
              </span>
            </h3>
          </div>

          <form
            onSubmit={handleSubmit}
            className="col-span-12 flex flex-col justify-end gap-4 md:col-span-5"
            data-testid="pk-newsletter-form"
          >
            <label className="pk-label" htmlFor="pk-newsletter-input">
              Your email
            </label>
            <div className="flex items-center border-b border-[color:var(--pk-gold)]/40 pb-2 transition-colors focus-within:border-[color:var(--pk-gold)]">
              <input
                id="pk-newsletter-input"
                data-testid="pk-newsletter-input"
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourhouse.com"
                className="w-full bg-transparent py-2 font-sans text-lg font-light text-white placeholder:text-white/25 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                data-testid="pk-newsletter-submit"
                className="ml-3 flex shrink-0 items-center gap-2 border-b border-transparent px-1 py-1 font-sans text-xs font-medium uppercase tracking-[0.25em] text-[color:var(--pk-gold-light)] transition-all hover:border-[color:var(--pk-gold)] hover:text-[color:var(--pk-gold)] disabled:opacity-40"
              >
                {submitting ? "Sending" : "Subscribe"}
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            <p className="font-sans text-[11px] tracking-wide text-white/40">
              We send no more than four letters a year. Unsubscribe with one tap.
            </p>
          </form>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3" data-testid="pk-footer-logo">
              <FeatherEyeMark />
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-xl italic text-[color:var(--pk-gold-light)]">
                  Peacock
                </span>
                <span className="pk-label -mt-0.5">Blouse House</span>
              </div>
            </div>
            <p className="mt-6 max-w-xs font-sans text-sm font-light leading-relaxed text-white/50">
              Hand-embroidered couture blouses, crafted one thread at a time
              in the ateliers of southern India.
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="pk-label mb-4">Explore</p>
            <ul className="flex flex-col gap-2 font-sans text-sm font-light text-white/70">
              {["Collection", "Atelier", "Journal", "Bespoke"].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    data-testid={`pk-nav-${l.toLowerCase()}`}
                    className="transition-colors hover:text-[color:var(--pk-gold-light)]"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="pk-label mb-4">Contact</p>
            <ul className="flex flex-col gap-3 font-sans text-sm font-light text-white/70">
              <li className="flex items-start gap-2" data-testid="pk-contact-address">
                <MapPin className="mt-0.5 h-4 w-4 text-[color:var(--pk-gold)]/70" />
                12 Silk Road, Mylapore, Chennai
              </li>
              <li className="flex items-start gap-2" data-testid="pk-contact-email">
                <Mail className="mt-0.5 h-4 w-4 text-[color:var(--pk-gold)]/70" />
                atelier@peacockblouse.house
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="pk-label mb-4">Follow</p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, label: "instagram", href: "#" },
                { Icon: Twitter, label: "twitter", href: "#" },
                { Icon: Youtube, label: "youtube", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  data-testid={`pk-social-${label}`}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center border border-[color:var(--pk-gold)]/25 text-white/70 transition-all hover:border-[color:var(--pk-gold)] hover:text-[color:var(--pk-gold)]"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.4} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-[color:var(--pk-gold)]/10 pt-8 md:flex-row md:items-center">
          <p className="font-sans text-[11px] tracking-[0.2em] text-white/40">
            © {new Date().getFullYear()} PEACOCK BLOUSE HOUSE · ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-6 font-sans text-[11px] tracking-[0.2em] text-white/40">
            <a href="#" className="hover:text-white/70" data-testid="pk-legal-privacy">
              PRIVACY
            </a>
            <a href="#" className="hover:text-white/70" data-testid="pk-legal-terms">
              TERMS
            </a>
            <a href="#" className="hover:text-white/70" data-testid="pk-legal-imprint">
              IMPRINT
            </a>
          </div>
        </div>
      </div>

      <div className="pk-feather-divider h-[1px] w-full opacity-70" />
    </footer>
  );
}

function FeatherEyeMark() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      data-testid="pk-footer-mark"
    >
      <ellipse cx="17" cy="17" rx="14" ry="16" stroke="#D4AF37" strokeOpacity="0.6" />
      <ellipse cx="17" cy="17" rx="9" ry="11" stroke="#097969" strokeOpacity="0.7" />
      <ellipse cx="17" cy="17" rx="5" ry="7" stroke="#0F52BA" strokeOpacity="0.8" />
      <circle cx="17" cy="17" r="2" fill="#D4AF37" />
    </svg>
  );
}

function FeatherOrnament() {
  return (
    <svg
      className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
      width="120"
      height="24"
      viewBox="0 0 120 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="60" cy="12" r="10" fill="var(--pk-bg-2)" stroke="rgba(212,175,55,0.6)" />
      <ellipse cx="60" cy="12" rx="6" ry="7" stroke="rgba(9,121,105,0.9)" />
      <ellipse cx="60" cy="12" rx="3" ry="4" stroke="rgba(15,82,186,0.9)" />
      <circle cx="60" cy="12" r="1.5" fill="#D4AF37" />
    </svg>
  );
}
