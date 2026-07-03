"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import React from 'react';

export default function AmbientToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<{
    ctx: AudioContext;
    gain: GainNode;
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    lfo: OscillatorNode;
  } | null>(null);

  useEffect(() => {
    let ctx: AudioContext;
    let gain: GainNode;
    let osc1: OscillatorNode;
    let osc2: OscillatorNode;
    let lfo: OscillatorNode;
    let lfoGain: GainNode;
    let filter: BiquadFilterNode;

    if (playing) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        ctx = new AudioCtx();
        gain = ctx.createGain();
        gain.gain.value = 0;
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.6);

        filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 900;
        filter.Q.value = 0.7;

        osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.value = 110;

        osc2 = ctx.createOscillator();
        osc2.type = "triangle";
        osc2.frequency.value = 165;

        lfo = ctx.createOscillator();
        lfo.frequency.value = 0.12;
        lfoGain = ctx.createGain();
        lfoGain.gain.value = 12;
        lfo.connect(lfoGain).connect(osc1.frequency);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain).connect(ctx.destination);

        osc1.start();
        osc2.start();
        lfo.start();

        audioRef.current = { ctx, gain, osc1, osc2, lfo };
      } catch (e) {
        console.warn("Ambient audio unsupported", e);
      }
    }

    return () => {
      const a = audioRef.current;
      if (a) {
        try {
          a.gain.gain.linearRampToValueAtTime(0, a.ctx.currentTime + 0.6);
          setTimeout(() => {
            a.osc1.stop();
            a.osc2.stop();
            a.lfo.stop();
            a.ctx.close();
          }, 700);
        } catch (e) {
          // ignore
        }
        audioRef.current = null;
      }
    };
  }, [playing]);

  return (
    <button
      type="button"
      onClick={() => setPlaying((p) => !p)}
      data-testid="pk-ambient-toggle"
      aria-label={playing ? "Mute ambient sound" : "Play ambient sound"}
      className="fixed right-5 top-5 z-[70] flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--pk-gold)]/25 bg-black/40 backdrop-blur-md text-[color:var(--pk-gold-light)] transition-all hover:border-[color:var(--pk-gold)] hover:bg-black/60 md:right-8 md:top-8"
    >
      {playing ? (
        <Volume2 className="h-4 w-4" data-testid="pk-ambient-on-icon" />
      ) : (
        <VolumeX className="h-4 w-4" data-testid="pk-ambient-off-icon" />
      )}
    </button>
  );
}
