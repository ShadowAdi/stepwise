"use client"

import { useState, useRef, MouseEvent, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StepResponse, HotspotResponse, CreateHotspotDTO } from '@/types';
import { createHotspot, deleteHotspot, updateHotspot, getHotspotsByStepId } from '@/actions/hotspot/hotspot.action';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface HotspotEditorProps {
  step: StepResponse;
  token: string;
  onHotspotsChange?: (hotspots: HotspotResponse[]) => void;
  allSteps?: StepResponse[]; // For selecting target steps
}

interface DrawingHotspot {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export const HotspotEditor = ({ step, token, onHotspotsChange, allSteps = [] }: HotspotEditorProps) => {
  const [hotspots, setHotspots] = useState<HotspotResponse[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingHotspot, setDrawingHotspot] = useState<DrawingHotspot | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotResponse | null>(null);
  const [hotspotToDelete, setHotspotToDelete] = useState<HotspotResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [clickedOnHotspot, setClickedOnHotspot] = useState(false);
  const [editingHotspot, setEditingHotspot] = useState<HotspotResponse | null>(null);
  const [isCreatingAutoNav, setIsCreatingAutoNav] = useState(false);
  
  // Hotspot form state
  const [color, setColor] = useState('#3b82f6');
  const [tooltipText, setTooltipText] = useState('');
  const [targetStepId, setTargetStepId] = useState('');
  
  const imageRef = useRef<HTMLDivElement>(null);

  // Fetch hotspots when step changes
  useEffect(() => {
    const fetchHotspots = async () => {
      if (!step?.id) return;
      
      const result = await getHotspotsByStepId(step.id, token);
      if (result.success && result.data) {
        setHotspots(result.data);
        onHotspotsChange?.(result.data);
      } else {
        setHotspots([]);
      }
    };

    fetchHotspots();
  }, [step?.id, token]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!isEditMode || !imageRef.current) return;
    
    // Prevent default to avoid text/image selection
    e.preventDefault();
    
    // Check if clicking on existing hotspot
    const target = e.target as HTMLElement;
    if (target.closest('[data-hotspot]')) {
      setClickedOnHotspot(true);
      return;
    }
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setIsDrawing(true);
    setClickedOnHotspot(false);
    setDrawingHotspot({
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !drawingHotspot || !imageRef.current || clickedOnHotspot) return;
    
    e.preventDefault();
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setDrawingHotspot({
      ...drawingHotspot,
      currentX: x,
      currentY: y,
    });
  };

  const handleMouseUp = async () => {
    if (!isDrawing || !drawingHotspot || clickedOnHotspot) {
      setIsDrawing(false);
      setDrawingHotspot(null);
      setClickedOnHotspot(false);
      return;
    }
    
    const width = Math.abs(drawingHotspot.currentX - drawingHotspot.startX);
    const height = Math.abs(drawingHotspot.currentY - drawingHotspot.startY);
    
    // Minimum size check (reduced to 0.5% for easier drawing)
    if (width < 0.5 || height < 0.5) {
      toast.error('Hotspot too small. Draw a larger area.');
      setIsDrawing(false);
      setDrawingHotspot(null);
      setClickedOnHotspot(false);
      return;
    }
    
    const x = Math.min(drawingHotspot.startX, drawingHotspot.currentX);
    const y = Math.min(drawingHotspot.startY, drawingHotspot.currentY);
    
    // Create hotspot
    const result = await createHotspot({
      stepId: step.id,
      x: x.toFixed(2),
      y: y.toFixed(2),
      width: width.toFixed(2),
      height: height.toFixed(2),
      color: color,
      tooltipText: tooltipText || undefined,
      targetStepId: targetStepId || undefined,
    }, token);
    
    if (result.success && result.data) {
      const newHotspots = [...hotspots, result.data];
      setHotspots(newHotspots);
      onHotspotsChange?.(newHotspots);
      toast.success('Hotspot created successfully! ✨');
      
      // Reset form
      setTooltipText('');
      setTargetStepId('');
    } else {
      toast.error(!result.success ? result.error : 'Failed to create hotspot');
    }
    
    setIsDrawing(false);
    setDrawingHotspot(null);
    setClickedOnHotspot(false);
  };

  const confirmDeleteHotspot = async () => {
    if (!hotspotToDelete) return;
    
    const result = await deleteHotspot(hotspotToDelete.id, token);
    if (result.success) {
      const newHotspots = hotspots.filter(h => h.id !== hotspotToDelete.id);
      setHotspots(newHotspots);
      onHotspotsChange?.(newHotspots);
      toast.success('Hotspot deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete hotspot');
    }
    setHotspotToDelete(null);
  };

