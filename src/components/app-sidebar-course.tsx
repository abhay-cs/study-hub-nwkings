"use client";

import * as React from "react";
import {
	ChevronUp,
	User,
	Settings2,
	LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { ChatHistorySidebar } from "@/components/chatbotSidebar";
import { supabase } from "@/lib/supabase/client";

interface AppSidebarProps {
	user: { id: string; name: string; email: string; avatar?: string };
	course: { id: string };
	currentSessionId?: string;
	onSessionSelect?: (sessionId: string) => void;
	onNewChat?: () => void;
}

export function AppSidebar({
	user,
	course,
	currentSessionId,
	onSessionSelect,
	onNewChat,
	...props
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
	const handleLogout = async () => {
		await supabase.auth.signOut();
		window.location.href = "/auth";
	};

	return (
		<Sidebar variant="floating" {...props}>
			{/* Header */}
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="/dashboard" className="flex items-center gap-2">
								<div>
									<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
										<circle cx="10" cy="24" r="8" fill="currentColor" />
										<circle cx="24" cy="24" r="8" fill="currentColor" />
										<circle cx="38" cy="24" r="8" fill="currentColor" />
									</svg>
								</div>
								<span className="font-bold text-xl">StudyHub</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			{/* Only ChatHistorySidebar */}
			{/* <div className="flex flex-col h-full"> */}
				{/* Chat history list scrolls */}
				<div className="flex flex-col flex-1 overflow-hidden">
					<ChatHistorySidebar
						currentSessionId={currentSessionId}
						onSessionSelect={onSessionSelect || (() => { })}
						userId={user.id}
						courseId={course.id}
					/>
				</div>

				{/* Footer stays fixed */}
				<SidebarFooter className="border-t">
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton size="lg">
										<Avatar className="h-8 w-8 rounded-lg">
											{user.avatar ? (
												<AvatarImage src={user.avatar} alt={user.name} />
											) : (
												<AvatarFallback className="rounded-lg">
													{user.name
														.split(" ")
														.map((n) => n[0])
														.join("")
														.toUpperCase()}
												</AvatarFallback>
											)}
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">{user.name}</span>
											<span className="truncate text-xs">{user.email}</span>
										</div>
										<ChevronUp className="ml-auto size-4" />
									</SidebarMenuButton>
								</DropdownMenuTrigger>

								<DropdownMenuContent
									className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
									side="top"
									align="end"
									sideOffset={4}
								>
									<DropdownMenuLabel className="p-0 font-normal">
										<div className="flex items-center gap-2 px-1 py-1.5 text-sm">
											<Avatar className="h-8 w-8 rounded-lg">
												<AvatarFallback className="rounded-lg">
													{user.name
														.split(" ")
														.map((n) => n[0])
														.join("")
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="grid flex-1 text-left">
												<span className="font-semibold">{user.name}</span>
												<span className="text-xs">{user.email}</span>
											</div>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<User className="mr-2 h-4 w-4" /> Profile
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Settings2 className="mr-2 h-4 w-4" /> Settings
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleLogout}>
										<LogOut className="mr-2 h-4 w-4" /> Log out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>


			<SidebarRail />
		</Sidebar>
	);
}