# Gemini Prompt for Stepwise SVG Animation Section

## 📋 Instructions
Copy the entire prompt below (starting from "I need help creating...") and paste it into Gemini. The output will be a complete Next.js component with SVG animations that you can integrate into your landing page.

---

## 🤖 PROMPT TO COPY-PASTE INTO GEMINI

I need help creating an animated SVG section for my landing page. Here's the complete context:

### PROJECT OVERVIEW
**Product Name**: Stepwise  
**What it does**: An interactive demo builder that transforms static product screenshots into interactive, guided walkthroughs with hotspots and tooltips.  
**Target Users**: Product teams, sales teams, and marketers who need to create compelling product demos without coding or screen recordings.  
**Core Value**: Turn screenshots into interactive product demos in minutes, not hours.

### CURRENT TECH STACK
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation Libraries**: GSAP, Framer Motion (both available)
- **Component Structure**: React Server Components with "use client" where needed

### DESIGN SYSTEM & BRAND IDENTITY

**Color Palette**:
```
Primary Black:   #0D0D0D
Primary White:   #FFFFFF
Off White:       #FAFAF8
Light Grey:      #EBEBEB
Grey:            #6B6B6B
Muted:           #999999
Accent Light:    #C7D2FE (light purple/lavender)
Accent Dark:     #4F46E5 (indigo/dark purple)
Warm Accent:     #E8D5C0 (beige/warm)
```

**Typography**:
- **Display/Headings**: 'Playfair Display', serif (elegant, use italic for emphasis)
- **Body Text**: 'Source Sans 3', sans-serif (clean, readable)
- **Style**: Minimalist, editorial, premium feel

**Current Animation Style**:
- Smooth, elegant GSAP-based transitions
- "Falling blocks" effect on hero text (colored rectangles that drop away to reveal text)
- Scroll-triggered animations with subtle parallax
- Card deck stacking effect for testimonials
- Modern, sophisticated, not flashy

**Aesthetic**: Clean, minimal, editorial design with breathing room. Think premium SaaS product meets design magazine.

### DASHBOARD SCREENSHOT REFERENCE
The attached dashboard screenshot shows:
- Clean, card-based UI with rounded corners
- Purple accent badges ("Public" status)
- Minimalist layout with good whitespace
- Light grey borders and subtle shadows
- Search bar and filter dropdowns
- Demo cards showing title, description, and slug path

### WHAT I NEED FROM YOU

Create a **complete, production-ready React component** for an SVG animation section that can be inserted into my landing page. The section should:

**Technical Requirements**:
1. Be a self-contained Next.js component (TypeScript)
2. Use Tailwind CSS v4 classes for styling
3. Include SVG animations (can use Framer Motion for animation, GSAP is also available)
4. Be fully responsive (mobile, tablet, desktop)
5. Include proper accessibility attributes
6. Have no external dependencies beyond what's already in the stack
7. Use "use client" directive if interactive animations are needed

**Design Requirements**:
1. Match the brand colors, fonts, and aesthetic from above
2. Feel cohesive with the existing landing page style
3. Be modern, smooth, and premium-looking
4. Work well in both hero section OR as a standalone section between content blocks

**Animation Concept Ideas** (choose one or suggest better):

**Option 1: Interactive Demo Mockup Animation**
- Animated SVG showing a simplified product interface
- Pulsing hotspots that appear sequentially
- Tooltip/modal elements that animate in
- Mouse cursor path animation showing interaction flow
- Represents the core product value visually

**Option 2: 3-Step Process Flow**
- Three connected cards/stages: "Upload" → "Add Hotspots" → "Share"
- Animated connecting lines/arrows between stages
- Icons or simple illustrations in each stage
- Smooth entrance and progression animation
- Can be scroll-triggered or auto-play on viewport

**Option 3: Screenshot to Interactive Demo Transformation**
- Start with a static screenshot representation (SVG)
- Transform/morph into an interactive version with hotspots
- Show the before/after of what Stepwise does
- Visual metaphor for the product's core function

