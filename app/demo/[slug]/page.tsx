"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDemoWithSteps, deleteDemo, toggleDemoVisibility, duplicateDemo } from "@/actions/demos/demos.action";
import { DemoResponse, StepResponse } from "@/types";
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
import { StepViewer } from "@/components/demo/StepViewer";
import { ShareEmbedDialog } from "@/components/demo/ShareEmbedDialog";
import {
  ArrowLeft,
  MoreHorizontal,
  Pencil,
  Layers,
  Globe,
  Lock,
  Copy,
  Link2,
  Trash2,
  Share2,
  Clock,
  Loader2,
  Zap,
} from "lucide-react";

export default function ViewDemoPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [demo, setDemo] = useState<(DemoResponse & { stepsCount: number }) | null>(null);
  const [steps, setSteps] = useState<StepResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const fetchDemo = async () => {
    setIsLoading(true);
    const result = await getDemoWithSteps(slug, token || undefined);
    if (result.success && result.data) {
      const { steps: demoSteps, ...demoData } = result.data;
      setDemo(demoData);
      setSteps(demoSteps || []);
    } else {
      toast.error(!result.success ? result.error : "Failed to load demo");
      router.push("/");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (slug) fetchDemo();
  }, [slug, token]);

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

  const isOwner = demo?.userId === user?.id;

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
      {/* Header */}
      <header className="h-14 border-b border-edge bg-surface sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push(user ? "/dashboard" : "/")}>
              <ArrowLeft className="size-4" />
              {user ? "Dashboard" : "Home"}
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <Zap className="size-3.5 text-text-tertiary" />
              <span className="text-sm font-medium text-text-secondary truncate max-w-[200px]">{demo.title}</span>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShareDialogOpen(true)}>
                <Share2 className="size-4" />Share
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon-sm">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/${demo.id}`)} className="cursor-pointer">
                    <Pencil className="size-4 mr-2 text-text-tertiary" />Edit Demo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/${demo.id}/steps`)} className="cursor-pointer">
                    <Layers className="size-4 mr-2 text-text-tertiary" />Manage Steps
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Demo info */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={demo.isPublic ? "default" : "secondary"} className="text-xs font-normal">
              {demo.isPublic ? <><Globe className="size-3 mr-1" />Public</> : <><Lock className="size-3 mr-1" />Private</>}
            </Badge>
            <span className="text-xs text-text-tertiary flex items-center gap-1">
              <Clock className="size-3" />
              {new Date(demo.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">{demo.title}</h1>
          {demo.description && (
            <p className="text-text-secondary text-[15px] leading-relaxed max-w-2xl">{demo.description}</p>
          )}
        </div>

        <Separator className="mb-8" />

        {/* Steps viewer */}
        <StepViewer steps={steps.sort((a, b) => parseInt(a.position) - parseInt(b.position))} />
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
        <ShareEmbedDialog isOpen={shareDialogOpen} onClose={() => setShareDialogOpen(false)} demoSlug={demo.slug} demoTitle={demo.title} />
      )}
    </div>
  );
}
