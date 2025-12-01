"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const minPasswordLength = 6;

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email.";
    if (form.password.length < minPasswordLength)
      return `Password must be at least ${minPasswordLength} characters.`;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.msg || JSON.stringify(data) || "Registration failed");
        setLoading(false);
        return;
      }

      // success -> navigate to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("Network error. Make sure backend is running on http://localhost:5000");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-100 to-white">
      <div className="w-full max-w-3xl mx-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex items-center justify-center">
          <div className="p-8 rounded-2xl bg-white/60 backdrop-blur-sm shadow-2xl border border-zinc-200">
            <h2 className="text-4xl font-extrabold text-zinc-900 mb-3">Welcome to Auth Dashboard</h2>
            <p className="text-zinc-600 leading-relaxed">
              Create an account to manage tasks, try the demo backend integration and explore a modern
              React + Next.js + Tailwind stack.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-zinc-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">Create account</h1>
              <p className="text-sm text-zinc-500">Start your free demo — no payment required.</p>
            </div>
            <div aria-hidden className="text-xs text-zinc-400">v1.0</div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
                Full name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border rounded-xl bg-white text-zinc-900 placeholder-zinc-400
                           border-zinc-300 focus:outline-none focus:ring-2 focus:ring-black transition"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border rounded-xl bg-white text-zinc-900 placeholder-zinc-400
                           border-zinc-300 focus:outline-none focus:ring-2 focus:ring-black transition"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder={`At least ${6} characters`}
                className="w-full px-4 py-3 border rounded-xl bg-white text-zinc-900 placeholder-zinc-400
                           border-zinc-300 focus:outline-none focus:ring-2 focus:ring-black transition"
                autoComplete="new-password"
                required
                minLength={6}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white px-4 py-3 rounded-xl
                           font-semibold hover:bg-zinc-800 transition disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm text-zinc-600">
            Already registered?{" "}
            <a href="/login" className="text-zinc-900 font-semibold underline">
              Log in
            </a>
          </div>

          <div className="mt-6 text-xs text-zinc-400 text-center">
            By creating an account you agree to the <span className="underline">Terms</span> and{" "}
            <span className="underline">Privacy Policy</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