**Option 4: Layered Screen Animation**
- Multiple overlapping screen/card layers
- Animate them separating to show depth
- Hotspots appearing on different layers
- Represents multi-step demo creation

**Feel free to suggest a better concept** that you think would work well for this product!

### DELIVERABLE FORMAT

Please provide:

1. **Complete Component Code**:
   ```tsx
   // Component with all necessary imports, types, and logic
   ```

2. **Usage Instructions**:
   - Where to save the file
   - How to import and use it in page.tsx
   - Any props/customization options

3. **Styling Notes**:
   - Any custom Tailwind classes used
   - Animation timing and easing explanations

4. **Accessibility Features**:
   - ARIA labels, reduced motion support, keyboard navigation if applicable

### EXAMPLE INTEGRATION
The component should be easy to drop into the landing page like this:
```tsx
import { SVGAnimationSection } from '@/components/landing/SVGAnimationSection';

export default function Home() {
  return (
    <>
      {/* ... existing hero section ... */}
      
      <SVGAnimationSection />
      
      {/* ... rest of the page ... */}
    </>
  );
}
```

### CONSTRAINTS & PREFERENCES
- ✅ Use inline SVGs (not external files)
- ✅ Keep animations smooth and performant
- ✅ Respect `prefers-reduced-motion` for accessibility
- ✅ Use semantic HTML and proper heading hierarchy
- ✅ Make it visually interesting but not distracting
- ❌ Avoid heavy external dependencies
- ❌ Don't use Lorem Ipsum - use product-relevant text
- ❌ Avoid overly complex animations that hurt performance

### ADDITIONAL CONTEXT
The current landing page has:
- A counter loader animation (000 → 100)
- Hero section with falling block text reveal
- Scroll-triggered section animations
- A card deck testimonial section
- Clean, minimal aesthetic throughout

The new SVG section should feel like a natural extension of this design language.

---

**Ready to create the component! Please provide the complete code and instructions.**

---

## 📝 AFTER YOU GET THE RESPONSE FROM GEMINI

1. **Save the component** to the file path Gemini suggests (likely `components/landing/SVGAnimationSection.tsx`)
2. **Import it** in your `app/page.tsx`
3. **Place it** where you want it to appear (suggestions below)
4. **Test and adjust** colors/spacing as needed

### Suggested Placement Locations in page.tsx:

**Option A - Replace or enhance hero mockup** (around line 435):
```tsx
{/* Replace or add above the hero-mockup div */}
<SVGAnimationSection />
```

**Option B - Between Stats and Features** (around line 506):
```tsx
</section>
{/* After stats section, before features */}
<SVGAnimationSection />
<section id="features" className="min-features...">
```

**Option C - Between Features and How It Works** (around line 550):
```tsx
</section>
{/* After features, before how it works */}
<SVGAnimationSection />
<section id="how-it-works"...>
```

**Option D - Between Testimonials and Pricing** (around line 651):
```tsx
</section>
{/* After testimonials deck, before pricing */}
<SVGAnimationSection />
<section id="pricing"...>
```

---

## 🎨 CUSTOMIZATION TIPS

Once you have the component, you can customize:
- **Colors**: Update hex values to match your exact brand
- **Animation Speed**: Adjust `duration` values in animation configs
- **Section Padding**: Change `py-24 md:py-32` classes for spacing
- **Background**: Add `style={{ background: C.offWhite }}` for alternating sections

---

## ✨ BONUS PROMPT ADDITIONS

If you want specific variations, add these to your Gemini prompt:

**For Hero Section**: "Make it large and attention-grabbing, suitable as the main hero visual"

**For Feature Section**: "Make it more subtle and supportive, illustrating the product features"

**For Mobile**: "Ensure it works beautifully on mobile with simplified animations if needed"

**For Dark Mode**: "Include dark mode variant styles using Tailwind's dark: variant"

---

## 🚀 Ready to Go!

Copy the prompt above (the section marked "PROMPT TO COPY-PASTE INTO GEMINI") and paste it into Gemini. You'll get a production-ready component tailored to your Stepwise landing page!
