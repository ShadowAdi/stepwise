"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getPublicDemos } from "@/actions/demos/demos.action";
import { DemoResponse } from "@/types";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ExploreHeader from "@/components/explore/ExploreHeader";
import {
  Search,
  X,
  ChevronDown,
  Globe,
  FileText,
  ExternalLink,
  Clock,
  ArrowRight,
  Zap,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sortByOptions = [
  { value: "createdAt" as const, label: "Date created", icon: "📅" },
  { value: "updatedAt" as const, label: "Last updated", icon: "🔄" },
  { value: "title" as const, label: "Title", icon: "🔤" },
];

/* ── Guest CTA Banner ── */
function GuestBanner() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || isAuthenticated) return null;

  return (
    <div className="bg-accent-blue-subtle border-b border-edge">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Zap className="size-4 text-brand shrink-0" />
          <p className="text-sm text-text-primary">
            <span className="font-medium">Like what you see?</span>
            {" "}Create your own interactive demos — free to get started.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button asChild variant="ghost" size="sm" className="text-text-secondary">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">
              Create free account <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Demo Card ── */
function DemoCard({
  demo,
  onClick,
}: {
  demo: DemoResponse;
  onClick: () => void;
}) {
  return (
    <div
      className="group border border-edge rounded-lg bg-surface p-4 hover:border-edge-strong hover:shadow-sm transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-sm font-medium truncate">{demo.title}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="default" className="text-[11px] h-5 font-normal">
              <Globe className="size-3 mr-1" />
              Public
            </Badge>
            <span className="text-xs text-text-tertiary flex items-center gap-1">
              <Clock className="size-3" />
              {new Date(demo.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="size-4 text-text-tertiary" />
        </div>
      </div>
      <p className="text-sm text-text-secondary line-clamp-2">
        {demo.description || "No description"}
      </p>
      <div className="mt-3 pt-3 border-t border-edge">
        <span className="text-xs text-text-tertiary font-mono">/{demo.slug}</span>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function ExplorePage() {
  const router = useRouter();

  const [demos, setDemos] = useState<DemoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "createdAt" | "updatedAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const limit = 12;
  const totalPages = Math.ceil(total / limit);

  const fetchDemos = async () => {
    setIsLoading(true);
    const result = await getPublicDemos({
      page,
      limit,
      search: search || undefined,
      sortBy,
      sortOrder,
    });
    if (result.success) {
      setDemos(result.data.demos);
      setTotal(result.data.total);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDemos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, sortOrder]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (page === 1) {
        fetchDemos();
      } else {
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(debounce);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const getSortLabel = () => {
    const option = sortByOptions.find((opt) => opt.value === sortBy);
    const orderText = sortOrder === "desc" ? "Newest" : "Oldest";
    return sortBy === "createdAt" ? orderText : option?.label || "Sort";
  };

  return (
    <div className="min-h-screen bg-page">
      <ExploreHeader />
      <GuestBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">Explore Demos</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Browse interactive product demos shared by the community
          </p>
        </div>

        {/* Search + Sort bar */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 flex items-center bg-surface border border-edge rounded-lg shadow-xs hover:shadow-sm transition-shadow overflow-hidden">
            {/* Search */}
            <div className="flex-1 flex items-center px-3 py-2.5 min-w-0">
              <Search className="size-4 text-text-tertiary shrink-0 mr-2.5" />
              <input
                type="text"
                placeholder="Search public demos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-text-tertiary min-w-0"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="ml-2 p-1 hover:bg-surface-secondary rounded-md transition-colors shrink-0"
                  aria-label="Clear search"
                >
                  <X className="size-3.5 text-text-tertiary" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="hidden sm:block w-px h-8 bg-edge" />
            <Popover open={sortOpen} onOpenChange={setSortOpen}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "hidden sm:flex items-center gap-1.5 px-3 py-2.5 text-sm hover:bg-surface-secondary transition-colors whitespace-nowrap",
                    (sortBy !== "createdAt" || sortOrder !== "desc") &&
                      "text-brand font-medium"
                  )}
                >
                  {getSortLabel()}
                  <ChevronDown className="size-3.5 text-text-tertiary shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-2" align="end">
                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <div className="px-3 py-1.5 text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                      Sort by
                    </div>
                    {sortByOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-secondary transition-colors text-left",
                          sortBy === option.value && "bg-accent-blue-subtle"
                        )}
                      >
                        <span className="text-base">{option.icon}</span>
                        <span className="flex-1 text-sm font-medium">{option.label}</span>
                        {sortBy === option.value && (
                          <Check className="size-4 text-brand shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="h-px bg-edge" />
                  <div className="space-y-0.5">
                    <div className="px-3 py-1.5 text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                      Order
                    </div>
                    {(["desc", "asc"] as const).map((order) => (
                      <button
                        key={order}
                        onClick={() => {
                          setSortOrder(order);
                          setSortOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-secondary transition-colors text-left",
                          sortOrder === order && "bg-accent-blue-subtle"
                        )}
                      >
                        <span className="flex-1 text-sm font-medium">
                          {order === "desc" ? "Newest first" : "Oldest first"}
                        </span>
                        {sortOrder === order && (
                          <Check className="size-4 text-brand shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Results count */}
        {!isLoading && (
          <p className="text-xs text-text-tertiary mb-4">
            {total} public demo{total !== 1 ? "s" : ""}
            {search ? ` matching "${search}"` : ""}
          </p>
        )}

        {/* Demo grid */}
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
            <h3 className="text-sm font-semibold mb-1">No public demos found</h3>
            <p className="text-sm text-text-secondary mb-6">
              {search
                ? "Try a different search term"
                : "Be the first to share a demo with the community!"}
            </p>
            {!search && (
              <Button asChild size="sm">
                <Link href="/register">
                  <Zap className="size-4" />
                  Create a demo
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demos.map((demo) => (
              <DemoCard
                key={demo.id}
                demo={demo}
                onClick={() => router.push(`/demo/${demo.slug}`)}
              />
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
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
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
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
}
