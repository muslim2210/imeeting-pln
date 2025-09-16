"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
// import { set } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      login(data.user); // simpan user & token ke store
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
    <div className="flex items-center justify-center h-screen bg-gray-100 p-5">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-md rounded-md p-6 w-full md:w-[400px]"
      >
        <div className="mb-4 w-full flex justify-center">
          <Logo isLogin />
        </div>
        <h1 className="text-xl font-bold mb-4">Register</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-3 rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Select value={role}
          onValueChange={(v) => setRole(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80 my-5"
          disabled={loading}
        >
          {loading ? "Loading..." : "Register"}
        </Button>
        <span className="text-xs text-gray-700">Sudah punya akun? <Link href="/auth/login" className="text-blue-500 underline">Login</Link></span>
      </form>
    </div>
  );
}
