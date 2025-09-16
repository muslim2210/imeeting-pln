"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/layout/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data.user); // simpan ke store
      router.push("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen bg-gray-100 p-5">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-md p-6 w-full md:w-[400px]"
      >
        <div className="w-full flex items-center justify-center mb-5">
          <Logo isLogin/>
        </div>
        <h1 className="text-xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80 mb-5"
        >
          {loading ? "Loading..." : "Login"}
        </Button>
        <span className="text-xs mt-5 text-gray-700">Silahkan daftar jika belum memiliki akun, <Link href="/auth/register" className="text-blue-500 underline">Register</Link></span>
        
      </form>
    </div>
  );
}
