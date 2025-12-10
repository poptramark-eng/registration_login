'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const values = new FormData(e.target);

    const profile = {
      email: values.get("email"),
      password: values.get("password"),
    };

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
      credentials:"include",
    });

    if (res.status === 200) {
      router.push("/dashboard");
      return;
    }

    if (res.status === 404 || res.status === 401) {
      const data = await res.json();
      setError(data.message);
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#1F1F1F]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 ease-out transform hover:-translate-y-1 animate-fadeIn"
      >

        {/* ✅ Tailwind Alert */}
        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-md bg-red-100 border border-red-300 text-red-700 px-4 py-3">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.75a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0v-4.5zm.75 8a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-6 text-center text-[#1F1F1F] animate-slideDown">
          Login
        </h2>

        <label className="block mb-2 text-sm font-medium text-[#1F1F1F]">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="you@example.com"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F1F1F] text-[#1F1F1F] placeholder:text-gray-400 transition-all duration-200 ease-in-out hover:border-[#1F1F1F]"
        />

        <label className="block mb-2 text-sm font-medium text-[#1F1F1F]">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F1F1F] text-[#1F1F1F] placeholder:text-gray-400 transition-all duration-200 ease-in-out hover:border-[#1F1F1F]"
        />

        <input
          type="submit"
          value="Login"
          className="w-full bg-[#1F1F1F] text-white py-2 rounded-md cursor-pointer hover:bg-black transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98]"
        />

        {/* ✅ Redirect to Register */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/register" className="text-[#1F1F1F] font-semibold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}