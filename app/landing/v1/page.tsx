"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MousePointerClick,
  Route,
  Blocks,
  Share2,
  BarChart3,
  Palette,
  Check,
  ArrowRight,
  Zap,
  Star,
  ChevronRight,
} from "lucide-react";
import { features, steps, testimonials, pricingPlans, stats } from "../data";

gsap.registerPlugin(ScrollTrigger);

/* ─── Color palette ─── */
const C = {
  red: "#E60026",
  blue: "#2454FF",
  yellow: "#FFCC00",
  black: "#1B1B1B",
  white: "#FFFFFF",
  offWhite: "#F5F5F0",
  grey: "#E8E8E4",
};

const iconMap: Record<string, React.ElementType> = {
  MousePointerClick,
  Route,
  Blocks,
  Share2,
  BarChart3,
  Palette,
};

/* ═══════════════════════════════════════════════════════
   VARIANT 1 — BAUHAUS
   Geometric shapes, primary colors, structured grids,
   sharp angular animations
   ═══════════════════════════════════════════════════════ */

export default function BauhausLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      /* ── OPENING ANIMATION ── */
      const tl = gsap.timeline({
        onComplete: () => setLoaded(true),
      });

      tl.set(".bauhaus-content", { visibility: "visible" });

      // Geometric shapes fly in
      tl.from(".geo-shape", {
        scale: 0,
        rotation: 180,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
      });

      // Hero text reveals
      tl.from(
        ".hero-title-word",
        {
          y: 120,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.3"
      );

      tl.from(
        ".hero-sub",
        {
          y: 40,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2"
      );

      tl.from(
        ".hero-cta",
        {
          y: 30,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.1"
      );

      /* ── SCROLL ANIMATIONS ── */
      // Stats counter strip
      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 85%",
        },
        y: 60,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });

      // Feature cards stagger in with geometric wipe
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 75%",
        },
        x: (i) => (i % 2 === 0 ? -100 : 100),
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      });

      // How it works - horizontal pin scroll
      const howSection = document.querySelector(".how-section");
      const howCards = document.querySelectorAll(".how-card");
      if (howSection && howCards.length) {
        gsap.to(".how-cards-track", {
          x: () => -(howCards.length - 1) * (window.innerWidth > 768 ? 500 : 320),
          ease: "none",
          scrollTrigger: {
            trigger: ".how-section",
            start: "top top",
            end: () => `+=${howCards.length * 400}`,
            pin: true,
            scrub: 1,
          },
        });
      }

      // Testimonials slide in
      gsap.from(".testimonial-card", {
        scrollTrigger: {
          trigger: ".testimonials-section",
          start: "top 75%",
        },
        y: 80,
        opacity: 0,
        rotation: (i) => (i % 2 === 0 ? -5 : 5),
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Pricing cards
      gsap.from(".pricing-card", {
        scrollTrigger: {
          trigger: ".pricing-section",
          start: "top 75%",
        },
        y: 100,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "power3.out",
      });

      // CTA section
      gsap.from(".cta-section .cta-inner", {
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 80%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ fontFamily: "'Manrope', sans-serif", background: C.offWhite, color: C.black }}
    >
      {/* ── LOADING OVERLAY ── */}
      {!loaded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: C.offWhite }}>
          <div className="flex gap-4">
            <div className="geo-shape w-12 h-12 rounded-full" style={{ background: C.red }} />
            <div className="geo-shape w-12 h-12" style={{ background: C.blue }} />
            <div
              className="geo-shape w-0 h-0"
              style={{ borderLeft: "24px solid transparent", borderRight: "24px solid transparent", borderBottom: `48px solid ${C.yellow}` }}
            />
          </div>
        </div>
      )}

      <div className="bauhaus-content" style={{ visibility: "hidden" }}>
        {/* ═══ HEADER ═══ */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b-2" style={{ background: C.white, borderColor: C.black }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
            <Link href="/landing" className="flex items-center gap-3" aria-label="Stepwise Home">
              <div className="w-8 h-8 flex items-center justify-center" style={{ background: C.red }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight uppercase">Stepwise</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {["Features", "How It Works", "Pricing"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-sm font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity">
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold uppercase tracking-wider hover:opacity-70 transition-opacity">
                Log in
              </Link>
              <Link href="/register"
                className="px-5 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors"
                style={{ background: C.blue }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </header>

        {/* ═══ HERO ═══ */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          {/* Geometric background shapes */}
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-20 geo-shape" style={{ background: C.red }} />
          <div className="absolute bottom-20 left-10 w-48 h-48 opacity-20 geo-shape" style={{ background: C.blue }} />
          <div className="absolute top-1/3 right-1/4 w-32 h-32 opacity-15 geo-shape rotate-45" style={{ background: C.yellow }} />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="overflow-hidden mb-4">
                <div className="hero-title-word inline-flex items-center gap-2 px-4 py-1.5 border-2 text-sm font-bold uppercase tracking-wider" style={{ borderColor: C.red, color: C.red }}>
                  <span className="w-2 h-2" style={{ background: C.red }} />
                  Interactive Product Demos
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6"
                style={{ fontFamily: "'Manrope', sans-serif" }}>
                <span className="hero-title-word block">Create.</span>
                <span className="hero-title-word block" style={{ color: C.blue }}>Engage.</span>
                <span className="hero-title-word block" style={{ color: C.red }}>Convert.</span>
              </h1>
              <p className="hero-sub text-lg md:text-xl leading-relaxed mb-8 max-w-lg" style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#525252" }}>
                Transform static screenshots into clickable, interactive product walkthroughs.
                No video recording. No code. Just results.
              </p>
              <div className="hero-cta flex flex-wrap gap-4">
                <Link href="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-white uppercase tracking-wider transition-transform hover:scale-105"
                  style={{ background: C.blue }}>
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold uppercase tracking-wider border-2 transition-colors hover:bg-black hover:text-white"
                  style={{ borderColor: C.black }}>
                  See How It Works
                </Link>
              </div>
            </div>

            {/* Bauhaus-style product mockup */}
            <div className="relative geo-shape">
              <div className="relative bg-white border-2 p-4" style={{ borderColor: C.black }}>
                {/* Browser chrome */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b-2" style={{ borderColor: C.grey }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: C.red }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: C.yellow }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#4CAF50" }} />
                  <div className="flex-1 mx-4 h-6 rounded-sm" style={{ background: C.grey }} />
                </div>
                {/* Mock screenshot */}
                <div className="aspect-video relative" style={{ background: C.grey }}>
                  <div className="absolute inset-4 grid grid-cols-3 gap-3">
                    <div className="col-span-1 space-y-3">
                      <div className="h-8" style={{ background: C.blue + "30" }} />
                      <div className="h-4 w-3/4" style={{ background: C.black + "15" }} />
                      <div className="h-4 w-1/2" style={{ background: C.black + "15" }} />
                      <div className="h-4 w-2/3" style={{ background: C.black + "15" }} />
                    </div>
                    <div className="col-span-2 relative">
                      <div className="h-full rounded-sm" style={{ background: C.white }} />
                      {/* Hotspot indicators */}
                      <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full border-3 flex items-center justify-center animate-pulse"
                        style={{ borderColor: C.red, background: C.red + "20" }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: C.red }} />
                      </div>
                      <div className="absolute bottom-1/3 right-1/4 w-8 h-8 rounded-full border-3 flex items-center justify-center animate-pulse"
                        style={{ borderColor: C.blue, background: C.blue + "20", animationDelay: "0.5s" }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: C.blue }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 -z-10" style={{ borderColor: C.yellow }} />
            </div>
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <section className="stats-section py-16 border-y-2" style={{ background: C.black, borderColor: C.black }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="stat-item text-center">
                  <div className="text-3xl md:text-4xl font-extrabold mb-1"
                    style={{ color: [C.red, C.blue, C.yellow, C.white][i] }}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: C.white + "80" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section id="features" className="features-section py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-[3px]" style={{ background: C.red }} />
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: C.red }}>Features</span>
                <div className="w-8 h-[3px]" style={{ background: C.red }} />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Everything You Need
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                const Icon = iconMap[feature.icon];
                const accentColor = [C.red, C.blue, C.yellow, C.red, C.blue, C.yellow][i];
                return (
                  <div key={i} className="feature-card group bg-white p-8 border-2 border-transparent hover:border-current transition-colors"
                    style={{ "--tw-border-opacity": 1, borderColor: "transparent" } as React.CSSProperties}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = accentColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-5" style={{ background: accentColor }}>
                      {Icon && <Icon className="w-6 h-6 text-white" />}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#525252" }}>
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section id="how-it-works" className="how-section relative overflow-hidden" style={{ background: C.white }}>
          <div className="min-h-screen flex flex-col justify-center py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-[3px]" style={{ background: C.blue }} />
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: C.blue }}>Process</span>
                <div className="w-8 h-[3px]" style={{ background: C.blue }} />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">How It Works</h2>
            </div>
            <div className="how-cards-track flex gap-8 px-6 lg:px-8 ml-auto">
              {steps.map((step, i) => {
                const accentColor = [C.red, C.blue, C.yellow][i];
                return (
                  <div key={i} className="how-card shrink-0 w-[300px] md:w-[460px] border-2 p-8" style={{ borderColor: C.black, background: C.white }}>
                    <div className="text-7xl font-extrabold mb-6" style={{ color: accentColor }}>
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-base leading-relaxed" style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#525252" }}>
                      {step.description}
                    </p>
                    {i < steps.length - 1 && (
                      <div className="mt-8 flex items-center gap-2 font-bold text-sm uppercase tracking-wider" style={{ color: accentColor }}>
                        Next <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="testimonials-section py-24" style={{ background: C.offWhite }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-[3px]" style={{ background: C.yellow }} />
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#B8960A" }}>Testimonials</span>
                <div className="w-8 h-[3px]" style={{ background: C.yellow }} />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Loved by Teams
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((t, i) => {
                const borderColor = [C.red, C.blue, C.yellow][i % 3];
                return (
                  <div key={i} className="testimonial-card bg-white p-6 border-l-4" style={{ borderColor }}>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-current" style={{ color: C.yellow }} />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#525252" }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/40?u=${t.avatar}`}
                        alt={`${t.name} avatar`}
                        className="w-10 h-10 rounded-full"
                        width={40}
                        height={40}
                        loading="lazy"
                      />
                      <div>
                        <div className="text-sm font-bold">{t.name}</div>
                        <div className="text-xs" style={{ color: "#888" }}>
                          {t.role}, {t.company}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ PRICING ═══ */}
        <section id="pricing" className="pricing-section py-24" style={{ background: C.white }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-[3px]" style={{ background: C.blue }} />
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: C.blue }}>Pricing</span>
                <div className="w-8 h-[3px]" style={{ background: C.blue }} />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Simple, Transparent Pricing
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {pricingPlans.map((plan, i) => {
                const isHighlighted = plan.highlighted;
                return (
                  <div key={i}
                    className="pricing-card border-2 p-8 flex flex-col"
                    style={{
                      borderColor: isHighlighted ? C.blue : C.black,
                      background: isHighlighted ? C.blue : C.white,
                      color: isHighlighted ? C.white : C.black,
                    }}
                  >
                    <div className="text-sm font-bold uppercase tracking-widest mb-2">{plan.name}</div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-extrabold">{plan.price}</span>
                      <span className="text-sm opacity-70">{plan.period}</span>
                    </div>
                    <p className="text-sm opacity-70 mb-8" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                      {plan.description}
                    </p>
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                          <Check className="w-4 h-4 shrink-0" style={{ color: isHighlighted ? C.yellow : C.blue }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      className="w-full py-3 text-sm font-bold uppercase tracking-wider transition-transform hover:scale-105"
                      style={{
                        background: isHighlighted ? C.white : C.blue,
                        color: isHighlighted ? C.blue : C.white,
                      }}
                    >
                      {plan.cta}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="cta-section py-24" style={{ background: C.red }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center cta-inner">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Ready to Build Your First Demo?
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Join thousands of teams creating interactive product walkthroughs with Stepwise.
              Get started in minutes — no credit card required.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold uppercase tracking-wider transition-transform hover:scale-105"
                style={{ background: C.white, color: C.red }}>
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#pricing"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold uppercase tracking-wider border-2 border-white text-white transition-colors hover:bg-white/10">
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="py-12 border-t-2" style={{ background: C.black, borderColor: C.black }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 flex items-center justify-center" style={{ background: C.red }}>
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white uppercase">Stepwise</span>
                </div>
                <p className="text-sm text-white/50" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                  Interactive product demos,<br /> made simple.
                </p>
              </div>
              {[
                { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
                { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
                { title: "Legal", links: ["Privacy", "Terms", "Security"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/40" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                © 2026 Stepwise. All rights reserved.
              </p>
              <div className="flex gap-2">
                {[C.red, C.blue, C.yellow].map((color, i) => (
                  <div key={i} className="w-3 h-3" style={{ background: color }} />
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
