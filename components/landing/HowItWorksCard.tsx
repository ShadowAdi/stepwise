import { UserPlus, Play, MousePointerClick, Share2 } from "lucide-react";
import { type ElementType } from "react";

const iconMap: Record<string, ElementType> = {
  UserPlus,
  Play,
  MousePointerClick,
  Share2,
};

export interface HowItWorksCardProps {
  title: string;
  description: string;
  keyword: string;
  icon: string;
  bgColor: string;
  textColor: string;
  bodyColor: string;
}

export default function HowItWorksCard({
  title,
  description,
  keyword,
  icon,
  bgColor,
  textColor,
  bodyColor,
}: HowItWorksCardProps) {
  const Icon = iconMap[icon];

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        minHeight: "calc(100vh - 120px)",
        padding: "clamp(2rem, 4vw, 3rem)",
        boxShadow: "0 -4px 30px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-start justify-between">
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>
        {Icon && (
          <div
            className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 ml-4"
            style={{ backgroundColor: textColor }}
          >
            <Icon
              className="w-4 h-4 md:w-5 md:h-5"
              style={{ color: bgColor }}
            />
          </div>
        )}
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-6"
        style={{ padding: "clamp(2rem, 4vw, 3rem)" }}
      >
        <p
          className="max-w-xs md:max-w-sm leading-relaxed"
          style={{
            color: bodyColor,
            fontSize: "clamp(0.8rem, 1.1vw, 1rem)",
          }}
        >
          {description}
        </p>
        <span
          className="leading-none select-none shrink-0"
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(4.5rem, 12vw, 13rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.85,
            color: textColor,
          }}
        >
          {keyword}
        </span>
      </div>
    </div>
  );
}
