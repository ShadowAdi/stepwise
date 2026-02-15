'use client'

import React from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { getInitials } from '@/helper/get-utils'
import { Zap, LayoutDashboard, Settings, LogOut, ChevronDown } from 'lucide-react'

const DashboardHeader = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  return (
    <header className="h-14 border-b border-edge bg-surface sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-brand flex items-center justify-center">
              <Zap className="size-3.5 text-brand-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Stepwise</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-surface-secondary rounded-md px-2 py-1.5 transition-colors cursor-pointer">
                <Avatar className="size-6">
                  <AvatarFallback className="bg-text-primary text-text-inverted text-[10px] font-medium">
                    {getInitials(user?.name || null)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-text-primary max-w-[120px] truncate">
                  {user?.name}
                </span>
                <ChevronDown className="size-3.5 text-text-tertiary" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 border-b border-edge mb-1">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
              </div>
              <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer">
                <LayoutDashboard className="size-4 mr-2 text-text-tertiary" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
                <Settings className="size-4 mr-2 text-text-tertiary" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-error">
                <LogOut className="size-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
