"use client";

import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#F67E4A]">
          Welcome to EduChat
        </h1>
        <AuthForm />
      </div>
    </div>
  );
}