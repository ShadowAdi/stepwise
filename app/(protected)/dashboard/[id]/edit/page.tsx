"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDemoById, updateDemo } from "@/actions/demos/demos.action";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, Globe, Lock } from "lucide-react";

const updateDemoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  isPublic: z.boolean(),
});

type UpdateDemoFormData = z.infer<typeof updateDemoSchema>;

export default function EditDemoPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const demoId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<UpdateDemoFormData>({
    resolver: zodResolver(updateDemoSchema),
    defaultValues: { title: "", description: "", isPublic: false },
  });

  useEffect(() => {
    const fetchDemo = async () => {
      if (!token || !demoId) return;
      const result = await getDemoById(demoId, token);
      if (result.success) {
        setValue("title", result.data.title);
        setValue("description", result.data.description || "");
        setValue("isPublic", result.data.isPublic);
      } else {
        toast.error(result.error);
        router.push("/dashboard");
      }
      setIsLoading(false);
    };
    fetchDemo();
  }, [token, demoId, router, setValue]);

  const onSubmit = async (data: UpdateDemoFormData) => {
    if (!token || !demoId) return;
    setIsSubmitting(true);

    const result = await updateDemo(
      demoId,
      { title: data.title, description: data.description || undefined, isPublic: data.isPublic },
      token
    );

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Demo updated");
      router.push(`/dashboard/${demoId}`);
    } else {
      toast.error(result.error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page">
        <Loader2 className="size-5 animate-spin text-text-tertiary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      <header className="h-14 border-b border-edge bg-surface sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/${demoId}`)}>
            <ArrowLeft className="size-4" />
            Cancel
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">Edit demo</h1>
          <p className="text-sm text-text-secondary mt-0.5">Update your demo details</p>
        </div>

        <div className="border border-edge rounded-lg bg-surface">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-5 space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-error">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Product Tour, Feature Demo"
                  {...register("title")}
                  aria-invalid={!!errors.title}
                />
                {errors.title && (
                  <p className="text-xs text-error">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What is this demo about?"
                  rows={5}
                  className="resize-none"
                  {...register("description")}
                  aria-invalid={!!errors.description}
                />
                {errors.description && (
                  <p className="text-xs text-error">{errors.description.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Visibility</Label>
                  <p className="text-xs text-text-tertiary">
                    {watch("isPublic") ? "Anyone with the link can view" : "Only you can view"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {watch("isPublic") ? (
                    <Globe className="size-4 text-text-secondary" />
                  ) : (
                    <Lock className="size-4 text-text-tertiary" />
                  )}
                  <Controller
                    control={control}
                    name="isPublic"
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-4 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/${demoId}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Save changes"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
