"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HowItWorksCard from "./HowItWorksCard";
import { howItWorksCards } from "@/app/data";

gsap.registerPlugin(ScrollTrigger);

const CARD_TOP_OFFSET = 70;
const STACK_GAP = 30;

export default function StackedCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !cardsContainerRef.current) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const topOffset = CARD_TOP_OFFSET + i * STACK_GAP;

        /* Pin each card when it reaches its designated position */
        ScrollTrigger.create({
          trigger: card,
          start: `top top+=${topOffset}`,
          endTrigger: cardsContainerRef.current!,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
        });

        /* Scale down + dim previous cards as the next one slides over */
        if (i < cards.length - 1) {
          const nextCard = cards[i + 1];
          const nextTopOffset = CARD_TOP_OFFSET + (i + 1) * STACK_GAP;

          gsap.to(card, {
            scale: 0.95,
            filter: "brightness(0.88)",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              end: `top top+=${nextTopOffset}`,
              scrub: 0.5,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative">
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
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
          }}
        >
          Four steps to your first demo
        </h2>
        <div
          className="h-px w-full mt-12"
          style={{ background: "#EBEBEB" }}
        />
      </div>

      {/* Stacked Cards */}
      <div
        ref={cardsContainerRef}
        className="max-w-7xl mx-auto px-6 lg:px-8 relative"
        style={{ minHeight: `${howItWorksCards.length * 100}vh` }}
      >
        {howItWorksCards.map((card, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="will-change-transform"
            style={{
              zIndex: i + 1,
              transformOrigin: "top center",
              marginBottom:
                i < howItWorksCards.length - 1 ? "25vh" : "0",
            }}
          >
            <HowItWorksCard {...card} />
          </div>
        ))}
      </div>
    </section>
  );
}
