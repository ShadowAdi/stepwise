import Link from "next/link";

const variants = [
  {
    id: "v2",
    name: "Organic / Abstract",
    description: "Fluid layouts, soft curves, natural forms, flowing transitions, earthy palette",
    colors: ["#A45A52", "#E0AB76", "#9AB973", "#FAF0E6"],
    fonts: "Nunito + Lora",
  },
  {
    id: "v5",
    name: "Modern Minimalist — Awwwards Edition",
    description:
      "Falling text reveals, stacked card deck slider, editorial typography, counter loader, scroll-pinned animations",
    colors: ["#0D0D0D", "#FFFFFF", "#AFDBF5", "#E8D5C0"],
    fonts: "Playfair Display + Source Sans 3",
  },
];

export default function LandingIndex() {
  return (
    <main className="min-h-screen bg-page py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 font-[family-name:var(--font-display)]">
          Landing Page Variants
        </h1>
        <p className="text-lg text-text-secondary mb-16 max-w-2xl">
          Two Awwwards-quality landing pages for Stepwise, each with distinct design styles,
          GSAP animations, and scroll-triggered effects.
        </p>

        <div className="grid gap-6">
          {variants.map((variant, i) => (
            <Link
              key={variant.id}
              href={`/landing/${variant.id}`}
              className="group block bg-surface border border-edge rounded-xl p-6 md:p-8 hover:border-brand transition-all duration-300 hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-brand/10 text-brand font-bold text-xl shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-text-primary mb-1 group-hover:text-brand transition-colors">
                    {variant.name}
                  </h2>
                  <p className="text-text-secondary text-sm mb-3">{variant.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      {variant.colors.map((color, ci) => (
                        <div
                          key={ci}
                          className="w-5 h-5 rounded-full border border-edge"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-text-tertiary">{variant.fonts}</span>
                  </div>
                </div>
                <div className="text-brand text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
