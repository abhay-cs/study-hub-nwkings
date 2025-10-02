import { AppSidebar } from "@/components/app-sidebar"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { CourseCard } from "@/components/dashboard/CourseCard"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/Header"

export default async function Page() {
	// 🔥 Fetch courses from Supabase
	const supabase = await createSupabaseServerClient()
	const { data: courses } = await supabase
		.from("courses")
		.select("id, name, description, created_at")

	const { data: { user } } = await supabase.auth.getUser()
	const { data: profile } = await supabase
        .from("users")
        .select("name, email") // select only what you need
        .eq("id", user?.id) // match auth user with your table
        .single();


	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "20rem",
				} as React.CSSProperties
			}
		>
			<AppSidebar user={{
				name: profile?.name ?? '',
				email: profile?.email ?? ''
			}} />
			
			<SidebarInset>
				
				<header className="flex h-16 shrink-0 items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					{/* <Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/> */}
					{/* <Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbPage>Dashboard</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb> */}
				</header>
				<DashboardHeader user={profile ?? null} />
				{/* Main Content */}
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					
					<div className="grid auto-rows-min gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{courses?.map((course) => (
							<CourseCard key={course.id} course={course} />
						))}
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}