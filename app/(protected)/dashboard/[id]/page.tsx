"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDemoWithStepsCount, getDemoWithSteps, deleteDemo, toggleDemoVisibility, duplicateDemo } from "@/actions/demos/demos.action";
import { DemoResponse, StepResponse } from "@/types";
import { StepViewer } from "@/components/demo/StepViewer";
import { ShareEmbedDialog } from "@/components/demo/ShareEmbedDialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
  ArrowLeft,
  MoreHorizontal,
  Pencil,
  ExternalLink,
  Globe,
  Lock,
  Copy,
  Share2,
  Trash2,
  Plus,
  Layers,
  Link2,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

export default function ViewDemoPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const demoId = params.id as string;

  const [demo, setDemo] = useState<(DemoResponse & { stepsCount: number; steps?: StepResponse[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const fetchDemo = async () => {
    if (!token || !demoId) return;
    setIsLoading(true);

    const result = showSteps
      ? await getDemoWithSteps(demoId, token)
      : await getDemoWithStepsCount(demoId, token);

    if (result.success) {
      setDemo(result.data);
    } else {
      toast.error(result.error);
      router.push("/dashboard");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDemo();
  }, [demoId, token, showSteps]);

  const handleDelete = async () => {
    if (!demo || !token) return;
    const result = await deleteDemo(demo.id, token);
    if (result.success) {
      toast.success("Demo deleted");
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
      toast.success("Demo duplicated");
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
    navigator.clipboard.writeText(`${window.location.origin}/demo/${demo.slug}`);
    toast.success("Link copied");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page">
        <Loader2 className="size-5 animate-spin text-text-tertiary" />
      </div>
    );
  }

  if (!demo) return null;

  return (
    <div className="min-h-screen bg-page">
      {/* Header bar */}
      <header className="h-14 border-b border-edge bg-surface sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="size-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShareDialogOpen(true)}>
              <Share2 className="size-4" />
              Share
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.push(`/dashboard/${demo.id}/edit`)} className="cursor-pointer">
                  <Pencil className="size-4 mr-2 text-text-tertiary" />Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/demo/${demo.slug}`)} className="cursor-pointer">
                  <ExternalLink className="size-4 mr-2 text-text-tertiary" />Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleVisibility} className="cursor-pointer">
                  {demo.isPublic ? <Lock className="size-4 mr-2 text-text-tertiary" /> : <Globe className="size-4 mr-2 text-text-tertiary" />}
                  Make {demo.isPublic ? "private" : "public"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate} className="cursor-pointer">
                  <Copy className="size-4 mr-2 text-text-tertiary" />Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyShareLink} className="cursor-pointer">
                  <Link2 className="size-4 mr-2 text-text-tertiary" />Copy link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-error cursor-pointer">
                  <Trash2 className="size-4 mr-2" />Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Demo info */}
        <div className="mb-8">
          <div className="flex items-start gap-3 mb-3">
            <Badge variant={demo.isPublic ? "default" : "secondary"} className="mt-1 text-xs font-normal">
              {demo.isPublic ? <><Globe className="size-3 mr-1" />Public</> : <><Lock className="size-3 mr-1" />Private</>}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">{demo.title}</h1>
          {demo.description && (
            <p className="text-text-secondary text-[15px] leading-relaxed max-w-2xl">{demo.description}</p>
          )}

          <div className="flex items-center gap-4 mt-4 text-xs text-text-tertiary">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              Created {new Date(demo.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              Updated {new Date(demo.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border border-edge rounded-lg p-4 bg-surface">
            <div className="flex items-center gap-2 text-text-secondary mb-1">
              <Layers className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Steps</span>
            </div>
            <p className="text-2xl font-semibold">{demo.stepsCount}</p>
          </div>
          <div className="border border-edge rounded-lg p-4 bg-surface">
            <div className="flex items-center gap-2 text-text-secondary mb-1">
              <Link2 className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Slug</span>
            </div>
            <p className="text-sm font-mono text-text-secondary truncate">/{demo.slug}</p>
          </div>
          <div className="border border-edge rounded-lg p-4 bg-surface">
            <div className="flex items-center gap-2 text-text-secondary mb-1">
              <CheckCircle2 className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Status</span>
            </div>
            <p className="text-sm font-medium">
              {demo.stepsCount === 0 ? (
                <span className="text-warning">Draft</span>
              ) : (
                <span className="text-success">Ready</span>
              )}
            </p>
          </div>
        </div>

        {/* Steps section */}
        <div className="border border-edge rounded-lg bg-surface">
          <div className="px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Demo Steps</h2>
            <div className="flex items-center gap-2">
              {demo.stepsCount > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setShowSteps(!showSteps)}>
                  {showSteps ? <ChevronUp className="size-4 mr-1" /> : <ChevronDown className="size-4 mr-1" />}
                  {showSteps ? "Hide" : "Preview"}
                </Button>
              )}
              <Button size="sm" onClick={() => router.push(`/dashboard/${demo.id}/steps`)}>
                {demo.stepsCount === 0 ? <><Plus className="size-4" />Add steps</> : <><Pencil className="size-4" />Manage</>}
              </Button>
            </div>
          </div>

          {demo.stepsCount === 0 ? (
            <div className="border-t border-edge py-16 flex flex-col items-center">
              <div className="size-12 rounded-lg bg-surface-secondary flex items-center justify-center mb-4">
                <Layers className="size-6 text-text-tertiary" />
              </div>
              <p className="text-sm font-medium mb-1">No steps yet</p>
              <p className="text-sm text-text-tertiary mb-5">Add steps to create your interactive demo</p>
              <Button size="sm" onClick={() => router.push(`/dashboard/${demo.id}/steps`)}>
                <Plus className="size-4" />
                Add first step
              </Button>
            </div>
          ) : showSteps && demo.steps ? (
            <div className="border-t border-edge p-4">
              <StepViewer steps={demo.steps.sort((a, b) => parseInt(a.position) - parseInt(b.position))} />
            </div>
          ) : demo.stepsCount > 0 ? (
            <div className="border-t border-edge py-10 text-center">
              <p className="text-sm text-text-tertiary">
                {demo.stepsCount} step{demo.stepsCount !== 1 ? "s" : ""} — click Preview to view
              </p>
            </div>
          ) : null}
        </div>
      </main>

      {/* Delete dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete demo</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this demo, all steps, and hotspots. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-error hover:bg-error/90 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {demo && (
        <ShareEmbedDialog
          isOpen={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          demoSlug={demo.slug}
          demoTitle={demo.title}
        />
      )}
    </div>
  );
}
