"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MousePointerClick, Route, Blocks, Share2, BarChart3, Palette,
  Check, ArrowRight, Zap, Star,
} from "lucide-react";
import { features, steps, testimonials, pricingPlans, stats } from "../data";

gsap.registerPlugin(ScrollTrigger);

const C = {
  bg: "#EDEAE0",
  surface: "#E4E0D4",
  surfaceLight: "#F2EFEA",
  taupe: "#BC8F8F",
  olive: "#9AB973",
  fawn: "#CDB280",
  dark: "#4A4035",
  muted: "#7A7060",
  highlight: "#A45A52",
};

/* Neumorphism shadow helpers */
const neuOut = "8px 8px 16px #C8C4B8, -8px -8px 16px #FFFFFF";
const neuIn = "inset 4px 4px 8px #C8C4B8, inset -4px -4px 8px #FFFFFF";
const neuOutSm = "4px 4px 8px #C8C4B8, -4px -4px 8px #FFFFFF";

const iconMap: Record<string, React.ElementType> = {
  MousePointerClick, Route, Blocks, Share2, BarChart3, Palette,
};

/* ═══════════════════════════════════════════════════════
   VARIANT 4 — NEUMORPHISM
   Soft UI, extruded elements, subtle shadows,
   tactile low-contrast feel
   ═══════════════════════════════════════════════════════ */

