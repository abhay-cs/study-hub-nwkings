import { AppSidebar } from "@/components/app-sidebar-course"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { ChatBot } from "@/components/chatbot"
import Resources from "@/components/resources"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function Page({ params }: { params: { courseId: string } }) {
    const { courseId } = params

    // Fetch course data
    const supabase = await createSupabaseServerClient()
    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single()

    const { data: { session } } = await supabase.auth.getSession()
    const { data: profile } = await supabase
        .from("users")
        .select("name, email") // select only what you need
        .eq("id", session?.user.id) // match auth user with your table
        .single();
    return (
        <SidebarProvider
            style={{ "--sidebar-width": "19rem" } as React.CSSProperties}
        >
            {/* Sidebar */}
            <AppSidebar user={{
                name: profile?.name ?? '',
                email: profile?.email ?? ''
            }} />

            {/* Main content */}
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbPage>Courses</BreadcrumbPage>
                            </BreadcrumbItem>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbPage>{course?.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>


                {/* Course Content */}
                <div className="flex flex-1 flex-col items-center p-1 gap-4">
                    <div className="w-full flex flex-col h-[90vh]">
                        <ChatBot course={course} />
                    </div>
                    {/* <Resources course={course} /> */}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}