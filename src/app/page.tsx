import Sidebar from "@/components/sidebar"
import { ChatBot } from "@/components/chatbot"
import Resources from "@/components/resources"

export default function Page() {
  return (
    <div className="flex min-h-screen bg-slate-100 → bg-[#FAF9F7]">
      <Sidebar />
      <main className="flex flex-1">
        <ChatBot />
        <Resources />
      </main>
    </div>
  )
}