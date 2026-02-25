"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HowItWorksCard from "./HowItWorksCard";
import { howItWorksCards } from "@/app/data";
import { UserPlus, Play, MousePointerClick, Share2, type LucideIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CARD_TOP_OFFSET = 70;
const STACK_GAP = 50;

const iconMap: Record<string, LucideIcon> = {
  UserPlus,
  Play,
  MousePointerClick,
  Share2,
};

export default function StackedCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  /* ── Detect mobile ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── GSAP stacking — desktop only ── */
  useEffect(() => {
    if (isMobile || !sectionRef.current || !cardsContainerRef.current) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const topOffset = CARD_TOP_OFFSET + i * STACK_GAP;

        ScrollTrigger.create({
          trigger: card,
          start: `top top+=${topOffset}`,
          endTrigger: cardsContainerRef.current!,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
        });

        if (i < cards.length - 1) {
          const nextCard = cards[i + 1];
          const nextTopOffset = CARD_TOP_OFFSET + (i + 1) * STACK_GAP;

          gsap.to(card, {
            scale: 0.96,
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              end: `top top+=${nextTopOffset}`,
              scrub: 1.5,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative"
      style={{ zIndex: 1 }}
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 md:pt-32 pb-16">
        <span
          className="text-xs uppercase tracking-[0.3em] mb-4 block"
          style={{ color: "#999" }}
        >
          Process
        </span>
        <h2
          className="text-4xl md:text-5xl lg:text-6xl tracking-tight max-w-3xl"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
        >
          Four steps to your first demo
        </h2>
        <div className="h-px w-full mt-12" style={{ background: "#EBEBEB" }} />
      </div>

      {/* ── Mobile: simple vertical cards ── */}
      {isMobile && (
        <div className="max-w-7xl mx-auto px-4 pb-16 flex flex-col gap-4">
          {howItWorksCards.map((card, i) => {
            const Icon = iconMap[card.icon];
            return (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: card.bgColor,
                  color: card.textColor,
                  padding: "1.75rem",
                  minHeight: "220px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <h3
                    className="text-2xl leading-tight"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 500,
                    }}
                  >
                    {card.title}
                  </h3>
                  {Icon && (
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ml-3"
                      style={{ backgroundColor: card.textColor }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: card.bgColor }}
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed max-w-[75%]"
                  style={{ color: card.bodyColor }}
                >
                  {card.description}
                </p>

                {/* Big keyword — bottom right */}
                <span
                  className="absolute bottom-3 right-4 leading-none select-none pointer-events-none"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(3.5rem, 18vw, 6rem)",
                    letterSpacing: "-0.04em",
                    lineHeight: 0.85,
                    color: card.textColor,
                    opacity: 0.9,
                  }}
                >
                  {card.keyword}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Desktop: GSAP stacked pinning ── */}
      {!isMobile && (
        <>
          <div
            ref={cardsContainerRef}
            className="max-w-7xl mx-auto px-6 lg:px-8 relative"
            style={{ minHeight: `${howItWorksCards.length * 80}vh` }}
          >
            {howItWorksCards.map((card, i) => (
              <div
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={{
                  zIndex: i + 1,
                  transformOrigin: "top center",
                  marginBottom: i < howItWorksCards.length - 1 ? "20vh" : "0",
                }}
              >
                <HowItWorksCard {...card} />
              </div>
            ))}
          </div>
          <div style={{ height: "20vh" }} />
        </>
      )}
    </section>
  );
}
