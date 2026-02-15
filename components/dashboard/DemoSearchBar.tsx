"use client"

import { useState } from 'react'
import { Search, SlidersHorizontal, X, Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface DemoSearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  sortBy: "title" | "createdAt" | "updatedAt"
  onSortByChange: (value: "title" | "createdAt" | "updatedAt") => void
  sortOrder: "asc" | "desc"
  onSortOrderChange: (value: "asc" | "desc") => void
  filterPublic: "all" | "public" | "private"
  onFilterPublicChange: (value: "all" | "public" | "private") => void
}

const visibilityOptions = [
  { value: "all" as const, label: "All demos", description: "Show everything" },
  { value: "public" as const, label: "Public only", description: "Visible to everyone" },
  { value: "private" as const, label: "Private only", description: "Only visible to you" },
]

const sortByOptions = [
  { value: "createdAt" as const, label: "Date created", icon: "📅" },
  { value: "updatedAt" as const, label: "Last updated", icon: "🔄" },
  { value: "title" as const, label: "Title", icon: "🔤" },
]

export function DemoSearchBar({
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  filterPublic,
  onFilterPublicChange,
}: DemoSearchBarProps) {
  const [visibilityOpen, setVisibilityOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const activeFiltersCount = [
    filterPublic !== "all",
    sortBy !== "createdAt" || sortOrder !== "desc",
  ].filter(Boolean).length

  const getVisibilityLabel = () => {
    const option = visibilityOptions.find(opt => opt.value === filterPublic)
    return option?.label || "All demos"
  }

  const getSortLabel = () => {
    const option = sortByOptions.find(opt => opt.value === sortBy)
    const orderText = sortOrder === "desc" ? "Newest" : "Oldest"
    return sortBy === "createdAt" ? orderText : option?.label || "Sort"
  }

  const clearFilters = () => {
    onFilterPublicChange("all")
    onSortByChange("createdAt")
    onSortOrderChange("desc")
  }

  return (
    <div className="space-y-3">
      {/* Main search bar - Airbnb style */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Unified search container */}
        <div className="flex-1 flex items-center bg-surface border border-edge rounded-lg shadow-xs hover:shadow-sm transition-shadow overflow-hidden">
          {/* Search section */}
          <div className="flex-1 flex items-center px-3 py-2.5 min-w-0">
            <Search className="size-4 text-text-tertiary shrink-0 mr-2.5" />
            <input
              type="text"
              placeholder="Search demos..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-text-tertiary min-w-0"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="ml-2 p-1 hover:bg-surface-secondary rounded-md transition-colors shrink-0"
                aria-label="Clear search"
              >
                <X className="size-3.5 text-text-tertiary" />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-edge" />

          {/* Visibility filter */}
          <Popover open={visibilityOpen} onOpenChange={setVisibilityOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "hidden sm:flex items-center gap-1.5 px-3 py-2.5 text-sm hover:bg-surface-secondary transition-colors min-w-0",
                  filterPublic !== "all" && "text-brand font-medium"
                )}
              >
                <span className="truncate">{getVisibilityLabel()}</span>
                <ChevronDown className="size-3.5 text-text-tertiary shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="end">
              <div className="space-y-0.5">
                {visibilityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onFilterPublicChange(option.value)
                      setVisibilityOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-surface-secondary transition-colors text-left",
                      filterPublic === option.value && "bg-accent-blue-subtle"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{option.label}</div>
                      <div className="text-xs text-text-tertiary">{option.description}</div>
                    </div>
                    {filterPublic === option.value && (
                      <Check className="size-4 text-brand shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-edge" />

          {/* Sort filter */}
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "hidden sm:flex items-center gap-1.5 px-3 py-2.5 text-sm hover:bg-surface-secondary transition-colors min-w-0",
                  (sortBy !== "createdAt" || sortOrder !== "desc") && "text-brand font-medium"
                )}
              >
                <span className="truncate">{getSortLabel()}</span>
                <ChevronDown className="size-3.5 text-text-tertiary shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="end">
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <div className="px-3 py-1.5 text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                    Sort by
                  </div>
                  {sortByOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortByChange(option.value)
                      }}
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
                  <button
                    onClick={() => onSortOrderChange("desc")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-secondary transition-colors text-left",
                      sortOrder === "desc" && "bg-accent-blue-subtle"
                    )}
                  >
                    <span className="flex-1 text-sm font-medium">Newest first</span>
                    {sortOrder === "desc" && (
                      <Check className="size-4 text-brand shrink-0" />
                    )}
                  </button>
                  <button
                    onClick={() => onSortOrderChange("asc")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-secondary transition-colors text-left",
                      sortOrder === "asc" && "bg-accent-blue-subtle"
                    )}
                  >
                    <span className="flex-1 text-sm font-medium">Oldest first</span>
                    {sortOrder === "asc" && (
                      <Check className="size-4 text-brand shrink-0" />
                    )}
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Mobile filters button */}
        <div className="sm:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <SlidersHorizontal className="size-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="default" className="ml-auto h-5 px-1.5 text-xs bg-brand">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] max-w-sm p-3" align="end">
              <div className="space-y-4">
                {/* Visibility */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                    Visibility
                  </div>
                  <div className="space-y-1">
                    {visibilityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => onFilterPublicChange(option.value)}
                        className={cn(
                          "w-full flex items-start gap-2 px-3 py-2 rounded-md hover:bg-surface-secondary transition-colors text-left",
                          filterPublic === option.value && "bg-accent-blue-subtle"
                        )}
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium">{option.label}</div>
                          <div className="text-xs text-text-tertiary">{option.description}</div>
                        </div>
                        {filterPublic === option.value && (
                          <Check className="size-4 text-brand shrink-0 mt-0.5" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-edge" />

                {/* Sort */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                    Sort by
                  </div>
                  <div className="space-y-1">
                    {sortByOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => onSortByChange(option.value)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-secondary transition-colors text-left",
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
                </div>

                <div className="h-px bg-edge" />

                {/* Order */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                    Order
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => onSortOrderChange("desc")}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-secondary transition-colors text-left",
                        sortOrder === "desc" && "bg-accent-blue-subtle"
                      )}
                    >
                      <span className="flex-1 text-sm font-medium">Newest first</span>
                      {sortOrder === "desc" && (
                        <Check className="size-4 text-brand shrink-0" />
                      )}
                    </button>
                    <button
                      onClick={() => onSortOrderChange("asc")}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-secondary transition-colors text-left",
                        sortOrder === "asc" && "bg-accent-blue-subtle"
                      )}
                    >
                      <span className="flex-1 text-sm font-medium">Oldest first</span>
                      {sortOrder === "asc" && (
                        <Check className="size-4 text-brand shrink-0" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active filters badges */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-text-tertiary">Active filters:</span>
          {filterPublic !== "all" && (
            <Badge variant="secondary" className="text-xs h-6 gap-1">
              {getVisibilityLabel()}
              <button
                onClick={() => onFilterPublicChange("all")}
                className="ml-1 hover:bg-surface-inset rounded-sm p-0.5"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {(sortBy !== "createdAt" || sortOrder !== "desc") && (
            <Badge variant="secondary" className="text-xs h-6 gap-1">
              {getSortLabel()}
              <button
                onClick={() => {
                  onSortByChange("createdAt")
                  onSortOrderChange("desc")
                }}
                className="ml-1 hover:bg-surface-inset rounded-sm p-0.5"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-brand hover:text-accent-blue-hover font-medium"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
