'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Form() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // ✅ Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // ✅ Wait until client-side hydration is ready

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      alert("Registration failed");
      return;
    }

    alert("Registration successful");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md bg-white p-8 rounded-lg border border-gray-200
          shadow-lg hover:shadow-2xl transition-all duration-300 ease-out
          transform hover:-translate-y-1 animate-fadeIn
        "
      >
        <h2 className="text-2xl font-semibold mb-6 text-[#1F1F1F] animate-slideDown">
          Register
        </h2>

        <label className="block mb-2 text-sm font-medium text-[#1F1F1F]">
          NAME
        </label>
        <input
          type="text"
          name="name"
          required
          className="
            w-full mb-4 px-4 py-2 border border-gray-300 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-[#1F1F1F] text-[#1F1F1F]
            transition-all duration-200 ease-in-out hover:border-[#1F1F1F]
          "
        />

        <label className="block mb-2 text-sm font-medium text-[#1F1F1F]">
          EMAIL
        </label>
        <input
          type="email"
          name="email"
          required
          className="
            w-full mb-4 px-4 py-2 border border-gray-300 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-[#1F1F1F] text-[#1F1F1F]
            transition-all duration-200 ease-in-out hover:border-[#1F1F1F]
          "
        />

        <label className="block mb-2 text-sm font-medium text-[#1F1F1F]">
          PASSWORD
        </label>
        <input
          type="password"
          name="password"
          required
          className="
            w-full mb-6 px-4 py-2 border border-gray-300 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-[#1F1F1F] text-[#1F1F1F]
            transition-all duration-200 ease-in-out hover:border-[#1F1F1F]
          "
        />

        <input
          type="submit"
          value="Register"
          className="
            w-full bg-[#1F1F1F] text-white py-2 rounded-md cursor-pointer 
            hover:bg-black transition-all duration-300 ease-out
            transform hover:scale-[1.02] active:scale-[0.98]
          "
        />

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-[#1F1F1F] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}