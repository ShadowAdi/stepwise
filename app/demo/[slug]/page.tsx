"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDemoWithSteps, deleteDemo, toggleDemoVisibility, duplicateDemo } from "@/actions/demos/demos.action";
import { DemoResponse, StepResponse } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { StepViewer } from "@/components/demo/StepViewer";

export default function ViewDemoPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [demo, setDemo] = useState<(DemoResponse & { stepsCount: number }) | null>(null);
  const [steps, setSteps] = useState<StepResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchDemo = async () => {
    setIsLoading(true);
    const result = await getDemoWithSteps(slug, token || undefined);

    if (result.success && result.data) {
      const { steps: demoSteps, ...demoData } = result.data;
      setDemo(demoData);
      setSteps(demoSteps || []);
    } else {
      toast.error(!result.success ? result.error : 'Failed to load demo');
      router.push("/dashboard");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (slug) {
      fetchDemo();
    }
  }, [slug, token]);

  const handleDelete = async () => {
    if (!demo || !token) return;

    const result = await deleteDemo(demo.id, token);
    if (result.success) {
      toast.success("Demo deleted successfully");
      router.push("/dashboard");
    } else {
      toast.error(result.error);
    }
    setDeleteDialogOpen(false);
  };

  const handleDuplicate = async () => {
    if (!demo || !token) return;

    const result = await duplicateDemo(demo.id, token);
    if (result.success) {
      toast.success("Demo duplicated successfully");
      router.push("/dashboard");
    } else {
      toast.error(result.error);
    }
  };

  const handleToggleVisibility = async () => {
    if (!demo || !token) return;

    const result = await toggleDemoVisibility(demo.id, token);
    if (result.success) {
      toast.success(`Demo is now ${result.data.isPublic ? "public" : "private"}`);
      fetchDemo();
    } else {
      toast.error(result.error);
    }
  };

  const copyShareLink = () => {
    if (!demo) return;
    const url = `${window.location.origin}/demo/${demo.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const isOwner = demo?.userId === user?.id;

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

  if (!demo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-sm">
                    Actions
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/${demo.id}`)}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Demo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/${demo.id}/steps`)}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Manage Steps
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleToggleVisibility}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Make {demo.isPublic ? 'Private' : 'Public'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyShareLink}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-red-600"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Demo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Header */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{demo.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className={`inline-flex items-center px-3 py-1 rounded-sm text-sm font-medium ${demo.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {demo.isPublic ? (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Public
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Private
                    </>
                  )}
                </span>
                <span>•</span>
                <span>Created {new Date(demo.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>Updated {new Date(demo.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {demo.description && (
            <p className="text-gray-600 text-lg leading-relaxed">
              {demo.description}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <Card className="rounded-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Total Steps</CardDescription>
              <CardTitle className="text-3xl">{demo.stepsCount}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-500">
                {demo.stepsCount === 0 ? "No steps yet" : "Interactive steps"}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Demo Link</CardDescription>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  /{demo.slug}
                </code>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyShareLink}
                className="h-7 text-xs rounded-sm"
              >
                Copy Link
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Status</CardDescription>
              <CardTitle className="text-lg">
                {demo.stepsCount === 0 ? "Draft" : "Ready"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-500">
                {demo.stepsCount === 0 ? "Add steps to publish" : "Demo is complete"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Steps Section */}
        <div>
          <StepViewer steps={steps} />
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your demo
              and all associated steps and hotspots.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 rounded-sm"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
