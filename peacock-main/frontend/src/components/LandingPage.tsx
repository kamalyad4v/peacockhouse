"use client";

import { useEffect, useState } from "react";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import AmbientToggle from "@/components/AmbientToggle";
import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/sections/Hero";
import AboutUs from "@/components/sections/AboutUs";
import ClothQuality from "@/components/sections/ClothQuality";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import FooterSection from "@/components/sections/FooterSection";
import { Toaster } from "sonner";
import React from 'react';

export default function LandingPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overscrollBehavior = "";
    };
  }, []);

  return (
    <div className="pk-grain pk-vignette relative min-h-screen bg-[color:var(--pk-bg)] text-[color:var(--pk-text)]">
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}

      <CustomCursor />
      <AmbientToggle />

      <SmoothScroll>
        <main data-testid="pk-landing-root">
          <Hero />
          <AboutUs />
          <ClothQuality />
          <WhyChooseUs />
          <FooterSection />
        </main>
      </SmoothScroll>

      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: "rgba(10, 13, 20, 0.9)",
            color: "#F8F9FA",
            border: "1px solid rgba(212, 175, 55, 0.25)",
            backdropFilter: "blur(12px)",
          },
        }}
      />
    </div>
  );
}
