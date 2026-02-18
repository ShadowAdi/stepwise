"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MousePointerClick, Route, Blocks, Share2, BarChart3, Palette,
  Check, ArrowRight, Zap, Star, Quote,
} from "lucide-react";
import { features, steps, testimonials, pricingPlans, stats } from "../data";

gsap.registerPlugin(ScrollTrigger);

/* ─── Design Tokens ─── */
const C = {
  black: "#0D0D0D",
  white: "#FFFFFF",
  offWhite: "#FAFAF8",
  lightGrey: "#EBEBEB",
  grey: "#6B6B6B",
  muted: "#999",
  accent: "#AFDBF5",
  accentDark: "#4A9ED6",
  warm: "#E8D5C0",
};

const iconMap: Record<string, React.ElementType> = {
  MousePointerClick, Route, Blocks, Share2, BarChart3, Palette,
};

/* ── Falling Words Component ──
   Each word gets a colored overlay block that "falls" away on scroll/load,
   revealing the text underneath with physics-like random trajectories. */
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

/* ═══════════════════════════════════════════════════════
   VARIANT 5 — MODERN MINIMALIST · AWWWARDS EDITION
   ─ Falling text reveals (GSAP word-split + color blocks)
   ─ Stacked card deck testimonial slider (ScrollTrigger pin)
   ─ Counter loader opening animation
   ─ Editorial typography + precise scroll animations
   ═══════════════════════════════════════════════════════ */

export default function MinimalistLanding() {
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
         Cards peel off one by one as you scroll,
         alternating left/right exit with rotation.
         ═══════════════════════════════════════ */
      const cards = gsap.utils.toArray<HTMLElement>(".deck-card");
      if (cards.length > 1) {
        // Initial stack: top card at z-highest, lower cards offset + scaled
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

        // Each card exits alternating left/right with rotation
        cards.slice(0, -1).forEach((card, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          deckTl.to(card, {
            xPercent: dir * 110,
            rotation: dir * 12,
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
          });
          // Reveal hidden cards deeper in the stack
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
        color