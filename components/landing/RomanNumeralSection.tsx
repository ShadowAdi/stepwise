"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedRomanNumerals from "./AnimatedRomanNumerals";

gsap.registerPlugin(ScrollTrigger);

export default function RomanNumeralSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Text reveal animation on scroll
      gsap.from(".roman-heading-line", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".roman-subtitle", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        delay: 0.5,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--color-purple-deep) 0%, var(--color-purple-mid) 50%, var(--color-purple-vivid) 100%)",
      }}
    >
      {/* Animated Roman Numerals Background */}
      <AnimatedRomanNumerals />

      {/* Text Content Overlay */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 py-24 md:py-32 text-center">
        <h2
          className="text-4xl md:text-6xl lg:text-7xl tracking-tight mb-8 leading-[1.1]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            color: "#FFFFFF",
            textShadow: "0 2px 20px rgba(0,0,0,0.15)",
          }}
        >
          <span className="roman-heading-line block">EVERY STEP MAPPED.</span>
          <span className="roman-heading-line block">EVERY DETAIL CAPTURED.</span>
          <span className="roman-heading-line block italic">EVERY GOAL ACHIEVED.</span>
        </h2>

        <p
          className="roman-subtitle text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          style={{
            color: "rgba(255, 255, 255, 0.75)",
            fontFamily: "'Source Sans 3', sans-serif",
          }}
        >
          Build interactive product demos that guide users through your product
          — step by step, click by click.
        </p>
      </div>
    </section>
  );
}
