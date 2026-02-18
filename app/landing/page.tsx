import Link from "next/link";

const variants = [
  {
    id: "v1",
    name: "Bauhaus",
    description: "Geometric shapes, primary colors, structured grids, sharp animations",
    colors: ["#E60026", "#2454FF", "#FFCC00", "#1B1B1B"],
    fonts: "Manrope + Source Sans 3",
  },
  {
    id: "v2",
    name: "Organic / Abstract",
    description: "Fluid layouts, soft curves, natural forms, flowing transitions",
    colors: ["#A45A52", "#E0AB76", "#9AB973", "#FAF0E6"],
    fonts: "Nunito + Lora",
  },
  {
    id: "v3",
    name: "Cyberpunk",
    description: "Neon glows, glitch effects, dark backgrounds, futuristic scrolling",
    colors: ["#DF00FF", "#0FFFFF", "#00009C", "#0A0A14"],
    fonts: "Chakra Petch + Work Sans",
  },
  {
    id: "v4",
    name: "Neumorphism",
    description: "Soft UI, extruded elements, subtle shadows, tactile feel",
    colors: ["#EDEAE0", "#BC8F8F", "#9AB973", "#CDB280"],
    fonts: "Raleway + Raleway",
  },
  {
    id: "v5",
    name: "Modern Minimalist",
    description: "Clean lines, ample white space, editorial typography, precise animations",
    colors: ["#1B1B1B", "#FFFFFF", "#AFDBF5", "#808080"],
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
          5 unique Awwwards-style landing pages for Stepwise, each with distinct design styles,
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
