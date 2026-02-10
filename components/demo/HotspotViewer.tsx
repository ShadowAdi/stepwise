"use client"

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { StepResponse, HotspotResponse } from '@/types';

interface HotspotViewerProps {
  step: StepResponse;
  hotspots: HotspotResponse[];
  onHotspotClick?: (targetStepId: string | null) => void;
  isLoading?: boolean;
  allSteps?: StepResponse[]; // To determine navigation direction
}

export const HotspotViewer = ({ step, hotspots, onHotspotClick, isLoading, allSteps = [] }: HotspotViewerProps) => {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [clickedHotspot, setClickedHotspot] = useState<string | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Determine if a hotspot navigates forward or backward
  const getNavigationDirection = (hotspot: HotspotResponse): 'forward' | 'backward' | 'none' => {
    if (!hotspot.targetStepId || !allSteps.length) return 'none';
    
    const currentStepIndex = allSteps.findIndex(s => s.id === step.id);
    const targetStepIndex = allSteps.findIndex(s => s.id === hotspot.targetStepId);
    
    if (currentStepIndex === -1 || targetStepIndex === -1) return 'none';
    
    return targetStepIndex > currentStepIndex ? 'forward' : 'backward';
  };

  const handleHotspotClick = (hotspot: HotspotResponse) => {
    console.log('Hotspot clicked:', {
      hotspotId: hotspot.id,
      targetStepId: hotspot.targetStepId,
      tooltipText: hotspot.tooltipText,
      color: hotspot.color
    });
    
    setClickedHotspot(hotspot.id);
    
    // Navigate immediately if target step exists
    if (hotspot.targetStepId) {
      console.log('Calling onHotspotClick with targetStepId:', hotspot.targetStepId);
      onHotspotClick?.(hotspot.targetStepId);
    } else {
      console.log('Hotspot has no targetStepId, showing tooltip only');
    }
    
    // Clear clicked state after animation
    setTimeout(() => {
      setClickedHotspot(null);
    }, 300);
  };

  const getHotspotStyles = (hotspot: HotspotResponse) => {
    const baseStyles = {
      position: 'absolute' as const,
      left: `${parseFloat(hotspot.x)}%`,
      top: `${parseFloat(hotspot.y)}%`,
      width: `${parseFloat(hotspot.width)}%`,
      height: `${parseFloat(hotspot.height)}%`,
    };

    return baseStyles;
  };

  const getOpacity = (hotspotId: string) => {
    if (clickedHotspot === hotspotId) return 0.9;
    if (hoveredHotspot === hotspotId) return 0.6;
    return 0.35;
  };

  return (
    <motion.div 
      ref={imageRef} 
      className="relative w-full aspect-video bg-gray-50 rounded-xl overflow-hidden shadow-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Main Image */}
      <Image
        src={step.imageUrl}
        alt={step.title || 'Step image'}
        fill
        className="object-contain"
        priority
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="absolute inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hotspots */}
      <AnimatePresence>
        {!isLoading && hotspots.map((hotspot, index) => (
          <motion.div 
            key={hotspot.id} 
            className="absolute z-10" 
            style={getHotspotStyles(hotspot)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            {/* Hotspot Area */}
            <motion.div
              className="w-full h-full relative group cursor-pointer"
              style={{
                opacity: getOpacity(hotspot.id),
                backgroundColor: hotspot.color,
                border: `3px solid ${hotspot.color}`,
                borderRadius: '12px',
                boxShadow: hoveredHotspot === hotspot.id 
                  ? `0 0 30px ${hotspot.color}80, 0 8px 20px rgba(0,0,0,0.15)` 
                  : '0 2px 8px rgba(0,0,0,0.1)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setHoveredHotspot(hotspot.id)}
              onMouseLeave={() => setHoveredHotspot(null)}
              onClick={(e) => {
                e.stopPropagation();
                handleHotspotClick(hotspot);
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Animated Ring on Hover */}
              <AnimatePresence>
                {hoveredHotspot === hotspot.id && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      border: `3px solid ${hotspot.color}`,
                    }}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    exit={{ scale: 1, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </AnimatePresence>

              {/* Pulse Animation - Only when not hovered */}
              {hoveredHotspot !== hotspot.id && clickedHotspot !== hotspot.id && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    backgroundColor: hotspot.color,
                  }}
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              {/* Click Ripple Effect */}
              <AnimatePresence>
                {clickedHotspot === hotspot.id && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      backgroundColor: hotspot.color,
                    }}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </AnimatePresence>

              {/* Tooltip */}
              <AnimatePresence>
                {(hotspot.tooltipText || hotspot.targetStepId) && hoveredHotspot === hotspot.id && (
                  <motion.div
                    className="absolute z-30 px-4 py-3 text-sm font-semibold text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
                    style={{
                      bottom: '110%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginBottom: '12px',
                    }}
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    {hotspot.tooltipText || 'Click to navigate'}
                    
                    {/* Arrow */}
                    <div
                      className="absolute w-3 h-3 bg-gray-900 transform rotate-45"
                      style={{
                        bottom: '-6px',
                        left: '50%',
                        marginLeft: '-6px',
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Click Icon for navigable hotspots */}
              <AnimatePresence>
                {hotspot.targetStepId && hoveredHotspot === hotspot.id && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    {(() => {
                      const direction = getNavigationDirection(hotspot);
                      if (direction === 'backward') {
                        return (
                          <motion.svg 
                            className="w-10 h-10 text-white drop-shadow-2xl" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            animate={{ x: [0, -5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={3.5} 
                              d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" 
                            />
                          </motion.svg>
                        );
                      } else {
                        return (
                          <motion.svg 
                            className="w-10 h-10 text-white drop-shadow-2xl" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={3.5} 
                              d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                          </motion.svg>
                        );
                      }
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Info Icon for non-navigable hotspots */}
              <AnimatePresence>
                {!hotspot.targetStepId && hotspot.tooltipText && hoveredHotspot === hotspot.id && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <motion.svg 
                      className="w-10 h-10 text-white drop-shadow-2xl" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2.5} 
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </motion.svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Hotspot Indicator */}
      <AnimatePresence>
        {hotspots.length > 0 && !isLoading && (
          <motion.div 
            className="absolute bottom-6 right-6 bg-blue-600 rounded-lg shadow-sm px-4 py-3 text-sm font-semibold text-white flex items-center gap-3 cursor-default"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="w-3 h-3 bg-white rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {hotspots.length} hotspot{hotspots.length !== 1 ? 's' : ''} available
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions Overlay */}
      <AnimatePresence>
        {hotspots.length > 0 && !hoveredHotspot && !isLoading && (
          <motion.div 
            className="absolute top-6 right-6 bg-blue-600 rounded-lg shadow-sm px-5 py-3 text-sm font-semibold text-white cursor-default"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨ Hover over highlighted areas to interact
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
