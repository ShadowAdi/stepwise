'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

export const SVGAnimationSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // Brand Colors mapped from your design system
  const colors = {
    primaryBlack: '#0D0D0D',
    primaryWhite: '#FFFFFF',
    offWhite: '#FAFAF8',
    lightGrey: '#EBEBEB',
    accentDark: '#4F46E5',
    accentLight: '#C7D2FE',
  };

  // Animation variants for the cursor simulating user interaction
  const cursorVariants: Variants = {
    initial: { x: 600, y: 400, opacity: 0 },
    animate: {
      x: [600, 420, 420, 550],
      y: [400, 260, 260, 350],
      opacity: [0, 1, 1, 0],
      scale: [1, 1, 0.8, 1], // Simulates a "click"
      transition: {
        duration: 5,
        ease: 'easeInOut' as const,
        repeat: Infinity,
        times: [0, 0.4, 0.5, 1],
      },
    },
  };

  // Animation for the hotspot pulsing
  const hotspotVariants: Variants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1, 1.5, 1],
      opacity: [0, 1, 0, 1],
      transition: {
        duration: 5,
        ease: 'easeOut' as const,
        repeat: Infinity,
        times: [0, 0.45, 0.6, 1],
      },
    },
  };

  // Animation for the tooltip appearing after the click
  const tooltipVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: [0, 0, 1, 1],
      y: [10, 10, 0, 0],
      transition: {
        duration: 5,
        ease: 'easeOut' as const,
        repeat: Infinity,
        times: [0, 0.5, 0.6, 1],
      },
    },
  };

  return (
    <section 
      className="w-full py-24 md:py-32 bg-[#FAFAF8] overflow-hidden"
      aria-labelledby="animation-section-title"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        
        {/* Text Header */}
        <div className="text-center max-w-2xl mb-16 md:mb-24">
          <h2 
            id="animation-section-title"
            className="text-4xl md:text-5xl lg:text-6xl text-[#0D0D0D] mb-6 font-serif"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            From static to <em className="text-[#4F46E5] not-italic italic">interactive</em> in seconds.
          </h2>
          <p 
            className="text-lg md:text-xl text-[#6B6B6B] font-sans"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
          >
            Watch how Stepwise instantly layers pulsing hotspots and engaging tooltips directly over your product screenshots. No coding required.
          </p>
        </div>

        {/* SVG Animation Container */}
        <div className="relative w-full max-w-4xl aspect-[16/10] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-[#EBEBEB] overflow-hidden">
          
          <svg 
            viewBox="0 0 800 500" 
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true" // Decorative, text above explains the value
          >
            {/* --- STATIC UI MOCKUP --- */}
            {/* macOS window dots */}
            <circle cx="24" cy="24" r="6" fill={colors.lightGrey} />
            <circle cx="44" cy="24" r="6" fill={colors.lightGrey} />
            <circle cx="64" cy="24" r="6" fill={colors.lightGrey} />
            <line x1="0" y1="48" x2="800" y2="48" stroke={colors.lightGrey} strokeWidth="1" />

            {/* Sidebar mock */}
            <rect x="0" y="48" width="180" height="452" fill={colors.offWhite} />
            <rect x="24" y="80" width="120" height="12" rx="4" fill={colors.lightGrey} />
            <rect x="24" y="110" width="90" height="10" rx="4" fill={colors.lightGrey} opacity="0.5" />
            <rect x="24" y="135" width="100" height="10" rx="4" fill={colors.lightGrey} opacity="0.5" />

            {/* Main Content Area - Dashboard Cards */}
            <rect x="210" y="80" width="270" height="180" rx="12" fill={colors.primaryWhite} stroke={colors.lightGrey} strokeWidth="1" />
            <rect x="230" y="100" width="100" height="16" rx="4" fill={colors.lightGrey} />
            <rect x="230" y="130" width="230" height="8" rx="4" fill={colors.offWhite} />
            <rect x="230" y="150" width="200" height="8" rx="4" fill={colors.offWhite} />
            
            {/* Purple 'Public' Badge Mockup */}
            <rect x="410" y="98" width="50" height="20" rx="10" fill={colors.accentLight} opacity="0.4" />
            <rect x="420" y="106" width="30" height="4" rx="2" fill={colors.accentDark} />

            <rect x="500" y="80" width="270" height="180" rx="12" fill={colors.primaryWhite} stroke={colors.lightGrey} strokeWidth="1" />
            <rect x="520" y="100" width="120" height="16" rx="4" fill={colors.lightGrey} />
            <rect x="520" y="130" width="230" height="8" rx="4" fill={colors.offWhite} />
            <rect x="520" y="150" width="210" height="8" rx="4" fill={colors.offWhite} />

            {/* --- INTERACTIVE ANIMATED ELEMENTS --- */}
            
            {/* 1. Pulsing Hotspot */}
            <motion.g 
              variants={shouldReduceMotion ? {} : hotspotVariants}
              initial="initial"
              animate="animate"
            >
              {/* Pulse Ring */}
              <motion.circle 
                cx="345" 
                cy="170" 
                r="24" 
                fill={colors.accentDark} 
                opacity="0.2"
                animate={shouldReduceMotion ? {} : { scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Solid Inner Circle */}
              <circle cx="345" cy="170" r="10" fill={colors.accentDark} />
              <circle cx="345" cy="170" r="4" fill={colors.primaryWhite} />
            </motion.g>

            {/* 2. Tooltip */}
            <motion.g
              variants={shouldReduceMotion ? {} : tooltipVariants}
              initial="initial"
              animate="animate"
            >
              <rect x="365" y="190" width="160" height="70" rx="8" fill={colors.primaryBlack} />
              {/* Tooltip text simulated */}
              <rect x="385" y="210" width="100" height="8" rx="4" fill={colors.primaryWhite} />
              <rect x="385" y="230" width="120" height="6" rx="3" fill={colors.lightGrey} opacity="0.7" />
              <rect x="385" y="245" width="80" height="6" rx="3" fill={colors.lightGrey} opacity="0.7" />
              {/* Tooltip pointer */}
              <polygon points="375,190 385,190 385,180" fill={colors.primaryBlack} />
            </motion.g>

            {/* 3. Mouse Cursor */}
            <motion.g
              variants={shouldReduceMotion ? {} : cursorVariants}
              initial="initial"
              animate="animate"
            >
              {/* Standard SVG cursor pointer */}
              <path 
                d="M10.1246 27.6405L14.7336 16.9208L24.2238 21.0827L10.1246 27.6405Z" 
                fill={colors.primaryBlack} 
              />
              <path 
                d="M2.08332 2.65625L10.1246 27.6405L14.7336 16.9208L24.2238 21.0827L2.08332 2.65625Z" 
                stroke={colors.primaryWhite} 
                strokeWidth="2" 
                strokeLinejoin="round" 
                fill={colors.primaryBlack}
              />
            </motion.g>

          </svg>
        </div>
      </div>
    </section>
  );
};