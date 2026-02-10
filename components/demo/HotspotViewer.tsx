"use client"

import { useState, useRef } from 'react';
import Image from 'next/image';
import { StepResponse, HotspotResponse } from '@/types';

interface HotspotViewerProps {
  step: StepResponse;
  hotspots: HotspotResponse[];
  onHotspotClick?: (targetStepId: string | null) => void;
  isLoading?: boolean;
}

export const HotspotViewer = ({ step, hotspots, onHotspotClick, isLoading }: HotspotViewerProps) => {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [clickedHotspot, setClickedHotspot] = useState<string | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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
    if (clickedHotspot === hotspotId) return 0.8;
    if (hoveredHotspot === hotspotId) return 0.5;
    return 0.3;
  };

  return (
    <div ref={imageRef} className="relative w-full aspect-video bg-gray-100">
      {/* Main Image */}
      <Image
        src={step.imageUrl}
        alt={step.title || 'Step image'}
        fill
        className="object-contain"
        priority
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
        </div>
      )}

      {/* Hotspots */}
      {!isLoading && hotspots.map((hotspot) => (
        <div key={hotspot.id} className="absolute" style={getHotspotStyles(hotspot)}>
          {/* Hotspot Area */}
          <div
            className="w-full h-full relative group cursor-pointer"
            style={{
              opacity: getOpacity(hotspot.id),
              backgroundColor: hotspot.color,
              border: `2px solid ${hotspot.color}`,
              borderRadius: '4px',
              boxShadow: hoveredHotspot === hotspot.id ? '0 0 20px rgba(0,0,0,0.3)' : 'none',
            }}
            onMouseEnter={() => setHoveredHotspot(hotspot.id)}
            onMouseLeave={() => setHoveredHotspot(null)}
            onClick={(e) => {
              e.stopPropagation();
              handleHotspotClick(hotspot);
            }}
          >
            {/* Pulse Animation */}
            {hoveredHotspot !== hotspot.id && clickedHotspot !== hotspot.id && (
              <div
                className="absolute inset-0 animate-ping"
                style={{
                  backgroundColor: hotspot.color,
                  borderRadius: '4px',
                  opacity: 0.3,
                }}
              />
            )}

            {/* Click Ripple Effect */}
            {clickedHotspot === hotspot.id && (
              <div
                className="absolute inset-0 animate-ping"
                style={{
                  backgroundColor: hotspot.color,
                  borderRadius: '4px',
                  opacity: 0.6,
                }}
              />
            )}

            {/* Tooltip */}
            {(hotspot.tooltipText || hotspot.targetStepId) && (
              <div
                className={`absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap transition-all duration-200 pointer-events-none ${
                  hoveredHotspot === hotspot.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '8px',
                }}
              >
                {hotspot.tooltipText || 'Click to navigate'}
                
                {/* Arrow */}
                <div
                  className="absolute w-2 h-2 bg-gray-900 transform rotate-45"
                  style={{
                    bottom: '-4px',
                    left: '50%',
                    marginLeft: '-4px',
                  }}
                />
              </div>
            )}

            {/* Click Icon for navigable hotspots */}
            {hotspot.targetStepId && hoveredHotspot === hotspot.id && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg 
                  className="w-8 h-8 text-white drop-shadow-lg animate-bounce" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
            )}

            {/* Info Icon for non-navigable hotspots */}
            {!hotspot.targetStepId && hotspot.tooltipText && hoveredHotspot === hotspot.id && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg 
                  className="w-8 h-8 text-white drop-shadow-lg" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Hotspot Indicator */}
      {hotspots.length > 0 && !isLoading && (
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 text-xs font-medium text-gray-700 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          {hotspots.length} hotspot{hotspots.length !== 1 ? 's' : ''} available
        </div>
      )}

      {/* Instructions Overlay (shows initially) */}
      {hotspots.length > 0 && !hoveredHotspot && !isLoading && (
        <div className="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 text-xs font-medium text-white animate-pulse">
          Hover over highlighted areas to interact
        </div>
      )}
    </div>
  );
};
