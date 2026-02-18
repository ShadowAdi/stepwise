"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MousePointerClick, Route, Blocks, Share2, BarChart3, Palette,
  Check, ArrowRight, Zap, Star, Terminal,
} from "lucide-react";
import { features, steps, testimonials, pricingPlans, stats } from "../data";

gsap.registerPlugin(ScrollTrigger);

const C = {
  neon: "#DF00FF",
  cyan: "#0FFFFF",
  navy: "#00009C",
  bg: "#0A0A14",
  surface: "#12121E",
  surfaceLight: "#1A1A2E",
  text: "#E0E0F0",
  muted: "#8888AA",
};

const iconMap: Record<string, React.ElementType> = {
  MousePointerClick, Route, Blocks, Share2, BarChart3, Palette,
};

/* ═══════════════════════════════════════════════════════
   VARIANT 3 — CYBERPUNK / RETROFUTURISM
   Neon glows, glitch effects, dark backgrounds,
   futuristic scrolling, scan lines
   ═══════════════════════════════════════════════════════ */

export default function CyberpunkLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setLoaded(true) });

      tl.set(".cyber-content", { visibility: "visible" });

      // Glitch / scan line reveal
      tl.from(".scan-line", {
        scaleX: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power4.inOut",
      });

      tl.to(".scan-line", {
        opacity: 0,
        duration: 0.3,
        stagger: 0.03,
      });

      // Neon text glitch in
      tl.from(".cyber-hero-word", {
        y: 100,
        opacity: 0,
        skewX: -20,
        duration: 0.4,
        stagger: 0.08,
        ease: "power3.out",
      }, "-=0.3");

      // Neon glow pulse
      tl.from(".neon-border", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      }, "-=0.2");

      tl.from(".cyber-sub", {
        y: 30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.2");

      tl.from(".cyber-cta", {
        y: 20,
        opacity: 0,
        duration: 0.3,
      }, "-=0.1");

      /* ── SCROLL ── */
      // Stats with glow
      gsap.from(".cyber-stat", {
        scrollTrigger: { trigger: ".cyber-stats", start: "top 85%" },
        y: 50,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
      });

      // Features horizontal scroll (pinned)
      const featureTrack = document.querySelector(".cyber-features-track");
      const featureCards = document.querySelectorAll(".cyber-feature");
      if (featureTrack && featureCards.length) {
        gsap.to(".cyber-features-track", {
          x: () => -(featureCards.length - 1) * (window.innerWidth > 768 ? 420 : 300),
          ease: "none",
          scrollTrigger: {
            trigger: ".cyber-features-pin",
            start: "top top",
            end: () => `+=${featureCards.length * 350}`,
            pin: true,
            scrub: 1,
          },
        });
      }

      // How it works stagger
      gsap.from(".cyber-step", {
        scrollTrigger: { trigger: ".cyber-how", start: "top 75%" },
        y: 80,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Testimonials
      gsap.from(".cyber-test", {
        scrollTrigger: { trigger: ".cyber-testimonials", start: "top 75%" },
        x: -60,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });

      // Pricing
      gsap.from(".cyber-price", {
        scrollTrigger: { trigger: ".cyber-pricing", start: "top 75%" },
        y: 80,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: "power3.out",
      });

      // CTA neon pulse
      gsap.from(".cyber-cta-inner", {
        scrollTrigger: { trigger: ".cyber-cta-section", start: "top 80%" },
        scale: 0.95,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ fontFamily: "'Chakra Petch', sans-serif", background: C.bg, color: C.text }}>
      {/* Loading */}
      {!loaded && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-2" style={{ background: C.bg }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="scan-line h-1 w-full" style={{ background: i % 2 === 0 ? C.cyan + "60" : C.neon + "40" }} />
          ))}
        </div>
      )}

      <div className="cyber-content" style={{ visibility: "hidden" }}>
        {/* CSS for neon glow effects */}
        <style>{`
          .neon-text-cyan { text-shadow: 0 0 10px ${C.cyan}80, 0 0 40px ${C.cyan}30; }
          .neon-text-pink { text-shadow: 0 0 10px ${C.neon}80, 0 0 40px ${C.neon}30; }
          .neon-box-cyan { box-shadow: 0 0 15px ${C.cyan}40, inset 0 0 15px ${C.cyan}10; }
          .neon-box-pink { box-shadow: 0 0 15px ${C.neon}40, inset 0 0 15px ${C.neon}10; }
          .cyber-grid-bg {
            background-image:
              linear-gradient(${C.cyan}08 1px, transparent 1px),
              linear-gradient(90deg, ${C.cyan}08 1px, transparent 1px);
            background-size: 40px 40px;
          }
        `}</style>

        {/* ═══ HEADER ═══ */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ background: C.bg + "EE", borderColor: C.cyan + "30" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
            <Link href="/landing" className="flex items-center gap-2" aria-label="Stepwise Home">
              <div className="w-8 h-8 flex items-center justify-center border" style={{ borderColor: C.cyan, background: C.cyan + "15" }}>
                <Zap className="w-4 h-4" style={{ color: C.cyan }} />
              </div>
              <span className="text-lg font-bold tracking-wider uppercase neon-text-cyan" style={{ color: C.cyan }}>Stepwise</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {["Features", "How It Works", "Pricing"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-sm font-semibold uppercase tracking-wider transition-colors hover:opacity-80" style={{ color: C.muted }}>
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold" style={{ color: C.muted }}>Log in</Link>
              <Link href="/register" className="px-5 py-2 text-sm font-bold uppercase tracking-wider border transition-all hover:shadow-lg"
                style={{ borderColor: C.neon, color: C.neon, boxShadow: `0 0 10px ${C.neon}30` }}>
                Sign Up
              </Link>
            </div>
          </div>
        </header>

        {/* ═══ HERO ═══ */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden cyber-grid-bg">
          {/* Neon gradient accents */}
          <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full opacity-15 blur-[100px]" style={{ background: C.neon }} />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full opacity-15 blur-[100px]" style={{ background: C.cyan }} />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl">
              <div className="neon-border inline-flex items-center gap-2 px-4 py-2 border mb-8"
                style={{ borderColor: C.cyan + "60", background: C.cyan + "10" }}>
                <Terminal className="w-4 h-4" style={{ color: C.cyan }} />
                <span className="text-sm font-bold uppercase tracking-wider" style={{ color: C.cyan }}>// Interactive Product Demos</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8">
                <span className="cyber-hero-word block neon-text-cyan" style={{ color: C.cyan }}>DECODE</span>
                <span className="cyber-hero-word block">YOUR PRODUCT</span>
                <span className="cyber-hero-word block neon-text-pink" style={{ color: C.neon }}>EXPERIENCE</span>
              </h1>

              <p className="cyber-sub text-lg md:text-xl leading-relaxed mb-10 max-w-2xl"
                style={{ fontFamily: "'Work Sans', sans-serif", color: C.muted }}>
                Transform static screenshots into immersive, clickable product walkthroughs.
                No recording. No code. Pure digital experience.
              </p>

              <div className="cyber-cta flex flex-wrap gap-4">
                <Link href="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold uppercase tracking-wider transition-all hover:scale-105 neon-box-pink"
                  style={{ background: C.neon, color: "white" }}>
                  Initialize <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold uppercase tracking-wider border transition-all hover:shadow-lg"
                  style={{ borderColor: C.cyan + "60", color: C.cyan }}>
                  View Protocol
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <section className="cyber-stats py-16 border-y" style={{ borderColor: C.cyan + "20" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="cyber-stat text-center p-4">
                  <div className="text-3xl md:text-4xl font-bold mb-1"
                    style={{ color: i % 2 === 0 ? C.cyan : C.neon }}>
                    {s.value}
                  </div>
                  <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: C.muted }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FEATURES (Horizontal Scroll) ═══ */}
        <section id="features" className="cyber-features-pin relative overflow-hidden" style={{ background: C.surface }}>
          <div className="min-h-screen flex flex-col justify-center py-24">
            <div className="px-6 lg:px-8 mb-12">
              <span className="text-sm font-bold uppercase tracking-widest block mb-2" style={{ color: C.neon }}>// Features</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">System Capabilities</h2>
            </div>
            <div className="cyber-features-track flex gap-6 px-6 lg:px-8">
              {features.map((f, i) => {
                const Icon = iconMap[f.icon];
                const accent = i % 2 === 0 ? C.cyan : C.neon;
                return (
                  <div key={i} className="cyber-feature shrink-0 w-[280px] md:w-[380px] p-6 border"
                    style={{ borderColor: accent + "30", background: C.surfaceLight }}>
                    <div className="w-10 h-10 flex items-center justify-center mb-4 border"
                      style={{ borderColor: accent + "40", background: accent + "10" }}>
                      {Icon && <Icon className="w-5 h-5" style={{ color: accent }} />}
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: accent }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: "'Work Sans', sans-serif", color: C.muted }}>{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section id="how-it-works" className="cyber-how py-24 cyber-grid-bg">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-bold uppercase tracking-widest block mb-2" style={{ color: C.cyan }}>// Protocol</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Execution Sequence</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, i) => {
                const accent = [C.cyan, C.neon, C.cyan][i];
                return (
                  <div key={i} className="cyber-step p-8 border relative overflow-hidden"
                    style={{ borderColor: accent + "30", background: C.surface }}>
                    <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
                    <div className="text-5xl font-bold mb-4 opacity-30" style={{ color: accent }}>{step.number}</div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: accent }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: "'Work Sans', sans-serif", color: C.muted }}>{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="cyber-testimonials py-24" style={{ background: C.surface }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-bold uppercase tracking-widest block mb-2" style={{ color: C.neon }}>// Transmissions</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">User Reports</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((t, i) => {
                const accent = i % 2 === 0 ? C.cyan : C.neon;
                return (
                  <div key={i} className="cyber-test p-6 border-l-2"
                    style={{ borderColor: accent, background: C.surfaceLight }}>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-current" style={{ color: C.neon }} />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: "'Work Sans', sans-serif", color: C.muted }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <img src={`https://i.pravatar.cc/40?u=${t.avatar}`} alt={`${t.name} avatar`}
                        className="w-10 h-10 rounded-sm border" style={{ borderColor: accent + "40" }}
                        width={40} height={40} loading="lazy" />
                      <div>
                        <div className="text-sm font-bold" style={{ color: accent }}>{t.name}</div>
                        <div className="text-xs" style={{ color: C.muted }}>{t.role}, {t.company}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ PRICING ═══ */}
        <section id="pricing" className="cyber-pricing py-24 cyber-grid-bg">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-bold uppercase tracking-widest block mb-2" style={{ color: C.cyan }}>// Pricing</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Access Tiers</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {pricingPlans.map((plan, i) => {
                const accent = plan.highlighted ? C.neon : C.cyan;
                return (
                  <div key={i} className="cyber-price p-8 border flex flex-col"
                    style={{
                      borderColor: plan.highlighted ? C.neon : C.cyan + "30",
                      background: C.surface,
                      boxShadow: plan.highlighted ? `0 0 30px ${C.neon}20` : "none",
                    }}>
                    <div className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{plan.name}</div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-bold" style={{ color: accent }}>{plan.price}</span>
                      <span className="text-sm" style={{ color: C.muted }}>{plan.period}</span>
                    </div>
                    <p className="text-sm mb-8" style={{ fontFamily: "'Work Sans', sans-serif", color: C.muted }}>{plan.description}</p>
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm" style={{ fontFamily: "'Work Sans', sans-serif", color: C.muted }}>
                          <Check className="w-4 h-4 shrink-0" style={{ color: accent }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-3 text-sm font-bold uppercase tracking-wider border transition-all hover:scale-105"
                      style={{
                        borderColor: accent,
                        background: plan.highlighted ? C.neon : "transparent",
                        color: plan.highlighted ? "white" : accent,
                        boxShadow: plan.highlighted ? `0 0 15px ${C.neon}30` : "none",
                      }}>
                      {plan.cta}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="cyber-cta-section py-24 relative overflow-hidden" style={{ background: C.surface }}>
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 50% 50%, ${C.neon}40, transparent 70%)` }} />
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10 cyber-cta-inner">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 neon-text-pink" style={{ color: C.neon }}>
              Ready to Jack In?
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: "'Work Sans', sans-serif", color: C.muted }}>
              Initialize your first interactive demo. No credit card required. Full system access.
            </p>
            <Link href="/register"
              className="inline-flex items-center gap-2 px-10 py-4 text-base font-bold uppercase tracking-wider transition-all hover:scale-105 neon-box-pink"
              style={{ background: C.neon, color: "white" }}>
              Start Protocol <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="py-12 border-t" style={{ borderColor: C.cyan + "15" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 flex items-center justify-center border" style={{ borderColor: C.cyan, background: C.cyan + "15" }}>
                    <Zap className="w-4 h-4" style={{ color: C.cyan }} />
                  </div>
                  <span className="text-lg font-bold uppercase tracking-wider neon-text-cyan" style={{ color: C.cyan }}>Stepwise</span>
                </div>
                <p className="text-sm" style={{ fontFamily: "'Work Sans', sans-serif", color: C.muted }}>
                  Interactive demos.<br />Digital evolution.
                </p>
              </div>
              {[
                { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
                { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
                { title: "Legal", links: ["Privacy", "Terms", "Security"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: C.cyan }}>{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-sm transition-colors hover:opacity-80" style={{ fontFamily: "'Work Sans', sans-serif", color: C.muted }}>{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t pt-8" style={{ borderColor: C.cyan + "15" }}>
              <p className="text-xs text-center" style={{ color: C.muted }}>
                © 2026 Stepwise Corp. All rights reserved. // System v3.0
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
