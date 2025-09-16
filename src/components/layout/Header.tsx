'use client';
import { IoMenuOutline } from "react-icons/io5";
import Logo from '@/components/layout/Logo';
import { IoIosNotificationsOutline } from "react-icons/io";
import UserButton from '@/components/button/UserButton';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import Link from "next/link";
import { useState } from "react";
import { Home, FileText } from "lucide-react";

const Header = () => {
  const [active, setActive] = useState("/");

  const menus = [
    { name: "Dashboard", icon: Home, href: "/" },
    { name: "Ruang Meeting", icon: FileText, href: "/meeting" },
  ];
  return (
    <header className="flex z-50 items-center justify-between bg-gradient-to-r from-[#18A2BA] to-[#296377] shadow-sm px-3 md:pl-1 md:pr-5 py-3 fixed top-0 left-0 right-0">
      <div className="flex items-center space-x-4">
        <Sheet>
          <SheetTrigger>
            <IoMenuOutline size={26} className='cursor-pointer block md:hidden'/>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>PLN iMeeting</SheetTitle>
              <SheetDescription>
                <nav className="flex flex-col gap-3 w-full mt-5 px-1">
                  {menus.map((menu) => {
                    const Icon = menu.icon;
                    return (
                      <Link
                        key={menu.name}
                        href={menu.href}
                        onClick={() => setActive(menu.href)}
                        className={`flex items-center justify-left gap-3 px-1 py-2 rounded-md text-sm font-medium transition-all
                          ${
                            active === menu.href
                              ? "bg-primary text-white px-2"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{menu.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        
        <Logo />
      </div>
      <div className="flex items-center">
        <div className="relative group">
          <div className="flex items-center space-x-4">
            <IoIosNotificationsOutline size={24} className='text-white'/>
            <div className="relative">
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;