"use client";
import { useState } from "react";
import { Home, FileText } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const [active, setActive] = useState("/");

  const menus = [
    { name: "Dashboard", icon: Home, href: "/" },
    { name: "Ruang Meeting", icon: FileText, href: "/meeting" },
  ];

  return (
    <aside className="hidden md:fixed top-12 bottom-0 left-0 h-screen w-16 bg-white border-r md:flex flex-col items-center md:items-start py-4 shadow-md">
      {/* Menu */}
      <nav className="flex flex-col gap-3 w-full mt-5 px-3">
        {menus.map((menu) => {
          const Icon = menu.icon;
          return (
            <Link
              key={menu.name}
              href={menu.href}
              onClick={() => setActive(menu.href)}
              className={`flex items-center justify-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all
                ${
                  active === menu.href
                    ? "bg-primary text-white px-2"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
