"use client"

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserDemos } from "@/actions/demos/demos.action";
import { DemoResponse } from "@/types";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";
import { deleteDemo, duplicateDemo, toggleDemoVisibility } from "@/actions/demos/demos.action";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { DemoSearchBar } from "@/components/dashboard/DemoSearchBar";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Copy,
  Trash2,
  Globe,
  Lock,
  FileText,
  ExternalLink,
} from "lucide-react";

export default function DashboardPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [demos, setDemos] = useState<DemoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "createdAt" | "updatedAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterPublic, setFilterPublic] = useState<"all" | "public" | "private">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(12);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [demoToDelete, setDemoToDelete] = useState<string | null>(null);

  const totalPages = Math.ceil(total / limit);

  const fetchDemos = async () => {
    if (!token) return;

    setIsLoading(true);
    const result = await getUserDemos(token, {
      page,
      limit,
      search: search || undefined,
      sortBy,
      sortOrder,
      isPublic: filterPublic === "all" ? undefined : filterPublic === "public",
    });

    if (result.success) {
      setDemos(result.data.demos);
      setTotal(result.data.total);
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDemos();
  }, [token, page, sortBy, sortOrder, filterPublic]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (page === 1) {
        fetchDemos();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [search]);

  const handleDelete = async () => {
    if (!demoToDelete || !token) return;

    const result = await deleteDemo(demoToDelete, token);
    if (result.success) {
      toast.success("Demo deleted");
      fetchDemos();
    } else {
      toast.error(result.error);
    }
    setDeleteDialogOpen(false);
    setDemoToDelete(null);
  };

  const handleDuplicate = async (demoId: string) => {
    if (!token) return;
    const result = await duplicateDemo(demoId, token);
    if (result.success) {
      toast.success("Demo duplicated");
      fetchDemos();
    } else {
      toast.error(result.error);
    }
  };

  const handleToggleVisibility = async (demoId: string) => {
    if (!token) return;
    const result = await toggleDemoVisibility(demoId, token);
    if (result.success) {
      toast.success(`Demo is now ${result.data.isPublic ? "public" : "private"}`);
      fetchDemos();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-page">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Demos</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {total} demo{total !== 1 ? "s" : ""} total
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard/create")} size="sm">
            <Plus className="size-4" />
            New demo
          </Button>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <DemoSearchBar
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            filterPublic={filterPublic}
            onFilterPublicChange={setFilterPublic}
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-edge rounded-lg p-4 bg-surface">
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : demos.length === 0 ? (
          <div className="border border-edge rounded-lg bg-surface flex flex-col items-center justify-center py-20">
            <div className="size-12 rounded-lg bg-surface-secondary flex items-center justify-center mb-4">
              <FileText className="size-6 text-text-tertiary" />
            </div>
            <h3 className="text-sm font-semibold mb-1">No demos found</h3>
            <p className="text-sm text-text-secondary mb-6">
              {search ? "Try adjusting your search or filters" : "Create your first demo to get started"}
            </p>
            {!search && (
              <Button onClick={() => router.push("/dashboard/create")} size="sm">
                <Plus className="size-4" />
                Create demo
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demos.map((demo) => (
              <div
                key={demo.id}
                className="group border border-edge rounded-lg bg-surface p-4 hover:border-edge-strong transition-colors cursor-pointer"
                onClick={() => router.push(`/dashboard/${demo.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm font-medium truncate">{demo.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant={demo.isPublic ? "default" : "secondary"} className="text-[11px] h-5 font-normal">
                        {demo.isPublic ? (
                          <><Globe className="size-3 mr-1" />Public</>
                        ) : (
                          <><Lock className="size-3 mr-1" />Private</>
                        )}
                      </Badge>
                      <span className="text-xs text-text-tertiary">
                        {new Date(demo.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/${demo.id}`); }}>
                        <Eye className="size-4 mr-2 text-text-tertiary" />View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/${demo.id}/edit`); }}>
                        <Pencil className="size-4 mr-2 text-text-tertiary" />Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/demo/${demo.slug}`); }}>
                        <ExternalLink className="size-4 mr-2 text-text-tertiary" />Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleToggleVisibility(demo.id); }}>
                        {demo.isPublic ? <Lock className="size-4 mr-2 text-text-tertiary" /> : <Globe className="size-4 mr-2 text-text-tertiary" />}
                        Make {demo.isPublic ? "private" : "public"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicate(demo.id); }}>
                        <Copy className="size-4 mr-2 text-text-tertiary" />Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => { e.stopPropagation(); setDemoToDelete(demo.id); setDeleteDialogOpen(true); }}
                        className="text-error"
                      >
                        <Trash2 className="size-4 mr-2" />Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-text-secondary line-clamp-2">
                  {demo.description || "No description"}
                </p>
                <div className="mt-3 pt-3 border-t border-edge">
                  <span className="text-xs text-text-tertiary font-mono">/{demo.slug}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setPage(i + 1)}
                      isActive={page === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>

      {/* Delete dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete demo</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this demo and all its steps and hotspots. This cannot be undone.
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
    </div>
  );
}
