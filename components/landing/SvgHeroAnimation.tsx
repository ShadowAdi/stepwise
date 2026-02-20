'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Brand Palette based on provided context
const colors = {
  primaryBlack: '#0D0D0D',
  primaryWhite: '#FFFFFF',
  offWhite: '#FAFAF8',
  lightGrey: '#EBEBEB',
  grey: '#6B6B6B',
  accentDark: '#4F46E5', // The main Stepwise purple
  accentLight: '#C7D2FE',
};

const TOTAL_STEPS = 5;
const AUTO_ADVANCE_TIME = 3500; // 3.5 seconds

export const StepwiseDemoCarousel = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % TOTAL_STEPS);
    }, AUTO_ADVANCE_TIME);
  }, []);

  useEffect(() => {
    resetTimer();
    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStep, resetTimer]);

  const handleManualAdvance = () => {
    setCurrentStep((prev) => (prev + 1) % TOTAL_STEPS);
    // Timer resets automatically due to the useEffect dependency on currentStep
  };

  // --- Animation Variants ---
  const pulseVariant = {
    initial: { scale: 1, opacity: 0.8 },
    animate: {
      scale: 1.4,
      opacity: 0,
      transition: { duration: 1.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1] as const }
    }
  };

  const modalSlideVariant = {
    hidden: { opacity: 0, x: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 }
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  const contentFadeVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header Text */}
        <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primaryBlack mb-4">
                See Stepwise in action
            </h2>
            <p className="text-lg text-grey max-w-2xl mx-auto font-sans">
                Watch how easily you can turn a static screenshot into a shareable, interactive demo flow in just five steps.
            </p>
        </div>

      {/* Browser Window Container */}
      <div 
        className="relative w-full aspect-[16/10] bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-lightGrey overflow-hidden cursor-pointer group"
        onClick={handleManualAdvance}
      >
         {/* Hover hint */}
        <div className="absolute inset-0 bg-primaryBlack/5 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none flex items-center justify-center">
            <span className="bg-white/90 px-4 py-2 rounded-full text-sm font-semibold text-accentDark shadow-sm backdrop-blur-sm">Click to advance</span>
        </div>

        {/* Browser Header Bar */}
        <div className="h-10 bg-[#F3F4F6] border-b border-lightGrey flex items-center px-4 relative">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
          </div>
          <div className="absolute inset-x-0 mx-auto w-fit bg-white border border-lightGrey rounded-md px-8 py-1 text-xs text-grey font-medium flex items-center">
            <svg className="w-3 h-3 mr-2 text-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            app.stepwise.com/create
          </div>
        </div>

        {/* Main Canvas Area (SVG) */}
        <div className="relative w-full h-[calc(100%-2.5rem)] bg-offWhite">
          <svg viewBox="0 0 960 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            
            {/* --- STATIC BACKGROUND (Sidebar) --- */}
            <rect x="0" y="0" width="200" height="600" fill="#FAFAF8"/>
            <rect x="20" y="30" width="120" height="24" rx="4" fill={colors.lightGrey} opacity="0.5" />
            <rect x="20" y="80" width="160" height="12" rx="4" fill={colors.lightGrey} opacity="0.3" />
            <rect x="20" y="110" width="140" height="12" rx="4" fill={colors.lightGrey} opacity="0.3" />
            <rect x="20" y="140" width="160" height="12" rx="4" fill={colors.lightGrey} opacity="0.3" />
            <line x1="200" y1="0" x2="200" y2="600" stroke={colors.lightGrey} strokeWidth="1"/>

            {/* --- STEP 1: UPLOAD STATE --- */}
            <AnimatePresence>
              {currentStep === 0 && (
                <motion.g 
                    key="step1-upload"
                    variants={contentFadeVariant}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                >
                  <rect x="350" y="150" width="460" height="300" rx="12" fill="white" stroke={colors.accentDark} strokeWidth="2" strokeDasharray="8 8" opacity="0.5" />
                  <circle cx="580" cy="280" r="40" fill={colors.accentLight} opacity="0.5" />
                  <path d="M580 260V300M560 280H600" stroke={colors.accentDark} strokeWidth="4" strokeLinecap="round" />
                  <text x="580" y="350" textAnchor="middle" fontFamily="'Source Sans 3', sans-serif" fontSize="18" fill={colors.accentDark} fontWeight="600">Upload Screenshot</text>
                  <text x="580" y="375" textAnchor="middle" fontFamily="'Source Sans 3', sans-serif" fontSize="14" fill={colors.grey}>or drag and drop here</text>
                </motion.g>
              )}
            </AnimatePresence>

            {/* --- COMMON STATE: MOCK SCREENSHOT (Steps 1-4) --- */}
            {/* This layer appears after step 0 and stays until the end, but gets dimmed in step 2 & 4 */}
            <motion.g 
                animate={{ 
                    opacity: currentStep > 0 ? 1 : 0,
                    filter: (currentStep === 2 || currentStep === 4) ? "brightness(0.9) blur(1px)" : "none"
                }}
                transition={{ duration: 0.5 }}
            >
                {/* Mock Dashboard Content area */}
                <rect x="240" y="40" width="680" height="520" rx="8" fill="white" stroke={colors.lightGrey} strokeWidth="1" />
                {/* Header inside mock */}
                <rect x="270" y="70" width="200" height="24" rx="4" fill={colors.lightGrey} opacity="0.6" />
                <rect x="850" y="70" width="40" height="40" rx="20" fill={colors.accentLight} />

                {/* Mock Cards */}
                <rect x="270" y="130" width="280" height="160" rx="8" fill="#FAFAF8" stroke="#EBEBEB" strokeWidth="1" />
                <rect x="290" y="150" width="80" height="12" rx="6" fill={colors.accentDark} opacity="0.8"/>
                <rect x="290" y="180" width="200" height="16" rx="4" fill={colors.lightGrey} />
                <rect x="290" y="210" width="140" height="12" rx="4" fill={colors.lightGrey} opacity="0.5" />

                <rect x="580" y="130" width="280" height="160" rx="8" fill="#FAFAF8" stroke="#EBEBEB" strokeWidth="1" />
                <rect x="600" y="150" width="80" height="12" rx="6" fill={colors.accentDark} opacity="0.8"/>
                <rect x="600" y="180" width="200" height="16" rx="4" fill={colors.lightGrey} />
              </motion.g>

            {/* --- STEP 2 & 3: ADDING HOTSPOTS --- */}
            <AnimatePresence>
              {(currentStep === 2 || currentStep === 3) && (
                 <motion.g key="hotspots-group">
                    {/* Hotspot 1 (Target for Step 2) */}
                    <g transform="translate(410, 210)">
                        <motion.circle r="25" fill={colors.accentDark} variants={pulseVariant} initial="initial" animate="animate" />
                        <circle r="10" fill={colors.accentDark} stroke="white" strokeWidth="3" />
                    </g>

                     {/* Hotspot 2 (Appears in step 3) */}
                    {currentStep === 3 && (
                        <g transform="translate(720, 180)">
                            <motion.circle r="25" fill={colors.accentDark} variants={pulseVariant} initial="initial" animate="animate" />
                            <circle r="10" fill={colors.accentDark} stroke="white" strokeWidth="3" />
                        </g>
                    )}
                 </motion.g>
              )}
            </AnimatePresence>

            {/* --- STEP 2 ONLY: EDITOR MODAL --- */}
            <AnimatePresence>
              {currentStep === 2 && (
                <motion.g
                  key="editor-modal"
                  variants={modalSlideVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Modal Container */}
                  <rect x="450" y="190" width="240" height="180" rx="8" fill="white" filter="drop-shadow(0px 10px 20px rgba(0,0,0,0.15))" />
                  
                  {/* Modal Content */}
                  <text x="470" y="225" fontFamily="'Source Sans 3', sans-serif" fontSize="14" fontWeight="600" fill={colors.primaryBlack}>Edit Hotspot</text>
                  
                  {/* Input Field 1 */}
                  <text x="470" y="255" fontFamily="'Source Sans 3', sans-serif" fontSize="12" fill={colors.grey}>Tooltip Text</text>
                  <rect x="470" y="265" width="200" height="30" rx="4" fill={colors.offWhite} stroke="#EBEBEB" strokeWidth="1" />
                  <rect x="480" y="277" width="120" height="6" rx="3" fill={colors.lightGrey} />

                   {/* Action buttons */}
                   <rect x="580" y="320" width="90" height="30" rx="4" fill={colors.accentDark} />
                   <text x="625" y="339" textAnchor="middle" fontFamily="'Source Sans 3', sans-serif" fontSize="12" fill="white" fontWeight="600">Save</text>
                </motion.g>
              )}
            </AnimatePresence>

             {/* --- STEP 4: SHARE SCREEN --- */}
            <AnimatePresence>
              {currentStep === 4 && (
                <motion.g
                    key="share-screen"
                    variants={modalSlideVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Dark overlay background */}
                    <rect x="200" y="0" width="760" height="600" fill={colors.primaryBlack} opacity="0.4" />

                    {/* Share Dialog */}
                    <rect x="380" y="150" width="400" height="250" rx="12" fill="white" filter="drop-shadow(0px 20px 40px rgba(0,0,0,0.2))" />
                    <text x="580" y="200" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="24" fontWeight="bold" fill={colors.primaryBlack}>Ready to share!</text>
                    <text x="580" y="230" textAnchor="middle" fontFamily="'Source Sans 3', sans-serif" fontSize="16" fill={colors.grey}>Your interactive demo is published.</text>

                    {/* URL Box */}
                    <rect x="420" y="260" width="320" height="50" rx="8" fill={colors.offWhite} stroke={colors.lightGrey} strokeWidth="1"/>
                    <text x="440" y="292" fontFamily="'Source Sans 3', sans-serif" fontSize="14" fill={colors.primaryBlack}>stepwise.com/d/feature-walkthrough</text>
                    
                    {/* Copy Button */}
                    <rect x="650" y="270" width="80" height="30" rx="6" fill={colors.accentDark} />
                    <text x="690" y="290" textAnchor="middle" fontFamily="'Source Sans 3', sans-serif" fontSize="12" fill="white" fontWeight="bold">Copy</text>

                     <text x="580" y="360" textAnchor="middle" fontFamily="'Source Sans 3', sans-serif" fontSize="14" fill={colors.accentDark} fontWeight="600">View live demo →</text>
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center items-center space-x-3 mt-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
                setCurrentStep(index);
                resetTimer(); // Reset timer on manual click
            }}
            className={`rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentDark ${
              index === currentStep ? 'bg-accentDark' : 'bg-lightGrey hover:bg-grey/40'
            }`}
            initial={false}
            animate={{
              width: index === currentStep ? 24 : 10,
              height: 10,
              opacity: index === currentStep ? 1 : 0.5
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            aria-label={`Go to step ${index + 1}`}
            aria-current={index === currentStep ? 'step' : undefined}
          />
        ))}
      </div>
    </div>
  );
};