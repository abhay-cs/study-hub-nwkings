"use client"

import { useState, useEffect } from "react"
import { signIn, signUp, resendVerification } from "@/lib/supabase/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Mail, AlertCircle } from "lucide-react"
import { Suspense } from "react"

// ✅ This inner component uses useSearchParams safely
function AuthContent() {
	const [isLogin, setIsLogin] = useState(true)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [name, setName] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [verificationSent, setVerificationSent] = useState(false)
	const [resendLoading, setResendLoading] = useState(false)

	const searchParams = useSearchParams()
	const urlError = searchParams.get("error")

	useEffect(() => {
		if (urlError === "verification_failed") {
			setError("Email verification failed. Please try again.")
		}
	}, [urlError])

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setLoading(true)

		try {
			if (isLogin) {
				await signIn(email, password)
				window.location.href = "/dashboard"
			} else {
				await signUp(email, password, name)
				setVerificationSent(true)
			}
		} catch (err: any) {
			if (err.message.includes("Email not confirmed")) {
				setError("Please verify your email before logging in. Check your inbox.")
			} else if (err.message.includes("Invalid login credentials")) {
				setError("Invalid email or password.")
			} else {
				setError(err.message)
			}
		} finally {
			setLoading(false)
		}
	}

	async function handleResendVerification() {
		setResendLoading(true)
		setError(null)
		try {
			await resendVerification(email)
			setError(null)
		} catch (err: any) {
			setError(err.message)
		} finally {
			setResendLoading(false)
		}
	}

	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-neutral-800 dark:text-neutral-200">
			{/* Background gradients */}
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

					{/* Auth card */}
					<div className="rounded-xl shadow-lg p-6 sm:p-10 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/15 dark:border-white/5">
						{/* Tabs */}
						<div className="mb-6 flex bg-neutral-200/50 dark:bg-neutral-800/40 rounded-lg p-1">
							<button
								onClick={() => setIsLogin(true)}
								className={`w-1/2 py-2.5 rounded-md text-sm font-bold shadow-sm transition-all ${isLogin ? "bg-primary text-white" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60"}`}
							>
								Login
							</button>
							<button
								onClick={() => setIsLogin(false)}
								className={`w-1/2 py-2.5 rounded-md text-sm font-bold transition-all ${!isLogin ? "bg-primary text-white" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60"}`}
							>
								Sign Up
							</button>
						</div>

						{/* Verification state */}
						{verificationSent ? (
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								className="text-center space-y-4 py-4"
							>
								<div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
									<Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
								</div>
								<h3 className="text-xl font-semibold mb-2">Check your email!</h3>
								<p className="text-sm text-muted-foreground mb-4">
									We sent a verification link to <strong>{email}</strong>
								</p>
								<Button
									onClick={handleResendVerification}
									disabled={resendLoading}
									variant="outline"
									className="w-full"
								>
									{resendLoading ? "Sending..." : "Resend verification email"}
								</Button>
							</motion.div>
						) : (
							<>
								{/* Form */}
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
											minLength={6}
										/>
										{error && (
											<div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
												<AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
												<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
											</div>
										)}
										<Button
											type="submit"
											disabled={loading}
											className="w-full bg-primary hover:bg-primary/90"
										>
											{loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
										</Button>
									</motion.form>
								</AnimatePresence>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}


export default function AuthPage() {
	return (
		<Suspense fallback={<div>Loading login...</div>}>
			<AuthContent />
		</Suspense>
	)
}