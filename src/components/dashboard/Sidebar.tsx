"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname, useParams } from "next/navigation"
import {
    Bell,
    Calendar,
    GraduationCap,
    HelpCircle,
    Home,
    Settings,
    TrendingUp,
    BookOpen,
    MessageSquare,
    
} from "lucide-react"

type SidebarProps = {
    mode: "global" | "course"
}

export function Sidebar({ mode }: SidebarProps) {
    const pathname = usePathname()
    const params = useParams()

    const courseId = params?.id as string | undefined

    const globalNav = [
        { href: "/dashboard", label: "Dashboard", icon: Home },
        { href: "/courses", label: "My Courses", icon: GraduationCap },
        { href: "/calendar", label: "Calendar", icon: Calendar },
        { href: "/notifications", label: "Notifications", icon: Bell },
        { href: "/grades", label: "Grades", icon: TrendingUp },
    ]

    const courseNav = [
        { href: `/dashboard/`, label: "Dashboard", icon: Home },
        { href: `/courses/${courseId}`, label: "Overview", icon: BookOpen },
        { href: `/courses/${courseId}/modules`, label: "Modules", icon: GraduationCap },
        { href: `/courses/${courseId}/chat`, label: "Chat", icon: MessageSquare },
    ]

    const footerItems = [
        { href: "/settings", label: "Settings", icon: Settings },
        // { href: "/help", label: "Help & Support", icon: HelpCircle },
    ]

    const items = mode === "global" ? globalNav : courseNav

    return (
        <aside className="w-60 shrink-0 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.05)] flex flex-col">
            <div className="px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-800">StudyHub</h1>
            </div>
            <nav className="flex-grow px-4 space-y-2">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100",
                            pathname === item.href && "bg-gray-100"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="px-4 pb-8 space-y-2">
                {footerItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}
            </div>
        </aside>
    )
}