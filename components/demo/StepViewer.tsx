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
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative">
          <HotspotViewer
            step={currentStep}
            hotspots={hotspots}
            onHotspotClick={handleHotspotClick}
            isLoading={isLoading}
            allSteps={steps}
          />
          
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-2 sm:p-3 max-w-[calc(100%-1rem)] sm:max-w-md">
            <div className="flex items-center gap-1 sm:gap-2 mb-1">
              <span className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 px-2 sm:px-3 py-1 rounded">
                Step {currentStep.position}
              </span>
              {isPlaying && (
                <span className="hidden sm:flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse mr-1"></span>
                  Auto-playing
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-gray-900 line-clamp-2 break-words">
              {currentStep.title}
            </h3>
            <p className="hidden sm:block text-xs sm:text-sm text-gray-600 line-clamp-2 break-words mt-1">
              {currentStep.description}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-3 py-3 sm:px-6 sm:py-4 border-t border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
                className="rounded-sm text-xs sm:text-sm px-2 sm:px-3"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Previous</span>
              </Button>
              
              <Button
                variant={isPlaying ? "default" : "outline"}
                size="sm"
                onClick={togglePlay}
                className="rounded-sm text-xs sm:text-sm px-2 sm:px-3"
              >
                {isPlaying ? (
                  <>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                    </svg>
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">{currentStepIndex >= steps.length - 1 ? 'Replay' : 'Play'}</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentStepIndex === steps.length - 1}
                className="rounded-sm text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Next</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 font-medium">
              {currentStepIndex + 1} / {steps.length}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 break-words">
          {currentStep.title}
        </h4>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
          {currentStep.description}
        </p>
      </div>

      {steps.length > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4">All Steps</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-1">
                  <span className="text-white text-xs sm:text-sm font-bold">
                    {step.position}
                  </span>
                </div>
                {currentStepIndex === index && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
