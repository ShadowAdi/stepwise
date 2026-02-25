"use client";

import { useRef, useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";

/* ── Card colours – soft palette matching Stepwise brand ── */
const CARD_COLORS = [
  "#C7D2FE", // soft indigo
  "#E8D5C0", // warm beige
  "#FFFFFF", // white
  "#EEF2FF", // lightest indigo
  "#FDE68A", // soft yellow
  "#D1FAE5", // mint
];

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}

interface Props {
  testimonials: Testimonial[];
}

export default function TestimonialSwiper({ testimonials }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ containerH: 540, cardH: 450, cardW: 360 });

  /* ── Responsive sizing ── */
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (vw < 480) {
        setDims({ containerH: Math.min(440, vh * 0.72), cardH: Math.min(360, vh * 0.6), cardW: Math.min(300, vw * 0.85) });
      } else if (vw < 768) {
        setDims({ containerH: Math.min(500, vh * 0.75), cardH: Math.min(410, vh * 0.63), cardW: Math.min(340, vw * 0.80) });
      } else {
        setDims({ containerH: 540, cardH: 450, cardW: 360 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const slides = [...wrapper.querySelectorAll<HTMLElement>("[data-slide]")];
    if (slides.length === 0) return;

    let current = 0;
    let target = 0;
    let isDragging = false;
    let startX = 0;
    let startScroll = 0;
    let prevX = 0;
    let prevTime = 0;
    let velocity = 0;
    let momentum = 0;
    let animId: number;

    const LERP = 0.06;
    const MOMENTUM_MULT = 12;
    const MOMENTUM_DECAY = 0.95;

    const getGap = () => window.innerWidth * 0.03;

    const getMaxScroll = () => {
      const slideW = slides[0].offsetWidth;
      const gap = getGap();
      return -((slides.length - 1) * (slideW + gap));
    };

    const clamp = (v: number, lo: number, hi: number) =>
      Math.min(hi, Math.max(lo, v));

    const render = () => {
      const vwOff = window.innerWidth * 0.10;

      slides.forEach((slide, i) => {
        const slideLeft = slide.offsetLeft + current;
        const slideW = slide.offsetWidth;
        const isLast = i === slides.length - 1;

        if (slideLeft < 0 && !isLast) {
          const ratio = Math.min(1, Math.abs(slideLeft) / slideW);
          slide.style.transformOrigin = "left 80%";
          slide.style.transform = `translateX(${
            current + Math.abs(slideLeft) + ratio * vwOff
          }px) rotate(${-15 * ratio}deg) scale(${1 - ratio * 0.35})`;
          slide.style.zIndex = `${i + 1}`;
          slide.style.opacity = `${1 - ratio * 0.15}`;
        } else {
          slide.style.transformOrigin = "";
          slide.style.transform = `translateX(${current}px)`;
          slide.style.zIndex = `${i + 1}`;
          slide.style.opacity = "1";
        }
      });
    };

    const tick = () => {
      if (!isDragging) {
        if (Math.abs(momentum) > 0.5) {
          target += momentum;
          momentum *= MOMENTUM_DECAY;
          target = clamp(target, getMaxScroll(), 0);
        }
        current += (target - current) * LERP;
      }
      render();
      animId = requestAnimationFrame(tick);
    };

    const onDown = (e: PointerEvent) => {
      isDragging = true;
      startX = e.clientX;
      startScroll = target;
      prevX = e.clientX;
      prevTime = performance.now();
      velocity = 0;
      momentum = 0;
      wrapper.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      target = clamp(startScroll + dx, getMaxScroll(), 0);
      current = target;

      const now = performance.now();
      const dt = now - prevTime;
      if (dt > 0) velocity = (e.clientX - prevX) / dt;
      prevX = e.clientX;
      prevTime = now;
    };

    const onUp = () => {
      if (!isDragging) return;
      isDragging = false;
      momentum = velocity * MOMENTUM_MULT;
    };

    wrapper.addEventListener("pointerdown", onDown);
    wrapper.addEventListener("pointermove", onMove);
    wrapper.addEventListener("pointerup", onUp);
    wrapper.addEventListener("pointercancel", onUp);

    const block = (e: Event) => e.preventDefault();
    wrapper.addEventListener("selectstart", block);
    wrapper.style.userSelect = "none";
    (wrapper.style as unknown as Record<string, string>).webkitUserSelect = "none";
    wrapper.style.touchAction = "pan-y";

    tick();

    return () => {
      cancelAnimationFrame(animId);
      wrapper.removeEventListener("pointerdown", onDown);
      wrapper.removeEventListener("pointermove", onMove);
      wrapper.removeEventListener("pointerup", onUp);
      wrapper.removeEventListener("pointercancel", onUp);
      wrapper.removeEventListener("selectstart", block);
    };
  }, [testimonials, dims]);

  return (
    <div
      className="w-full overflow-hidden relative"
      style={{ height: `${dims.containerH}px` }}
    >
      <div
        ref={wrapperRef}
        className="flex h-full items-center cursor-grab active:cursor-grabbing"
        style={{ willChange: "transform", paddingLeft: "4vw" }}
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            data-slide
            className="shrink-0 pointer-events-none flex flex-col justify-between relative"
            style={{
              width: `${dims.cardW}px`,
              height: `${dims.cardH}px`,
              marginRight: "3vw",
              padding: "clamp(1.25rem, 3vw, 2rem)",
              borderRadius: "1.5rem",
              border: "2px solid rgba(0,0,0,0.08)",
              backgroundColor: CARD_COLORS[i % CARD_COLORS.length],
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            {/* Top — Quote */}
            <div>
              <Quote
                className="w-6 h-6 mb-4"
                style={{ opacity: 0.15, color: "#0D0D0D" }}
              />
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  color: "#0D0D0D",
                  fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Bottom — Author */}
            <div className="flex items-center gap-3 mt-4">
              <img
                src={`https://i.pravatar.cc/44?u=${t.avatar}`}
                alt={`${t.name} avatar`}
                className="w-10 h-10 rounded-full border-2 border-white/60 shrink-0"
                width={40}
                height={40}
                loading="lazy"
                draggable={false}
              />
              <div className="flex-1 min-w-0">
                <div
                  className="font-semibold text-sm truncate"
                  style={{ color: "#0D0D0D" }}
                >
                  {t.name}
                </div>
                <div
                  className="text-xs truncate"
                  style={{ color: "rgba(0,0,0,0.5)" }}
                >
                  {t.role}, {t.company}
                </div>
              </div>
              <div className="flex gap-0.5 shrink-0">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-3 h-3 fill-current"
                    style={{ color: "#E8D5C0" }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drag hint */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium select-none pointer-events-none"
        style={{
          background: "rgba(0,0,0,0.05)",
          color: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(4px)",
          whiteSpace: "nowrap",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="m12 5-7 7 7 7" />
        </svg>
        <span>Drag to explore</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
