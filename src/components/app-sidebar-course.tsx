import * as React from "react"
import {
    Home,
    GraduationCap,
    Calendar,
    Bell,
    TrendingUp,
    BookOpen,
    Layers,
    MessageCircle,
    Folder,
    Settings,
    HelpCircle,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarFooter
} from "@/components/ui/sidebar"
import Link from "next/link"
import { NavUser } from "@/components/nav-user"
import { Separator } from "@/components/ui/separator"
// const data = {
//     user: {
//         name: "Demo User",
//         email: "demo@example.com",
//         avatar: "/avatar.png"
//     },
// }
export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: {
        name: string
        email: string
        avatar?: string
    },
    course: {
        id: string
    }
}
export function AppSidebar({ user, course, ...props }: AppSidebarProps) {
    return (
        <Sidebar variant="floating" {...props} className="backdrop-blur-lg bg-white/20 border-r border-white/30 shadow-lg">
            {/* Header / Branding */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/dashboard">
                                <div>
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="24" r="8" fill="currentColor" />
                                        <circle cx="24" cy="24" r="8" fill="currentColor" />
                                        <circle cx="38" cy="24" r="8" fill="currentColor" />
                                    </svg>
                                </div>

                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-bold text-xl">StudyHub</span>
                                </div>
                            </a>
                        </SidebarMenuButton>

                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Main Navigation */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu className="gap-2">
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="/dashboard">
                                    <Home className="size-4" />
                                    <span>Dashboard</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                    </SidebarMenu>
                </SidebarGroup>
                <Separator />
                {/* Course Navigation */}
                <SidebarGroup>
                    <SidebarMenu className="gap-2">
                        {/* <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="/courses/[id]">
                                    <BookOpen className="size-4" />
                                    <span>Overview</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem> */}
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive>
                                <Link
                                    href={`/courses/${course.id}/chat`}
                                    className="font-semibold text-primary flex items-center gap-2"
                                >
                                    <MessageCircle className="size-4" />
                                    <span>Chat</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <Layers className="size-4" />
                                <span>Modules</span>
                            </SidebarMenuButton>
                            {/* <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild>
                                        <a href="#">Week 1</a>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton asChild>
                                        <a href="#">Week 2</a>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub> */}
                        </SidebarMenuItem>

                        {/* <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="/courses/[id]/resources">
                                    <Folder className="size-4" />
                                    <span>Resources</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem> */}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Footer */}
                <SidebarGroup>
                    <SidebarMenu className="gap-2">
                        {/* <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/settings">
                  <Settings className="size-4" />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem> */}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={{ ...user, avatar: user.avatar || '/avatar.png' }} />
            </SidebarFooter>
        </Sidebar>
    )
}