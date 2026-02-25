"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Zap, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ExploreHeader() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className="h-14 border-b border-edge bg-surface sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-brand flex items-center justify-center">
            <Zap className="size-3.5 text-brand-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Stepwise</span>
        </Link>

        {/* Right side */}
        {!isLoading && (
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button asChild size="sm">
                <Link href="/dashboard">
                  <LayoutDashboard className="size-4" />
                  My Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">
                    <LogIn className="size-4" />
                    Log in
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">
                    <UserPlus className="size-4" />
                    Get started free
                  </Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
