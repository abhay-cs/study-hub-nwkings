"use client"

import { useState, useEffect } from "react"
import { updatePassword } from "@/lib/supabase/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const searchParams = useSearchParams()
  const hasToken = searchParams.get("code") || searchParams.get("token_hash")

  useEffect(() => {
    if (!hasToken) {
      setError("Invalid or missing reset token. Please request a new password reset.")
    }
  }, [hasToken])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      await updatePassword(password)
      setSuccess(true)
      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-neutral-800 dark:text-neutral-200">
      {/* background blobs */}
      <div className="absolute -top-56 -left-56 w-[600px] h-[600px] bg-gradient-to-r from-orange-400 via-orange-200 to-pink-200 rounded-full blur-3xl opacity-70 rotate-12"></div>
      <div className="absolute top-1/3 -right-64 w-[500px] h-[500px] bg-gradient-to-br from-pink-300 via-orange-200 to-yellow-200 rounded-full blur-3xl opacity-60 -rotate-12"></div>

      <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center items-center gap-3 mb-8">
            <div className="size-11 text-primary">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="24" r="8.5" fill="currentColor" />
                <circle cx="24" cy="24" r="8.5" fill="currentColor" />
                <circle cx="38" cy="24" r="8.5" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">StudyHub</h1>
          </div>

          {/* Card */}
          <div className="rounded-xl shadow-lg p-6 sm:p-10 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/15 dark:border-white/5">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Password updated!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your password has been successfully updated. Redirecting to login...
                  </p>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Set new password</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your new password below.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={!hasToken}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={!hasToken}
                  />
                  {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={loading || !hasToken}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {loading ? "Updating..." : "Update password"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
