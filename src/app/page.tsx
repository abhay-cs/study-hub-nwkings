// src/app/page.tsx
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function Page() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login") // not logged in → go to auth
  }

  redirect("/dashboard") // logged in → go to dashboard
}