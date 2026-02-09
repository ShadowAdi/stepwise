"use client"

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef, DragEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const stepSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  order: z.number().min(1, 'Order must be at least 1'),
});

type StepFormData = z.infer<typeof stepSchema>;

interface Step {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
}

const page = () => {
  const params = useParams();
  const demoId = params.id as string;

  const [steps, setSteps] = useState<Step[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<StepFormData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      order: steps.length + 1,
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: StepFormData) => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    const newStep: Step = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      image: uploadedImage,
      order: data.order,
    };

    const updatedSteps = [...steps, newStep].sort((a, b) => a.order - b.order);
    setSteps(updatedSteps);
    setUploadedImage(null);
    reset();
    setValue('order', updatedSteps.length + 1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Step added successfully');
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const newSteps = [...steps];
    const draggedStep = newSteps[draggedItem];
    newSteps.splice(draggedItem, 1);
    newSteps.splice(dropIndex, 0, draggedStep);

    // Update order
    const updatedSteps = newSteps.map((step, idx) => ({
      ...step,
      order: idx,
    }));

    setSteps(updatedSteps);
    setDraggedItem(null);
  };

  return (
    <div className="h-screen bg-surface p-4 md:p-6 lg:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-row gap-6">
        {/* Section 1 - Steps List (Draggable & Selectable) */}
        <section className="border-2 border-border rounded-lg bg-background hover:border-border-light transition-colors flex-[0.15] h-full flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-text-primary">
              Steps
            </h2>
            <p className="text-xs text-text-muted mt-1">Drag to reorder</p>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {steps.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-muted text-sm">No steps yet</p>
                <p className="text-text-muted text-xs mt-2">Upload an image to get started</p>
              </div>
            ) : (
              steps.sort((a, b) => a.order - b.order).map((step, index) => (
                <div
                  key={step.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onClick={() => setSelectedStep(step)}
                  className={`group cursor-pointer hover:shadow-md transition-all rounded-lg p-2 ${
                    selectedStep?.id === step.id ? 'ring-2 ring-primary bg-surface' : ''
                  }`}
                >
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-2 border border-border-light">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                    {step.order}. {step.title}
                  </h3>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section 2 - Image Upload & Form */}
        <section className="border-2 border-border rounded-lg bg-background hover:border-border-light transition-colors flex-[0.45] h-full flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-text-primary">
              Create Step
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label className="mb-2 block">Step Image</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="block w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                >
                  {uploadedImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <svg className="w-12 h-12 text-text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-text-secondary font-medium">Click to upload an image</p>
                      <p className="text-text-muted text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </label>

                {uploadedImage && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setUploadedImage(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="w-full mt-3"
                  >
                    Remove Image
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Step Order</Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  placeholder="Enter step order"
                  {...register('order', { valueAsNumber: true })}
                  className={errors.order ? 'border-red-500' : ''}
                />
                {errors.order && (
                  <p className="text-xs text-red-500">{errors.order.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter step title"
                  {...register('title')}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter step description"
                  rows={4}
                  {...register('description')}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">{errors.description.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Submit Step
              </Button>
            </form>
          </div>
        </section>

        {/* Section 3 - Live Preview */}
        <section className="border-2 border-border rounded-lg bg-background hover:border-border-light transition-colors flex-[0.4] h-full flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-text-primary">
              Live Preview
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {selectedStep ? (
              <div className="space-y-4">
                <div className="relative w-full h-96 rounded-lg overflow-hidden border border-border-light">
                  <Image
                    src={selectedStep.image}
                    alt={selectedStep.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                      Step {selectedStep.order}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-3">
                    {selectedStep.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {selectedStep.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  No Step Selected
                </h3>
                <p className="text-text-muted text-sm">
                  Click on a step from the left to preview it here
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default page