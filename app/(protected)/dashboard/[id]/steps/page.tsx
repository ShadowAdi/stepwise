"use client"

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef, DragEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { createStep, getAllSteps, deleteStep, updateStep, changeStepOrder } from "@/actions/steps/steps.action";
import { StepResponse } from "@/types/step";
import { uploadStepImage, deleteStepImage } from "@/actions/upload/upload.action";
import { HotspotEditor } from "@/components/dashboard/HotspotEditor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  Upload,
  Image as ImageIcon,
  MousePointerClick,
  Eye,
  Loader2,
  X,
  Layers,
} from "lucide-react";

const stepSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

type StepFormData = z.infer<typeof stepSchema>;

const StepsPage = () => {
  const params = useParams();
  const router = useRouter();
  const demoId = params.id as string;
  const { isAuthenticated, isLoading, token } = useAuth();
  const [steps, setSteps] = useState<StepResponse[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [selectedStep, setSelectedStep] = useState<StepResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepToDelete, setStepToDelete] = useState<StepResponse | null>(null);
  const [oldImageUrl, setOldImageUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"create" | "hotspots">("create");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<StepFormData>({
    resolver: zodResolver(stepSchema),
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please login to access this page");
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchSteps = async () => {
      if (!token || !demoId) return;
      const result = await getAllSteps(demoId, token);
      if (result.success && result.data) {
        setSteps(result.data.sort((a, b) => parseInt(a.position) - parseInt(b.position)));
      } else {
        toast.error(!result.success ? result.error : "Failed to load steps");
      }
    };
    if (isAuthenticated && token) fetchSteps();
  }, [demoId, token, isAuthenticated]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading("Uploading…");
      if (uploadedImage && oldImageUrl) await deleteStepImage(oldImageUrl);
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadStepImage(formData);
      if (result.success && result.data) {
        setUploadedImage(result.data.publicUrl);
        toast.dismiss();
        toast.success("Image uploaded");
      } else {
        toast.dismiss();
        toast.error(result.error || "Upload failed");
      }
    } catch {
      toast.dismiss();
      toast.error("Upload failed");
    }
  };

  const onSubmit = async (data: StepFormData) => {
    if (!uploadedImage) { toast.error("Please upload an image first"); return; }
    if (!token) { toast.error("Auth required"); return; }
    setIsSubmitting(true);
    try {
      if (isEditMode && editingStepId) {
        const result = await updateStep(editingStepId, { title: data.title, description: data.description, imageUrl: uploadedImage }, token);
        if (result.success && result.data) {
          setSteps(prev => prev.map(s => s.id === editingStepId ? result.data! : s));
          if (selectedStep?.id === editingStepId) setSelectedStep(result.data);
          if (oldImageUrl && oldImageUrl !== uploadedImage) await deleteStepImage(oldImageUrl);
          toast.success("Step updated");
          setIsEditMode(false);
          setEditingStepId(null);
          setOldImageUrl(null);
        } else {
          toast.error(!result.success ? result.error : "Update failed");
        }
      } else {
        const position = (steps.length + 1).toString();
        const result = await createStep({ title: data.title, description: data.description, imageUrl: uploadedImage, position, demoId }, token, demoId);
        if (result.success && result.data) {
          setSteps(prev => [...prev, result.data!]);
          toast.success("Step created");
        } else {
          toast.error(!result.success ? result.error : "Create failed");
        }
      }
      setUploadedImage(null);
      setOldImageUrl(null);
      setViewMode("create");
      reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!stepToDelete || !token) return;
    const result = await deleteStep(stepToDelete.id, token);
    if (result.success) {
      await deleteStepImage(stepToDelete.imageUrl);
      setSteps(prev => prev.filter(s => s.id !== stepToDelete.id));
      if (selectedStep?.id === stepToDelete.id) setSelectedStep(null);
      toast.success("Step deleted");
    } else {
      toast.error(result.error || "Delete failed");
    }
    setStepToDelete(null);
  };

  const handleEditStep = (step: StepResponse) => {
    setIsEditMode(true);
    setEditingStepId(step.id);
    setValue("title", step.title || "");
    setValue("description", step.description || "");
    setUploadedImage(step.imageUrl);
    setOldImageUrl(step.imageUrl);
    setSelectedStep(step);
    setViewMode("create");
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditingStepId(null);
    reset();
    setUploadedImage(null);
    setOldImageUrl(null);
    setViewMode("create");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const handleDrop = async (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem === null || !token) return;
    const newSteps = [...steps];
    const [moved] = newSteps.splice(draggedItem, 1);
    newSteps.splice(dropIndex, 0, moved);
    const updated = newSteps.map((s, i) => ({ ...s, position: (i + 1).toString() }));
    setSteps(updated);
    setDraggedItem(null);
    try {
      for (const step of updated) {
        if (step.position !== steps.find(s => s.id === step.id)?.position) {
          await changeStepOrder(step.id, step.position, token);
        }
      }
      toast.success("Order updated");
    } catch {
      toast.error("Reorder failed");
      const result = await getAllSteps(demoId, token);
      if (result.success && result.data) setSteps(result.data.sort((a, b) => parseInt(a.position) - parseInt(b.position)));
    }
  };

  return (
    <div className="h-screen flex flex-col bg-page overflow-hidden">
      {/* Top bar */}
      <header className="h-12 border-b border-edge bg-surface flex items-center px-4 shrink-0 z-40">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/${demoId}`)}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Separator orientation="vertical" className="mx-3 h-5" />
        <span className="text-sm font-medium text-text-secondary">Step Editor</span>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant={viewMode === "create" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("create")}
          >
            {isEditMode ? <Pencil className="size-3.5 mr-1" /> : <Plus className="size-3.5 mr-1" />}
            {isEditMode ? "Edit" : "Create"}
          </Button>
          <Button
            variant={viewMode === "hotspots" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => {
              if (!selectedStep) { toast.error("Select a step first"); return; }
              setViewMode("hotspots");
            }}
            disabled={!selectedStep}
          >
            <MousePointerClick className="size-3.5 mr-1" />
            Hotspots
          </Button>
        </div>
      </header>

      {/* Editor body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Steps list */}
        <aside className="w-60 border-r border-edge bg-surface flex flex-col shrink-0">
          <div className="px-3 py-2.5 border-b border-edge flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Steps ({steps.length})
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {steps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <Layers className="size-8 text-text-tertiary mb-2" />
                <p className="text-xs text-text-tertiary">No steps yet</p>
              </div>
            ) : (
              steps.sort((a, b) => parseInt(a.position) - parseInt(b.position)).map((step, index) => (
                <div
                  key={step.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onClick={() => setSelectedStep(step)}
                  className={`group flex items-start gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                    selectedStep?.id === step.id
                      ? "bg-accent-blue-subtle ring-1 ring-accent-blue/20"
                      : "hover:bg-surface-secondary"
                  }`}
                >
                  <GripVertical className="size-3.5 text-text-tertiary mt-0.5 shrink-0 cursor-grab active:cursor-grabbing" />
                  <div className="flex-1 min-w-0">
                    <div className="relative w-full aspect-[16/10] rounded overflow-hidden bg-surface-secondary mb-1.5">
                      <Image src={step.imageUrl} alt={step.title || "Step"} fill className="object-cover" />
                      <span className="absolute top-1 left-1 text-[10px] font-semibold bg-text-primary/80 text-white px-1.5 py-0.5 rounded">
                        {step.position}
                      </span>
                    </div>
                    <p className="text-xs font-medium truncate">{step.title}</p>
                    <div className="flex gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => { e.stopPropagation(); handleEditStep(step); }}
                      >
                        <Pencil className="size-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => { e.stopPropagation(); setStepToDelete(step); }}
                        className="text-error hover:text-error"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Center: Form / Hotspots */}
        <div className="flex-1 flex flex-col min-w-0">
          {viewMode === "create" ? (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-lg mx-auto py-8 px-6">
                <h2 className="text-lg font-semibold mb-5">
                  {isEditMode ? "Edit step" : "New step"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Image upload */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Screenshot *</Label>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                    <label
                      htmlFor="image-upload"
                      className="block w-full aspect-video border border-dashed border-edge-strong rounded-lg cursor-pointer hover:border-accent-blue hover:bg-accent-blue-subtle/30 transition-colors overflow-hidden"
                    >
                      {uploadedImage ? (
                        <div className="relative w-full h-full group">
                          <Image src={uploadedImage} alt="Uploaded" fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-medium">Click to change</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-2">
                          <Upload className="size-6 text-text-tertiary" />
                          <p className="text-sm font-medium text-text-secondary">Upload screenshot</p>
                          <p className="text-xs text-text-tertiary">PNG, JPG or GIF up to 10MB</p>
                        </div>
                      )}
                    </label>
                    {uploadedImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => { setUploadedImage(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="text-error hover:text-error"
                      >
                        <Trash2 className="size-3.5 mr-1" />Remove image
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Click the settings button"
                      {...register("title")}
                      aria-invalid={!!errors.title}
                    />
                    {errors.title && <p className="text-xs text-error">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Explain what users should do…"
                      rows={5}
                      className="resize-none"
                      {...register("description")}
                      aria-invalid={!!errors.description}
                    />
                    {errors.description && <p className="text-xs text-error">{errors.description.message}</p>}
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : isEditMode ? "Update step" : "Create step"}
                    </Button>
                    {isEditMode && (
                      <Button type="button" variant="outline" size="sm" onClick={cancelEdit}>
                        <X className="size-4 mr-1" />Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6">
              {selectedStep && token ? (
                <HotspotEditor step={selectedStep} token={token} allSteps={steps} onHotspotsChange={(h) => console.log("Hotspots:", h)} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <MousePointerClick className="size-10 text-text-tertiary mb-3" />
                  <p className="text-sm text-text-tertiary">Select a step to manage hotspots</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <aside className="w-80 border-l border-edge bg-surface flex flex-col shrink-0">
          <div className="px-3 py-2.5 border-b border-edge flex items-center gap-2">
            <Eye className="size-3.5 text-text-tertiary" />
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Preview</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {selectedStep ? (
              <div>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-edge mb-4">
                  <Image src={selectedStep.imageUrl} alt={selectedStep.title || "Step"} fill className="object-cover" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold bg-text-primary text-text-inverted px-2 py-0.5 rounded">
                    Step {selectedStep.position}
                  </span>
                </div>
                <h3 className="text-base font-semibold mb-2 break-words">{selectedStep.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed break-words">{selectedStep.description}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Eye className="size-8 text-text-tertiary mb-3" />
                <p className="text-sm font-medium mb-1">No step selected</p>
                <p className="text-xs text-text-tertiary">Click a step from the list to preview</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Delete dialog */}
      <AlertDialog open={!!stepToDelete} onOpenChange={(open) => !open && setStepToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete step</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this step and its image. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-error hover:bg-error/90 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StepsPage;