export default function NeumorphismLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setLoaded(true) });

      tl.set(".neu-content", { visibility: "visible" });

      // Elements push out from flat surface
      tl.from(".neu-emerge", {
        boxShadow: "0 0 0 #C8C4B8, 0 0 0 #FFFFFF",
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });

      tl.from(".hero-neu-text", {
        y: 60,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }, "-=0.5");

      tl.from(".hero-neu-sub", {
        y: 30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.2");

      tl.from(".hero-neu-cta", {
        y: 20,
        opacity: 0,
        duration: 0.3,
      }, "-=0.1");

      /* ── SCROLL ── */
      gsap.from(".neu-stat", {
        scrollTrigger: { trigger: ".neu-stats", start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });

      gsap.from(".neu-feature", {
        scrollTrigger: { trigger: ".neu-features", start: "top 75%" },
        y: 60,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });

      // Steps with accordion-like animation
      gsap.from(".neu-step", {
        scrollTrigger: { trigger: ".neu-how", start: "top 75%" },
        x: -60,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "power2.out",
      });

      gsap.from(".neu-test", {
        scrollTrigger: { trigger: ".neu-testimonials", start: "top 75%" },
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });

      gsap.from(".neu-price", {
        scrollTrigger: { trigger: ".neu-pricing", start: "top 75%" },
        y: 70,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out",
      });

      gsap.from(".neu-cta-inner", {
        scrollTrigger: { trigger: ".neu-cta", start: "top 80%" },
        scale: 0.95,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ fontFamily: "'Raleway', sans-serif", background: C.bg, color: C.dark }}>
      {!loaded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: C.bg }}>
          <div className="flex gap-6">
            <div className="neu-emerge w-16 h-16 rounded-2xl" style={{ background: C.bg, boxShadow: neuOut }} />
            <div className="neu-emerge w-16 h-16 rounded-full" style={{ background: C.bg, boxShadow: neuOut }} />
            <div className="neu-emerge w-16 h-16 rounded-2xl" style={{ background: C.bg, boxShadow: neuOut }} />
          </div>
        </div>
      )}

      <div className="neu-content" style={{ visibility: "hidden" }}>
        {/* ═══ HEADER ═══ */}
        <header className="fixed top-0 left-0 right-0 z-50" style={{ background: C.bg }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
            <Link href="/landing" className="flex items-center gap-2" aria-label="Stepwise Home">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.bg, boxShadow: neuOutSm }}>
                <Zap className="w-4 h-4" style={{ color: C.highlight }} />
              </div>
              <span className="text-lg font-bold tracking-tight">Stepwise</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {["Features", "How It Works", "Pricing"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-sm font-semibold transition-colors" style={{ color: C.muted }}>
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold" style={{ color: C.muted }}>Log in</Link>
              <Link href="/register" className="px-5 py-2 text-sm font-semibold rounded-xl transition-all active:scale-95"
                style={{ background: C.bg, boxShadow: neuOutSm, color: C.highlight }}>
                Sign Up
              </Link>
            </div>
          </div>
        </header>

        {/* ═══ HERO ═══ */}
        <section className="relative min-h-screen flex items-center pt-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="hero-neu-text inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8"
                style={{ background: C.bg, boxShadow: neuOutSm, color: C.highlight }}>
                <span className="text-sm font-semibold">Interactive Product Demos</span>
              </div>
              <h1 className="hero-neu-text text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
                Soft Touch,<br />
                <span style={{ color: C.highlight }}>Big Impact</span>
              </h1>
              <p className="hero-neu-sub text-lg leading-relaxed mb-8 max-w-lg" style={{ color: C.muted }}>
                Create tactile, interactive walkthroughs that feel intuitive and natural.
                Upload screenshots, add hotspots, share instantly.
              </p>
              <div className="hero-neu-cta flex flex-wrap gap-4">
                <Link href="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white rounded-xl transition-all hover:scale-105"
                  style={{ background: C.highlight, boxShadow: "4px 4px 12px rgba(164, 90, 82, 0.3)" }}>
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl transition-all active:scale-95"
                  style={{ background: C.bg, boxShadow: neuOut, color: C.dark }}>
                  How It Works
                </Link>
              </div>
            </div>

            {/* Neumorphic product mockup */}
            <div className="neu-emerge rounded-3xl p-6" style={{ background: C.bg, boxShadow: neuOut }}>
              <div className="rounded-2xl p-4" style={{ background: C.bg, boxShadow: neuIn }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: C.highlight + "60" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: C.fawn + "60" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: C.olive + "60" }} />
                </div>
                <div className="aspect-video rounded-xl relative" style={{ background: C.bg, boxShadow: neuIn }}>
                  <div className="absolute inset-4 grid grid-cols-4 gap-2">
                    <div className="col-span-1 space-y-2">
                      <div className="h-6 rounded-lg" style={{ background: C.bg, boxShadow: neuOutSm }} />
                      <div className="h-3 rounded" style={{ background: C.surface }} />
                      <div className="h-3 w-3/4 rounded" style={{ background: C.surface }} />
                    </div>
                    <div className="col-span-3 rounded-xl p-3" style={{ background: C.surfaceLight }}>
                      <div className="h-3 w-1/3 rounded mb-2" style={{ background: C.surface }} />
                      <div className="h-3 w-2/3 rounded mb-4" style={{ background: C.surface }} />
                      {/* Hotspot */}
                      <div className="relative w-10 h-10 mx-auto mt-4">
                        <div className="absolute inset-0 rounded-full animate-ping" style={{ background: C.highlight + "20" }} />
                        <div className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: C.bg, boxShadow: neuOutSm }}>
                          <MousePointerClick className="w-4 h-4" style={{ color: C.highlight }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <section className="neu-stats py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="neu-stat text-center p-6 rounded-2xl" style={{ background: C.bg, boxShadow: neuOut }}>
                  <div className="text-3xl font-bold mb-1" style={{ color: C.highlight }}>{s.value}</div>
                  <div className="text-sm font-semibold" style={{ color: C.muted }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section id="features" className="neu-features py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold uppercase tracking-widest mb-2 block" style={{ color: C.olive }}>Features</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Crafted With Care</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f, i) => {
                const Icon = iconMap[f.icon];
                const accent = [C.highlight, C.olive, C.fawn, C.highlight, C.olive, C.fawn][i];
                return (
                  <div key={i} className="neu-feature p-8 rounded-2xl transition-all"
                    style={{ background: C.bg, boxShadow: neuOut }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: C.bg, boxShadow: neuIn }}>
                      {Icon && <Icon className="w-5 h-5" style={{ color: accent }} />}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section id="how-it-works" className="neu-how py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold uppercase tracking-widest mb-2 block" style={{ color: C.highlight }}>Process</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">How It Works</h2>
            </div>
            <div className="max-w-2xl mx-auto space-y-8">
              {steps.map((step, i) => {
                const accent = [C.highlight, C.olive, C.fawn][i];
                return (
                  <div key={i} className="neu-step flex items-start gap-6 p-8 rounded-2xl"
                    style={{ background: C.bg, boxShadow: neuOut }}>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-xl font-bold"
                      style={{ background: C.bg, boxShadow: neuIn, color: accent }}>
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="neu-testimonials py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold uppercase tracking-widest mb-2 block" style={{ color: C.fawn.replace("CD", "A0") }}>Testimonials</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">What People Say</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((t, i) => (
                <div key={i} className="neu-test p-6 rounded-2xl" style={{ background: C.bg, boxShadow: neuOut }}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current" style={{ color: C.fawn }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: C.muted }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="p-0.5 rounded-full" style={{ boxShadow: neuOutSm }}>
                      <img src={`https://i.pravatar.cc/40?u=${t.avatar}`} alt={`${t.name} avatar`}
                        className="w-10 h-10 rounded-full" width={40} height={40} loading="lazy" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{t.name}</div>
                      <div className="text-xs" style={{ color: C.muted }}>{t.role}, {t.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PRICING ═══ */}
        <section id="pricing" className="neu-pricing py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold uppercase tracking-widest mb-2 block" style={{ color: C.olive }}>Pricing</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Simple & Honest</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {pricingPlans.map((plan, i) => (
                <div key={i} className={`neu-price p-8 rounded-2xl flex flex-col ${plan.highlighted ? "scale-105" : ""}`}
                  style={{
                    background: plan.highlighted ? C.highlight : C.bg,
                    color: plan.highlighted ? "white" : C.dark,
                    boxShadow: neuOut,
                  }}>
                  <div className="text-sm font-semibold uppercase tracking-wider mb-2">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm opacity-60">{plan.period}</span>
                  </div>
                  <p className="text-sm opacity-60 mb-8">{plan.description}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 shrink-0" style={{ color: plan.highlighted ? C.fawn : C.olive }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 text-sm font-semibold rounded-xl transition-all active:scale-95"
                    style={{
                      background: plan.highlighted ? "white" : C.bg,
                      color: plan.highlighted ? C.highlight : C.dark,
                      boxShadow: plan.highlighted ? "none" : neuOutSm,
                    }}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="neu-cta py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="neu-cta-inner p-12 md:p-16 rounded-3xl" style={{ background: C.bg, boxShadow: neuOut }}>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Start Building Today
              </h2>
              <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: C.muted }}>
                Create your first interactive product demo in minutes.
                No credit card. No commitments.
              </p>
              <Link href="/register"
                className="inline-flex items-center gap-2 px-10 py-4 text-base font-semibold text-white rounded-xl transition-all hover:scale-105"
                style={{ background: C.highlight }}>
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.bg, boxShadow: neuOutSm }}>
                    <Zap className="w-4 h-4" style={{ color: C.highlight }} />
                  </div>
                  <span className="text-lg font-bold">Stepwise</span>
                </div>
                <p className="text-sm" style={{ color: C.muted }}>Tactile demos,<br />intuitive experiences.</p>
              </div>
              {[
                { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
                { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
                { title: "Legal", links: ["Privacy", "Terms", "Security"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="text-sm font-bold mb-4">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-sm hover:underline" style={{ color: C.muted }}>{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t" style={{ borderColor: C.surface }}>
              <p className="text-xs text-center" style={{ color: C.muted }}>© 2026 Stepwise. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
