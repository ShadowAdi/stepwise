"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { StepResponse, HotspotResponse } from '@/types';
import { HotspotViewer } from '@/components/demo/HotspotViewer';
import { getHotspotsByStepId } from '@/actions/hotspot/hotspot.action';
import { toast } from 'sonner';

interface StepViewerProps {
  steps: StepResponse[];
  autoPlay?: boolean;
}

export const StepViewer = ({ steps, autoPlay = false }: StepViewerProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hotspots, setHotspots] = useState<HotspotResponse[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentStep = steps[currentStepIndex];

  // Fetch hotspots for current step
  useEffect(() => {
    const fetchHotspots = async () => {
      if (!currentStep?.id) return;
      
      setIsLoading(true);
      const result = await getHotspotsByStepId(currentStep.id);
      if (result.success && result.data) {
        setHotspots(result.data);
      } else {
        setHotspots([]);
      }
      setIsLoading(false);
    };

    fetchHotspots();
  }, [currentStep?.id]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || currentStepIndex >= steps.length - 1) {
      if (isPlaying && currentStepIndex >= steps.length - 1) {
        setIsPlaying(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      handleNext();
    }, 5000); // 5 seconds per step

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
    setIsPlaying(false);
  };

  const handleHotspotClick = (targetStepId: string | null) => {
    if (!targetStepId) {
      console.log('No target step ID provided');
      return;
    }
    
    console.log('Attempting to navigate to step:', targetStepId);
    console.log('Available steps:', steps.map(s => ({ id: s.id, position: s.position, title: s.title })));
    
    const targetIndex = steps.findIndex(step => step.id === targetStepId);
    console.log('Found target index:', targetIndex);
    
    if (targetIndex !== -1) {
      const targetStep = steps[targetIndex];
      console.log(`Navigating from step ${currentStepIndex + 1} to step ${targetIndex + 1}`);
      toast.success(`Navigating to Step ${targetStep.position}: ${targetStep.title}`);
      setCurrentStepIndex(targetIndex);
      setIsPlaying(false); // Stop auto-play when navigating via hotspot
    } else {
      console.error('Target step not found:', targetStepId);
      console.error('Available step IDs:', steps.map(s => s.id));
      // Show a toast that navigation failed
      toast.error('Could not navigate to target step. The step may not exist in this demo.');
    }
  };

  const togglePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  if (steps.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No steps yet</h3>
        <p className="text-gray-500">Add steps to create your interactive demo</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative">
          <HotspotViewer
            step={currentStep}
            hotspots={hotspots}
            onHotspotClick={handleHotspotClick}
            isLoading={isLoading}
          />
          
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded">
                Step {currentStep.position}
              </span>
              {isPlaying && (
                <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse mr-1"></span>
                  Auto-playing
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {currentStep.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3">
              {currentStep.description}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
                className="rounded-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>
              
              <Button
                variant={isPlaying ? "default" : "outline"}
                size="sm"
                onClick={togglePlay}
                className="rounded-sm"
              >
                {isPlaying ? (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                    </svg>
                    Pause
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {currentStepIndex >= steps.length - 1 ? 'Replay' : 'Play'}
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentStepIndex === steps.length - 1}
                className="rounded-sm"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>

            <div className="text-sm text-gray-600 font-medium">
              {currentStepIndex + 1} / {steps.length}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          {currentStep.title}
        </h4>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {currentStep.description}
        </p>
        
        {hotspots.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              Interactive Hotspots ({hotspots.length})
            </h5>
            <p className="text-sm text-gray-600 mb-3">
              Click on the highlighted areas in the image to explore different parts or navigate to related steps.
            </p>
            
            {/* <div className="mt-4 bg-gray-50 rounded-lg p-3 space-y-2">
              <p className="text-xs font-semibold text-gray-700">Hotspot Details (Debug):</p>
              {hotspots.map((hotspot, idx) => {
                const targetStep = hotspot.targetStepId 
                  ? steps.find(s => s.id === hotspot.targetStepId)
                  : null;
                return (
                  <div key={hotspot.id} className="text-xs text-gray-600 bg-white p-2 rounded border">
                    <div><strong>Hotspot {idx + 1}:</strong></div>
                    <div>• Tooltip: {hotspot.tooltipText || 'None'}</div>
                    <div>• Target Step ID: {hotspot.targetStepId || 'None'}</div>
                    {hotspot.targetStepId && (
                      <div>• Target: {targetStep ? `Step ${targetStep.position}: ${targetStep.title}` : '⚠️ Step not found!'}</div>
                    )}
                    <div>• Color: <span style={{ backgroundColor: hotspot.color, padding: '2px 8px', borderRadius: '3px' }}>{hotspot.color}</span></div>
                  </div>
                );
              })}
            </div> */}
          </div>
        )}
        
        {hotspots.length === 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            No hotspots on this step
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">All Steps</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                currentStepIndex === index
                  ? 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <Image
                src={step.imageUrl}
                alt={step.title || `Step ${step.position}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
              <div className={`absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-2 ${
                currentStepIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              } transition-opacity`}>
                <span className="text-white text-xs font-medium">
                  {step.position}. {step.title}
                </span>
              </div>
              {currentStepIndex === index && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
