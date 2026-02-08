"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDemoById, updateDemo } from "@/actions/demos/demos.action";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  } = useForm<UpdateDemoFormData>({
    resolver: zodResolver(updateDemoSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: false,
    },
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
    if (!token || !demoId) {
      toast.error("Missing required information");
      return;
    }

    setIsSubmitting(true);

    const result = await updateDemo(
      demoId,
      {
        title: data.title,
        description: data.description || undefined,
        isPublic: data.isPublic,
      },
      token
    );

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Demo updated successfully!");
      router.push("/dashboard");
    } else {
      toast.error(result.error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-600">Loading demo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="rounded-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Demo</h1>
          <p className="text-gray-600 mt-2">
            Update your demo information
          </p>
        </div>

        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle>Demo Details</CardTitle>
            <CardDescription>
              Modify the information below to update your demo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Product Tour, Feature Demo"
                  className="rounded-sm"
                  {...register("title")}
                  aria-invalid={!!errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
                <p className="text-sm text-gray-500">
                  A descriptive title for your demo
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this demo is about..."
                  rows={4}
                  className="rounded-sm resize-none"
                  {...register("description")}
                  aria-invalid={!!errors.description}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
                <p className="text-sm text-gray-500">
                  Optional. Help others understand what this demo showcases
                </p>
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label htmlFor="isPublic">Visibility</Label>
                <div className="flex items-center space-x-2">
                  <input
                    id="isPublic"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    {...register("isPublic")}
                  />
                  <Label htmlFor="isPublic" className="font-normal cursor-pointer">
                    Make this demo public
                  </Label>
                </div>
                <p className="text-sm text-gray-500">
                  Public demos can be viewed by anyone with the link
                </p>
              </div>

              {/* Preview Card */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Preview</h3>
                <Card className="rounded-sm bg-gray-50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">
                          {watch("title") || "Demo Title"}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${watch("isPublic") ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {watch("isPublic") ? 'Public' : 'Private'}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {watch("description") || "No description provided"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  disabled={isSubmitting}
                  className="rounded-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-sm"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Demo"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
