"use client"

import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StepResponse, HotspotResponse, CreateHotspotDTO } from '@/types';
import { createHotspot, deleteHotspot, updateHotspot } from '@/actions/hotspot/hotspot.action';
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
      toast.success('Hotspot created');
      
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
      toast.success('Hotspot deleted');
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
        border: `2px solid ${h.color}`,
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
        border: `2px dashed ${color}`,
      };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Hotspot Editor</h3>
        <Button
          variant={isEditMode ? 'default' : 'outline'}
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? 'Done Editing' : 'Add Hotspots'}
        </Button>
      </div>

      {isEditMode && (
        <div className="bg-surface p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Color</Label>
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10"
              />
            </div>
            <div>
              <Label>Target Step (optional)</Label>
              <select
                value={targetStepId}
                onChange={(e) => setTargetStepId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">No link</option>
                {allSteps.filter(s => s.id !== step.id).map(s => (
                  <option key={s.id} value={s.id}>
                    Step {s.position}: {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label>Tooltip Text (optional)</Label>
            <Input
              value={tooltipText}
              onChange={(e) => setTooltipText(e.target.value)}
              placeholder="Click here to continue..."
            />
          </div>
          <p className="text-xs text-text-muted">
            Click and drag on the image to create a hotspot
          </p>
        </div>
      )}

      <div
        ref={imageRef}
        className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-border select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDrawing) {
            setIsDrawing(false);
            setDrawingHotspot(null);
          }
        }}
        style={{ cursor: isEditMode ? 'crosshair' : 'default', userSelect: 'none' }}
      >
        <Image
          src={step.imageUrl}
          alt={step.title || 'Step'}
          fill
          className="object-contain pointer-events-none select-none"
          draggable={false}
        />
        
        {/* Render existing hotspots */}
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            data-hotspot="true"
            className="absolute cursor-pointer hover:opacity-75 transition-opacity group pointer-events-auto"
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
          >
            {isEditMode && (
              <button
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setHotspotToDelete(hotspot);
                }}
              >
                ×
              </button>
            )}
            {hotspot.tooltipText && !isEditMode && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                {hotspot.tooltipText}
              </div>
            )}
          </div>
        ))}
        
        {/* Render drawing hotspot */}
        {drawingHotspot && (
          <div
            className="absolute pointer-events-none"
            style={getHotspotStyle(drawingHotspot)}
          />
        )}
      </div>

      {hotspots.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Hotspots ({hotspots.length})</h4>
          <div className="grid grid-cols-2 gap-2">
            {hotspots.map((hotspot, idx) => (
              <div
                key={hotspot.id}
                className="p-2 border rounded text-xs space-y-1"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: hotspot.color }}
                  />
                  <span className="font-medium">Hotspot {idx + 1}</span>
                </div>
                {hotspot.tooltipText && (
                  <p className="text-text-muted">"{hotspot.tooltipText}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <AlertDialog open={!!hotspotToDelete} onOpenChange={(open) => !open && setHotspotToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hotspot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hotspot? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDeleteHotspot}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
