import { supabase } from "./client"

export async function signUp(email: string, password: string, name: string) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: { name }, // stays in raw_user_meta_data
		},
	})

	if (error) throw error
	if (!data.user) throw new Error("Signup failed")

	// ✅ Ensure user also exists in your public.users table
	// const { error: insertError } = await supabase
	//   .from("users")
	//   .insert([
	//     {
	//       id: data.user.id, // must match auth.users.id
	//       email,
	//       name,
	//       role: "student", // default role, can update later
	//     },
	//   ])
	//   .single()

	// if (insertError) {
	//   console.error("Failed to insert into public.users:", insertError.message)
	// }

	return data
}

export async function signIn(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	})
	if (error) throw error
	return data
}

export async function signOut() {
	const { error } = await supabase.auth.signOut()
	if (error) throw error
}