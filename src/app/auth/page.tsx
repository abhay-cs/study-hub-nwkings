"use client"

import { useState } from "react"
import { signIn, signUp } from "@/lib/supabase/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password, name)
      }
      window.location.href = "/dashboard"
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-neutral-800 dark:text-neutral-200">
      {/* background blobs */}
      <div className="absolute -top-56 -left-56 w-[600px] h-[600px] bg-gradient-to-r from-orange-400 via-orange-200 to-pink-200 rounded-full blur-3xl opacity-70 rotate-12"></div>

      <div className="absolute top-1/3 -right-64 w-[500px] h-[500px] bg-gradient-to-br from-pink-300 via-orange-200 to-yellow-200 rounded-full blur-3xl opacity-60 -rotate-12"></div>

      <div className="absolute bottom-[-120px] left-1/3 w-[450px] h-[450px] bg-gradient-to-t from-orange-200 via-pink-100 to-transparent rounded-full blur-2xl opacity-60"></div>

      <div className="absolute bottom-20 right-1/4 w-[300px] h-[300px] bg-gradient-to-tl from-yellow-200 via-orange-100 to-transparent rounded-full blur-2xl opacity-50"></div>

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
          <div
            className="
            rounded-xl 
            shadow-lg 
            p-6 sm:p-10 
            bg-white/10 
            dark:bg-black/20 
            backdrop-blur-xl 
            border border-white/15 
            dark:border-white/5">
            {/* Tabs */}
            <div className="mb-6 flex bg-neutral-200/50 dark:bg-neutral-800/40 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`w-1/2 py-2.5 rounded-md text-sm font-bold shadow-sm transition-all ${isLogin ? "bg-primary text-white" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60"
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`w-1/2 py-2.5 rounded-md text-sm font-bold transition-all ${!isLogin ? "bg-primary text-white" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60"
                  }`}
              >
                Sign Up
              </button>
            </div>

            {/* Animated Form */}
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                {!isLogin && (
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                )}
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isLogin ? "Login" : "Sign Up"}
                </Button>
              </motion.form>
            </AnimatePresence>

            {/* Switch */}
            <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
              {isLogin ? (
                <>Don&apos;t have an account?{" "}
                  <span
                    onClick={() => setIsLogin(false)}
                    className="font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Sign up
                  </span></>
              ) : (
                <>Already have an account?{" "}
                  <span
                    onClick={() => setIsLogin(true)}
                    className="font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Login
                  </span></>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}