  const createAutoNavigationHotspots = async () => {
    if (!allSteps || allSteps.length <= 1) {
      toast.error('Need at least 2 steps for auto-navigation');
      return;
    }

    setIsCreatingAutoNav(true);
    const sortedSteps = [...allSteps].sort((a, b) => parseInt(a.position) - parseInt(b.position));
    const currentStepIndex = sortedSteps.findIndex(s => s.id === step.id);
    
    if (currentStepIndex === -1) {
      toast.error('Current step not found');
      setIsCreatingAutoNav(false);
      return;
    }

    // Calculate previous and next steps (circular)
    const prevStep = currentStepIndex === 0 
      ? sortedSteps[sortedSteps.length - 1] 
      : sortedSteps[currentStepIndex - 1];
    
    const nextStep = currentStepIndex === sortedSteps.length - 1 
      ? sortedSteps[0] 
      : sortedSteps[currentStepIndex + 1];

    try {
      // Create left hotspot (previous)
      const leftHotspot = await createHotspot({
        stepId: step.id,
        x: '5',
        y: '40',
        width: '10',
        height: '20',
        color: '#10b981',
        tooltipText: `← Previous: ${prevStep.title}`,
        targetStepId: prevStep.id,
      }, token);

      // Create right hotspot (next)
      const rightHotspot = await createHotspot({
        stepId: step.id,
        x: '85',
        y: '40',
        width: '10',
        height: '20',
        color: '#3b82f6',
        tooltipText: `Next: ${nextStep.title} →`,
        targetStepId: nextStep.id,
      }, token);

      if (leftHotspot.success && rightHotspot.success) {
        const updatedHotspots = [...hotspots, leftHotspot.data!, rightHotspot.data!];
        setHotspots(updatedHotspots);
        onHotspotsChange?.(updatedHotspots);
        toast.success('🎠 Carousel navigation created!');
      } else {
        toast.error('Failed to create navigation hotspots');
      }
    } catch (error) {
      toast.error('Error creating navigation');
    } finally {
      setIsCreatingAutoNav(false);
    }
  };

  const handleEditHotspot = (hotspot: HotspotResponse) => {
    setEditingHotspot(hotspot);
    setColor(hotspot.color);
    setTooltipText(hotspot.tooltipText || '');
    setTargetStepId(hotspot.targetStepId || '');
  };

  const handleUpdateHotspot = async () => {
    if (!editingHotspot) return;

    const result = await updateHotspot(editingHotspot.id, {
      color,
      tooltipText: tooltipText || undefined,
      targetStepId: targetStepId || undefined,
    }, token);

    if (result.success && result.data) {
      const updatedHotspots = hotspots.map(h => 
        h.id === editingHotspot.id ? result.data! : h
      );
      setHotspots(updatedHotspots);
      onHotspotsChange?.(updatedHotspots);
      toast.success('Hotspot updated!');
      cancelEdit();
    } else {
      toast.error(!result.success ? result.error : 'Failed to update hotspot');
    }
  };

  const cancelEdit = () => {
    setEditingHotspot(null);
    setColor('#3b82f6');
    setTooltipText('');
    setTargetStepId('');
  };

