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
  allSteps?: StepResponse[];
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
  const [hotspotToDelete, setHotspotToDelete] = useState<HotspotResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [clickedOnHotspot, setClickedOnHotspot] = useState(false);
  const [editingHotspot, setEditingHotspot] = useState<HotspotResponse | null>(null);
  const [isCreatingAutoNav, setIsCreatingAutoNav] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Hotspot form state
  const [color, setColor] = useState('#3b82f6');
  const [borderRadius, setBorderRadius] = useState('8');
  const [tooltipText, setTooltipText] = useState('');
  const [targetStepId, setTargetStepId] = useState('');
  
  const imageRef = useRef<HTMLDivElement>(null);

  // Fetch hotspots when step changes
  useEffect(() => {
    const fetchHotspots = async () => {
      if (!step?.id) return;
      
      setIsLoading(true);
      const result = await getHotspotsByStepId(step.id, token);
      if (result.success && result.data) {
        setHotspots(result.data);
        onHotspotsChange?.(result.data);
      } else {
        setHotspots([]);
      }
      setIsLoading(false);
    };

    fetchHotspots();
  }, [step?.id, token]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!isEditMode || !imageRef.current || editingHotspot) return;
    
    e.preventDefault();
    
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
    
    if (width < 1 || height < 1) {
      toast.error('Hotspot too small. Draw a larger area.');
      setIsDrawing(false);
      setDrawingHotspot(null);
      setClickedOnHotspot(false);
      return;
    }
    
    const x = Math.min(drawingHotspot.startX, drawingHotspot.currentX);
    const y = Math.min(drawingHotspot.startY, drawingHotspot.currentY);
    
    setIsSaving(true);
    const result = await createHotspot({
      stepId: step.id,
      x: x.toFixed(2),
      y: y.toFixed(2),
      width: width.toFixed(2),
      height: height.toFixed(2),
      color: color,
      borderRadius: borderRadius,
      tooltipText: tooltipText || undefined,
      targetStepId: targetStepId || undefined,
    }, token);
    
    if (result.success && result.data) {
      const newHotspots = [...hotspots, result.data];
      setHotspots(newHotspots);
      onHotspotsChange?.(newHotspots);
      toast.success('✨ Hotspot created!');
      setTooltipText('');
      setTargetStepId('');
    } else {
      toast.error(!result.success ? result.error : 'Failed to create hotspot');
    }
    
    setIsDrawing(false);
    setDrawingHotspot(null);
    setClickedOnHotspot(false);
    setIsSaving(false);
  };

  const confirmDeleteHotspot = async () => {
    if (!hotspotToDelete) return;
    
    setIsSaving(true);
    const result = await deleteHotspot(hotspotToDelete.id, token);
    if (result.success) {
      const newHotspots = hotspots.filter(h => h.id !== hotspotToDelete.id);
      setHotspots(newHotspots);
      onHotspotsChange?.(newHotspots);
      toast.success('Hotspot deleted');
    } else {
      toast.error(result.error || 'Failed to delete');
    }
    setHotspotToDelete(null);
    setIsSaving(false);
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

    const prevStep = currentStepIndex === 0 
      ? sortedSteps[sortedSteps.length - 1] 
      : sortedSteps[currentStepIndex - 1];
    
    const nextStep = currentStepIndex === sortedSteps.length - 1 
      ? sortedSteps[0] 
      : sortedSteps[currentStepIndex + 1];

    try {
      const leftHotspot = await createHotspot({
        stepId: step.id,
        x: '5',
        y: '40',
        width: '10',
        height: '20',
        color: '#10b981',
        borderRadius: '12',
        tooltipText: `← Previous: ${prevStep.title}`,
        targetStepId: prevStep.id,
      }, token);

      const rightHotspot = await createHotspot({
        stepId: step.id,
        x: '85',
        y: '40',
        width: '10',
        height: '20',
        color: '#3b82f6',
        borderRadius: '12',
        tooltipText: `Next: ${nextStep.title} →`,
        targetStepId: nextStep.id,
      }, token);

      if (leftHotspot.success && rightHotspot.success) {
        const updatedHotspots = [...hotspots, leftHotspot.data!, rightHotspot.data!];
        setHotspots(updatedHotspots);
        onHotspotsChange?.(updatedHotspots);
        toast.success('🎠 Navigation created!');
      } else {
        toast.error('Failed to create navigation');
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
    setBorderRadius(hotspot.borderRadius || '8');
    setTooltipText(hotspot.tooltipText || '');
    setTargetStepId(hotspot.targetStepId || '');
  };

  const handleUpdateHotspot = async () => {
    if (!editingHotspot) return;

    setIsSaving(true);
    const result = await updateHotspot(editingHotspot.id, {
      color,
      borderRadius,
      tooltipText: tooltipText || undefined,
      targetStepId: targetStepId || undefined,
    }, token);

    if (result.success && result.data) {
      const updatedHotspots = hotspots.map(h => 
        h.id === editingHotspot.id ? result.data! : h
      );
      setHotspots(updatedHotspots);
      onHotspotsChange?.(updatedHotspots);
      toast.success('✨ Hotspot updated!');
      cancelEdit();
    } else {
      toast.error(!result.success ? result.error : 'Failed to update');
    }
    setIsSaving(false);
  };

  const cancelEdit = () => {
    setEditingHotspot(null);
    setColor('#3b82f6');
    setBorderRadius('8');
    setTooltipText('');
    setTargetStepId('');
  };

  const getHotspotStyle = (h: HotspotResponse | DrawingHotspot) => {
    if ('id' in h) {
      return {
        left: `${h.x}%`,
        top: `${h.y}%`,
        width: `${h.width}%`,
        height: `${h.height}%`,
        backgroundColor: `${h.color}30`,
        border: `2px solid ${h.color}`,
        borderRadius: `${h.borderRadius || 0}px`,
      };
    } else {
      const width = Math.abs(h.currentX - h.startX);
      const height = Math.abs(h.currentY - h.startY);
      const x = Math.min(h.startX, h.currentX);
      const y = Math.min(h.startY, h.currentY);
      
      return {
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        backgroundColor: `${color}30`,
        border: `2px dashed ${color}`,
        borderRadius: `${borderRadius}px`,
      };
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">🎯 Hotspot Editor</h3>
          {isLoading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={createAutoNavigationHotspots}
            disabled={isCreatingAutoNav || !allSteps || allSteps.length <= 1}
            className="cursor-pointer text-xs"
          >
            {isCreatingAutoNav ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-3 h-3 border-2 border-current border-t-transparent rounded-full mr-1"
                />
                <span className="hidden sm:inline">Creating...</span>
              </>
            ) : (
              <>🎠 <span className="hidden sm:inline">Auto Nav</span></>
            )}
          </Button>
          <Button
            variant={isEditMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setIsEditMode(!isEditMode);
              if (isEditMode) {
                cancelEdit();
              }
            }}
            className="cursor-pointer text-xs"
          >
            {isEditMode ? (
              <>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden sm:inline">Done</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Draw Hotspot
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded-lg"
          >
            {editingHotspot ? (
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Editing Hotspot
                </p>
                <Button size="sm" variant="ghost" onClick={cancelEdit} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                  Cancel
                </Button>
              </div>
            ) : (
              <p className="text-sm font-medium text-blue-900 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                {isSaving ? 'Saving...' : 'Click and drag on the image below to create a hotspot'}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div 
            className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-semibold mb-2 block text-gray-700">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-16 cursor-pointer border-2"
                  />
                  <span className="text-xs text-gray-600 font-mono">{color}</span>
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-2 block text-gray-700">Roundness (px)</Label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(e.target.value)}
                  className="text-sm"
                  placeholder="0-50"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-2 block text-gray-700">Link to Step</Label>
                <select
                  value={targetStepId}
                  onChange={(e) => setTargetStepId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 cursor-pointer"
                >
                  <option value="">None</option>
                  {allSteps.filter(s => s.id !== step.id).map(s => (
                    <option key={s.id} value={s.id}>
                      Step {s.position}: {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold mb-2 block text-gray-700">Tooltip Text (optional)</Label>
              <Input
                value={tooltipText}
                onChange={(e) => setTooltipText(e.target.value)}
                placeholder="e.g., Click here to continue"
                className="text-sm"
              />
            </div>
            {editingHotspot && (
              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  onClick={handleUpdateHotspot} 
                  disabled={isSaving}
                  className="flex-1 cursor-pointer"
                  size="sm"
                >
                  {isSaving ? 'Saving...' : '💾 Save Changes'}
                </Button>
                <Button onClick={cancelEdit} variant="outline" size="sm" className="cursor-pointer">
                  Cancel
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Canvas */}
      <motion.div
        ref={imageRef}
        className="relative w-full aspect-video rounded-lg overflow-hidden border-2 shadow-sm select-none"
        style={{ 
          cursor: isEditMode && !editingHotspot ? 'crosshair' : 'default',
          borderColor: isEditMode ? '#3b82f6' : '#e5e7eb'
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
      >
        <Image
          src={step.imageUrl}
          alt={step.title || 'Step'}
          fill
          className="object-contain pointer-events-none select-none"
          draggable={false}
        />
        
        {isEditMode && !isDrawing && (
          <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
        )}
        
        {/* Existing hotspots */}
        {hotspots.map((hotspot, index) => (
          <motion.div
            key={hotspot.id}
            data-hotspot="true"
            className={`absolute transition-all ${isEditMode ? 'cursor-pointer hover:opacity-80' : ''} group`}
            style={getHotspotStyle(hotspot)}
            onMouseDown={(e) => {
              e.stopPropagation();
              if (isEditMode) setClickedOnHotspot(true);
            }}
            onClick={(e) => {
              if (!isEditMode) return;
              e.stopPropagation();
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={isEditMode ? { scale: 1.02 } : {}}
          >
            {isEditMode && (
              <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditHotspot(hotspot);
                  }}
                  title="Edit"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHotspotToDelete(hotspot);
                  }}
                  title="Delete"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
        ))}
        
        {/* Drawing hotspot */}
        {drawingHotspot && (
          <motion.div
            className="absolute pointer-events-none"
            style={getHotspotStyle(drawingHotspot)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </motion.div>

      {/* Hotspots List */}
      {hotspots.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {hotspots.length} Hotspot{hotspots.length !== 1 ? 's' : ''}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {hotspots.map((hotspot, idx) => {
              const targetStep = allSteps.find(s => s.id === hotspot.targetStepId);
              return (
                <div
                  key={hotspot.id}
                  className="p-3 bg-white border border-gray-200 rounded-lg text-xs space-y-2 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded border-2 flex-shrink-0"
                      style={{ 
                        backgroundColor: hotspot.color,
                        borderColor: hotspot.color,
                        borderRadius: `${parseInt(hotspot.borderRadius || '0') / 2}px`
                      }}
                    />
                    <span className="font-bold text-gray-900">Hotspot {idx + 1}</span>
                  </div>
                  {hotspot.tooltipText && (
                    <p className="text-gray-600 italic line-clamp-1">"{hotspot.tooltipText}"</p>
                  )}
                  {targetStep && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold line-clamp-1">→ Step {targetStep.position}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={!!hotspotToDelete} onOpenChange={(open) => !open && setHotspotToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hotspot?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The hotspot will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              variant="destructive" 
              onClick={confirmDeleteHotspot} 
              className="cursor-pointer"
              disabled={isSaving}
            >
              {isSaving ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};
