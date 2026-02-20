"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MousePointerClick, Route, Blocks, Share2, BarChart3, Palette,
  Check, ArrowRight, Zap, Star, Quote,
} from "lucide-react";
import { features, steps, testimonials, pricingPlans, stats } from "./data";

gsap.registerPlugin(ScrollTrigger);

const C = {
  black: "#0D0D0D",
  white: "#FFFFFF",
  offWhite: "#FAFAF8",
  lightGrey: "#EBEBEB",
  grey: "#6B6B6B",
  muted: "#999",
  accent: "#C7D2FE",
  accentDark: "#4F46E5",
  warm: "#E8D5C0",
};

const iconMap: Record<string, React.ElementType> = {
  MousePointerClick, Route, Blocks, Share2, BarChart3, Palette,
};

/* ── Falling Words Component ── */
function FallingWords({
  text,
  blockClass,
  blockColor,
}: {
  text: string;
  blockClass: string;
  blockColor: string;
}) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            position: "relative",
            marginRight: "0.25em",
          }}
        >
          {word}
          <span
            className={blockClass}
            style={{
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
              width: "115%",
              height: "92%",
              background: blockColor,
              borderRadius: "4px",
              zIndex: 10,
              pointerEvents: "none",
            }}
          />
        </span>
      ))}
    </>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      /* ═══════════════════════════════════════
         1. OPENING ANIMATION — Counter Loader
         ═══════════════════════════════════════ */
      const openTl = gsap.timeline({
        onComplete: () => setLoaded(true),
      });

      // Counter 000 → 100
      const counter = { val: 0 };
      openTl.to(counter, {
        val: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = Math.round(counter.val)
              .toString()
              .padStart(3, "0");
          }
        },
      });

      // Progress bar fills
      openTl.to(
        ".loader-bar",
        { scaleX: 1, duration: 2, ease: "power2.inOut" },
        "<"
      );

      // Wipe loader upward
      openTl.to(
        ".loader-overlay",
        { yPercent: -100, duration: 0.8, ease: "power3.inOut" },
        "+=0.3"
      );

      // Reveal page
      openTl.set(".page-content", { visibility: "visible" }, "<0.2");

      // Hero label
      openTl.from(
        ".hero-label",
        { y: 30, opacity: 0, duration: 0.4, ease: "power2.out" },
        "-=0.3"
      );

      /* ─── Hero Falling Blocks ─── */
      openTl.to(".hero-block", {
        y: () => gsap.utils.random(600, 1000),
        x: () => gsap.utils.random(-80, 80),
        rotation: () => gsap.utils.random(-180, 180),
        duration: 0.8,
        ease: "power2.in",
        stagger: 0.02,
        onComplete: () => {
          containerRef.current
            ?.querySelectorAll(".hero-block")
            .forEach((el) => {
              (el as HTMLElement).style.display = "none";
            });
        },
      }, "-=0.1");

      openTl.from(
        ".hero-sub",
        { y: 30, opacity: 0, duration: 0.4, ease: "power2.out" },
        "-=0.5"
      );
      openTl.from(
        ".hero-ctas",
        { y: 20, opacity: 0, duration: 0.3, ease: "power2.out" },
        "-=0.2"
      );
      openTl.from(
        ".hero-mockup",
        { y: 60, opacity: 0, scale: 0.97, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      );

      /* ═══════════════════════════════════════
         2. SCROLL-TRIGGERED ANIMATIONS
         ═══════════════════════════════════════ */

      // ── Stats
      gsap.from(".min-stat", {
        scrollTrigger: { trigger: ".min-stats", start: "top 85%" },
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.4,
        ease: "power2.out",
      });

      // ── Section Falling Text (scroll-triggered)
      containerRef.current
        ?.querySelectorAll(".fall-trigger")
        .forEach((trigger) => {
          const blocks = trigger.querySelectorAll(".section-block");
          if (!blocks.length) return;
          gsap.to(blocks, {
            scrollTrigger: { trigger, start: "top 80%" },
            y: () => gsap.utils.random(600, 1000),
            x: () => gsap.utils.random(-80, 80),
            rotation: () => gsap.utils.random(-180, 180),
            duration: 0.8,
            ease: "power2.in",
            stagger: 0.02,
            onComplete: () => {
              blocks.forEach((el) => {
                (el as HTMLElement).style.display = "none";
              });
            },
          });
        });

      // ── Line reveals
      gsap.utils.toArray<HTMLElement>(".line-reveal").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%" },
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.6,
          ease: "power2.out",
        });
      });

      // ── Features stagger
      gsap.from(".min-feature", {
        scrollTrigger: { trigger: ".min-features", start: "top 70%" },
        y: 60,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out",
      });

      // ── Steps
      gsap.from(".min-step", {
        scrollTrigger: { trigger: ".min-how", start: "top 75%" },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.5,
        ease: "power2.out",
      });

      // ── Hero mockup parallax
      gsap.to(".hero-mockup", {
        y: -50,
        scrollTrigger: {
          trigger: ".hero-mockup",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      /* ═══════════════════════════════════════
         3. TESTIMONIAL CARD DECK — Pinned Stack
         ═══════════════════════════════════════ */
      const cards = gsap.utils.toArray<HTMLElement>(".deck-card");
      if (cards.length > 1) {
        cards.forEach((card, i) => {
          gsap.set(card, {
            y: i * 12,
            scale: 1 - i * 0.025,
            zIndex: cards.length - i,
            opacity: i < 3 ? 1 : 0,
          });
        });

        const deckTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".deck-container",
            start: "top 15%",
            end: () => `+=${(cards.length - 1) * 350}`,
            pin: true,
            scrub: 0.5,
          },
        });

        cards.slice(0, -1).forEach((card, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          deckTl.to(card, {
            xPercent: dir * 110,
            rotation: dir * 12,
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
          });
          if (cards[i + 3]) {
            deckTl.to(
              cards[i + 3],
              { opacity: 1, duration: 0.3 },
              "<0.3"
            );
          }
        });
      }

      // ── Pricing
      gsap.from(".min-price", {
        scrollTrigger: { trigger: ".min-pricing", start: "top 75%" },
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.5,
        ease: "power2.out",
      });

      // ── CTA
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
    <div
      ref={containerRef}
      style={{
        fontFamily: "'Source Sans 3', sans-serif",
        background: C.white,
        color: C.black,
        overflowX: "hidden" as const,
      }}
    >
      {/* ═══ LOADER OVERLAY ═══ */}
      <div
        className="loader-overlay fixed inset-0 z-[200] flex flex-col items-center justify-center"
        style={{ background: C.black }}
      >
        <span
          ref={counterRef}
          className="text-7xl md:text-9xl font-light tracking-tighter"
          style={{ fontFamily: "'Playfair Display', serif", color: C.white }}
        >
          000
        </span>
        <div className="w-48 h-[2px] mt-6 overflow-hidden" style={{ background: C.white + "20" }}>
          <div
            className="loader-bar h-full origin-left"
            style={{ background: C.white, transform: "scaleX(0)" }}
          />
        </div>
        <span className="text-xs mt-4 uppercase tracking-[0.3em]" style={{ color: C.muted }}>
          Loading Experience
        </span>
      </div>

      {/* ═══ PAGE CONTENT ═══ */}
      <div className="page-content" style={{ visibility: "hidden" }}>
        {/* ═══ HEADER ═══ */}
        <header
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
          style={{ background: C.white + "EE", borderColor: C.lightGrey }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Stepwise Home">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: C.black }}
              >
                <Zap className="w-4 h-4" style={{ color: C.white }} />
              </div>
              <span
                className="text-lg font-semibold tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Stepwise
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {["Features", "How It Works", "Pricing"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-sm transition-colors"
                  style={{ color: C.grey }}
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm" style={{ color: C.grey }}>
                Log in
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-medium text-white rounded-full transition-transform hover:scale-105"
                style={{ background: C.black }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* ═══ HERO ═══ */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full pt-20 pb-16">
            <div className="hero-label inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border" style={{ borderColor: C.lightGrey, color: C.grey }}>
              <Zap className="w-3.5 h-3.5" style={{ color: C.accentDark }} />
              <span className="text-xs font-medium uppercase tracking-widest">Interactive Demo Builder</span>
            </div>

            <h1
              className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight mb-8"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
            >
              <FallingWords text="Turn Screenshots" blockClass="hero-block" blockColor={C.accent} />
              <br />
              <FallingWords text="Into Interactive" blockClass="hero-block" blockColor={C.warm} />
              <br />
              <span style={{ fontStyle: "italic", color: C.accentDark }}>
                <FallingWords text="Product Demos" blockClass="hero-block" blockColor={C.accent} />
              </span>
            </h1>

            <p
              className="hero-sub text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
              style={{ color: C.grey }}
            >
              Upload screenshots, add interactive hotspots, and share guided walkthroughs
              — no code, no recordings, no complexity.
            </p>

            <div className="hero-ctas flex flex-wrap items-center gap-4 mb-20">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium text-white rounded-full transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: C.black }}
              >
                Start Building <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium rounded-full border transition-colors"
                style={{ borderColor: C.lightGrey, color: C.black }}
              >
                See How It Works
              </Link>
            </div>

            {/* ── Product Mockup ── */}
            <div className="hero-mockup relative">
              <div
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: C.lightGrey, background: C.offWhite }}
              >
                <div className="p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#28CA41" }} />
                    <div className="flex-1 mx-4 h-7 rounded-lg" style={{ background: C.lightGrey }} />
                  </div>
                  <div
                    className="aspect-[16/9] md:aspect-[2.2/1] rounded-xl relative overflow-hidden"
                    style={{ background: `linear-gradient(145deg, ${C.offWhite}, ${C.accent}15)` }}
                  >
                    <div className="absolute inset-4 md:inset-8 grid grid-cols-5 gap-4">
                      {/* Sidebar */}
                      <div className="col-span-1 space-y-3">
                        <div className="h-6 rounded-md" style={{ background: C.black + "08" }} />
                        {[...Array(5)].map((_, j) => (
                          <div key={j} className="h-3 rounded" style={{ background: C.black + "06", width: `${70 + j * 5}%` }} />
                        ))}
                      </div>
                      {/* Main area */}
                      <div className="col-span-4 rounded-xl p-4 md:p-6 relative" style={{ background: C.white }}>
                        <div className="h-4 w-1/4 rounded mb-4" style={{ background: C.black + "10" }} />
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="h-20 md:h-24 rounded-lg" style={{ background: C.accent + "20" }} />
                          <div className="h-20 md:h-24 rounded-lg" style={{ background: C.warm + "20" }} />
                          <div className="h-20 md:h-24 rounded-lg" style={{ background: C.accent + "15" }} />
                        </div>
                        {/* Hotspot */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="w-12 h-12 rounded-full animate-ping absolute" style={{ background: C.accentDark + "25" }} />
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center relative"
                            style={{ background: C.accentDark + "15", border: `2px solid ${C.accentDark}` }}
                          >
                            <MousePointerClick className="w-5 h-5" style={{ color: C.accentDark }} />
                          </div>
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
        <section className="min-stats py-16 border-y" style={{ borderColor: C.lightGrey }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div key={i} className="min-stat text-center">
                  <div
                    className="text-3xl md:text-4xl font-light tracking-tight mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em]" style={{ color: C.muted }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section id="features" className="min-features py-24 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="fall-trigger mb-16">
              <span className="text-xs uppercase tracking-[0.3em] mb-4 block" style={{ color: C.muted }}>
                Capabilities
              </span>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl tracking-tight max-w-3xl"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
              >
                <FallingWords text="Everything you need to create compelling demos" blockClass="section-block" blockColor={C.accent} />
              </h2>
            </div>
            <div className="line-reveal h-px w-full mb-16" style={{ background: C.lightGrey }} />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {features.map((f, i) => {
                const Icon = iconMap[f.icon];
                return (
                  <div key={i} className="min-feature group">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors group-hover:scale-110"
                        style={{ background: i % 2 === 0 ? C.accent + "25" : C.warm + "25" }}
                      >
                        {Icon && (
                          <Icon
                            className="w-5 h-5"
                            style={{ color: i % 2 === 0 ? C.accentDark : "#B8936E" }}
                          />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed pl-14" style={{ color: C.grey }}>
                      {f.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section
          id="how-it-works"
          className="min-how py-24 md:py-32"
          style={{ background: C.offWhite }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="fall-trigger mb-16">
              <span className="text-xs uppercase tracking-[0.3em] mb-4 block" style={{ color: C.muted }}>
                Process
              </span>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl tracking-tight max-w-2xl"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
              >
                <FallingWords text="Three steps to your first demo" blockClass="section-block" blockColor={C.warm} />
              </h2>
            </div>
            <div className="line-reveal h-px w-full mb-16" style={{ background: C.lightGrey }} />

            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((step, i) => (
                <div key={i} className="min-step">
                  <div
                    className="text-7xl font-light mb-6 opacity-15"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight mb-3">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.grey }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS — STACKED CARD DECK ═══ */}
        <section className="py-24 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="fall-trigger mb-16">
              <span className="text-xs uppercase tracking-[0.3em] mb-4 block" style={{ color: C.muted }}>
                Testimonials
              </span>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl tracking-tight max-w-3xl"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
              >
                <FallingWords text="Loved by teams who ship faster" blockClass="section-block" blockColor={C.accent} />
              </h2>
            </div>
            <div className="line-reveal h-px w-full mb-16" style={{ background: C.lightGrey }} />
          </div>

          {/* Deck container – pinned during scroll */}
          <div className="deck-container max-w-2xl mx-auto px-6 relative" style={{ minHeight: "420px" }}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="deck-card absolute top-0 left-6 right-6 rounded-2xl p-8 md:p-10 border"
                style={{
                  background: C.white,
                  borderColor: C.lightGrey,
                  boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
                }}
              >
                <Quote className="w-8 h-8 mb-6 opacity-15" />
                <p
                  className="text-lg md:text-xl leading-relaxed mb-8"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: C.black }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={`https://i.pravatar.cc/48?u=${t.avatar}`}
                    alt={`${t.name} avatar`}
                    className="w-12 h-12 rounded-full"
                    width={48}
                    height={48}
                    loading="lazy"
                  />
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs" style={{ color: C.muted }}>
                      {t.role}, {t.company}
                    </div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current" style={{ color: C.warm }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ PRICING ═══ */}
        <section
          id="pricing"
          className="min-pricing py-24 md:py-32"
          style={{ background: C.offWhite }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="fall-trigger mb-16 text-center">
              <span className="text-xs uppercase tracking-[0.3em] mb-4 block" style={{ color: C.muted }}>
                Pricing
              </span>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl tracking-tight mx-auto"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
              >
                <FallingWords text="Simple, transparent pricing" blockClass="section-block" blockColor={C.warm} />
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {pricingPlans.map((plan, i) => (
                <div
                  key={i}
                  className={`min-price rounded-2xl p-8 flex flex-col border transition-shadow hover:shadow-lg ${
                    plan.highlighted ? "scale-[1.03]" : ""
                  }`}
                  style={{
                    background: plan.highlighted ? C.black : C.white,
                    color: plan.highlighted ? C.white : C.black,
                    borderColor: plan.highlighted ? C.black : C.lightGrey,
                  }}
                >
                  <div className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: plan.highlighted ? C.accent : C.muted }}>
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span
                      className="text-4xl font-light tracking-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {plan.price}
                    </span>
                    <span className="text-sm opacity-50">{plan.period}</span>
                  </div>
                  <p className="text-sm opacity-60 mb-8">{plan.description}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm">
                        <Check
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: plan.highlighted ? C.accent : C.accentDark }}
                        />
                        <span style={{ opacity: 0.8 }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="w-full py-3 text-sm font-medium rounded-full transition-all hover:scale-105"
                    style={{
                      background: plan.highlighted ? C.white : C.black,
                      color: plan.highlighted ? C.black : C.white,
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="min-cta py-24 md:py-32 overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center min-cta-inner">
            <h2
              className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
            >
              Ready to build your
              <br />
              <span style={{ color: C.accentDark, fontStyle: "italic" }}>first demo?</span>
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: C.grey }}>
              Join 10,000+ teams creating interactive product experiences that convert.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-4 text-base font-medium text-white rounded-full transition-all hover:scale-105 hover:shadow-lg"
              style={{ background: C.black }}
            >
              Start Building — It&apos;s Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="py-16 border-t" style={{ borderColor: C.lightGrey }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-5 gap-8 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.black }}>
                    <Zap className="w-4 h-4" style={{ color: C.white }} />
                  </div>
                  <span className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Stepwise
                  </span>
                </div>
                <p className="text-sm max-w-xs leading-relaxed" style={{ color: C.grey }}>
                  Transform static screenshots into interactive product demos.
                  No code required.
                </p>
              </div>
              {[
                { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
                { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
                { title: "Legal", links: ["Privacy", "Terms", "Security"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: C.muted }}>
                    {col.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-sm transition-colors hover:underline" style={{ color: C.grey }}>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: C.lightGrey }}>
              <p className="text-xs" style={{ color: C.muted }}>
                © 2026 Stepwise. All rights reserved.
              </p>
              <p className="text-xs" style={{ color: C.muted }}>
                Designed with precision. Built for conversion.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
