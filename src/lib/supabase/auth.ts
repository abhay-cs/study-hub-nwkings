import { supabase } from "./client"

export async function signUp(email: string, password: string, name: string) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: { name }, // stays in raw_user_meta_data
			emailRedirectTo: `${window.location.origin}/auth/confirm`,
		},
	})

	if (error) throw error

	// Check if user was created or if email already exists
	// Supabase returns success even if email exists (security feature)
	// But we can detect it by checking if identities array is empty
	if (data.user && data.user.identities && data.user.identities.length === 0) {
		throw new Error("An account with this email already exists. Please login or reset your password.")
	}

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

export async function resetPassword(email: string) {
	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${window.location.origin}/update-password`,
	})
	if (error) throw error
}

export async function updatePassword(newPassword: string) {
	const { error } = await supabase.auth.updateUser({
		password: newPassword,
	})
	if (error) throw error
}

export async function resendVerification(email: string) {
	const { error } = await supabase.auth.resend({
		type: 'signup',
		email,
		options: {
			emailRedirectTo: `${window.location.origin}/auth/confirm`,
		},
	})
	if (error) throw error
}