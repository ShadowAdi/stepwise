"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MousePointerClick, Route, Blocks, Share2, BarChart3, Palette,
  Check, ArrowRight, Zap, Star, Leaf,
} from "lucide-react";
import { features, steps, testimonials, pricingPlans, stats } from "../data";

gsap.registerPlugin(ScrollTrigger);

const C = {
  terracotta: "#A45A52",
  sand: "#E0AB76",
  linen: "#FAF0E6",
  olive: "#9AB973",
  cream: "#FFF8F0",
  dark: "#3D2B24",
  muted: "#7A6860",
};

const iconMap: Record<string, React.ElementType> = {
  MousePointerClick, Route, Blocks, Share2, BarChart3, Palette,
};

/* ═══════════════════════════════════════════════════════
   VARIANT 2 — ORGANIC / ABSTRACT SHAPES
   Fluid layouts, soft curves, natural forms, flowing
   transitions, earthy palette
   ═══════════════════════════════════════════════════════ */

export default function OrganicLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setLoaded(true) });

      tl.set(".organic-content", { visibility: "visible" });

      // Blob shapes expand from center
      tl.from(".blob-shape", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "elastic.out(1, 0.5)",
      });

      // Hero text flows in
      tl.from(".hero-line", {
        y: 80,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      }, "-=0.5");

      tl.from(".hero-desc", {
        y: 40,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.3");

      tl.from(".hero-buttons", {
        y: 30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.2");

      /* ── SCROLL ANIMATIONS ── */
      gsap.from(".stat-card", {
        scrollTrigger: { trigger: ".stats-strip", start: "top 85%" },
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });

      // Feature items float up with organic motion
      gsap.from(".feature-organic", {
        scrollTrigger: { trigger: ".features-organic", start: "top 70%" },
        y: 80,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
      });

      // Alternating rows
      document.querySelectorAll(".alt-row").forEach((row, i) => {
        gsap.from(row, {
          scrollTrigger: { trigger: row, start: "top 80%" },
          x: i % 2 === 0 ? -80 : 80,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
        });
      });

      // Parallax blob shapes
      gsap.utils.toArray<HTMLElement>(".parallax-blob").forEach((el) => {
        gsap.to(el, {
          y: -80,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      // Testimonials
      gsap.from(".test-organic", {
        scrollTrigger: { trigger: ".testimonials-organic", start: "top 75%" },
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });

      // Pricing
      gsap.from(".price-organic", {
        scrollTrigger: { trigger: ".pricing-organic", start: "top 75%" },
        y: 80,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "power2.out",
      });

      // CTA
      gsap.from(".cta-organic-inner", {
        scrollTrigger: { trigger: ".cta-organic", start: "top 80%" },
        scale: 0.9,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ fontFamily: "'Nunito', sans-serif", background: C.cream, color: C.dark }}>
      {!loaded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: C.cream }}>
          <div className="relative">
            <div className="blob-shape w-20 h-20 rounded-full absolute -top-4 -left-4" style={{ background: C.terracotta + "40" }} />
            <div className="blob-shape w-16 h-16 rounded-full absolute top-2 left-8" style={{ background: C.olive + "40" }} />
            <div className="blob-shape w-12 h-12 rounded-full absolute top-8 left-0" style={{ background: C.sand + "40" }} />
            <Leaf className="blob-shape w-8 h-8 relative z-10" style={{ color: C.terracotta }} />
          </div>
        </div>
      )}

      <div className="organic-content" style={{ visibility: "hidden" }}>
        {/* ═══ HEADER ═══ */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ background: C.cream + "DD", borderColor: C.sand + "40" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
            <Link href="/landing" className="flex items-center gap-2" aria-label="Stepwise Home">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.terracotta }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">Stepwise</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {["Features", "How It Works", "Pricing"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-sm font-semibold transition-colors hover:opacity-70" style={{ color: C.muted }}>
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold" style={{ color: C.muted }}>Log in</Link>
              <Link href="/register" className="px-5 py-2 text-sm font-bold text-white rounded-full transition-transform hover:scale-105"
                style={{ background: C.terracotta }}>
                Sign Up
              </Link>
            </div>
          </div>
        </header>

        {/* ═══ HERO ═══ */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          {/* Organic background blobs */}
          <div className="parallax-blob absolute top-16 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: C.terracotta }} />
          <div className="parallax-blob absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: C.olive }} />
          <div className="parallax-blob absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-10 blur-2xl" style={{ background: C.sand }} />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="hero-line inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: C.olive + "20", color: C.olive }}>
                <Leaf className="w-4 h-4" />
                <span className="text-sm font-bold">Naturally Engaging Demos</span>
              </div>
              <h1 className="hero-line text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6">
                Let Your <span style={{ color: C.terracotta }}>Product</span> Speak for Itself
              </h1>
              <p className="hero-desc text-lg leading-relaxed mb-8 max-w-lg" style={{ fontFamily: "'Lora', serif", color: C.muted }}>
                Create beautiful, interactive walkthroughs that feel as natural as using your product.
                No recordings, no editing — just seamless experiences.
              </p>
              <div className="hero-buttons flex flex-wrap gap-4">
                <Link href="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-white rounded-full transition-transform hover:scale-105"
                  style={{ background: C.terracotta }}>
                  Start Creating <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold rounded-full border-2 transition-colors"
                  style={{ borderColor: C.dark + "30", color: C.dark }}>
                  How It Works
                </Link>
              </div>
            </div>

            {/* Organic product visual */}
            <div className="relative blob-shape">
              <div className="rounded-3xl overflow-hidden shadow-2xl border" style={{ borderColor: C.sand + "40" }}>
                <div className="p-4" style={{ background: C.linen }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: C.terracotta }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: C.sand }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: C.olive }} />
                    <div className="flex-1 mx-3 h-6 rounded-full" style={{ background: C.sand + "30" }} />
                  </div>
                  <div className="aspect-[4/3] rounded-2xl relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.linen}, ${C.sand}30)` }}>
                    <div className="absolute inset-6 grid grid-cols-4 gap-3">
                      <div className="col-span-1 space-y-2">
                        <div className="h-8 rounded-lg" style={{ background: C.terracotta + "25" }} />
                        <div className="h-3 w-full rounded" style={{ background: C.dark + "10" }} />
                        <div className="h-3 w-3/4 rounded" style={{ background: C.dark + "10" }} />
                        <div className="h-3 w-1/2 rounded" style={{ background: C.dark + "10" }} />
                      </div>
                      <div className="col-span-3 rounded-xl p-4 relative" style={{ background: "white" }}>
                        <div className="h-4 w-1/3 rounded mb-3" style={{ background: C.dark + "15" }} />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-16 rounded-lg" style={{ background: C.olive + "15" }} />
                          <div className="h-16 rounded-lg" style={{ background: C.sand + "15" }} />
                        </div>
                        {/* Hotspot */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="w-10 h-10 rounded-full animate-ping absolute" style={{ background: C.terracotta + "30" }} />
                          <div className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ background: C.terracotta + "20", border: `2px solid ${C.terracotta}` }}>
                            <MousePointerClick className="w-4 h-4" style={{ color: C.terracotta }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating accent shapes */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30" style={{ background: C.olive }} />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-25" style={{ background: C.sand }} />
            </div>
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <section className="stats-strip py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="stat-card text-center p-6 rounded-2xl" style={{ background: C.linen }}>
                  <div className="text-3xl font-extrabold mb-1" style={{ color: C.terracotta }}>{s.value}</div>
                  <div className="text-sm font-semibold" style={{ color: C.muted }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section id="features" className="features-organic py-24 relative overflow-hidden">
          <div className="parallax-blob absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: C.olive }} />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="text-sm font-bold uppercase tracking-widest mb-2 block" style={{ color: C.olive }}>Features</span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Grow Your Engagement
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f, i) => {
                const Icon = iconMap[f.icon];
                const accent = [C.terracotta, C.olive, C.sand, C.terracotta, C.olive, C.sand][i];
                return (
                  <div key={i} className="feature-organic rounded-2xl p-8 transition-shadow hover:shadow-lg" style={{ background: C.linen }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: accent + "20" }}>
                      {Icon && <Icon className="w-6 h-6" style={{ color: accent }} />}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: "'Lora', serif", color: C.muted }}>{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section id="how-it-works" className="py-24" style={{ background: C.linen }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-bold uppercase tracking-widest mb-2 block" style={{ color: C.terracotta }}>Process</span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Three Simple Steps</h2>
            </div>
            <div className="space-y-16">
              {steps.map((step, i) => {
                const accent = [C.terracotta, C.olive, C.sand][i];
                return (
                  <div key={i} className={`alt-row flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12`}>
                    <div className="flex-1">
                      <div className="text-6xl font-extrabold mb-4 opacity-20" style={{ color: accent }}>{step.number}</div>
                      <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                      <p className="text-base leading-relaxed max-w-md" style={{ fontFamily: "'Lora', serif", color: C.muted }}>{step.description}</p>
                    </div>
                    <div className="flex-1 w-full">
                      <div className="aspect-[4/3] rounded-3xl flex items-center justify-center" style={{ background: accent + "15" }}>
                        <div className="text-8xl font-extrabold" style={{ color: accent + "30" }}>{step.number}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="testimonials-organic py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-bold uppercase tracking-widest mb-2 block" style={{ color: C.sand.replace("E0", "B8") }}>Testimonials</span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Trusted by Teams</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((t, i) => (
                <div key={i} className="test-organic rounded-2xl p-6" style={{ background: C.linen }}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current" style={{ color: C.sand }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: "'Lora', serif", color: C.muted }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <img src={`https://i.pravatar.cc/40?u=${t.avatar}`} alt={`${t.name} avatar`}
                      className="w-10 h-10 rounded-full" width={40} height={40} loading="lazy" />
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
        <section id="pricing" className="pricing-organic py-24" style={{ background: C.linen }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-sm font-bold uppercase tracking-widest mb-2 block" style={{ color: C.olive }}>Pricing</span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Plans That Grow With You</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {pricingPlans.map((plan, i) => (
                <div key={i} className={`price-organic rounded-2xl p-8 flex flex-col ${plan.highlighted ? "ring-2 scale-105" : ""}`}
                  style={{
                    background: plan.highlighted ? C.terracotta : "white",
                    color: plan.highlighted ? "white" : C.dark,
                    outlineColor: plan.highlighted ? C.terracotta : undefined,
                  }}>
                  <div className="text-sm font-bold uppercase tracking-wider mb-2">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-sm opacity-60">{plan.period}</span>
                  </div>
                  <p className="text-sm opacity-60 mb-8" style={{ fontFamily: "'Lora', serif" }}>{plan.description}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm" style={{ fontFamily: "'Lora', serif" }}>
                        <Check className="w-4 h-4 shrink-0" style={{ color: plan.highlighted ? C.sand : C.olive }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 text-sm font-bold rounded-full transition-transform hover:scale-105"
                    style={{
                      background: plan.highlighted ? "white" : C.terracotta,
                      color: plan.highlighted ? C.terracotta : "white",
                    }}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="cta-organic py-24 relative overflow-hidden">
          <div className="parallax-blob absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 30% 50%, ${C.terracotta}, transparent 60%), radial-gradient(circle at 70% 50%, ${C.olive}, transparent 60%)` }} />
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10 cta-organic-inner">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Ready to Grow Your Engagement?
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: "'Lora', serif", color: C.muted }}>
              Join thousands of teams creating natural, engaging product experiences.
            </p>
            <Link href="/register"
              className="inline-flex items-center gap-2 px-10 py-4 text-base font-bold text-white rounded-full transition-transform hover:scale-105"
              style={{ background: C.terracotta }}>
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="py-12 border-t" style={{ borderColor: C.sand + "30" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.terracotta }}>
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold">Stepwise</span>
                </div>
                <p className="text-sm" style={{ fontFamily: "'Lora', serif", color: C.muted }}>
                  Interactive demos,<br />naturally engaging.
                </p>
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
                        <a href="#" className="text-sm hover:underline" style={{ fontFamily: "'Lora', serif", color: C.muted }}>{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t pt-8" style={{ borderColor: C.sand + "30" }}>
              <p className="text-xs text-center" style={{ color: C.muted }}>
                © 2026 Stepwise. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
