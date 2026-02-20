"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

interface NumeralConfig {
  text: string;
  x: number;      // % from left
  y: number;      // % from top
  size: number;   // rem
  opacity: number;
  rotation: number;
  duration: number;
  direction: 1 | -1;
}

const numeralConfigs: NumeralConfig[] = [
  { text: "XII",  x: 5,   y: 8,   size: 12, opacity: 0.06, rotation: -15,  duration: 18, direction: 1 },
  { text: "III",  x: 78,  y: 5,   size: 9,  opacity: 0.08, rotation: 25,   duration: 14, direction: -1 },
  { text: "VII",  x: 15,  y: 75,  size: 14, opacity: 0.05, rotation: -30,  duration: 20, direction: 1 },
  { text: "I",    x: 85,  y: 70,  size: 11, opacity: 0.07, rotation: 45,   duration: 16, direction: -1 },
  { text: "IX",   x: 55,  y: 15,  size: 7,  opacity: 0.09, rotation: -10,  duration: 12, direction: 1 },
  { text: "V",    x: 35,  y: 80,  size: 10, opacity: 0.06, rotation: 20,   duration: 15, direction: -1 },
  { text: "XI",   x: 70,  y: 45,  size: 8,  opacity: 0.08, rotation: -40,  duration: 13, direction: 1 },
  { text: "II",   x: 8,   y: 40,  size: 6,  opacity: 0.1,  rotation: 15,   duration: 11, direction: -1 },
  { text: "VIII", x: 45,  y: 55,  size: 13, opacity: 0.04, rotation: -20,  duration: 22, direction: 1 },
  { text: "IV",   x: 90,  y: 25,  size: 7,  opacity: 0.07, rotation: 35,   duration: 14, direction: -1 },
  { text: "VI",   x: 25,  y: 20,  size: 8,  opacity: 0.08, rotation: -25,  duration: 16, direction: 1 },
  { text: "X",    x: 60,  y: 85,  size: 9,  opacity: 0.06, rotation: 30,   duration: 17, direction: -1 },
  // Extra scattered numerals for density
  { text: "I",    x: 50,  y: 30,  size: 5,  opacity: 0.1,  rotation: -50,  duration: 10, direction: 1 },
  { text: "IV",   x: 20,  y: 55,  size: 6,  opacity: 0.07, rotation: 40,   duration: 13, direction: -1 },
  { text: "XI",   x: 75,  y: 88,  size: 7,  opacity: 0.05, rotation: -35,  duration: 19, direction: 1 },
  { text: "III",  x: 40,  y: 5,   size: 5,  opacity: 0.09, rotation: 10,   duration: 11, direction: -1 },
];

export default function AnimatedRomanNumerals() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const numerals = containerRef.current.querySelectorAll<HTMLSpanElement>(".roman-numeral");

    const ctx = gsap.context(() => {
      numerals.forEach((el, i) => {
        const config = numeralConfigs[i];
        if (!config) return;

        // Continuous rotation
        gsap.to(el, {
          rotation: `+=${360 * config.direction}`,
          duration: config.duration,
          repeat: -1,
          ease: "none",
        });

        // Gentle floating Y
        gsap.to(el, {
          y: "+=20",
          duration: config.duration * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Subtle opacity pulse
        gsap.to(el, {
          opacity: config.opacity * 1.6,
          duration: config.duration * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {numeralConfigs.map((config, i) => (
        <span
          key={i}
          className="roman-numeral absolute select-none"
          style={{
            left: `${config.x}%`,
            top: `${config.y}%`,
            fontSize: `${config.size}rem`,
            opacity: config.opacity,
            color: "#FFFFFF",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontStyle: "italic",
            transform: `rotate(${config.rotation}deg)`,
            lineHeight: 1,
            willChange: "transform, opacity",
          }}
        >
          {config.text}
        </span>
      ))}
    </div>
  );
}
