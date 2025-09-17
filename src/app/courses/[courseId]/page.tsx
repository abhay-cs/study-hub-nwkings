import Sidebar from "@/components/sidebar"
import { ChatBot } from "@/components/chatbot"
import Resources from "@/components/resources"
import { supabase } from "@/lib/supabase/client"
export default async function Page({ params }: { params: { courseId: string } }) {
    const {courseId} = await params

    // example: fetch course data from supabase
    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single()

    return (
        <div className="flex min-h-screen bg-[#FAF9F7]">
            {/* <Sidebar course={course} /> */}
            <main className="flex flex-1">
                <ChatBot course={course} />
                <Resources course={course} />
            </main>
        </div>
    )
}