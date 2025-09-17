"use client"

import Image from "next/image"
import { Bell } from "lucide-react"

export function DashboardHeader({ user }: { user: { name?: string; email?: string } | null }) {
    return (
        <header className="px-8 py-6 md:px-12 md:py-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-medium text-gray-800">
                        Welcome back, {user?.name || user?.email?.split("@")[0] || "Learner"}!
                    </h1>
                    <p className="text-gray-500 mt-1">Let&apos;s continue your learning journey.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="relative text-gray-500 hover:text-gray-700">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <Image
                        src="/avatar.png" // replace with Supabase user avatar if you store one
                        width={50}
                        height={50}
                        alt="User Avatar"
                        className="rounded-full"
                    />
                </div>
            </div>
        </header>
    )
}