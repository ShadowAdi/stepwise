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
  black: "#1B1B1B",
  white: "#FFFFFF",
  offWhite: "#FAFAFA",
  silver: "#C0C0C0",
  grey: "#808080",
  lightGrey: "#F0F0F0",
  accent: "#AFDBF5",
  accentDark: "#5BA3D9",
  muted: "#999999",
};

const iconMap: Record<string, React.ElementType> = {
  MousePointerClick, Route, Blocks, Share2, BarChart3, Palette,
};

/* ═══════════════════════════════════════════════════════
   VARIANT 5 — MODERN MINIMALIST
   Clean lines, ample white space, editorial typography,
   precise animations, elegant restraint
   ═══════════════════════════════════════════════════════ */

export default function MinimalistLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setLoaded(true) });

      tl.set(".min-content", { visibility: "visible" });

      // Elegant curtain wipe - two halves
      tl.to(".curtain-left", { x: "-100%", duration: 0.8, ease: "power3.inOut" });
      tl.to(".curtain-right", { x: "100%", duration: 0.8, ease: "power3.inOut" }, "<");

      // Hero text letter stagger
      tl.from(".min-hero-line", {
        y: 80,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      }, "-=0.3");

      tl.from(".min-hero-sub", {
        y: 30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.2");

      tl.from(".min-hero-cta", {
        y: 20,
        opacity: 0,
        duration: 0.3,
      }, "-=0.1");

      tl.from(".min-hero-visual", {
        y: 40,
        opacity: 0,
        scale: 0.98,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.2");

      /* ── SCROLL ── */
      // Stats with line drawing
      gsap.from(".min-stat", {
        scrollTrigger: { trigger: ".min-stats", start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
      });

      // Feature grid stagger reveal
      gsap.from(".min-feature", {
        scrollTrigger: { trigger: ".min-features", start: "top 70%" },
        y: 60,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
      });

      // How it works - precise sequence
      gsap.from(".min-step", {
        scrollTrigger: { trigger: ".min-how", start: "top 75%" },
        y: 60,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "power2.out",
      });

      // Line separator animation
      gsap.utils.toArray<HTMLElement>(".line-reveal").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%" },
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.6,
          ease: "power2.out",
        });
      });

      // Testimonials
      gsap.from(".min-test", {
        scrollTrigger: { trigger: ".min-testimonials", start: "top 75%" },
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });

      // Pricing
      gsap.from(".min-price", {
        scrollTrigger: { trigger: ".min-pricing", start: "top 75%" },
        y: 60,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out",
      });

      // CTA
      gsap.from(".min-cta-inner", {
        scrollTrigger: { trigger: ".min-cta", start: "top 80%" },
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ fontFamily: "'Source Sans 3', sans-serif", background: C.white, color: C.black }}>
      {/* Curtain overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none flex">
        <div className="curtain-left w-1/2 h-full" style={{ background: C.black }} />
        <div className="curtain-right w-1/2 h-full" style={{ background: C.black }} />
      </div>

      <div className="min-content" style={{ visibility: "hidden" }}>
        {/* ═══ HEADER ═══ */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ background: C.white + "EE", borderColor: C.lightGrey }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
            <Link href="/landing" className="flex items-center gap-2" aria-label="Stepwise Home">
              <Zap className="w-5 h-5" style={{ color: C.black }} />
              <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Stepwise
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {["Features", "Process", "Pricing"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`}
                  className="text-sm transition-colors hover:opacity-60" style={{ color: C.grey }}>
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm" style={{ color: C.grey }}>Log in</Link>
              <Link href="/register"
                className="px-5 py-2 text-sm font-medium text-white rounded-sm transition-all hover:opacity-90"
                style={{ background: C.black }}>
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* ═══ HERO ═══ */}
        <section className="min-h-screen flex items-center pt-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <div className="max-w-3xl mb-16">
              <p className="min-hero-line text-sm uppercase tracking-widest mb-6" style={{ color: C.muted }}>
                Interactive Product Demos
              </p>
              <h1 className="min-hero-line text-5xl md:text-6xl lg:text-[5.5rem] leading-[1.05] tracking-tight mb-8"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                The Art of <br />
                <em className="italic" style={{ color: C.accentDark }}>Showing</em>, Not Telling
              </h1>
              <p className="min-hero-sub text-lg md:text-xl leading-relaxed mb-10 max-w-xl" style={{ color: C.grey }}>
                Transform screenshots into elegant, clickable walkthroughs.
                Simple. Beautiful. Effective.
              </p>
              <div className="min-hero-cta flex flex-wrap items-center gap-6">
                <Link href="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium text-white rounded-sm transition-all hover:opacity-90"
                  style={{ background: C.black }}>
                  Start Free <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#process" className="text-sm underline underline-offset-4 transition-colors"
                  style={{ color: C.grey, textDecorationColor: C.silver }}>
                  See how it works
                </a>
              </div>
            </div>

            {/* Clean product visual */}
            <div className="min-hero-visual rounded-sm overflow-hidden border" style={{ borderColor: C.lightGrey }}>
              <div className="aspect-[16/7] relative" style={{ background: C.offWhite }}>
                <div className="absolute inset-6 md:inset-10 grid grid-cols-5 gap-4">
                  <div className="col-span-1 space-y-3 hidden md:block">
                    <div className="h-8 rounded-sm" style={{ background: C.lightGrey }} />
                    <div className="h-3 w-full rounded-sm" style={{ background: C.lightGrey }} />
                    <div className="h-3 w-3/4 rounded-sm" style={{ background: C.lightGrey }} />
                    <div className="h-3 w-1/2 rounded-sm" style={{ background: C.lightGrey }} />
                    <div className="h-px my-2" style={{ background: C.lightGrey }} />
                    <div className="h-3 w-full rounded-sm" style={{ background: C.lightGrey }} />
                    <div className="h-3 w-2/3 rounded-sm" style={{ background: C.lightGrey }} />
                  </div>
                  <div className="col-span-5 md:col-span-4 rounded-sm p-4 md:p-6 relative" style={{ background: C.white, border: `1px solid ${C.lightGrey}` }}>
                    <div className="h-4 w-1/4 rounded-sm mb-4" style={{ background: C.lightGrey }} />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {[C.accent + "30", C.lightGrey, C.accent + "15", C.lightGrey, C.accent + "20", C.lightGrey].map((bg, j) => (
                        <div key={j} className="h-12 md:h-16 rounded-sm" style={{ background: bg }} />
                      ))}
                    </div>
                    {/* Hotspot indicators */}
                    <div className="absolute top-1/3 right-1/4 w-6 h-6 rounded-full border-2 flex items-center justify-center animate-pulse"
                      style={{ borderColor: C.accentDark, background: C.accent + "30" }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.accentDark }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <section className="min-stats py-20 border-y" style={{ borderColor: C.lightGrey }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div key={i} className="min-stat text-center">
                  <div className="text-3xl md:text-4xl font-light tracking-tight mb-1"
                    style={{ fontFamily: "'Playfair Display', serif", color: C.black }}>
                    {s.value}
                  </div>
                  <div className="text-xs uppercase tracking-widest" style={{ color: C.muted }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section id="features" className="min-features py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-16">
              <p className="text-sm uppercase tracking-widest mb-4" style={{ color: C.muted }}>Features</p>
              <h2 className="text-4xl md:text-5xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                Everything, <em className="italic">nothing</em> more
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {features.map((f, i) => {
                const Icon = iconMap[f.icon];
                return (
                  <div key={i} className="min-feature">
                    <div className="line-reveal h-px mb-6" style={{ background: C.lightGrey }} />
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0" style={{ background: C.offWhite }}>
                        {Icon && <Icon className="w-5 h-5" style={{ color: C.grey }} />}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{f.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: C.grey }}>{f.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section id="process" className="min-how py-24" style={{ background: C.offWhite }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-16">
              <p className="text-sm uppercase tracking-widest mb-4" style={{ color: C.muted }}>Process</p>
              <h2 className="text-4xl md:text-5xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                Three steps to <em className="italic">clarity</em>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((step, i) => (
                <div key={i} className="min-step">
                  <div className="text-6xl font-light mb-4 tracking-tight"
                    style={{ fontFamily: "'Playfair Display', serif", color: C.silver }}>
                    {step.number}
                  </div>
                  <div className="line-reveal h-px mb-6" style={{ background: C.black + "15" }} />
                  <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.grey }}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="min-testimonials py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-16">
              <p className="text-sm uppercase tracking-widest mb-4" style={{ color: C.muted }}>Testimonials</p>
              <h2 className="text-4xl md:text-5xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                In their <em className="italic">words</em>
              </h2>
            </div>
            {/* Anchor quote */}
            <div className="min-test mb-12 p-8 md:p-12 rounded-sm" style={{ background: C.offWhite }}>
              <p className="text-xl md:text-2xl leading-relaxed mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontStyle: "italic", color: C.black }}>
                &ldquo;{testimonials[0].quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img src={`https://i.pravatar.cc/48?u=${testimonials[0].avatar}`} alt={`${testimonials[0].name} avatar`}
                  className="w-12 h-12 rounded-full" width={48} height={48} loading="lazy" />
                <div>
                  <div className="text-sm font-semibold">{testimonials[0].name}</div>
                  <div className="text-xs" style={{ color: C.muted }}>{testimonials[0].role}, {testimonials[0].company}</div>
                </div>
              </div>
            </div>
            {/* Supporting grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(1, 4).map((t, i) => (
                <div key={i} className="min-test p-6 border rounded-sm" style={{ borderColor: C.lightGrey }}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 fill-current" style={{ color: C.accentDark }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: C.grey }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <img src={`https://i.pravatar.cc/36?u=${t.avatar}`} alt={`${t.name} avatar`}
                      className="w-9 h-9 rounded-full" width={36} height={36} loading="lazy" />
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs" style={{ color: C.muted }}>{t.role}, {t.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PRICING ═══ */}
        <section id="pricing" className="min-pricing py-24" style={{ background: C.offWhite }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-widest mb-4" style={{ color: C.muted }}>Pricing</p>
              <h2 className="text-4xl md:text-5xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                Transparent <em className="italic">simplicity</em>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {pricingPlans.map((plan, i) => (
                <div key={i} className={`min-price p-8 rounded-sm flex flex-col ${plan.highlighted ? "ring-1" : "border"}`}
                  style={{
                    background: plan.highlighted ? C.black : C.white,
                    color: plan.highlighted ? C.white : C.black,
                    borderColor: C.lightGrey,
                    outlineColor: plan.highlighted ? C.black : undefined,
                  }}>
                  <div className="text-xs uppercase tracking-widest mb-4" style={{ color: plan.highlighted ? C.muted : C.muted }}>
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>{plan.price}</span>
                    <span className="text-sm" style={{ color: plan.highlighted ? C.silver : C.muted }}>{plan.period}</span>
                  </div>
                  <p className="text-sm mb-8" style={{ color: plan.highlighted ? C.silver : C.muted }}>{plan.description}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm" style={{ color: plan.highlighted ? C.silver : C.grey }}>
                        <Check className="w-4 h-4 shrink-0" style={{ color: plan.highlighted ? C.accent : C.accentDark }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 text-sm font-medium rounded-sm transition-all hover:opacity-90"
                    style={{
                      background: plan.highlighted ? C.white : C.black,
                      color: plan.highlighted ? C.black : C.white,
                    }}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="min-cta py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center min-cta-inner">
            <h2 className="text-4xl md:text-5xl tracking-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
              Ready to show your <em className="italic">best</em>?
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: C.grey }}>
              Join teams crafting beautiful, interactive product experiences.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/register"
                className="inline-flex items-center gap-2 px-10 py-4 text-base font-medium text-white rounded-sm transition-all hover:opacity-90"
                style={{ background: C.black }}>
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#pricing" className="text-sm underline underline-offset-4" style={{ color: C.grey, textDecorationColor: C.silver }}>
                View pricing
              </a>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="py-16 border-t" style={{ borderColor: C.lightGrey }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5" />
                  <span className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Stepwise</span>
                </div>
                <p className="text-sm" style={{ color: C.muted }}>
                  Interactive demos,<br />beautifully simple.
                </p>
              </div>
              {[
                { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
                { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
                { title: "Legal", links: ["Privacy", "Terms", "Security"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: C.muted }}>{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-sm hover:underline" style={{ color: C.grey }}>{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t pt-8" style={{ borderColor: C.lightGrey }}>
              <p className="text-xs text-center" style={{ color: C.muted }}>© 2026 Stepwise. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
