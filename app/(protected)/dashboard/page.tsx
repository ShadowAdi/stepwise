"use client"

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserDemos } from "@/actions/demos/demos.action";
import { DemoResponse } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";
import { deleteDemo, duplicateDemo, toggleDemoVisibility } from "@/actions/demos/demos.action";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

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
      toast.success("Demo deleted successfully");
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
      toast.success("Demo duplicated successfully");
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
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Demos</h2>
              <p className="text-gray-600 mt-1">Create and manage your interactive demos</p>
            </div>
            <Button
              onClick={() => router.push("/dashboard/create")}
              className="rounded-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Demo
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search demos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterPublic} onValueChange={(value: any) => setFilterPublic(value)}>
                <SelectTrigger className="w-full sm:w-[140px] rounded-sm">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Demos</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-[140px] rounded-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created</SelectItem>
                  <SelectItem value="updatedAt">Updated</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                <SelectTrigger className="w-full sm:w-[120px] rounded-sm">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest</SelectItem>
                  <SelectItem value="asc">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="rounded-sm">
            <CardHeader className="pb-2">
              <CardDescription>Total Demos</CardDescription>
              <CardTitle className="text-3xl">{total}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="rounded-sm">
            <CardHeader className="pb-2">
              <CardDescription>Public Demos</CardDescription>
              <CardTitle className="text-3xl">
                {demos.filter(d => d.isPublic).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="rounded-sm">
            <CardHeader className="pb-2">
              <CardDescription>Private Demos</CardDescription>
              <CardTitle className="text-3xl">
                {demos.filter(d => !d.isPublic).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="rounded-sm animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : demos.length === 0 ? (
          <Card className="rounded-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No demos found</h3>
              <p className="text-gray-500 text-center mb-6">
                {search ? "Try adjusting your search or filters" : "Get started by creating your first demo"}
              </p>
              {!search && (
                <Button onClick={() => router.push("/dashboard/create")} className="rounded-sm">
                  Create Your First Demo
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demos.map((demo) => (
              <Card 
                key={demo.id} 
                className="rounded-sm hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/dashboard/${demo.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{demo.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${demo.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {demo.isPublic ? 'Public' : 'Private'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(demo.createdAt).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0 rounded-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/${demo.id}`);
                        }}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/${demo.id}/edit`);
                        }}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/demo/${demo.slug}`);
                        }}>
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVisibility(demo.id);
                        }}>
                          Make {demo.isPublic ? 'Private' : 'Public'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(demo.id);
                        }}>
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setDemoToDelete(demo.id);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {demo.description || "No description provided"}
                  </p>
                </CardContent>
                <CardFooter className="text-xs text-gray-500">
                  <span>/{demo.slug}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                    className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>

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