  const getHotspotStyle = (h: HotspotResponse | DrawingHotspot) => {
    if ('id' in h) {
      // Existing hotspot
      return {
        left: `${h.x}%`,
        top: `${h.y}%`,
        width: `${h.width}%`,
        height: `${h.height}%`,
        backgroundColor: `${h.color}40`,
        border: `3px solid ${h.color}`,
      };
    } else {
      // Drawing hotspot
      const width = Math.abs(h.currentX - h.startX);
      const height = Math.abs(h.currentY - h.startY);
      const x = Math.min(h.startX, h.currentX);
      const y = Math.min(h.startY, h.currentY);
      
      return {
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        backgroundColor: `${color}40`,
        border: `3px dashed ${color}`,
      };
    }
  };

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <motion.h3 
          className="text-base sm:text-lg lg:text-xl font-bold text-text-primary"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
        >
          🎯 Hotspot Editor
        </motion.h3>
        <div className="flex gap-1 sm:gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={createAutoNavigationHotspots}
              disabled={isCreatingAutoNav || !allSteps || allSteps.length <= 1}
              className="cursor-pointer text-xs sm:text-sm"
            >
              {isCreatingAutoNav ? '⏳' : '🎠'} <span className="hidden sm:inline">Auto Nav</span>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={isEditMode ? 'default' : 'outline'}
              onClick={() => setIsEditMode(!isEditMode)}
              className="cursor-pointer text-xs sm:text-sm"
            >
              {isEditMode ? (
                <>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="hidden sm:inline">Done Editing</span>
                  <span className="sm:hidden">Done</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">Add Hotspots</span>
                  <span className="sm:hidden">Add</span>
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isEditMode && (
          <motion.div 
            className="bg-gray-50 p-3 sm:p-4 lg:p-6 rounded-xl border border-gray-200 shadow-sm space-y-3 sm:space-y-4"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {editingHotspot && (
              <div className="mb-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 flex items-center">
                  ✏️ Editing Hotspot
                  <button 
                    onClick={cancelEdit}
                    className="ml-auto text-blue-600 hover:text-blue-800 underline text-xs"
                  >
                    Cancel
                  </button>
                </p>
              </div>
            )}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div>
                <Label className="text-xs sm:text-sm font-semibold mb-2 block">Hotspot Color</Label>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 sm:h-12 w-16 sm:w-20 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-text-muted font-mono">{color}</span>
                </div>
              </div>
              <div>
                <Label className="text-xs sm:text-sm font-semibold mb-2 block">Link to Step (optional)</Label>
                <select
                  value={targetStepId}
                  onChange={(e) => setTargetStepId(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer"
                >
                  <option value="">No link</option>
                  {allSteps.filter(s => s.id !== step.id).map(s => (
                    <option key={s.id} value={s.id}>
                      Step {s.position}: {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <Label className="text-xs sm:text-sm font-semibold mb-2 block">Tooltip Text (optional)</Label>
              <Input
                value={tooltipText}
                onChange={(e) => setTooltipText(e.target.value)}
                placeholder="Click here to continue..."
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
              />
            </motion.div>
            {editingHotspot ? (
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button onClick={handleUpdateHotspot} size="sm" className="flex-1">
                  💾 Update Hotspot
                </Button>
                <Button onClick={cancelEdit} variant="outline" size="sm">
                  Cancel
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-text-secondary font-medium">
                  Click and drag on the image below to create a hotspot area
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={imageRef}
        className="relative w-full aspect-video rounded-xl overflow-hidden border border-border shadow-sm select-none"
        style={{ 
          cursor: isEditMode ? 'crosshair' : 'default', 
          userSelect: 'none',
          borderWidth: '2px',
          borderColor: isEditMode ? '#3b82f6' : '#e2e8f0'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDrawing) {
            setIsDrawing(false);
            setDrawingHotspot(null);
          }
        }}
        whileHover={isEditMode ? { borderColor: '#2563eb' } : {}}
        transition={{ duration: 0.2 }}
      >
        <Image
          src={step.imageUrl}
          alt={step.title || 'Step'}
          fill
          className="object-contain pointer-events-none select-none"
          draggable={false}
        />
        
        {/* Edit Mode Overlay */}
        <AnimatePresence>
          {isEditMode && !isDrawing && (
            <motion.div
              className="absolute inset-0 bg-blue-500/5 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        
        {/* Render existing hotspots */}
        <AnimatePresence>
          {hotspots.map((hotspot, index) => (
            <motion.div
              key={hotspot.id}
              data-hotspot="true"
              className="absolute cursor-pointer hover:opacity-80 transition-opacity group pointer-events-auto"
              style={getHotspotStyle(hotspot)}
              onMouseDown={(e) => {
                e.stopPropagation();
                if (isEditMode) {
                  setClickedOnHotspot(true);
                }
              }}
              onClick={(e) => {
                if (!isEditMode) return;
                e.stopPropagation();
                setSelectedHotspot(hotspot);
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: index * 0.05, type: "spring" }}
              whileHover={isEditMode ? { scale: 1.05 } : {}}
            >
              {isEditMode && (
                <>
                  <motion.button
                    className="absolute -top-3 -right-3 bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditHotspot(hotspot);
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    title="Edit hotspot"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </motion.button>
                  <motion.button
                    className="absolute -top-3 -right-12 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHotspotToDelete(hotspot);
                    }}
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete hotspot"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </>
              )}
              {hotspot.tooltipText && !isEditMode && (
                <motion.div 
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap shadow-xl"
                  initial={{ y: 10 }}
                  whileHover={{ y: 0 }}
                >
                  {hotspot.tooltipText}
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Render drawing hotspot */}
        <AnimatePresence>
          {drawingHotspot && (
            <motion.div
              className="absolute pointer-events-none"
              style={getHotspotStyle(drawingHotspot)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{ 
                  boxShadow: ['0 0 0px rgba(59, 130, 246, 0.5)', '0 0 20px rgba(59, 130, 246, 0.8)', '0 0 0px rgba(59, 130, 246, 0.5)']
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {hotspots.length > 0 && (
          <motion.div 
            className="space-y-2 sm:space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h4 className="font-bold text-xs sm:text-sm text-text-primary flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Hotspots Created ({hotspots.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {hotspots.map((hotspot, idx) => (
                <motion.div
                  key={hotspot.id}
                  className="p-4 bg-white border border-gray-200 rounded-xl text-xs space-y-2 shadow-sm hover:shadow-md transition-shadow cursor-default"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-6 h-6 rounded-lg shadow-sm"
                      style={{ backgroundColor: hotspot.color }}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    />
                    <span className="font-bold text-text-primary">Hotspot {idx + 1}</span>
                  </div>
                  {hotspot.tooltipText && (
                    <p className="text-text-muted italic">"{hotspot.tooltipText}"</p>
                  )}
                  {hotspot.targetStepId && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="font-semibold">Linked</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={!!hotspotToDelete} onOpenChange={(open) => !open && setHotspotToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hotspot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hotspot? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDeleteHotspot} className="cursor-pointer">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};
