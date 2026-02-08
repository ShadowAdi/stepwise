"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/Button"
import { createUser } from "@/actions/user/user.action"
import { useAuth } from "@/context/AuthContext"
import { redirect } from "next/navigation"
import { toast } from "sonner"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { isAuthenticated, isLoading, register: registerAuth } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  if (!isLoading && isAuthenticated) {
    redirect("/dashboard")
  }

  const onSubmit = async (createUserData: RegisterFormData) => {
    try {
      const response = await createUser(createUserData)
      if (response.success && response.data) {
        registerAuth(response.data.token, response.data.user)
        toast.success(`User registered successfully`)
      } else {
        toast.error(!response.success ? response.error : `Failed to register user`)
        console.error(!response.success ? response.error : `Failed to register user`)
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during registration. Please try again.'
      )
    }
  }

  return (
    <>
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
            <p className="text-gray-600">Get started with StepWise today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="rounded-sm"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="rounded-sm"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="rounded-sm"
                {...register("password")}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-sm"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center p-8 bg-linear-to-br from-blue-600 to-indigo-700">
        <div className="max-w-md space-y-6 text-white">
          <h2 className="text-4xl font-bold">Join StepWise</h2>
          <p className="text-lg text-purple-100">
            Start building beautiful, interactive step-by-step demos that help your
            users understand your product better.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1 h-5 w-5 rounded-sm bg-white/20 flex items-center justify-center">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white">Free to start, upgrade anytime</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 h-5 w-5 rounded-sm bg-white/20 flex items-center justify-center">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white">No credit card required</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 h-5 w-5 rounded-sm bg-white/20 flex items-center justify-center">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white">Cancel anytime</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}