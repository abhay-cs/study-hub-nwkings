"use client"

import { useState } from "react"
import { resetPassword } from "@/lib/supabase/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await resetPassword(email)
      setEmailSent(true)
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
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>

            {emailSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Check your email!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click the link in the email to reset your password.
                  </p>
                </div>
                <Button
                  onClick={() => window.location.href = "/login"}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Back to Login
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Reset your password</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {loading ? "Sending..." : "Send reset link"}
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
