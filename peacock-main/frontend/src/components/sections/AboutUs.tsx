"use client";

import useReveal from "@/hooks/useReveal";
import ParticleField from "@/components/ParticleField";
import React from 'react';

export default function AboutUs() {
  const [ref1, v1] = useReveal(0.25);
  const [ref2, v2] = useReveal(0.3);
  const [ref3, v3] = useReveal(0.3);

  return (
    <section
      className="relative z-[10] overflow-hidden bg-transparent"
      data-testid="pk-about-section"
    >
      <div className="pointer-events-none absolute inset-0 z-[0]">
        <ParticleField count={80} />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[0] opacity-40">
        <div className="absolute left-[10%] top-[10%] h-[600px] w-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(9,121,105,0.12) 0%, transparent 60%)",
            animation: "pk-slow-drift 12s ease-in-out infinite",
          }}
        />
        <div className="absolute right-[10%] bottom-[10%] h-[500px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(15,82,186,0.12) 0%, transparent 60%)",
            animation: "pk-slow-drift 15s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="relative z-[2] mx-auto max-w-[100rem] px-6 py-32 md:px-12 md:py-48 lg:px-24">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <div
              ref={ref1 as React.RefObject<HTMLDivElement | null>}
              className={`transition-all duration-[1400ms] ${
                v1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="pk-label mb-6" data-testid="pk-about-eyebrow">
                Chapter I · Our Origin
              </p>
              <h2
                className="font-serif text-4xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
                data-testid="pk-about-heading"
              >
                A house
                <br />
                <span className="italic text-[color:var(--pk-gold-light)]">
                  woven from
                </span>
                <br />
                jewel &amp; thread.
              </h2>
              <div className="pk-hairline mt-10 w-32" />
            </div>
          </div>

          <div className="md:col-span-7 md:col-start-7">
            <div className="flex flex-col gap-14">
              <div
                ref={ref2 as React.RefObject<HTMLDivElement | null>}
                className={`transition-all delay-100 duration-[1400ms] ${
                  v2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <p className="pk-label mb-3">Heritage</p>
                <p
                  className="font-serif text-2xl font-light leading-relaxed text-white/85 md:text-3xl lg:text-[2rem]"
                  data-testid="pk-about-para-1"
                >
                  Born in the courtyard workshops of old Chennai, Peacock Blouse
                  House began with a single silk thread, a needle of tempered
                  gold, and an obsession with the iridescent hush of a peacock&apos;s
                  wing.
                </p>
              </div>

              <div
                ref={ref3 as React.RefObject<HTMLDivElement | null>}
                className={`transition-all delay-200 duration-[1400ms] ${
                  v3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <p className="pk-label mb-3">Philosophy</p>
                <p
                  className="font-sans text-base font-light leading-relaxed text-white/70 md:text-lg"
                  data-testid="pk-about-para-2"
                >
                  Every blouse is a private ceremony — cut, threaded, and finished
                  by hand across seven pairs of hands. We do not chase seasons.
                  We chase the light that lingers on the collarbone of a woman
                  who knows exactly who she is.
                </p>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-8 border-t border-[color:var(--pk-gold)]/15 pt-10">
                <Metric label="Years of craft" value="14" testid="pk-metric-years" />
                <Metric
                  label="Master artisans"
                  value="42"
                  testid="pk-metric-artisans"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface MetricProps {
  label: string;
  value: string;
  testid: string;
}

function Metric({ label, value, testid }: MetricProps) {
  return (
    <div>
      <div
        className="font-serif text-5xl font-light text-[color:var(--pk-gold-light)] md:text-6xl"
        data-testid={testid}
      >
        {value}
      </div>
      <p className="pk-label mt-3">{label}</p>
    </div>
  );
}
