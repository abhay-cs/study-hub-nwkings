import { Sidebar } from "@/components/dashboard/Sidebar"

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FAF9F7]">
      <Sidebar mode="course" />
      <div className="flex flex-col flex-grow">{children}</div>
    </div>
  )
}