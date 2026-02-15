"use client"

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef, DragEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { createStep, getAllSteps, deleteStep, updateStep, changeStepOrder } from '@/actions/steps/steps.action';
import { StepResponse } from '@/types/step';
import { uploadStepImage, deleteStepImage } from '@/actions/upload/upload.action';
import { HotspotEditor } from '@/components/dashboard/HotspotEditor';
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

const stepSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
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
  const [viewMode, setViewMode] = useState<'create' | 'hotspots'>('create');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<StepFormData>({
    resolver: zodResolver(stepSchema),
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Please login to access this page');
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchSteps = async () => {
      if (!token || !demoId) {
        return
      }
      const result = await getAllSteps(demoId, token)
      if (result.success && result.data) {
        const sortedSteps = result.data.sort((a, b) => parseInt(a.position) - parseInt(b.position))
        setSteps(sortedSteps)
      } else {
        console.error(!result.success ? result.error : 'Failed to load steps')
        toast.error(!result.success ? result.error : 'Failed to load steps');
      }
    }

    if (isAuthenticated && token) {
      fetchSteps()
    }
  }, [demoId, token, isAuthenticated])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading('Uploading image...');

      // Delete old image if it exists and we're changing it
      if (uploadedImage && oldImageUrl) {
        await deleteStepImage(oldImageUrl);
      }

      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadStepImage(formData);

      if (result.success && result.data) {
        setUploadedImage(result.data.publicUrl);
        toast.dismiss();
        toast.success('Image uploaded successfully! ✨');
      } else {
        toast.dismiss();
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      toast.dismiss();
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  const onSubmit = async (data: StepFormData) => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    if (!token) {
      toast.error('Authentication required');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && editingStepId) {
        const result = await updateStep(editingStepId, {
          title: data.title,
          description: data.description,
          imageUrl: uploadedImage,
        }, token);

        if (result.success && result.data) {
          setSteps(prevSteps =>
            prevSteps.map(step =>
              step.id === editingStepId ? result.data! : step
            )
          );
          if (selectedStep?.id === editingStepId) {
            setSelectedStep(result.data);
          }
          // Delete old image if it was changed
          if (oldImageUrl && oldImageUrl !== uploadedImage) {
            await deleteStepImage(oldImageUrl);
          }
          toast.success('Step updated successfully! 🎉');
          setIsEditMode(false);
          setEditingStepId(null);
          setOldImageUrl(null);
        } else {
          console.error(!result.success ? result.error : 'Failed to update step')
          toast.error(!result.success ? result.error : 'Failed to update step');
        }
      } else {
        const position = (steps.length + 1).toString();
        const result = await createStep({
          title: data.title,
          description: data.description,
          imageUrl: uploadedImage,
          position: position,
          demoId: demoId,
        }, token, demoId);

        if (result.success && result.data) {
          setSteps(prevSteps => [...prevSteps, result.data!]);
          toast.success('Step created successfully! 🎉');
        } else {
          console.error(!result.success ? result.error : 'Failed to create step')
          toast.error(!result.success ? result.error : 'Failed to create step');
        }
      }

      setUploadedImage(null);
      setOldImageUrl(null);
      setViewMode('create');
      reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!stepToDelete || !token) return;

    const result = await deleteStep(stepToDelete.id, token);
    if (result.success) {
      // Delete the image from storage
      await deleteStepImage(stepToDelete.imageUrl);

      setSteps(prevSteps => prevSteps.filter(step => step.id !== stepToDelete.id));
      if (selectedStep?.id === stepToDelete.id) {
        setSelectedStep(null);
      }
      toast.success('Step deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete step');
    }
    setStepToDelete(null);
  };

  const handleDeleteStep = (step: StepResponse) => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }
    setStepToDelete(step);
  };

  const handleEditStep = (step: StepResponse) => {
    setIsEditMode(true);
    setEditingStepId(step.id);
    setValue('title', step.title || '');
    setValue('description', step.description || '');
    setUploadedImage(step.imageUrl);
    setOldImageUrl(step.imageUrl); // Store the old image URL
    setSelectedStep(step);
    setViewMode('create'); // Switch to create/edit view
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditingStepId(null);
    reset();
    setUploadedImage(null);
    setOldImageUrl(null);
    setViewMode('create');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem === null || !token) return;

    const newSteps = [...steps];
    const draggedStep = newSteps[draggedItem];
    newSteps.splice(draggedItem, 1);
    newSteps.splice(dropIndex, 0, draggedStep);

    // Update positions for all affected steps
    const updatedSteps = newSteps.map((step, idx) => ({
      ...step,
      position: (idx + 1).toString(),
    }));

    setSteps(updatedSteps);
    setDraggedItem(null);

    // Update positions in backend
    try {
      for (const step of updatedSteps) {
        if (step.position !== steps.find(s => s.id === step.id)?.position) {
          await changeStepOrder(step.id, step.position, token);
        }
      }
      toast.success('Step order updated ✨');
    } catch (error) {
      toast.error('Failed to update step order');
      // Revert on error
      const result = await getAllSteps(demoId, token);
      if (result.success && result.data) {
        setSteps(result.data.sort((a, b) => parseInt(a.position) - parseInt(b.position)));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Steps List Panel */}
        <motion.section 
          className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all w-full lg:flex-[0.25] max-h-[40vh] lg:max-h-[calc(100vh-4rem)] flex flex-col overflow-hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Steps ({steps.length})
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Drag to reorder steps</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
            {steps.length === 0 ? (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500 font-medium text-sm">No steps yet</p>
                <p className="text-gray-400 text-xs mt-2">Upload an image to get started</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {steps.sort((a, b) => parseInt(a.position) - parseInt(b.position)).map((step, index) => (
                  <motion.div
                    key={step.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e as any, index)}
                    onDragOver={handleDragOver as any}
                    onDrop={(e) => handleDrop(e as any, index)}
                    onClick={() => setSelectedStep(step)}
                    className={`group cursor-grab active:cursor-grabbing hover:shadow-xl transition-all rounded-xl p-3 border-2 ${selectedStep?.id === step.id ? 'ring-3 ring-blue-500 bg-blue-50 border-blue-300 shadow-xl' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-3 border-2 border-gray-200 group-hover:border-blue-400 transition-all">
                      <Image
                        src={step.imageUrl}
                        alt={step.title || 'Step image'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                        #{step.position}
                      </div>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2 sm:mb-3 line-clamp-2 break-words">
                      {step.title}
                    </h3>
                    <div className="flex gap-1 sm:gap-2">
                      <motion.div
                        className="flex-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStep(step);
                          }}
                          className="w-full text-xs font-semibold cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Button>
                      </motion.div>
                      <motion.div
                        className="flex-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStep(step);
                          }}
                          className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.section>

        {/* Step Management Panel */}
        <motion.section 
          className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all w-full lg:flex-[0.45] max-h-[60vh] lg:max-h-[calc(100vh-4rem)] flex flex-col overflow-hidden"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
        >
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Step Management
            </h2>
            <div className="flex gap-3">
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={viewMode === 'create' ? 'default' : 'outline'}
                  onClick={() => setViewMode('create')}
                  className="w-full cursor-pointer"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {isEditMode ? 'Edit Step' : 'Create Step'}
                </Button>
              </motion.div>
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={viewMode === 'hotspots' ? 'default' : 'outline'}
                  onClick={() => {
                    if (!selectedStep) {
                      toast.error('Please select a step first');
                      return;
                    }
                    setViewMode('hotspots');
                  }}
                  className="w-full cursor-pointer"
                  disabled={!selectedStep}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  Manage Hotspots
                </Button>
              </motion.div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
            <AnimatePresence mode="wait">
              {viewMode === 'create' ? (
                <motion.form 
                  onSubmit={handleSubmit(onSubmit)} 
                  className="space-y-6"
                  key="create-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <Label className="mb-3 block text-sm font-bold text-gray-700">Step Image</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <motion.label
                      htmlFor="image-upload"
                      className="block w-full h-48 sm:h-60 lg:h-72 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {uploadedImage ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={uploadedImage}
                            alt="Uploaded"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-6">
                            <span className="text-white font-semibold bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                              Click to change image
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full px-4">
                          <motion.svg 
                            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-blue-400 mb-3 sm:mb-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </motion.svg>
                          <p className="text-gray-700 font-bold text-sm sm:text-base lg:text-lg text-center">Click to upload an image</p>
                          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 text-center">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                    </motion.label>

                    {uploadedImage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setUploadedImage(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="w-full mt-3 cursor-pointer"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Remove Image
                        </Button>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-bold text-gray-700">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter step title"
                      {...register('title')}
                      className={`border-2 ${errors.title ? 'border-red-400' : 'border-gray-300'} focus:border-blue-500`}
                    />
                    {errors.title && (
                      <motion.p 
                        className="text-xs text-red-600 font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.title.message}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-bold text-gray-700">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter step description"
                      rows={6}
                      {...register('description')}
                      className={`border-2 ${errors.description ? 'border-red-400' : 'border-gray-300'} focus:border-blue-500 text-sm`}
                    />
                    {errors.description && (
                      <motion.p 
                        className="text-xs text-red-600 font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.description.message}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.div
                      className="flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 cursor-pointer" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.svg 
                              className="w-5 h-5 mr-2" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </motion.svg>
                            {isEditMode ? 'Updating...' : 'Creating...'}
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {isEditMode ? 'Update Step' : 'Create Step'}
                          </>
                        )}
                      </Button>
                    </motion.div>
                    {isEditMode && (
                      <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEdit}
                          className="w-full py-6 font-bold cursor-pointer"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  className="space-y-4"
                  key="hotspot-editor"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {selectedStep && token ? (
                    <HotspotEditor
                      step={selectedStep}
                      token={token}
                      allSteps={steps}
                      onHotspotsChange={(hotspots) => {
                        console.log('Hotspots updated:', hotspots);
                      }}
                    />
                  ) : (
                    <div className="text-center py-20">
                      <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                      <p className="text-gray-500 font-medium">Please select a step to manage hotspots</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Live Preview Panel */}
        <motion.section 
          className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all w-full lg:flex-[0.3] max-h-[50vh] lg:max-h-[calc(100vh-4rem)] flex flex-col overflow-hidden"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
        >
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Live Preview
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
            <AnimatePresence mode="wait">
              {selectedStep ? (
                <motion.div 
                  className="space-y-6"
                  key={selectedStep.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <Image
                      src={selectedStep.imageUrl}
                      alt={selectedStep.title || 'Step image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <motion.span 
                        className="text-sm font-bold text-white bg-blue-600 px-4 py-2 rounded-full shadow-sm"
                        whileHover={{ scale: 1.1 }}
                      >
                        Step {selectedStep.position}
                      </motion.span>
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-3 sm:mb-4 leading-tight break-words">
                      {selectedStep.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">
                      {selectedStep.description}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  className="flex flex-col items-center justify-center h-full text-center"
                  key="no-selection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-6"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-14 h-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    No Step Selected
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Click on a step from the left to preview it here
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>

      <AlertDialog open={!!stepToDelete} onOpenChange={(open) => !open && setStepToDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Step</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this step? This action cannot be undone and will permanently delete the step and its image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete} className="rounded-lg cursor-pointer">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default StepsPage
