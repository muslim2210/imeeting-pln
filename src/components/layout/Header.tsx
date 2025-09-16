'use client';
import { IoMenuOutline } from "react-icons/io5";
import Logo from '@/components/layout/Logo';
import { IoIosNotificationsOutline } from "react-icons/io";
import UserButton from '@/components/button/UserButton';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

const Header = () => {
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
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
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