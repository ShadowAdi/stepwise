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
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <motion.h3 
          className="text-xl font-bold text-text-primary"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
        >
          🎯 Hotspot Editor
        </motion.h3>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={isEditMode ? 'default' : 'outline'}
            onClick={() => setIsEditMode(!isEditMode)}
            className="cursor-pointer"
          >
            {isEditMode ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Done Editing
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Hotspots
              </>
            )}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isEditMode && (
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200 shadow-lg space-y-4"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div>
                <Label className="text-sm font-semibold mb-2 block">Hotspot Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-12 w-20 cursor-pointer"
                  />
                  <span className="text-sm text-text-muted font-mono">{color}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">Link to Step (optional)</Label>
                <select
                  value={targetStepId}
                  onChange={(e) => setTargetStepId(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer"
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
              <Label className="text-sm font-semibold mb-2 block">Tooltip Text (optional)</Label>
              <Input
                value={tooltipText}
                onChange={(e) => setTooltipText(e.target.value)}
                placeholder="Click here to continue..."
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </motion.div>
            <motion.div 
              className="flex items-center gap-3 bg-white/70 backdrop-blur-sm px-4 py-3 rounded-lg"
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
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={imageRef}
        className="relative w-full aspect-video rounded-xl overflow-hidden border-3 border-border shadow-xl select-none"
        style={{ 
          cursor: isEditMode ? 'crosshair' : 'default', 
          userSelect: 'none',
          borderWidth: isEditMode ? '3px' : '2px',
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
                <motion.button
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHotspotToDelete(hotspot);
                  }}
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
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
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h4 className="font-bold text-sm text-text-primary flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Hotspots Created ({hotspots.length})
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {hotspots.map((hotspot, idx) => (
                <motion.div
                  key={hotspot.id}
                  className="p-4 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl text-xs space-y-2 shadow-sm hover:shadow-md transition-shadow cursor-default"
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
