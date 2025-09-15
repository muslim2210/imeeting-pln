'use client';
import { useAuth } from '@/hooks/AuthContexts';
import { IoMenuOutline } from "react-icons/io5";
import Logo from '@/components/layout/Logo';
import { IoIosNotificationsOutline } from "react-icons/io";
import UserButton from '@/components/button/UserButton';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="flex z-50 items-center justify-between bg-gradient-to-r from-[#18A2BA] to-[#296377] shadow-sm px-3 md:px-5 py-2 fixed top-0 left-0 right-0">
      <div className="flex items-center space-x-4">
        <IoMenuOutline size={26} className='cursor-pointer block md:hidden'/>
        <Logo />
      </div>
      <div className="flex items-center">
        <div className="relative group">
          <div className="flex items-center space-x-4">
            <IoIosNotificationsOutline size={24} className='text-white'/>
            <div className="relative">
              <UserButton user={user} />
              {/* <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;