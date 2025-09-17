import { Sidebar } from "@/components/dashboard/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FAF9F7]">
      <Sidebar mode="global" />
      <div className="flex flex-col flex-grow">{children}</div>
    </div>
  )
}