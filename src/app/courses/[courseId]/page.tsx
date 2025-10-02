import { createSupabaseServerClient } from "@/lib/supabase/server";
import ClientPage from "./clientPage";

export default async function Page({ params }: { params: { courseId: string } }) {
  const { courseId } = await params;

  // ✅ Safe: runs on server
  const supabase = await createSupabaseServerClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("name, email")
    .eq("id", user?.id)
    .single();

  return (
    <ClientPage
      course={course}
      user={{
        id: user?.id ?? "",
        name: profile?.name ?? "",
        email: profile?.email ?? "",
      }}
    />
  );
}