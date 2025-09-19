"use client"

import Image from "next/image"
import { Bell } from "lucide-react"

export function DashboardHeader({ user }: { user: { name?: string; email?: string } | null }) {
    return (
        <header className="px-8 py-6 md:px-12 md:py-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-medium text-gray-800">
                        Welcome back, {user?.name || user?.email?.split("@")[0] || "Learner"}!
                    </h1>
                    <p className="text-gray-500 mt-1">Let&apos;s continue your learning journey.</p>
                </div>
                
            </div>
        </header>
    )
}