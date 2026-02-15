"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createDemo } from "@/actions/demos/demos.action";
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

const createDemoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  isPublic: z.boolean(),
});

type CreateDemoFormData = z.infer<typeof createDemoSchema>;

export default function CreateDemoPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<CreateDemoFormData>({
    resolver: zodResolver(createDemoSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: false,
    },
  });

  const onSubmit = async (data: CreateDemoFormData) => {
    if (!token) {
      toast.error("You must be logged in");
      return;
    }
    setIsSubmitting(true);

    const result = await createDemo(
      { title: data.title, description: data.description || undefined, isPublic: data.isPublic },
      token
    );

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Demo created");
      router.push("/dashboard");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-page">
      <header className="h-14 border-b border-edge bg-surface sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">New demo</h1>
          <p className="text-sm text-text-secondary mt-0.5">Fill in the details below to create your demo</p>
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
                  rows={3}
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
                onClick={() => router.push("/dashboard")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Create demo"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
