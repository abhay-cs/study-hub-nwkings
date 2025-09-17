import { supabase } from "@/lib/supabase/client"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { DashboardHeader } from "@/components/dashboard/Header"
import { CourseCard } from "@/components/dashboard/CourseCard"

export default async function Dashboard() {
  const { data: { session } } = await supabase.auth.getSession()

  const { data: courses } = await supabase
    .from("courses")
    .select("id, name, description, created_at")

  return (
    <div className="flex min-h-screen bg-[#FAF9F7]">
      <div className="flex flex-col flex-grow">
        <DashboardHeader user={session?.user ?? null} />
        <main className="flex-grow px-8 py-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {courses?.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}